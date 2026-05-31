import React from 'react';
import { Mail, GraduationCap, Github, BookOpen, Heart } from 'lucide-react';
import { TeacherProfile } from '../types';

interface FooterProps {
  teacher: TeacherProfile;
}

export default function Footer({ teacher }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Section 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <BookOpen size={20} />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">E-App Library</span>
            </div>
            <p className="text-sm text-slate-400 italic">
              "{teacher.slogan}"
            </p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Kho ứng dụng chất lượng giúp giáo viên đổi mới sáng tạo, tạo sinh khí tích cực và khơi dậy đam mê chinh phục tri thức của mỗi học sinh.
            </p>
          </div>

          {/* Section 2: Teacher Bio Summary */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center space-x-2">
              <GraduationCap size={16} className="text-sky-400" />
              <span>Thông tin tác giả</span>
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="font-semibold text-white">{teacher.name}</p>
              <p className="text-xs text-indigo-400 font-medium">{teacher.role}</p>
              <p className="text-xs">{teacher.school}</p>
            </div>
          </div>

          {/* Section 3: Tech stack & Quick contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center space-x-2">
              <Mail size={16} className="text-rose-400" />
              <span>Liên hệ & Công nghệ</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Nền tảng: HTML5 / React / Tailwind</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Lưu trữ: LocalStorage an toàn</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block animate-pulse" />
                <span>Giao diện: 100% Responsive & Đa mượt</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} Kho ứng dụng Giáo dục - Giáo viên {teacher.name}. Bảo lưu mọi quyền.
          </p>
          <p className="flex items-center space-x-1">
            <span>Thiết kế bởi lớp học số với</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-bounce" />
            <span>&amp; Đổi mới Giáo dục</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
