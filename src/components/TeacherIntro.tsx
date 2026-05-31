import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Award, PlayCircle, BookOpen, 
  Gamepad2, Compass, ShieldCheck, Zap, ArrowRight, Star, 
  Calculator, Languages, FlaskConical, Brain, ShieldAlert, Phone
} from 'lucide-react';
import { TeacherProfile, EducationalApp } from '../types';
import IconRenderer from './IconRenderer';

interface TeacherIntroProps {
  teacher: TeacherProfile;
  totalApps: number;
  onExplore: () => void;
  apps?: EducationalApp[];
  onOpenAdmin?: () => void;
}

export default function TeacherIntro({ teacher, totalApps, onExplore, apps = [], onOpenAdmin }: TeacherIntroProps) {
  
  // Filtering apps by audience
  const studentApps = apps.filter(app => !app.audience || app.audience === 'hoc_sinh');
  const teacherApps = apps.filter(app => app.audience === 'giao_vien');

  // Helper to resolve colors matching the Bento Grid HTML mockup
  const getBentoColors = (index: number, category: string) => {
    switch (category) {
      case 'toan':
        return {
          bg: 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-100 hover:border-emerald-300',
          badgeText: 'text-emerald-700 bg-emerald-100/50',
          badgeLabel: 'Môn Toán',
          iconBg: 'bg-emerald-500',
          textHover: 'text-emerald-600'
        };
      case 'tieng_viet':
        return {
          bg: 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-100 hover:border-amber-300',
          badgeText: 'text-amber-700 bg-amber-100/50',
          badgeLabel: 'Tiếng Việt',
          iconBg: 'bg-amber-500',
          textHover: 'text-amber-600'
        };
      case 'khoa_hoc':
        return {
          bg: 'bg-indigo-50/80 hover:bg-indigo-100/90 border-indigo-100 hover:border-indigo-300',
          badgeText: 'text-indigo-700 bg-indigo-100/50',
          badgeLabel: 'Khoa Học',
          iconBg: 'bg-indigo-500',
          textHover: 'text-indigo-600'
        };
      default:
        return {
          bg: 'bg-rose-50/80 hover:bg-rose-100/90 border-rose-100 hover:border-rose-300',
          badgeText: 'text-rose-700 bg-rose-100/50',
          badgeLabel: 'Tư Duy',
          iconBg: 'bg-rose-500',
          textHover: 'text-rose-600'
        };
    }
  };

  const benefits = [
    {
      icon: Gamepad2,
      title: 'Học thông qua Trò chơi (Gamification)',
      description: 'Chuyển hóa lý thuyết khô khan thành câu đố, tương tác sống động, giúp học sinh tiếp thu kiến thức một cách tự nhiên.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      icon: Compass,
      title: 'Kích thích Tư duy trực quan',
      description: 'Mô phỏng chân thực các mô hình không gian, thí nghiệm hóa sinh ảo, thúc đẩy khả năng sáng tạo vượt bậc.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      icon: Zap,
      title: 'Tăng cường tương tác & Phản xạ',
      description: 'Nâng cao nhịp độ bài giảng thông qua rèn luyện tính nhẩm tốc độ, học từ vựng tiếng Việt sinh động.',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      icon: ShieldCheck,
      title: 'An toàn & Chủ động tự học',
      description: 'Hỗ trợ các em ôn tập kỹ năng cốt lõi mọi lúc mọi nơi trên điện thoại, máy tính bảng của gia đình.',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
  ];

  return (
    <div className="space-y-12 py-4 text-left" id="teacher-landing">
      
      {/* Bento Grid Container */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5" id="bento-box-grid">
        
        {/* Cell 1: Left Section - Profile & Hero (col-span-4) */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <BookOpen size={160} className="text-slate-900 group-hover:scale-105 transition-transform duration-500" />
          </div>

          <div className="space-y-6">
            {/* Header Badge & Profile info */}
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-505 to-purple-500 bg-indigo-600 flex items-center justify-center text-white font-black text-lg border-4 border-indigo-50 shadow-md">
                TH
              </div>
              <div className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg text-[10px] font-extrabold leading-none flex items-center space-x-1 border border-amber-100 shadow-2xs">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                <span>Edu Creator</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold leading-tight text-slate-900">
                Học vui - 
                <br />
                <span className="text-indigo-600">{teacher.slogan.split('-').pop()?.trim() || 'Sáng tạo mỗi ngày'}</span>
              </h2>
              
              <div className="text-xs text-slate-500 font-bold tracking-wide uppercase flex items-center space-x-1">
                <Award size={14} className="text-indigo-500" />
                <span>Hồ sơ: {teacher.name}</span>
              </div>

              {/* Contact information card block */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">Điện thoại liên hệ:</span>
                  <span className="font-black text-indigo-600 text-sm">{teacher.phone || '033.666.0253'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Công tác:</span>
                  <span className="text-slate-700">{teacher.school}</span>
                </div>
              </div>

              <p className="text-slate-500 text-xs leading-relaxed">
                {teacher.bio}
              </p>
            </div>
          </div>

          <div className="pt-8">
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={onExplore}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-100 cursor-pointer text-sm"
                id="bento-explore-btn"
              >
                <span>Khám phá thư viện app</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href={teacher.zaloLink || "https://zalo.me/0336660253"}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#0068ff] hover:bg-[#005cd4] text-white rounded-2xl font-extrabold transition-all flex items-center justify-center gap-2 group shadow-md cursor-pointer text-sm"
                id="zalo-bento-btn"
              >
                <div className="w-5 h-5 bg-white text-[#0068ff] rounded-full flex items-center justify-center text-xs font-black shrink-0">Z</div>
                <span>Liên hệ Zalo: {teacher.phone || '033.666.0253'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Cell 2: Top Right - Featured Applications Grid (col-span-8) */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {apps.slice(0, 4).map((app, idx) => {
            const colors = getBentoColors(idx, app.category);
            return (
              <div
                key={app.id}
                onClick={() => {
                  if (app.link && app.link !== '#') {
                    window.location.href = app.link;
                  } else {
                    alert(`Đây là ứng dụng mẫu "${app.name}". Thầy cô hãy đăng nhập Admin (mật khẩu: admin123) để sửa link thực cho học sinh nhé!`);
                  }
                }}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-2xs ${colors.bg}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl text-white ${colors.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                    <IconRenderer name={app.iconName} size={20} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg ${colors.badgeText}`}>
                      {colors.badgeLabel}
                    </span>
                    <span className="text-[9px] bg-slate-900/5 text-slate-600 font-extrabold px-1.5 py-0.5 rounded">
                      {app.audience === 'giao_vien' ? '🍏 Cho Giáo viên' : '🎒 Cho Học sinh'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-900 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {app.description}
                  </p>
                </div>

                <div className={`mt-4 flex items-center font-bold text-xs gap-1 group-hover:gap-2 transition-all ${colors.textHover}`}>
                  <span>Trải nghiệm ngay</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}

          {/* Fallback cards to maintain structural symmetry in Bento Grid if less than 4 apps */}
          {apps.length < 4 && Array.from({ length: 4 - apps.length }).map((_, i) => (
            <div
              key={`fallback-${i}`}
              onClick={onExplore}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-400 rounded-2xl text-white">
                  <BookOpen size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Bài đọc</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Thêm bài học mới</h3>
                <p className="text-xs text-slate-500">Giáo viên có thể click vào Quản lý để đăng tải các trò chơi học tập lý thú mới.</p>
              </div>
              <div className="flex items-center text-slate-600 font-bold text-sm gap-1">Khám phá ngay →</div>
            </div>
          ))}
        </div>

        {/* Cell 3: Bottom Center - Search & Stats (col-span-8) */}
        <div className="col-span-12 md:col-span-8 bg-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner relative overflow-hidden text-white">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-505/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex-1 flex flex-col gap-3 w-full text-left">
            <h4 className="text-white font-extrabold text-lg tracking-tight">Tìm kiếm nhanh ứng dụng học tập</h4>
            <div className="relative w-full">
              <input 
                type="text" 
                onClick={onExplore}
                readOnly
                placeholder="Ví dụ: Toán vui, Chữ cái, Thí nghiệm..." 
                className="w-full bg-slate-800 hover:bg-slate-800/80 cursor-pointer border-none rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors"
              />
              <div className="absolute left-3.5 top-3.5 text-slate-500">
                <IconRenderer name="Search" size={16} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full sm:w-auto justify-end">
            <div className="text-center bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-800/50 flex-1 sm:flex-initial">
              <span className="block text-indigo-400 text-3xl font-black">{totalApps}+</span>
              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest">Ứng dụng</span>
            </div>
            <div className="text-center bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-800/50 flex-1 sm:flex-initial">
              <span className="block text-emerald-400 text-3xl font-black">500+</span>
              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest">Học sinh</span>
            </div>
          </div>
        </div>

        {/* Cell 4: Bottom Left - Admin Quick Access (col-span-4) */}
        <div className="col-span-12 md:col-span-4 bg-indigo-600 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-white shadow-lg relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500 rounded-full opacity-30" />
          
          <div className="flex justify-between items-start mb-6">
            <h4 className="font-extrabold text-lg tracking-tight">Khu vực Quản trị</h4>
            <div className="p-1.5 bg-indigo-500 rounded-lg text-indigo-100">
              <ShieldAlert size={18} />
            </div>
          </div>

          <p className="text-indigo-100 text-xs leading-relaxed mb-6 text-left">
            Dành riêng cho giáo viên. Nhập mã bảo mật để tùy chỉnh danh sách app và hồ sơ cá nhân tức thời.
          </p>

          <button 
            onClick={onOpenAdmin}
            className="w-full bg-white hover:bg-indigo-50 text-indigo-600 rounded-xl py-3 font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm text-center"
          >
            Mở bảng điều khiển
          </button>
        </div>

      </section>

      {/* TWO DISTINCT AREAS FOR APPS (STUDENTS vs TEACHERS) */}
      <section className="space-y-12 pt-8" id="landing-app-zones">
        <div className="text-left space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-indigo-600 animate-pulse animate-duration-1000" size={28} />
            <span>Phân Hệ Học Tập Trực Tuyến Tương Tác</span>
          </h3>
          <p className="text-slate-500 max-w-2xl text-xs sm:text-sm">
            Danh mục phần mềm tương tác chất lượng cao được thiết kế phân luồng thông minh thành hai khu vực chuyên biệt cho Học sinh tự luyện và Giáo viên soạn bài.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AREA 1: APPS FOR STUDENTS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                  <Languages size={24} />
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-950">Ứng Dụng Cho Học Sinh 🎒</h4>
                  <p className="text-xs text-slate-500">Giúp các em vui học luyện nhớ, thử tài toán lý, phát triển tư duy IQ siêu tốc.</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-100">
                {studentApps.length} ứng dụng
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentApps.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
                  Chưa có ứng dụng học sinh nào được tải lên!
                </div>
              ) : (
                studentApps.map((app) => {
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        if (app.link && app.link !== '#') {
                          window.location.href = app.link;
                        } else {
                          alert(`Đây là ứng dụng mẫu "${app.name}". Bạn hãy click vào trang quản trị để liên kết đường chạy app thật nhé.`);
                        }
                      }}
                      className="bg-slate-50/50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 transition-all duration-300 rounded-2xl p-4 cursor-pointer group flex flex-col justify-between text-left h-36"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase bg-emerald-100/50 text-emerald-800 px-2 py-0.5 rounded-md">
                            {app.category === 'toan' ? 'Môn Toán' : app.category === 'tieng_viet' ? 'Tiếng Việt' : app.category === 'khoa_hoc' ? 'Khoa Học' : 'Tự học'}
                          </span>
                          <div className="text-emerald-500 group-hover:scale-110 transition-transform">
                            <IconRenderer name={app.iconName} size={16} />
                          </div>
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{app.name}</h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{app.description}</p>
                      </div>
                      <span className="text-[10.5px] font-bold text-emerald-600 mt-2 flex items-center gap-1 group-hover:gap-1.5 transition-all">Vào luyện tập ngay →</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AREA 2: APPS FOR TEACHERS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-950">Công Cụ Cho Giáo Viên 🍏</h4>
                  <p className="text-xs text-slate-500">Giúp các thầy cô xây dựng giáo案, liên kết bài giảng, quản lý thi đua lớp học.</p>
                </div>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-100">
                {teacherApps.length} công cụ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teacherApps.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
                  Chưa có công cụ dành riêng cho giáo viên. Hãy mở bảng điều khiển để tải lên.
                </div>
              ) : (
                teacherApps.map((app) => {
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        if (app.link && app.link !== '#') {
                          window.location.href = app.link;
                        } else {
                          alert(`Đây là ứng dụng nghiệp vụ "${app.name}" mẫu. Bạn hãy đăng nhập Quản lý (admin123) để sửa đường link nhé.`);
                        }
                      }}
                      className="bg-slate-50/50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 transition-all duration-300 rounded-2xl p-4 cursor-pointer group flex flex-col justify-between text-left h-36"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase bg-badge bg-indigo-100/50 text-indigo-800 px-2 py-0.5 rounded-md">
                            Nghiệp vụ
                          </span>
                          <div className="text-indigo-500 group-hover:scale-110 transition-transform">
                            <IconRenderer name={app.iconName} size={16} />
                          </div>
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1">{app.name}</h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{app.description}</p>
                      </div>
                      <span className="text-[10.5px] font-bold text-indigo-600 mt-2 flex items-center gap-1 group-hover:gap-1.5 transition-all">Sử dụng công cụ →</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Content Section */}
      <section className="space-y-12 pt-10" id="benefits-section">
        <div className="text-left space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Lợi Ích Từ Việc Học Qua Ứng Dụng Tương Tác
          </h3>
          <p className="text-slate-500 max-w-2xl text-xs sm:text-sm">
            Phương pháp kết hợp công nghệ thông tin giúp nâng cao tinh thần tự học, tăng gấp đôi hiệu suất ghi nhớ của học sinh tiểu học và trung học.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 text-left flex gap-5 shadow-2xs group hover:border-indigo-250 transition-all"
              >
                <div className={`p-4 rounded-2xl shrink-0 border h-fit group-hover:scale-105 transition-transform duration-300 ${benefit.color}`}>
                  <Icon size={24} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Slogan Banner with Bento layout style */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl mt-6 border border-slate-850">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-900 to-slate-900 -z-10" />
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <Star size={36} className="mx-auto text-yellow-400 fill-yellow-400 animate-bounce" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black italic tracking-wide">
            "{teacher.slogan}"
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Chúng tôi luôn nỗ lực đổi mới mỗi ngày để mang lại những giá trị giáo dục trực quan và hạnh phúc nhất cho học trò yêu quý. Hãy click ngay vào thư viện để trải nghiệm!
          </p>
          <div className="pt-2">
            <button
              onClick={onExplore}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-indigo-950 font-extrabold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-md"
            >
              <span>Vào học ngay bây giờ</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Zalo Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.a
          href={teacher.zaloLink || "https://zalo.me/0336660253"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2.5 bg-[#0068ff] hover:bg-[#005cd4] text-white font-extrabold px-5 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 1 }}
          title={`Liên hệ thầy ${teacher.name} qua Zalo`}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span>
          <div className="w-6 h-6 bg-white text-[#0068ff] rounded-full flex items-center justify-center text-sm font-black shadow-xs shrink-0 select-none">
            Z
          </div>
          <span className="text-xs uppercase tracking-wider hidden sm:inline md:inline">Zalo Giáo Viên</span>
        </motion.a>
      </div>

    </div>
  );
}

