export type AppCategory = 'toan' | 'tieng_viet' | 'khoa_hoc' | 'khac';
export type AppAudience = 'giao_vien' | 'hoc_sinh';

export interface EducationalApp {
  id: string;
  name: string;
  description: string;
  link: string;
  category: AppCategory;
  audience: AppAudience; // Phân loại: Dành cho giáo viên hay học sinh
  iconName: string; // The Lucide React icon name
  color: string;    // Tailwind color gradient/solid classes for custom theming
}

export interface TeacherProfile {
  name: string;
  role: string;
  school: string;
  bio: string;
  slogan: string;
  phone?: string;
  zaloLink?: string;
}
