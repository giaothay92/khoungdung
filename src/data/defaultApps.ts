import { EducationalApp, TeacherProfile } from '../types';

export const INITIAL_APPS: EducationalApp[] = [
  {
    id: 'toan-vui',
    name: 'Toán vui - Luyện tính nhẩm',
    description: 'Thử thách tính nhẩm nhanh với các phép tính cộng, trừ, nhân, chia từ dễ đến khó. Giúp học sinh học toán một cách chủ động và phản xạ siêu nhanh!',
    link: '#',
    category: 'toan',
    audience: 'hoc_sinh',
    iconName: 'Calculator',
    color: 'from-blue-500 to-indigo-600',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 12,
    createdAt: '2026-05-30T00:00:00Z'
  },
  {
    id: 'be-hoc-chu-cai',
    name: 'Bé học chữ cái',
    description: 'Ứng dụng tương tác sinh động giúp các bé mầm non và tiểu học nhanh chóng ghi nhớ bảng chữ cái tiếng Việt cùng âm điệu vần phát âm chuẩn.',
    link: '#',
    category: 'tieng_viet',
    audience: 'hoc_sinh',
    iconName: 'Languages',
    color: 'from-pink-500 to-rose-600',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 8,
    createdAt: '2026-05-30T01:00:00Z'
  },
  {
    id: 'kham-pha-khoa-hoc',
    name: 'Khám phá khoa học',
    description: 'Các thí nghiệm ảo trực quan sinh động về vật lý, hóa học và sinh học cơ bản. Kích thích sự tò mò học hỏi và niềm đam mê nghiên cứu của học sinh.',
    link: '#',
    category: 'khoa_hoc',
    audience: 'hoc_sinh',
    iconName: 'FlaskConical',
    color: 'from-emerald-400 to-teal-600',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 15,
    createdAt: '2026-05-30T02:00:00Z'
  },
  {
    id: 'do-vui-iq',
    name: 'Đố vui IQ - Rèn tư duy',
    description: 'Bộ sưu tập các câu đố logic, hình học không gian và thử thách IQ thú vị, thúc đẩy trí thông minh, tính nhẫn nại và tư duy phản biện.',
    link: '#',
    category: 'toan',
    audience: 'hoc_sinh',
    iconName: 'Brain',
    color: 'from-amber-500 to-orange-600',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 22,
    createdAt: '2026-05-30T03:00:00Z'
  },
  {
    id: 'so-tay-giao-an',
    name: 'Sổ tay Giáo án điện tử',
    description: 'Công cụ soạn thảo giáo án điện tử theo mẫu chuẩn của Bộ Giáo dục, tích hợp AI gợi ý bài tập tương tác sáng tạo cho từng tiết học.',
    link: '#',
    category: 'khac',
    audience: 'giao_vien',
    iconName: 'BookOpen',
    color: 'from-purple-500 to-indigo-700',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 6,
    createdAt: '2026-05-30T04:00:00Z'
  },
  {
    id: 'quan-ly-lop-hoc',
    name: 'Quản lý thi đua & Điểm danh',
    description: 'Ứng dụng quản lý nề nếp lớp học, tích lũy ngôi sao thi đua học tập cho từng học sinh, giúp liên lạc báo cáo nhanh chóng tới phụ huynh.',
    link: '#',
    category: 'khac',
    audience: 'giao_vien',
    iconName: 'GraduationCap',
    color: 'from-cyan-400 to-blue-600',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 9,
    createdAt: '2026-05-30T05:00:00Z'
  },
  {
    id: 'nhan-xet-hoc-sinh',
    name: 'Công cụ Nhận xét Học sinh',
    description: 'Công cụ thông minh giúp giáo viên soạn lập nhanh bảng nhận xét học bạ chuẩn thông tư, tích hợp gợi ý nhận xét mẫu phong phú.',
    link: 'https://nhanxethocsinh.vercel.app/',
    category: 'khac',
    audience: 'giao_vien',
    iconName: 'Sparkles',
    color: 'from-violet-500 to-purple-700',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 31,
    createdAt: '2026-05-30T06:00:00Z'
  },
  {
    id: 'so-diem-viet-tay',
    name: 'Sổ điểm Viết tay Điện tử',
    description: 'Bảng số hóa sổ điểm viết tay truyền thống, lưu dữ liệu điểm danh, điểm kiểm tra thi cử và hỗ trợ xuất báo cáo tự động cho học sinh.',
    link: 'https://sodiemviettay.vercel.app/',
    category: 'khac',
    audience: 'giao_vien',
    iconName: 'Calculator',
    color: 'from-emerald-500 to-teal-600',
    contributorUID: 'system-admin',
    contributorName: 'Bùi Thanh Huấn',
    likesCount: 19,
    createdAt: '2026-05-30T07:00:00Z'
  }
];

export const DEFAULT_TEACHER: TeacherProfile = {
  name: 'Bùi Thanh Huấn',
  role: 'Giáo viên & Chuyên gia lập trình ứng dụng giáo dục sáng tạo',
  school: 'Trường Tiểu học & Trung học Cơ sở Chất lượng cao',
  bio: 'Tôi là giáo viên yêu thích đổi mới sáng tạo, ứng dụng công nghệ thông tin vào giảng dạy. Với mong muốn mang lại những bài học bổ ích, hấp dẫn nhất cho học sinh, tôi đã thiết kế và tổng hợp các ứng dụng học tập tương tác nâng cao hiệu quả giảng dạy và kích thích tư duy chủ động của các em.',
  slogan: 'Học vui - Sáng tạo mỗi ngày',
  phone: '033.666.0253',
  zaloLink: 'https://zalo.me/0336660253'
};
