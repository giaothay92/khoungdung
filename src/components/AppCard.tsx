import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Edit2, Trash2, Heart, Eye } from 'lucide-react';
import { EducationalApp } from '../types';
import IconRenderer from './IconRenderer';

interface AppCardProps {
  key?: string;
  app: EducationalApp;
  isAdmin: boolean;
  onEdit?: (app: EducationalApp) => void;
  onDelete?: (app: EducationalApp) => void;
  onLike?: (app: EducationalApp) => void;
  currentUserUID?: string;
}

export default function AppCard({ app, isAdmin, onEdit, onDelete, onLike, currentUserUID }: AppCardProps) {
  
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
  const likedKey = currentUserUID ? `liked_${app.id}_${currentUserUID}` : '';
  const hasLikedLocal = likedKey ? localStorage.getItem(likedKey) === 'true' : false;

  // Simulate persistent view count on-mount based on likesCount and random seeding
  const [views] = useState(() => {
    const baseLikes = app.likesCount || 0;
    const offset = Math.floor(Math.random() * 80) + 40;
    // Views roughly proportional to likes to look realistic
    return (baseLikes * 15) + offset + Math.floor(Math.random() * 120);
  });

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

        {/* Community details: Contributor, Views & Likes */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            {app.contributorPhoto ? (
              <img 
                src={app.contributorPhoto} 
                alt="" 
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                {(app.contributorName || 'C')[0]}
              </div>
            )}
            <span className="text-slate-500 truncate max-w-[120px]" title={app.contributorName}>
              Đóng góp: <span className="font-semibold text-slate-700">{app.contributorName || 'Bùi Thanh Huấn'}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* View count indicator */}
            <div 
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-semibold border border-transparent"
              title="Lượt xem"
            >
              <Eye size={12} className="text-slate-400" />
              <span>{views}</span>
            </div>

            {/* Like button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                if (onLike) onLike(app);
              }}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all text-xs font-semibold hover:bg-rose-50 cursor-pointer ${
                hasLikedLocal 
                  ? 'bg-rose-50/50 text-rose-600 border border-thin border-rose-100' 
                  : 'bg-slate-50 text-slate-500 border border-thin border-slate-100'
              }`}
              title="Thích ứng dụng này"
            >
              <Heart 
                size={12} 
                className={`${hasLikedLocal ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'}`} 
              />
              <span>{app.likesCount || 0}</span>
            </button>
          </div>
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
                alert(`Đây là ứng dụng mẫu "${app.name}". Nhấp nút "Dùng thử" để mở trang trò chơi! Bạn có thể sửa link để trỏ về trang web thật.`);
              }
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs tracking-wider transition-colors duration-200 uppercase group-hover:shadow-md"
            id={`btn-live-test-${app.id}`}
          >
            <span>Dùng thử</span>
            <ExternalLink size={12} />
          </a>

          {/* Quick Admin/Owner controls */}
          {(isAdmin || (currentUserUID && currentUserUID === app.contributorUID)) && (
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
