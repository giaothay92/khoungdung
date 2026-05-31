import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { EducationalApp } from '../types';
import IconRenderer from './IconRenderer';

interface AppCardProps {
  key?: string;
  app: EducationalApp;
  isAdmin: boolean;
  onEdit?: (app: EducationalApp) => void;
  onDelete?: (app: EducationalApp) => void;
}

export default function AppCard({ app, isAdmin, onEdit, onDelete }: AppCardProps) {
  
  // Custom metadata resolver based on category
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'toan':
        return { label: 'Toán học', border: 'border-blue-100', text: 'text-blue-700', bg: 'bg-blue-50' };
      case 'tieng_viet':
        return { label: 'Tiếng Việt', border: 'border-rose-100', text: 'text-rose-700', bg: 'bg-rose-50' };
      case 'khoa_hoc':
        return { label: 'Khoa học', border: 'border-emerald-100', text: 'text-emerald-700', bg: 'bg-emerald-50' };
      default:
        return { label: 'Môn học khác', border: 'border-purple-100', text: 'text-purple-700', bg: 'bg-purple-50' };
    }
  };

  const catDetails = getCategoryDetails(app.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden relative group"
      id={`app-card-${app.id}`}
    >
      {/* Top Background Gradient Header with Integrated Icon */}
      <div className={`h-24 bg-gradient-to-tr ${app.color} relative p-4 flex items-end justify-between`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-10 mix-blend-overlay" />
        
        {/* Floating Category Badge */}
        <span className={`px-2.5 py-1 ${catDetails.bg} ${catDetails.text} text-[11px] font-extrabold rounded-lg border ${catDetails.border} shadow-2xs uppercase tracking-wide shrink-0`}>
          {catDetails.label}
        </span>

        {/* Dynamic Lucide Icon Container */}
        <div className="p-3 bg-white/95 backdrop-blur-xs rounded-xl shadow-lg ring-2 ring-white/30 text-indigo-950 shrink-0 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <IconRenderer name={app.iconName} size={22} className="text-slate-800" />
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
        <div className="space-y-2">
          <h4 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1" title={app.name}>
            {app.name}
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3" title={app.description}>
            {app.description}
          </p>
        </div>

        {/* Footer actions inside the card */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-50">
          
          {/* Main action button: Dùng thử */}
          <a
            href={app.link === '#' ? undefined : app.link}
            onClick={(e) => {
              if (app.link === '#') {
                e.preventDefault();
                // Alert in iframe safe modal or interactive visual prompt
                alert(`Đây là ứng dụng mẫu "${app.name}". Bạn vui lòng đăng nhập tài khoản Admin (mật khẩu: admin123) để sửa link thật cho học sinh dùng!`);
              }
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs tracking-wider transition-colors duration-200 uppercase group-hover:shadow-md"
            id={`btn-live-test-${app.id}`}
          >
            <span>Dùng thử</span>
            <ExternalLink size={12} />
          </a>

          {/* Quick Admin Utility controls */}
          {isAdmin && (
            <div className="flex space-x-1" id={`admin-actions-${app.id}`}>
              <button
                onClick={() => onEdit && onEdit(app)}
                className="p-1.5 hover:bg-slate-100 text-indigo-600 rounded-md hover:text-indigo-700 transition-colors"
                title="Chỉnh sửa thông tin app"
                id={`btn-edit-${app.id}`}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete && onDelete(app)}
                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-md hover:text-rose-700 transition-colors"
                title="Xóa ứng dụng này"
                id={`btn-delete-${app.id}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
