import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  LogIn, LogOut, User as UserIcon, Shield, CreditCard, Sparkles, ChevronDown 
} from 'lucide-react';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthButtonProps {
  onUserChanged?: (profile: UserProfile | null) => void;
}

export default function AuthButton({ onUserChanged }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let currentProfile: UserProfile;
          if (userDocSnap.exists()) {
            currentProfile = userDocSnap.data() as UserProfile;
          } else {
            // Check if the user is the owner/admin Bùi Thanh Huấn
            const isAdminEmail = currentUser.email === 'thanhhuanhb@gmail.com';
            
            // Create user profile in Firestore
            currentProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || 'Thành viên cộng đồng',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              role: isAdminEmail ? 'admin' : 'member',
              createdAt: new Date().toISOString()
            };
            
            await setDoc(userDocRef, currentProfile);
          }
          
          setProfile(currentProfile);
          if (onUserChanged) onUserChanged(currentProfile);
        } catch (error) {
          console.error('Error fetching/creating user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        if (onUserChanged) onUserChanged(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [onUserChanged]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Authentication Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-semibold animate-pulse border border-slate-200">
        <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin" />
        <span>Đang xác thực...</span>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <button
        onClick={handleSignIn}
        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 text-xs uppercase tracking-wide cursor-pointer"
        id="btn-google-login"
      >
        <LogIn size={14} />
        <span>Đăng nhập Google</span>
      </button>
    );
  }

  const isAdmin = profile.role === 'admin';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id="auth-dropdown-wrapper">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2.5 p-1.5 pr-3.5 bg-slate-50 hover:bg-slate-100/80 active:bg-slate-100 border border-slate-200/80 rounded-2xl transition-all cursor-pointer group"
        id="btn-auth-menu"
      >
        {profile.photoURL ? (
          <img 
            src={profile.photoURL} 
            alt={profile.name} 
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all border border-slate-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {profile.name[0]}
          </div>
        )}

        <div className="hidden sm:block text-left max-w-[120px]">
          <div className="text-xs font-bold text-slate-800 truncate leading-tight">{profile.name}</div>
          <div className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1">
            {isAdmin ? (
              <span className="text-rose-600 font-bold flex items-center gap-0.5">
                <Shield size={10} /> Admin
              </span>
            ) : (
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <Sparkles size={10} /> Thành viên
              </span>
            )}
          </div>
        </div>

        <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl border border-slate-150 shadow-xl overflow-hidden focus:outline-none z-50 animate-fade-in-down" id="auth-dropdown">
          {/* User info header */}
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 text-left">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tài khoản Cộng đồng</p>
            <h4 className="text-sm font-black text-slate-800 leading-tight mt-1">{profile.name}</h4>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{profile.email}</p>
          </div>

          <div className="p-1.5 space-y-0.5 text-left">
            {isAdmin && (
              <div className="flex items-center space-x-2.5 px-3 py-2 text-rose-700 bg-rose-50/50 rounded-lg text-xs font-bold">
                <Shield size={14} className="text-rose-500 shrink-0" />
                <span>Quyền Quản trị viên (Admin)</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2.5 px-3 py-2 text-slate-700 rounded-lg text-xs font-medium">
              <Sparkles size={14} className="text-indigo-500 shrink-0" />
              <span>Đại sứ đóng góp học liệu</span>
            </div>
          </div>

          <div className="p-1.5 border-t border-slate-100">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
              id="btn-sign-out"
            >
              <LogOut size={14} />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
