import React, { useState } from 'react';
import { 
  Key, ShieldCheck, Plus, CheckCircle2, Lock, Save, 
  Trash2, Edit, X, RefreshCw, Sparkles, UserCheck, AlertCircle, Phone, MessageSquare
} from 'lucide-react';
import { EducationalApp, TeacherProfile, AppCategory, AppAudience } from '../types';
import { SUPPORTED_ICONS, CATEGORIES } from './IconRenderer';

interface AdminPanelProps {
  apps: EducationalApp[];
  teacher: TeacherProfile;
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  saveApp: (app: Omit<EducationalApp, 'id'> & { id?: string }) => void;
  deleteApp: (id: string) => void;
  updateTeacher: (profile: TeacherProfile) => void;
}

const COLOR_THEMES = [
  { value: 'from-blue-500 to-indigo-600', label: 'Xanh dương Đại Dương' },
  { value: 'from-pink-500 to-rose-600', label: 'Hồng Ngọc ngọt ngào' },
  { value: 'from-emerald-400 to-teal-600', label: 'Xanh lục Bảo Ngọc' },
  { value: 'from-amber-500 to-orange-600', label: 'Cam hoàng hôn rực rỡ' },
  { value: 'from-purple-500 to-indigo-700', label: 'Tím hoa cà sang trọng' },
  { value: 'from-cyan-400 to-blue-600', label: 'Xanh mát Băng tuyết' },
];

