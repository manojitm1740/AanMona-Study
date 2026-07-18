/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type Language, i18n } from './i18n';
import { type UserProfile, UserRole } from './types';
import { onAuthStateChanged, logout } from './firebase';

// Components
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import OfferingsPage from './components/OfferingsPage';
import GalleryPage from './components/GalleryPage';
import LiveTestZone from './components/LiveTestZone';
import SyllabusPage from './components/SyllabusPage';
import AboutPage from './components/AboutPage';
import AdmissionForm from './components/AdmissionForm';

// Dashboards
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

// Lucide icon
import { Bell, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('bn'); // Default to Bengali
  const [currentView, setCurrentView] = useState<string>('landing');
  const [history, setHistory] = useState<string[]>(['landing']);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  // Auth modals state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        // If logged in via Google OAuth, automatically construct user profile as STUDENT
        const profile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          fullNameEn: user.displayName || 'Google User',
          fullNameBn: user.displayName || 'গুগল ব্যবহারকারী',
          role: user.email === 'manojitm20@gmail.com' ? UserRole.ADMIN : UserRole.STUDENT,
          whatsapp: '9830098300',
          studentClass: '10',
          isVerified: true,
          registrationDate: new Date().toISOString().split('T')[0]
        };
        setCurrentUser(profile);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setGoogleAccessToken(null);
    setCurrentView('landing');
    setHistory(['landing']);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setHistory(prev => [...prev, view]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prevView = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentView(prevView);
    }
  };

  const handleLinkGoogleToken = (token: string) => {
    setGoogleAccessToken(token);
  };

  const handleLogoutGoogle = () => {
    setGoogleAccessToken(null);
  };

  const t = i18n[lang];

  return (
    <div id="app-root" className="min-h-screen bg-[#FFF9F0] flex flex-col justify-between">
      
      {/* 1. TOP NAVBAR BRANDING */}
      <Navbar
        lang={lang}
        onLangToggle={() => setLang(prev => (prev === 'en' ? 'bn' : 'en'))}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalMode('signin');
          setShowAuthModal(true);
        }}
        onSignOut={handleLogout}
        onNavigate={handleNavigate}
        onBack={handleBack}
        currentView={currentView}
      />

      {/* 2. CORE CONTAINER WITH TRANSITIONS */}
      <div className="flex-1 w-full max-w-7xl mx-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Render View Routing Grid */}
            {currentView === 'admission-form' && (
              <AdmissionForm lang={lang} />
            )}

            {currentView === 'landing' && (
              <LandingPage
                lang={lang}
                onNavigate={handleNavigate}
                onOpenAuth={() => {
                  setAuthModalMode('signin');
                  setShowAuthModal(true);
                }}
              />
            )}

            {currentView === 'offerings' && (
              <OfferingsPage
                lang={lang}
                currentUser={currentUser}
                onOpenAuth={() => {
                  setAuthModalMode('signin');
                  setShowAuthModal(true);
                }}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'live-tests' && (
              <LiveTestZone
                lang={lang}
                currentUser={currentUser}
                onOpenAuth={() => {
                  setAuthModalMode('signin');
                  setShowAuthModal(true);
                }}
              />
            )}

            {currentView === 'syllabus' && (
              <SyllabusPage lang={lang} />
            )}

            {currentView === 'gallery' && (
              <GalleryPage lang={lang} />
            )}

            {currentView === 'about' && (
              <AboutPage lang={lang} />
            )}

            {/* Dashboards Routing Mapping */}
            {currentView === 'dashboard-student' && currentUser && (
              <StudentDashboard
                lang={lang}
                currentUser={currentUser}
                googleAccessToken={googleAccessToken}
                onUpdateUser={(updated) => setCurrentUser(updated)}
                onLinkGoogleToken={handleLinkGoogleToken}
                onLogoutGoogle={handleLogoutGoogle}
              />
            )}

            {currentView === 'dashboard-teacher' && currentUser && (
              <TeacherDashboard
                lang={lang}
                currentUser={currentUser}
                googleAccessToken={googleAccessToken}
                onLinkGoogleToken={handleLinkGoogleToken}
              />
            )}

            {currentView === 'dashboard-admin' && currentUser && (
              <AdminDashboard
                lang={lang}
                currentUser={currentUser}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. BILINGUAL LANDING FOOTER DESIGN */}
      <footer id="global-footer" className="bg-[#1A1A2E] text-white/90 pt-16 pb-8 border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="space-y-4">
            <h3 className="text-xl font-black font-sans tracking-wide text-white">
              {lang === 'en' ? 'AanMona Study' : 'আনমনা স্টাডি'}
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              {lang === 'en' 
                ? 'High quality, robust educational systems mapped perfectly to WBBSE and WBCHSE boards. Supporting online lectures and cached text outlines.' 
                : 'পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ এবং উচ্চমাধ্যমিক শিক্ষা সংসদ অনুমোদিত পাঠক্রমের জন্য অন্যতম সেরা ডিজিটাল শিক্ষামূলক প্ল্যাটফর্ম।'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
              {lang === 'en' ? 'Quick Views' : 'নেভিগেশন'}
            </h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-white/70 font-sans">
              <button onClick={() => handleNavigate('landing')} className="hover:text-white transition-all text-left cursor-pointer">
                {lang === 'en' ? 'Home' : 'হোম'}
              </button>
              <button onClick={() => handleNavigate('offerings')} className="hover:text-white transition-all text-left cursor-pointer">
                {t.offerings}
              </button>
              <button onClick={() => handleNavigate('live-tests')} className="hover:text-white transition-all text-left cursor-pointer">
                {lang === 'en' ? 'Exam Zone' : 'পরীক্ষা জোন'}
              </button>
              <button onClick={() => handleNavigate('syllabus')} className="hover:text-white transition-all text-left cursor-pointer">
                {t.syllabus}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
              {lang === 'en' ? 'Academic Boards' : 'পর্ষদ তালিকা'}
            </h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-white/70 font-sans">
              <span>WBBSE (Classes 1 - 10)</span>
              <span>WBCHSE (Classes 11 - 12)</span>
              <span>WB Primary Council</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
              {lang === 'en' ? 'Student Safety' : 'নিরাপত্তা'}
            </h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-white/70 font-sans">
              <span>PWA Offline Enabled</span>
              <span>Secure SSL Encryption</span>
              <span>HOD Verified Materials</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/50 font-mono">
            &copy; 2026 AanMona Study. All rights reserved. Mapped for West Bengal Boards.
          </p>
          <div className="flex gap-4 text-[10px] text-white/50 font-mono">
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>

      {/* 4. MODALS ATTACHED */}
      {showAuthModal && (
        <AuthModal
          lang={lang}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user, googleToken) => {
            setCurrentUser(user);
            if (googleToken) setGoogleAccessToken(googleToken);
            setShowAuthModal(false);
            // Default navigate student/teacher to their dashboard on login
            if (user.role === UserRole.ADMIN) handleNavigate('dashboard-admin');
            else if (user.role === UserRole.TEACHER) handleNavigate('dashboard-teacher');
            else handleNavigate('dashboard-student');
          }}
        />
      )}

    </div>
  );
}
