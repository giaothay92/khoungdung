import React from 'react';
import * as Lucide from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export default function IconRenderer({ name, className = '', size }: IconRendererProps) {
  // Safe lookup with fallback to GraduationCap
  const LucideIcon = (Lucide as any)[name] || Lucide.GraduationCap;
  
  return <LucideIcon className={className} size={size} />;
}

export const SUPPORTED_ICONS = [
  { name: 'Calculator', label: 'Máy tính / Toán học' },
  { name: 'Languages', label: 'Ngôn ngữ / Tiếng Việt' },
  { name: 'FlaskConical', label: 'Khoa học / Thí nghiệm' },
  { name: 'Brain', label: 'Trí não / IQ' },
  { name: 'GraduationCap', label: 'Mũ cử nhân' },
  { name: 'BookOpen', label: 'Sách mở' },
  { name: 'Sparkles', label: 'Sáng tạo' },
  { name: 'Compass', label: 'Địa lý / Định hướng' }
];

export const CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'toan', label: 'Môn Toán' },
  { value: 'tieng_viet', label: 'Tiếng Việt' },
  { value: 'khoa_hoc', label: 'Khoa học' },
  { value: 'khac', label: 'Khác' }
];
