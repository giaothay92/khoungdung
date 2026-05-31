import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, AlertCircle, RefreshCw, X, Sparkles, 
  ChevronRight, Calendar, PlusCircle, ArrowRight, Compass, GraduationCap 
} from 'lucide-react';

import { EducationalApp, TeacherProfile, AppCategory } from './types';
import { INITIAL_APPS, DEFAULT_TEACHER } from './data/defaultApps';
import Header from './components/Header';
import Footer from './components/Footer';
import TeacherIntro from './components/TeacherIntro';
import AppCard from './components/AppCard';
import AdminPanel from './components/AdminPanel';
import { CATEGORIES } from './components/IconRenderer';

export default function App() {
  // Tab control: 'home' | 'library' | 'admin'
  const [currentTab, setTab] = useState<'home' | 'library' | 'admin'>('home');

  // Load from localStorage or defaults
  const [apps, setApps] = useState<EducationalApp[]>([]);
  const [teacher, setTeacher] = useState<TeacherProfile>(DEFAULT_TEACHER);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Search and Filter states for the Library Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');

  // Load initial state
  useEffect(() => {
    const cachedApps = localStorage.getItem('edu_apps');
    if (cachedApps) {
      try {
        const parsed = JSON.parse(cachedApps) as EducationalApp[];
        const merged = [...parsed];
        let hasChanges = false;
        INITIAL_APPS.forEach((initialApp) => {
          if (!merged.some((app) => app.id === initialApp.id)) {
            merged.push(initialApp);
            hasChanges = true;
          }
        });
        if (hasChanges) {
          setApps(merged);
          localStorage.setItem('edu_apps', JSON.stringify(merged));
        } else {
          setApps(parsed);
        }
      } catch (e) {
        setApps(INITIAL_APPS);
      }
    } else {
      setApps(INITIAL_APPS);
      localStorage.setItem('edu_apps', JSON.stringify(INITIAL_APPS));
    }

    const cachedProfile = localStorage.getItem('edu_teacher_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        // Automatically migrate profile if it has the old name
        if (parsed && (parsed.name === 'Nguyễn Thanh Huân' || !parsed.name)) {
          const updated = {
            ...DEFAULT_TEACHER,
            ...parsed,
            name: 'Bùi Thanh Huấn',
            phone: '033.666.0253',
            zaloLink: 'https://zalo.me/0336660253'
          };
          setTeacher(updated);
          localStorage.setItem('edu_teacher_profile', JSON.stringify(updated));
        } else {
          setTeacher(parsed);
        }
      } catch (e) {
        setTeacher(DEFAULT_TEACHER);
      }
    } else {
      setTeacher(DEFAULT_TEACHER);
      localStorage.setItem('edu_teacher_profile', JSON.stringify(DEFAULT_TEACHER));
    }

    // Load admin login persistence (optionally cached per session)
    const storedAdmin = sessionStorage.getItem('is_edu_admin');
    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Update apps state helper
  const updateAppsList = (newApps: EducationalApp[]) => {
    setApps(newApps);
    localStorage.setItem('edu_apps', JSON.stringify(newApps));
  };

  // Login action handler
  const loginAdmin = (password: string): boolean => {
    if (password === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('is_edu_admin', 'true');
      return true;
    }
    return false;
  };

  // Logout admin helper
  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('is_edu_admin');
    if (currentTab === 'admin') {
      setTab('home');
    }
  };

  // Add or Edit app operation
  const handleSaveApp = (appData: Omit<EducationalApp, 'id'> & { id?: string }) => {
    let updated: EducationalApp[];
    if (appData.id) {
      // Edit mode
      updated = apps.map(item => item.id === appData.id ? { 
        ...item, 
        name: appData.name,
        description: appData.description,
        link: appData.link,
        category: appData.category,
        iconName: appData.iconName,
        color: appData.color
      } : item);
    } else {
      // Add mode - generate a simple random ID string
      const newId = `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newApp: EducationalApp = {
        id: newId,
        ...appData,
      };
      updated = [newApp, ...apps];
    }
    updateAppsList(updated);
  };

  // Delete operation
  const handleDeleteApp = (id: string) => {
    const updated = apps.filter(item => item.id !== id);
    updateAppsList(updated);
  };

  // Update Teacher profile parameters
  const handleUpdateTeacher = (newProfile: TeacherProfile) => {
    setTeacher(newProfile);
    localStorage.setItem('edu_teacher_profile', JSON.stringify(newProfile));
  };

  // Filter logic
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800" id="school-spa-root">
      
      {/* Top Header Navigation */}
      <Header 
        currentTab={currentTab} 
        setTab={setTab} 
        teacherName={teacher.name} 
        isAdmin={isAdmin}
        logoutAdmin={logoutAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="main-content">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME PAGE */}
          {currentTab === 'home' && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <TeacherIntro 
                teacher={teacher} 
                totalApps={apps.length} 
                onExplore={() => setTab('library')} 
                apps={apps}
                onOpenAdmin={() => setTab('admin')}
              />
            </motion.div>
          )}

          {/* TAB 2: LIBRARY VIEWER */}
          {currentTab === 'library' && (
            <motion.div
              key="library-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-10 text-left"
              id="library-panel"
            >
              {/* Context bar / Title and subtitle */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Thư Viện Ứng Dụng Học Tập</h3>
                <p className="text-sm text-slate-500 max-w-2xl">
                  Danh sách ứng dụng được chính thầy cô chọn lọc thiết kế, tối ưu trực quan để các em luyện tập rèn nhớ và phát triển IQ ngay tại nhà.
                </p>
              </div>

              {/* Dynamic Operations bar (Search & Filters) */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Search query box */}
                <div className="relative md:col-span-5">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên app hoặc từ khóa nội dung..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    id="app-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      title="Xóa tìm kiếm"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Filters Row */}
                <div className="md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-end" id="category-pills">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value as any)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Apps Grid */}
              <AnimatePresence mode="popLayout">
                {filteredApps.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs"
                    id="empty-search-state"
                  >
                    <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                      <AlertCircle size={28} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-base text-slate-800">Không tìm thấy ứng dụng phù hợp</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Thử đổi từ khóa tìm kiếm khác hoặc chuyển bộ lọc danh mục về dạng "Tất cả".
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1.5 uppercase tracking-wide"
                    >
                      <RefreshCw size={12} />
                      <span>Đặt lại bộ lọc</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    id="library-grid"
                  >
                    {filteredApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        isAdmin={isAdmin}
                        onEdit={(target) => {
                          setTab('admin');
                          // Simple delay to let the page render, done in edit trigger inside AdminPanel
                        }}
                        onDelete={(target) => handleDeleteApp(target.id)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tips for Students / Teachers banner */}
              <div className="bg-radial from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between text-white gap-4 border border-slate-800">
                <div className="flex gap-4 items-center text-left">
                  <div className="p-3 bg-white/10 rounded-xl hidden sm:block">
                    <Compass size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-base">Bạn là Giáo viên và muốn thêm bài học của riêng mình?</h5>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Chọn thẻ <b className="text-sky-300">Quản Lý</b> trên thanh điều hướng, gõ mật khẩu <b className="text-sky-300">"admin123"</b> để kích hoạt chế độ sửa đổi linh hoạt. Thêm bất cứ link trò chơi hay bài trắc nghiệm nào!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTab('admin')}
                  className="px-4.5 py-2.5 bg-white text-slate-900 font-extrabold rounded-lg hover:bg-slate-50 transition-colors uppercase text-[11px] tracking-wide shrink-0"
                >
                  Ghé Quản Trị Viên
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ADMINISTRATOR CONTROLLER */}
          {currentTab === 'admin' && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <AdminPanel
                apps={apps}
                teacher={teacher}
                isAdmin={isAdmin}
                loginAdmin={loginAdmin}
                saveApp={handleSaveApp}
                deleteApp={handleDeleteApp}
                updateTeacher={handleUpdateTeacher}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Website Bottom Footer Signature */}
      <Footer teacher={teacher} />
    </div>
  );
}