export default function AdminPanel({
  apps,
  teacher,
  isAdmin,
  loginAdmin,
  saveApp,
  deleteApp,
  updateTeacher
}: AdminPanelProps) {
  
  // Local state for authentication challenge
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Local state for sub-tabs in admin panel or forms
  const [activeSubTab, setActiveSubTab] = useState<'apps' | 'profile'>('apps');

  // Form states for App
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formCategory, setFormCategory] = useState<AppCategory>('toan');
  const [formAudience, setFormAudience] = useState<AppAudience>('hoc_sinh');
  const [formIconName, setFormIconName] = useState('Calculator');
  const [formColor, setFormColor] = useState('from-blue-500 to-indigo-600');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states for Teacher Profile
  const [profName, setProfName] = useState(teacher.name);
  const [profRole, setProfRole] = useState(teacher.role);
  const [profSchool, setProfSchool] = useState(teacher.school);
  const [profBio, setProfBio] = useState(teacher.bio);
  const [profSlogan, setProfSlogan] = useState(teacher.slogan);
  const [profPhone, setProfPhone] = useState(teacher.phone || '');
  const [profZaloLink, setProfZaloLink] = useState(teacher.zaloLink || '');

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (success) {
      setAuthError('');
      setPassword('');
      triggerSuccess('Đăng nhập quản trị viên thành công!');
    } else {
      setAuthError('Mật khẩu chưa chính xác! Hãy nhập "admin123" để thử.');
    }
  };

  const resetAppForm = () => {
    setEditingAppId(null);
    setFormName('');
    setFormDescription('');
    setFormLink('');
    setFormCategory('toan');
    setFormAudience('hoc_sinh');
    setFormIconName('Calculator');
    setFormColor('from-blue-500 to-indigo-600');
  };

  const handleSaveAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      alert('Vui lòng nhập đầy đủ tên và mô tả ứng dụng!');
      return;
    }

    saveApp({
      id: editingAppId || undefined,
      name: formName,
      description: formDescription,
      link: formLink.trim() || '#',
      category: formCategory,
      audience: formAudience,
      iconName: formIconName,
      color: formColor,
    });

    triggerSuccess(editingAppId ? 'Cập nhật ứng dụng thành công!' : 'Thêm ứng dụng mới thành công!');
    resetAppForm();
  };

  const handleEditAppClick = (app: EducationalApp) => {
    setEditingAppId(app.id);
    setFormName(app.name);
    setFormDescription(app.description);
    setFormLink(app.link);
    setFormCategory(app.category);
    setFormAudience(app.audience || 'hoc_sinh');
    setFormIconName(app.iconName);
    setFormColor(app.color);
    // Scroll window smoothly to form
    const formElement = document.getElementById('app-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName.trim() || !profSlogan.trim()) {
      alert('Tên giáo viên và slogan không được để trống!');
      return;
    }
    updateTeacher({
      name: profName,
      role: profRole,
      school: profSchool,
      bio: profBio,
      slogan: profSlogan,
      phone: profPhone,
      zaloLink: profZaloLink
    });
    triggerSuccess('Đã cập nhật thông tin hồ sơ của bạn thành công!');
  };

  // Safe wrapper for deletion confirmation
  const handleDeleteConfirm = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa ứng dụng "${name}" ra khỏi thư viện?`)) {
      deleteApp(id);
      triggerSuccess(`Đã xóa thành công ứng dụng "${name}"!`);
      if (editingAppId === id) resetAppForm();
    }
  };

  // If not admin, render key login challenge page
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-12 px-4" id="admin-login-card">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6 text-center transform hover:scale-[1.01] transition-transform">
          <div className="mx-auto w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xs">
            <Lock size={28} className="animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Khu Vực Giáo Viên</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Vui lòng nhập mật khẩu quản trị để thêm mới, sửa đổi hoặc xóa các ứng dụng giáo dục trong thư viện.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5ClassName">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Mật khẩu cấu hình (Mặc định: admin123)
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập admin123..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-850"
                  required
                  id="admin-pwd-input"
                />
              </div>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold px-3 py-2.5 rounded-lg flex items-center space-x-2 animate-shake" id="login-error">
                <AlertCircle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 font-extrabold text-white rounded-lg shadow-lg hover:shadow-indigo-100 transition-all uppercase text-xs tracking-wider cursor-pointer"
              id="btn-login-submit"
            >
              Xác thực hành động
            </button>
          </form>

          <p className="text-xs text-slate-400">
            * Mật khẩu lưu trữ cứng dạng client-side để giáo viên tự quản lý nhanh chóng mà không cần máy chủ riêng tư.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto" id="admin-workspace">
      
      {/* Toast Alert Indicator */}
      {successMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2.5 text-sm font-semibold animate-fade-in-down" id="admin-toast">
          <ShieldCheck size={18} className="text-emerald-500 animate-pulse" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Admin Panel Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-100 gap-4 shadow-2xs text-left">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-extrabold border border-emerald-100 leading-none">
            <UserCheck size={12} />
            <span>Đã xác minh Admin (Giáo viên)</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Khu vực kiểm soát thư viện</h3>
          <p className="text-sm text-slate-500 mt-1">
            Điều chỉnh linh hoạt dữ liệu app và hồ sơ hiển thị ra bên ngoài cho học sinh học hỏi.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex bg-slate-50 p-1.5 rounded-lg border border-slate-200/50 w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('apps')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-md transition-all ${
              activeSubTab === 'apps'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            Quản lý App
          </button>
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-md transition-all ${
              activeSubTab === 'profile'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            Hồ Sơ Giáo Viên
          </button>
        </div>
      </div>

      {activeSubTab === 'apps' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column: Create & Edit Form */}
          <div className="lg:col-span-5 space-y-6" id="app-form-section">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {editingAppId ? 'Cập nhật ứng dụng' : 'Thêm ứng dụng mới'}
                  </h4>
                </div>
                {editingAppId && (
                  <button
                    onClick={resetAppForm}
                    className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-md flex items-center space-x-1"
                    title="Hủy sửa đổi hiện tại"
                  >
                    <X size={12} />
                    <span>Hủy</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveAppSubmit} className="space-y-4">
                {/* Name field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
                    Tên ứng dụng học tập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ví dụ: Rèn luyện phép nhân siêu tốc"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    id="input-app-name"
                  />
                </div>

                {/* Grid Category & Icon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
                      Danh mục môn học
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as AppCategory)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
                      id="input-app-category"
                    >
                      {CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Icon Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
                      Biểu tượng hoạt họa
                    </label>
                    <select
                      value={formIconName}
                      onChange={(e) => setFormIconName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
                      id="input-app-icon"
                    >
                      {SUPPORTED_ICONS.map((ico) => (
                        <option key={ico.name} value={ico.name}>{ico.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phân nhóm đối tượng sử dụng */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
                    Đối tượng sử dụng ứng dụng
                  </label>
                  <select
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value as AppAudience)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
                    id="input-app-audience"
                  >
                    <option value="hoc_sinh">🎒 Dành cho Học Sinh (Luyện tập, chơi game toán học...)</option>
                    <option value="giao_vien">🍏 Dành cho Giáo Viên (Thiết kế, soạn giảng, quản trị lớp...)</option>
                  </select>
                </div>

                {/* Color choices & Background Template */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
                    Tông màu bảng hiệu thẻ học
                  </label>
                  <select
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
                    id="input-app-color"
                  >
                    {COLOR_THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>{theme.label}</option>
                    ))}
                  </select>
                </div>

                {/* Link chạy app */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
                    Đường dẫn chạy ứng dụng (Link URL)
                  </label>
                  <input
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="Ví dụ: https://giao-an-toan.web.app hoặc để dấu # để học sinh xem thử"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-800 font-mono text-xs"
                    id="input-app-link"
                  />
                  <p className="text-[10px] text-slate-400 italic">
                    Gợi ý: Quý thầy cô có thể tự dán link các trang Scratch, Kahoot, Google Forms hoặc trang HTML vào đây.
                  </p>
                </div>

                {/* Description field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-widest block">
                    Mô tả tóm tắt tính năng giáo dục <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Mô tả cụ thể cách học, độ tuổi phù hợp hoặc mục đích bài học để giáo viên khác và phụ huynh nắm được..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none"
                    id="input-app-description"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  id="btn-save-app"
                >
                  <Save size={16} />
                  <span>{editingAppId ? 'Lưu chỉnh sửa ngay' : 'Thêm mới vào Thư Viện'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Mini list of apps for quick actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
              <h4 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-4">
                Danh sách các App hiện có ({apps.length})
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse" id="admin-apps-table">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase">
                      <th className="py-3 px-1">Ứng dụng</th>
                      <th className="py-3 px-1">Học phần</th>
                      <th className="py-3 px-1 text-center">Tác vụ quản lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {apps.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400 font-medium">
                          Chưa có ứng dụng nào trong thư viện! Hãy sử dụng ô bên trái để nhập app đầu tiên.
                        </td>
                      </tr>
                    ) : (
                      apps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-1">
                            <div className="font-bold text-slate-800">{app.name}</div>
                            <div className="text-xs text-slate-400 line-clamp-1 max-w-[240px]">{app.description}</div>
                          </td>
                          <td className="py-3 px-1">
                            <span className="text-slate-600 text-xs font-semibold uppercase">{app.category}</span>
                            <div className="text-[10px] text-indigo-600 font-bold mt-0.5 whitespace-nowrap">
                              {app.audience === 'giao_vien' ? '🍏 Giáo viên' : '🎒 Học sinh'}
                            </div>
                          </td>
                          <td className="py-3 px-1">
                            <div className="flex justify-center space-x-1.5">
                              <button
                                onClick={() => handleEditAppClick(app)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                                title="Sửa thông tin app"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(app.id, app.name)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                                title="Xóa app ra khỏi lớp học"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Teacher Profile Edit Form */
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-xs text-left max-w-2xl mx-auto space-y-6" id="teacher-profile-form">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <UserCheck size={20} className="text-indigo-600 animate-pulse" />
            <h4 className="font-extrabold text-base text-slate-900">Thay đổi thông tin giới thiệu của tôi</h4>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Họ và Tên giáo viên
              </label>
              <input
                type="text"
                required
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
              />
            </div>

            {/* Role & School */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Chức danh / Chuyên môn
                </label>
                <input
                  type="text"
                  required
                  value={profRole}
                  onChange={(e) => setProfRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Đơn vị công tác / Trường học
                </label>
                <input
                  type="text"
                  required
                  value={profSchool}
                  onChange={(e) => setProfSchool(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Slogan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Slogan giáo dục của bạn
              </label>
              <input
                type="text"
                required
                value={profSlogan}
                onChange={(e) => setProfSlogan(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
              />
            </div>

            {/* Phone & Zalo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="text"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  placeholder="Ví dụ: 033.666.0253"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Đường dẫn Zalo liên hệ (Link URL)
                </label>
                <input
                  type="text"
                  value={profZaloLink}
                  onChange={(e) => setProfZaloLink(e.target.value)}
                  placeholder="Ví dụ: https://zalo.me/0336660253"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800 font-mono text-xs"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Tiểu sử / Lời tâm huyết với học sinh
              </label>
              <textarea
                required
                rows={5}
                value={profBio}
                onChange={(e) => setProfBio(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-sm rounded-lg outline-none transition-all text-slate-800 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer shadow-md"
              id="btn-save-profile"
            >
              <Save size={16} />
              <span>Cập nhật hồ sơ công khai</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
