/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Award, CheckCircle, ChevronDown, Flame, Globe, LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { i18n, type Language } from '../i18n';
import { type UserProfile, UserRole } from '../types';

interface NavbarProps {
  lang: Language;
  onLangToggle: () => void;
  currentUser: UserProfile | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
  onBack?: () => void;
  currentView?: string;
}

export default function Navbar({
  lang,
  onLangToggle,
  currentUser,
  onSignOut,
  onOpenAuth,
  onNavigate,
  onBack,
  currentView,
}: NavbarProps) {
  const [offeringsOpen, setOfferingsOpen] = useState(false);
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const t = i18n[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Back Button or Logo */}
          <div className="flex items-center gap-2">
            {currentView !== 'landing' && onBack && (
              <button 
                onClick={onBack}
                className="p-2 rounded-xl text-gray-500 hover:bg-orange-50 hover:text-[#FF6B35] transition-all"
              >
                <ChevronDown size={20} className="rotate-90" />
              </button>
            )}
            <div 
              id="nav-logo-container"
              onClick={() => onNavigate('landing')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img src="/assets/logo.png" alt="AanMona Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            
            {/* Offerings Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOfferingsOpen(true)}
              onMouseLeave={() => setOfferingsOpen(false)}
            >
              <button
                id="nav-offerings-trigger"
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#FF6B35] py-2 transition-all cursor-pointer"
              >
                <span>{t.offerings}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${offeringsOpen ? 'rotate-180' : ''}`} />
              </button>

              {offeringsOpen && (
                <div id="nav-offerings-dropdown" className="absolute left-0 mt-0 w-80 bg-white rounded-xl shadow-xl border border-orange-100 p-4 grid grid-cols-1 gap-2 transition-all duration-300 animate-slide-down">
                  <div className="text-[11px] font-bold text-[#FF6B35] tracking-wider uppercase border-b border-orange-50 pb-1.5 mb-1">
                    {lang === 'en' ? 'Class Categories' : 'শ্রেণি ক্যাটাগরি'}
                  </div>
                  
                  <button 
                    onClick={() => { onNavigate('offerings'); setOfferingsOpen(false); }} 
                    className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-orange-50/50 text-left cursor-pointer"
                  >
                    <div className="bg-orange-100 p-1 rounded text-[#FF6B35] text-xs">I-V</div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{t.classLevel_primary}</div>
                      <div className="text-[10px] text-gray-400">{lang === 'en' ? 'Fun learning and basics' : 'সহজ পাঠ ও গণিত শিক্ষা'}</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { onNavigate('offerings'); setOfferingsOpen(false); }} 
                    className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-orange-50/50 text-left cursor-pointer"
                  >
                    <div className="bg-teal-100 p-1 rounded text-[#4ECDC4] text-xs">VI-VIII</div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{t.classLevel_upper_primary}</div>
                      <div className="text-[10px] text-gray-400">{lang === 'en' ? 'Science, Mathematics, Arts' : 'বিজ্ঞান, গণিত ও সাহিত্য'}</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { onNavigate('offerings'); setOfferingsOpen(false); }} 
                    className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-orange-50/50 text-left cursor-pointer"
                  >
                    <div className="bg-amber-100 p-1 rounded text-amber-600 text-xs">IX-X</div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{t.classLevel_secondary}</div>
                      <div className="text-[10px] text-gray-400">{lang === 'en' ? 'Board preparation' : 'মাধ্যমিক পরীক্ষার প্রস্তুতি'}</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { onNavigate('offerings'); setOfferingsOpen(false); }} 
                    className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-orange-50/50 text-left cursor-pointer"
                  >
                    <div className="bg-purple-100 p-1 rounded text-purple-600 text-xs">XI-XII</div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{t.classLevel_higher_secondary}</div>
                      <div className="text-[10px] text-gray-400">{lang === 'en' ? 'Science, Arts, Commerce Streams' : 'উচ্চ মাধ্যমিকের ৩টি বিভাগ'}</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Link */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="nav-gallery"
              onClick={() => onNavigate('gallery')}
              className="text-sm font-semibold text-gray-700 hover:text-[#FF6B35] transition-all cursor-pointer"
            >
              {t.gallery}
            </motion.button>

            {/* Live Test with blinking badge */}
            <button
              id="nav-livetest"
              onClick={() => onNavigate('live-test')}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-[#FF6B35] transition-all cursor-pointer"
            >
              <span>{t.liveTest}</span>
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF233C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF233C]"></span>
              </span>
            </button>

            {/* Syllabus Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setSyllabusOpen(true)}
              onMouseLeave={() => setSyllabusOpen(false)}
            >
              <button
                id="nav-syllabus-trigger"
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#FF6B35] py-2 transition-all cursor-pointer"
              >
                <span>{t.syllabus}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${syllabusOpen ? 'rotate-180' : ''}`} />
              </button>

              {syllabusOpen && (
                <div id="nav-syllabus-dropdown" className="absolute left-0 mt-0 w-64 bg-white rounded-xl shadow-xl border border-orange-100 p-3 flex flex-col gap-1 animate-slide-down">
                  <button 
                    onClick={() => { onNavigate('syllabus'); setSyllabusOpen(false); }} 
                    className="p-2 rounded-lg hover:bg-orange-50/50 text-left text-xs font-bold text-gray-800 cursor-pointer"
                  >
                    WBBSE Syllabus (Classes 1-10)
                  </button>
                  <button 
                    onClick={() => { onNavigate('syllabus'); setSyllabusOpen(false); }} 
                    className="p-2 rounded-lg hover:bg-orange-50/50 text-left text-xs font-bold text-gray-800 cursor-pointer"
                  >
                    WBCHSE Syllabus (Classes 11-12)
                  </button>
                </div>
              )}
            </div>

            {/* About */}
            <button
              id="nav-about"
              onClick={() => onNavigate('about')}
              className="text-sm font-semibold text-gray-700 hover:text-[#FF6B35] transition-all cursor-pointer"
            >
              {t.about}
            </button>
          </nav>

          {/* Right controls: Language + Login */}
          <div className="flex items-center gap-3">
            
            {/* Elegant slide-toggle for language */}
            <button
              id="nav-lang-toggle"
              onClick={onLangToggle}
              className="flex items-center gap-1 bg-orange-50 text-[#FF6B35] hover:bg-orange-100/70 border border-orange-200/50 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Globe size={14} />
              <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* User Session profile dropdown or login CTA */}
            {currentUser ? (
              <div 
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  id="nav-profile-trigger"
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-teal-50 border border-orange-100 p-1.5 pr-3 rounded-full cursor-pointer hover:border-orange-300 transition-all"
                >
                  <img
                    id="user-avatar-small"
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border border-[#FF6B35]/20"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-gray-800 leading-3">
                      {lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn}
                    </div>
                    <div className="text-[9px] text-[#FF6B35] font-semibold leading-3 uppercase tracking-wider">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown size={12} className="text-gray-500" />
                </button>

                {profileOpen && (
                  <div id="nav-profile-dropdown" className="absolute right-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-orange-100 p-2 flex flex-col gap-1 animate-slide-down">
                    <div className="p-2 border-b border-orange-50 text-center">
                      <div className="text-xs font-bold text-gray-800">
                        {lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {currentUser.email}
                      </div>
                      {currentUser.isVerified ? (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100 mt-1">
                          <CheckCircle size={9} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-amber-100 mt-1">
                          Pending Approval
                        </span>
                      )}
                    </div>

                    <button
                      id="nav-profile-dashboard"
                      onClick={() => {
                        if (currentUser.role === UserRole.STUDENT) onNavigate('dashboard-student');
                        else if (currentUser.role === UserRole.TEACHER) onNavigate('dashboard-teacher');
                        else onNavigate('dashboard-admin');
                        setProfileOpen(false);
                      }}
                      className="w-full p-2 rounded-lg hover:bg-orange-50 text-left text-xs font-semibold text-gray-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={14} className="text-[#FF6B35]" />
                      <span>{t.dashboard}</span>
                    </button>

                    <button
                      id="nav-profile-signout"
                      onClick={() => { onSignOut(); setProfileOpen(false); }}
                      className="w-full p-2 rounded-lg hover:bg-red-50 text-left text-xs font-semibold text-red-600 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-nav-signin"
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white py-1.5 px-4 rounded-xl text-xs font-bold hover:shadow-md hover:shadow-orange-200 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <UserIcon size={14} />
                <span>{t.signIn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
