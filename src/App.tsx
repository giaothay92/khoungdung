import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, AlertCircle, RefreshCw, X, Sparkles, 
  ChevronRight, Calendar, PlusCircle, ArrowRight, Compass, GraduationCap 
} from 'lucide-react';

import { collection, onSnapshot, doc, setDoc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { EducationalApp, TeacherProfile, AppCategory, UserProfile } from './types';
import { INITIAL_APPS, DEFAULT_TEACHER } from './data/defaultApps';
import Header from './components/Header';
import Footer from './components/Footer';
import TeacherIntro from './components/TeacherIntro';
import AppCard from './components/AppCard';
import AdminPanel from './components/AdminPanel';
import { CATEGORIES } from './components/IconRenderer';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
          })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  // Tab control: 'home' | 'library' | 'admin'
  const [currentTab, setTab] = useState<'home' | 'library' | 'admin'>('home');

  // Load from Firestore with local fallback/defaults
  const [apps, setApps] = useState<EducationalApp[]>([]);
  const [teacher, setTeacher] = useState<TeacherProfile>(DEFAULT_TEACHER);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Search and Filter states for the Library Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');

  // Sync state with Google Auth / Database on load
  useEffect(() => {
    // 1. Listen to community apps from Firestore
    const unsubscribeApps = onSnapshot(collection(db, 'apps'), (snapshot) => {
      const appsList: EducationalApp[] = [];
      snapshot.forEach((doc) => {
        appsList.push(doc.data() as EducationalApp);
      });
      
      // Sort: Newest first
      appsList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      // Merge with hardcoded initial apps to ensure fallback is always available
      const merged: EducationalApp[] = [...appsList];
      INITIAL_APPS.forEach((initialApp) => {
        if (!merged.some((app) => app.id === initialApp.id)) {
          merged.push(initialApp);
        }
      });
      
      setApps(merged);
    }, (error) => {
      console.warn('Unable to subscribe to Firestore apps (using offline defaults):', error);
      setApps(INITIAL_APPS);
    });

    // 2. Load teacher bio from localStorage
    const cachedProfile = localStorage.getItem('edu_teacher_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
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
    }

    // 3. Load manual password admin session as a fallback (if any)
    const storedAdmin = sessionStorage.getItem('is_edu_admin');
    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }

    return () => {
      unsubscribeApps();
    };
  }, []);

  // Update administrative privileges based on Google Auth Role
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin') {
        setIsAdmin(true);
      } else {
        const storedAdmin = sessionStorage.getItem('is_edu_admin');
        if (storedAdmin !== 'true') {
          setIsAdmin(false);
        }
      }
    } else {
      const storedAdmin = sessionStorage.getItem('is_edu_admin');
      if (storedAdmin !== 'true') {
        setIsAdmin(false);
      }
    }
  }, [userProfile]);

  // Login action handler (Fallback back-door password check)
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

  // Add or Edit app operation in Firestore
  const handleSaveApp = async (appData: Omit<EducationalApp, 'id'> & { id?: string }) => {
    if (!userProfile) {
      alert('Vui lòng đăng nhập bằng Google ở góc trên cùng bên phải trước khi đóng góp hoặc chỉnh sửa!');
      return;
    }

    const pathForWrite = 'apps';
    try {
      if (appData.id) {
        // Edit mode
        const existingApp = apps.find(a => a.id === appData.id);
        if (!existingApp) return;

        // Verify if owner or admin
        const canEdit = isAdmin || existingApp.contributorUID === userProfile.uid;
        if (!canEdit) {
          alert('Bạn không có quyền chỉnh sửa ứng dụng này! Chỉ người đóng góp hoặc Quản trị viên mới được sửa.');
          return;
        }

        const updatedApp: EducationalApp = {
          ...existingApp,
          name: appData.name,
          description: appData.description,
          link: appData.link.trim() || '#',
          category: appData.category,
          audience: appData.audience,
          iconName: appData.iconName,
          color: appData.color
        };

        await setDoc(doc(db, 'apps', appData.id), updatedApp);
      } else {
        // Create mode
        const newId = `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newApp: EducationalApp = {
          id: newId,
          name: appData.name,
          description: appData.description,
          link: appData.link.trim() || '#',
          category: appData.category,
          audience: appData.audience,
          iconName: appData.iconName,
          color: appData.color,
          contributorUID: userProfile.uid,
          contributorName: userProfile.name,
          contributorPhoto: userProfile.photoURL,
          likesCount: 0,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'apps', newId), newApp);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    }
  };

  // Delete operation on Firestore
  const handleDeleteApp = async (id: string) => {
    if (!userProfile) {
      alert('Vui lòng đăng nhập Google để thực hiện thao tác xóa!');
      return;
    }

    const appToDelete = apps.find(a => a.id === id);
    if (!appToDelete) return;

    if (!isAdmin && appToDelete.contributorUID !== userProfile.uid) {
      alert('Chỉ quản trị viên hoặc người gốc đóng góp ứng dụng này mới được quyền xóa!');
      return;
    }

    const pathForDelete = 'apps';
    try {
      await deleteDoc(doc(db, 'apps', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, pathForDelete);
    }
  };

  // Like / Unlike action handling using atomic Firestore increment
  const handleLikeApp = async (app: EducationalApp) => {
    if (!userProfile) {
      alert('Vui lòng đăng nhập Google để yêu thích ứng dụng này!');
      return;
    }

    const likedKey = `liked_${app.id}_${userProfile.uid}`;
    const hasLiked = localStorage.getItem(likedKey) === 'true';
    const pathForHeart = 'apps';

    try {
      const appRef = doc(db, 'apps', app.id);
      if (hasLiked) {
        // Decrement by 1
        await updateDoc(appRef, {
          likesCount: increment(-1)
        });
        localStorage.removeItem(likedKey);
      } else {
        // Increment by 1
        await updateDoc(appRef, {
          likesCount: increment(1)
        });
        localStorage.setItem(likedKey, 'true');
      }
    } catch (error) {
      // If document is hardcoded or error has permission issues, we can try creating a stub, or save locally
      if (app.id.startsWith('toan-vui') || app.id.startsWith('be-hoc-') || app.id.startsWith('kham-pha-') || app.id.startsWith('do-vui-') || app.id.startsWith('so-tay-') || app.id.startsWith('quan-ly-') || app.id.startsWith('nhan-xet-') || app.id.startsWith('so-diem-')) {
        // To make initial apps likable, let's create a snapshot of them in firestore if it was voted for!
        try {
          const appRef = doc(db, 'apps', app.id);
          const appSnap = await getDoc(appRef);
          if (!appSnap.exists()) {
            const seedApp: EducationalApp = {
              ...app,
              contributorUID: 'system-admin',
              contributorName: 'Bùi Thanh Huấn',
              likesCount: hasLiked ? Math.max(0, app.likesCount - 1) : app.likesCount + 1,
              createdAt: app.createdAt || new Date().toISOString()
            };
            await setDoc(appRef, seedApp);
            if (hasLiked) {
              localStorage.removeItem(likedKey);
            } else {
              localStorage.setItem(likedKey, 'true');
            }
            return;
          }
        } catch (e) {
          console.error('Error seeding fallback app in database:', e);
        }
      }
      handleFirestoreError(error, OperationType.UPDATE, pathForHeart);
    }
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
        onUserChanged={setUserProfile}
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
                        currentUserUID={userProfile?.uid}
                        onLike={handleLikeApp}
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
