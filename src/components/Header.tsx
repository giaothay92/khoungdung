import React, { useState } from 'react';
import { BookOpen, GraduationCap, Grid, ShieldAlert, AlignRight, X } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  currentTab: 'home' | 'library' | 'admin';
  setTab: (tab: 'home' | 'library' | 'admin') => void;
  teacherName: string;
  isAdmin: boolean;
  logoutAdmin: () => void;
}

export default function Header({ currentTab, setTab, teacherName, isAdmin, logoutAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Trang Chủ', icon: GraduationCap },
    { id: 'library', label: 'Thư Viện App', icon: Grid },
    { id: 'admin', label: 'Quản Lý', icon: ShieldAlert },
  ] as const;

  const handleTabClick = (tabId: 'home' | 'library' | 'admin') => {
    setTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleTabClick('home')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-all duration-300">
              <BookOpen size={24} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                Kho Ứng Dụng Giáo Dục
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Giáo viên: <span className="text-indigo-600 font-semibold">{teacherName}</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center" id="desktop-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isActive 
                      ? 'text-indigo-600' 
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                  id={`nav-tab-${item.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnder"
                      className="absolute inset-0 bg-indigo-50/70 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={16} className={`${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'admin' && isAdmin && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-ping" />
                  )}
                </button>
              );
            })}

            {isAdmin && (
              <button
                onClick={logoutAdmin}
                className="ml-4 px-3.5 py-1.5 border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-md transition-colors"
                id="btn-logout"
              >
                Đăng Xuất Admin
              </button>
            )}
          </nav>

          {/* Hamburger Menu Toggle */}
          <div className="md:hidden flex items-center">
            {isAdmin && (
              <span className="mr-3 w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" title="Đã đăng nhập Admin" />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Mobile Menu"
              id="btn-mobile-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <AlignRight size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-6 space-y-2 shadow-inner"
          id="mobile-nav"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
                id={`nav-tab-mobile-${item.id}`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-500' : 'text-slate-400'} />
                <span>{item.label}</span>
                {item.id === 'admin' && isAdmin && (
                  <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-md">Đã bật</span>
                )}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => {
                logoutAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-4 text-center px-4 py-3 border border-rose-200 bg-rose-50 text-rose-700 font-bold rounded-lg hover:bg-rose-100 transition-colors"
              id="btn-mobile-logout"
            >
              Đăng Xuất Admin (Khóa)
            </button>
          )}
        </motion.div>
      )}
    </header>
  );
}
