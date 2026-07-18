/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ArrowRight, BookOpen, Download, HelpCircle, Laptop, Landmark, 
  MapPin, Milestone, MonitorPlay, Sparkles, Trophy, Users, WifiOff, FileText, CheckCircle
} from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { CLASSES_DATA, ANNOUNCEMENTS, GALLERY_ITEMS, INITIAL_LEADERBOARD } from '../mockData';

interface LandingPageProps {
  lang: Language;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export default function LandingPage({ lang, onNavigate, onOpenAuth }: LandingPageProps) {
  const [boardSelected, setBoardSelected] = useState<'WBBSE' | 'WBCHSE'>('WBBSE');
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 45, seconds: 30 });
  const [stats, setStats] = useState({ students: 420, tests: 95, teachers: 28 });

  const t = i18n[lang];

  // Simulated countdown for next live test spotlight
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 0, seconds: 0 }; // Loop back
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated count-up animation on mounting
  useEffect(() => {
    const stdInt = setInterval(() => {
      setStats((prev) => {
        if (prev.students < 540) return { ...prev, students: prev.students + 3 };
        return prev;
      });
    }, 40);
    return () => clearInterval(stdInt);
  }, []);

  return (
    <div id="landing-page-root" className="space-y-16 pb-12 overflow-x-hidden">
      
      {/* SECTION 1: HERO BANNER */}
      <section id="hero-banner-section" className="relative bg-[#FFF9F0] pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-orange-100">
        {/* Floating geometric shape ornaments */}
        <div className="absolute top-10 left-5 w-12 h-12 bg-orange-100 rounded-full blur-sm opacity-60 animate-float"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-teal-100 rounded-3xl blur-md opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-yellow-100 rounded-full blur-sm opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-[#FF6B35] px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200/50">
              <Sparkles size={14} className="animate-spin" />
              <span>{lang === 'en' ? 'Empowering West Bengal Board Learners' : 'পশ্চিমবঙ্গ বোর্ডের শিক্ষার্থীদের জন্য বিশেষ প্ল্যাটফর্ম'}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A1A2E] leading-tight font-sans">
              {lang === 'en' ? (
                <>
                  The <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] bg-clip-text text-transparent">Joy of Learning</span>, <br />
                  Your Path to Exam Success!
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] bg-clip-text text-transparent">শেখার আনন্দ</span>, <br />
                  সাফল্যের সহজ রাজপথ!
                </>
              )}
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              {t.heroSubheading}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-cta-learn"
                onClick={() => onNavigate('offerings')}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white py-3 px-8 rounded-2xl text-sm font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.startLearning}</span>
                <ArrowRight size={16} />
              </button>
              <button
                id="hero-cta-admission"
                onClick={() => onNavigate('admission-form')}
                className="bg-[#4ECDC4] text-white py-3 px-8 rounded-2xl text-sm font-bold shadow-lg shadow-teal-200 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{lang === 'en' ? 'Apply for Admission' : 'ভর্তির জন্য আবেদন'}</span>
                <Sparkles size={16} />
              </button>
              <button
                id="hero-cta-tests"
                onClick={() => onNavigate('live-test')}
                className="bg-white text-[#FF6B35] border-2 border-[#FF6B35] py-3 px-7 rounded-2xl text-sm font-bold hover:bg-orange-50 transition-all cursor-pointer flex items-center gap-1.5 animate-pulse-glow"
              >
                <span>{t.viewLiveTests}</span>
              </button>
            </div>

            {/* Simulated Live Floating Stats cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6">
              <div className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-3">
                <div className="bg-orange-50 p-2.5 rounded-xl text-[#FF6B35]">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-sm sm:text-lg font-bold text-gray-800">{formatNumber(stats.students, lang)}+</div>
                  <div className="text-[9px] sm:text-xs text-gray-400 font-sans">{t.activeStudents}</div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-3">
                <div className="bg-teal-50 p-2.5 rounded-xl text-[#4ECDC4]">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="text-sm sm:text-lg font-bold text-gray-800">{formatNumber(stats.tests, lang)}+</div>
                  <div className="text-[9px] sm:text-xs text-gray-400 font-sans">{t.mockTests}</div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-3">
                <div className="bg-yellow-50 p-2.5 rounded-xl text-yellow-600">
                  <Laptop size={18} />
                </div>
                <div>
                  <div className="text-sm sm:text-lg font-bold text-gray-800">{formatNumber(stats.teachers, lang)}+</div>
                  <div className="text-[9px] sm:text-xs text-gray-400 font-sans">{t.expertTeachers}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated illustration container */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-orange-100/40 p-4 flex items-center justify-center animate-float">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#FF6B35]/20 animate-spin" style={{ animationDuration: '40s' }}></div>
              
              <img
                id="hero-classroom-svg"
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600"
                alt="AanMona Classroom"
                className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
              />

              {/* Badges popping out */}
              <div className="absolute -top-2 -left-2 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-orange-100 flex items-center gap-1.5 rotate-[-6deg]">
                <span className="text-[#06D6A0]">●</span>
                <span className="text-xs font-bold text-gray-800 font-sans">{lang === 'en' ? 'PWA Offline Ready' : 'অফলাইনেও চলবে'}</span>
              </div>

              <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-orange-100 flex items-center gap-1.5 rotate-[4deg]">
                <img src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=40" alt="drive" className="w-4 h-4 rounded-full" />
                <span className="text-xs font-bold text-[#FF6B35] font-sans">{lang === 'en' ? 'Drive Sync' : 'ড্রাইভ লিঙ্ক'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MARQUEE ANNOUNCEMENT BAR */}
      <div id="marquee-announcements" className="bg-[#FF6B35] text-white py-3 overflow-hidden shadow-md">
        <div className="whitespace-nowrap flex items-center gap-12 animate-[marquee_25s_linear_infinite]">
          {ANNOUNCEMENTS.map((ann, idx) => (
            <div key={idx} className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold font-sans">
              <span className="bg-[#FFE66D] text-gray-900 px-2 py-0.5 rounded text-[10px] uppercase font-black">{lang === 'en' ? 'Notice' : 'নোটিশ'}</span>
              <span>{lang === 'en' ? ann.textEn : ann.textBn}</span>
            </div>
          ))}
          {/* Duplicate for seamless infinite loop */}
          {ANNOUNCEMENTS.map((ann, idx) => (
            <div key={`dup-${idx}`} className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold font-sans">
              <span className="bg-[#FFE66D] text-gray-900 px-2 py-0.5 rounded text-[10px] uppercase font-black">{lang === 'en' ? 'Notice' : 'নোটিশ'}</span>
              <span>{lang === 'en' ? ann.textEn : ann.textBn}</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* SECTION 3: OUR BOARDS & CLASSES */}
      <section id="boards-and-classes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1A1A2E]">{lang === 'en' ? 'Choose Your Syllabus Board' : 'আপনার সিলেবাস বোর্ড নির্বাচন করুন'}</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">{lang === 'en' ? 'Quick class access to West Bengal Secondary (WBBSE) and Higher Secondary (WBCHSE) courses.' : 'পশ্চিমবঙ্গ মাধ্যমিক (WBBSE) ও উচ্চ মাধ্যমিক (WBCHSE) সিলেবাসে দ্রুত প্রবেশ করুন।'}</p>
        </div>

        {/* Board Selection Tabs */}
        <div className="flex justify-center gap-4">
          <button
            id="tab-select-wbbse"
            onClick={() => setBoardSelected('WBBSE')}
            className={`py-2.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              boardSelected === 'WBBSE'
                ? 'bg-[#FF6B35] text-white border-2 border-[#FF6B35]'
                : 'bg-white text-gray-700 border-2 border-orange-100 hover:bg-orange-50/50'
            }`}
          >
            {t.board_wbbse}
          </button>
          <button
            id="tab-select-wbchse"
            onClick={() => setBoardSelected('WBCHSE')}
            className={`py-2.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              boardSelected === 'WBCHSE'
                ? 'bg-[#FF6B35] text-white border-2 border-[#FF6B35]'
                : 'bg-white text-gray-700 border-2 border-orange-100 hover:bg-orange-50/50'
            }`}
          >
            {t.board_wbchse}
          </button>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {CLASSES_DATA.filter(c => c.board === boardSelected).map((cls) => (
            <div
              key={cls.id}
              id={`class-card-${cls.id}`}
              onClick={onOpenAuth}
              className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left group"
            >
              <div className="bg-orange-50 text-[#FF6B35] w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg mb-4 group-hover:bg-[#FF6B35] group-hover:text-white transition-all">
                {formatNumber(cls.id, lang)}
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] font-sans">{lang === 'en' ? cls.nameEn : cls.nameBn}</h3>
              <p className="text-xs text-gray-400 font-mono tracking-wide uppercase mt-1">
                {cls.board} • {formatNumber(cls.subjects.length, lang)} {t.subjectsLabel}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#4ECDC4] group-hover:text-[#FF6B35] transition-all">
                <span>{t.startLearning}</span>
                <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FEATURES SHOWCASE */}
      <section id="features-section" className="bg-gradient-to-br from-orange-50/50 via-[#FFF9F0] to-teal-50/30 py-16 px-4 sm:px-6 lg:px-8 border-y border-orange-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-[#1A1A2E]">
              {lang === 'en' ? 'Engineered for Digital Classrooms' : 'ডিজিটাল ক্লাসরুমের শ্রেষ্ঠ উপাদানসমূহ'}
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              {lang === 'en' ? 'AanMona Study provides all the learning tools students require for West Bengal Board exams.' : 'মাধ্যমিক ও উচ্চ মাধ্যমিক পরীক্ষার প্রস্তুতি সহজ করতে সব ফিচার রয়েছে একই অ্যাপে।'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-md transition-all">
              <div className="bg-orange-100 text-[#FF6B35] p-3 rounded-2xl w-fit mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-md font-bold text-gray-900">{lang === 'en' ? 'Chapter Notes' : 'অধ্যায় ভিত্তিক নোটস'}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{lang === 'en' ? 'Detailed textbook notes structured block-by-block with board level standard.' : 'বোর্ডের নিয়মানুযায়ী সাজানো বিস্তারিত ও সংক্ষিপ্ত প্রশ্নোত্তর।'}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-md transition-all">
              <div className="bg-teal-100 text-[#4ECDC4] p-3 rounded-2xl w-fit mb-4">
                <MonitorPlay size={24} />
              </div>
              <h3 className="text-md font-bold text-gray-900">{lang === 'en' ? 'Live & Video Classes' : 'লাইভ ও ভিডিও ক্লাস'}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{lang === 'en' ? 'Attend interactive live sessions and review recorded backups any time.' : 'সরাসরি শিক্ষকের সাথে ডাউট ক্লিয়ারিং লাইভ ক্লাস।'}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-md transition-all">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-2xl w-fit mb-4">
                <Download size={24} />
              </div>
              <h3 className="text-md font-bold text-gray-900">{lang === 'en' ? 'PDF Downloads' : 'পিডিএফ ডাউনলোড'}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{lang === 'en' ? 'Mark notes as downloadable and print or study them offline comfortably.' : 'প্রয়োজনীয় প্রশ্নপত্রের পিডিএফ ডাউনলোড করে অফলাইনে পড়ার সুবিধা।'}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm hover:shadow-md transition-all">
              <div className="bg-red-100 text-[#EF233C] p-3 rounded-2xl w-fit mb-4">
                <WifiOff size={24} />
              </div>
              <h3 className="text-md font-bold text-gray-900">{lang === 'en' ? 'Full PWA Offline Mode' : 'অফলাইন পিডব্লিউএ'}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{lang === 'en' ? 'Never stop learning even with zero internet. Access cached PDFs.' : 'ইন্টারনেট ছাড়াই আগের পড়া নোটস ও পিডিএফ দেখার সুবিধা।'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1A1A2E]">{t.howItWorks}</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">{lang === 'en' ? 'Get started on AanMona Study in four easy stages' : 'সহজ চারটি ধাপে শুরু করুন আপনার পড়াশোনা।'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-dashed bg-orange-100 -z-10"></div>
          
          <div className="text-center space-y-3 relative">
            <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-2 shadow-md">
              {formatNumber('1', lang)}
            </div>
            <h3 className="text-base font-bold text-gray-900 font-sans">{t.howItWorks_step1_title}</h3>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">{t.howItWorks_step1_desc}</p>
          </div>

          <div className="text-center space-y-3 relative">
            <div className="bg-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-2 shadow-md">
              {formatNumber('2', lang)}
            </div>
            <h3 className="text-base font-bold text-gray-900 font-sans">{t.howItWorks_step2_title}</h3>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">{t.howItWorks_step2_desc}</p>
          </div>

          <div className="text-center space-y-3 relative">
            <div className="bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-2 shadow-md">
              {formatNumber('3', lang)}
            </div>
            <h3 className="text-base font-bold text-gray-900 font-sans">{t.howItWorks_step3_title}</h3>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">{t.howItWorks_step3_desc}</p>
          </div>

          <div className="text-center space-y-3 relative">
            <div className="bg-[#FF6B35] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-2 shadow-md">
              {formatNumber('4', lang)}
            </div>
            <h3 className="text-base font-bold text-gray-900 font-sans">{t.howItWorks_step4_title}</h3>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">{t.howItWorks_step4_desc}</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: LIVE TEST SPOTLIGHT */}
      <section id="live-test-spotlight" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute top-0 right-0 translate-x-20 -translate-y-20 w-80 h-80 bg-white/10 rounded-full pointer-events-none"></div>
          
          <div className="space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1 bg-[#EF233C] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-blink">
              {lang === 'en' ? 'LIVE NOW' : 'লাইভ চলছে'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              {lang === 'en' ? 'Public Weekly Science & Math Tests' : 'পাবলিক সাপ্তাহিক বিজ্ঞান ও গণিত মক টেস্ট'}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              {lang === 'en' ? 'Take free board-level simulated online tests directly on our portal. No compulsory login required! Track instant result sheets.' : 'পাবলিক পরীক্ষার আদলে সম্পূর্ণ বিনামূল্যে অনলাইন লাইভ মক টেস্ট দিন। লগ-ইন ছাড়াও ফলাফল দেখতে পারবেন।' }
            </p>

            <div className="flex justify-center md:justify-start gap-4 text-xs font-mono bg-white/10 p-3 rounded-2xl w-fit">
              <div>
                <span className="block text-lg font-bold">{formatNumber(countdown.hours, lang)}</span>
                <span className="text-[10px] text-white/70">Hours</span>
              </div>
              <span className="text-lg font-bold">:</span>
              <div>
                <span className="block text-lg font-bold">{formatNumber(countdown.minutes, lang)}</span>
                <span className="text-[10px] text-white/70">Mins</span>
              </div>
              <span className="text-lg font-bold">:</span>
              <div>
                <span className="block text-lg font-bold">{formatNumber(countdown.seconds, lang)}</span>
                <span className="text-[10px] text-white/70">Secs</span>
              </div>
            </div>
          </div>

          <button
            id="spotlight-attempt-now"
            onClick={() => onNavigate('live-test')}
            className="bg-white text-[#FF6B35] hover:bg-orange-50 font-extrabold text-sm py-3.5 px-8 rounded-2xl transition-all cursor-pointer whitespace-nowrap shadow-lg shrink-0"
          >
            {t.attemptNow}
          </button>
        </div>
      </section>

      {/* SECTION 7: SYLLABUS PREVIEW ACCORDION */}
      <section id="syllabus-accordion-section" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{lang === 'en' ? 'Syllabus Highlights' : 'পাঠ্যক্রমের প্রধান তথ্যসমূহ'}</h2>
          <p className="text-xs text-gray-500">{lang === 'en' ? 'Click on each Board category to view core subjects.' : 'প্রধান বিষয়সমূহ দেখে নিন এক নজরে।'}</p>
        </div>

        <div className="space-y-3 bg-white p-4 rounded-3xl border border-orange-100 shadow-sm">
          <details className="group py-3 border-b border-orange-50 cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-sm text-gray-800 list-none font-sans">
              <span>{lang === 'en' ? 'WBBSE Class 1 to 5 Subject Mapping' : 'WBBSE শ্রেণি ১ থেকে ৫ পাঠ্যক্রম'}</span>
              <span className="text-[#FF6B35] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-gray-500 pt-3 leading-relaxed pl-2 font-sans">
              {lang === 'en' 
                ? 'Core Focus: Bengali, English, Mathematics, and Environmental Studies (EVS). Primary curriculum develops alphabets, counting and general surroundings.'
                : 'প্রধান বিষয়: বাংলা, ইংরেজি, গণিত এবং আমাদের পরিবেশ (EVS)। স্বরবর্ণ, সংখ্যা গণনা ও পারিপার্শ্বিক পরিবেশ আলোচনা করা হয়।'}
            </p>
          </details>

          <details className="group py-3 border-b border-orange-50 cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-sm text-gray-800 list-none font-sans">
              <span>{lang === 'en' ? 'WBBSE Class 9 to 10 Secondary Exams' : 'WBBSE শ্রেণি ৯ থেকে ১০ মাধ্যমিক প্রস্তুতি'}</span>
              <span className="text-[#FF6B35] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-gray-500 pt-3 leading-relaxed pl-2 font-sans">
              {lang === 'en'
                ? 'Core Focus: Physical Science, Life Science, Mathematics, History, Geography, Bengali and English. Thorough preparation for WBBSE Madhyamik Board Exams.'
                : 'প্রধান বিষয়: ভৌত বিজ্ঞান, জীবন বিজ্ঞান, গণিত, ইতিহাস, ভূগোল, বাংলা এবং ইংরেজি। পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ মাধ্যমিক পরীক্ষার সম্পূর্ণ পাঠ্যক্রম।'}
            </p>
          </details>

          <details className="group py-3 cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-sm text-gray-800 list-none font-sans">
              <span>{lang === 'en' ? 'WBCHSE Class 11 to 12 Streams' : 'WBCHSE শ্রেণি ১১ থেকে ১২ উচ্চ মাধ্যমিক বিভাগসমূহ'}</span>
              <span className="text-[#FF6B35] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-gray-500 pt-3 leading-relaxed pl-2 font-sans">
              {lang === 'en'
                ? 'Streams Supported: Science (Physics, Chemistry, Math, Biology), Arts (History, Political Science, Philosophy, Geography), Commerce (Accountancy, Business Studies, Economics).'
                : 'বিভাগসমূহ: বিজ্ঞান বিভাগ (পদার্থবিদ্যা, রসায়ন, গণিত, জীববিজ্ঞান), কলা বিভাগ (ইতিহাস, রাষ্ট্রবিজ্ঞান, দর্শন, ভূগোল), বাণিজ্য বিভাগ (হিসাবশাস্ত্র, ব্যবসায়িক শিক্ষা, অর্থনীতি)।'}
            </p>
          </details>
        </div>
      </section>

      {/* SECTION 8: TEACHER SHOWCASE */}
      <section id="teacher-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1A1A2E]">{lang === 'en' ? 'Learn From Best Educators' : 'আমাদের অভিজ্ঞ শিক্ষক মণ্ডলী'}</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">{lang === 'en' ? 'Our senior teachers prepare standard chapter-wise kits and review mock test submissions.' : 'অভিজ্ঞ শিক্ষকদের তৈরি মডিউল ও নির্দেশিকা অনুসরণ করুন।'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-orange-100 text-center shadow-sm hover:shadow-md transition-all">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="teacher" className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[#FF6B35]/20 mb-4" />
            <h4 className="text-sm font-bold text-gray-900">Dr. Subhabrata Roy</h4>
            <p className="text-xs text-[#FF6B35] font-semibold mt-1">Physical Science (HOD)</p>
            <p className="text-[10px] text-gray-400 mt-2">M.Sc, Ph.D in Physics with 15+ Years Board evaluation experience.</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-orange-100 text-center shadow-sm hover:shadow-md transition-all">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="teacher" className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[#FF6B35]/20 mb-4" />
            <h4 className="text-sm font-bold text-gray-900">Prof. Ananya Sen</h4>
            <p className="text-xs text-teal-600 font-semibold mt-1">Mathematics Special</p>
            <p className="text-[10px] text-gray-400 mt-2">Specialist in Algebra & Trignometry. Ex-KV Senior Instructor.</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-orange-100 text-center shadow-sm hover:shadow-md transition-all">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="teacher" className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[#FF6B35]/20 mb-4" />
            <h4 className="text-sm font-bold text-gray-900">Debraj Banerjee</h4>
            <p className="text-xs text-purple-600 font-semibold mt-1">Life Science & Biology</p>
            <p className="text-[10px] text-gray-400 mt-2">Authored multiple high-school exam guide books for Board exams.</p>
          </div>
        </div>
      </section>

      {/* SECTION 9: STUDENT TESTIMONIALS */}
      <section id="testimonials-section" className="bg-[#FFF9F0] py-16 px-4 sm:px-6 border-y border-orange-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">{lang === 'en' ? 'What Our Students Say' : 'শিক্ষার্থীদের মুখে সাফল্যের গল্প'}</h2>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50 relative">
            <span className="text-5xl text-[#FF6B35]/20 absolute top-4 left-4 font-serif">“</span>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed italic relative z-10 font-sans">
              {lang === 'en' 
                ? 'AanMona Study made light refraction in Physical Science incredibly clear. The offline note-reading helped me revise topics even on my train journeys back from school.' 
                : 'আনমনা স্টাডির ভৌতবিজ্ঞান নোটগুলো অসাধারণ! বিশেষ করে লেন্স চ্যাপ্টারের রশ্মিচিত্রগুলো খুব সুন্দর ব্যাখ্যা করা হয়েছে। অফলাইন পড়ার সুবিধায় আমার রিভিশন দিতে দারুণ সাহায্য হয়েছে।'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="Rohit Sen" className="w-10 h-10 rounded-full object-cover" />
              <div className="text-left">
                <h5 className="text-xs font-bold text-gray-900">Rohit Sen</h5>
                <p className="text-[10px] text-[#FF6B35] font-semibold">{lang === 'en' ? 'Class 10 Student' : '১০ম শ্রেণি শিক্ষার্থী'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: GALLERY PREVIEW */}
      <section id="gallery-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">{t.galleryTitle}</h2>
            <p className="text-gray-400 text-xs mt-1">{lang === 'en' ? 'Capturing learning achievements and science fairs.' : 'আমাদের ক্লাসরুম ও অনুষ্ঠানের বিশেষ মুহূর্তসমূহ।'}</p>
          </div>
          <button
            id="btn-goto-gallery"
            onClick={() => onNavigate('gallery')}
            className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{lang === 'en' ? 'View Full Gallery' : 'সম্পূর্ণ গ্যালারি দেখুন'}</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {GALLERY_ITEMS.slice(0, 3).map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-video shadow-sm hover:shadow-md transition-all">
              <img src={item.url} alt={item.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4 opacity-90">
                <span className="text-[9px] font-black tracking-widest text-[#FFE66D] uppercase mb-1">{item.category}</span>
                <h4 className="text-white text-xs font-bold font-sans">{lang === 'en' ? item.titleEn : item.titleBn}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: STATS COUNTER */}
      <section id="stats-counter" className="bg-[#FFF9F0] py-12 border-y border-orange-100">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-[#FF6B35] font-sans">
              {formatNumber('12', lang)}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-500 tracking-wide uppercase font-semibold">
              {lang === 'en' ? 'Classes Covered' : 'শ্রেণি কভার্ড'}
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-teal-600 font-sans">
              {formatNumber('100', lang)}+
            </span>
            <span className="text-[11px] sm:text-xs text-gray-500 tracking-wide uppercase font-semibold">
              {lang === 'en' ? 'Teacher Study Kits' : 'শিক্ষক স্টাডি কিটস'}
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-yellow-600 font-sans">
              {formatNumber('500', lang)}+
            </span>
            <span className="text-[11px] sm:text-xs text-gray-500 tracking-wide uppercase font-semibold">
              {lang === 'en' ? 'Solved Questions' : 'সমাধানকৃত প্রশ্ন'}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 12: DOWNLOAD APP / PWA PROMPT */}
      <section id="download-pwa-prompt" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44A8B3] rounded-3xl p-8 text-white text-center sm:text-left shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              {lang === 'en' ? 'PROGRESSIVE WEB APP' : 'পিডব্লিউএ মোড'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold">{lang === 'en' ? 'Install AanMona Study App' : 'আনমনা স্টাডি অ্যাপ ইনস্টল করুন'}</h3>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl font-sans">{lang === 'en' ? 'Install our light application directly. No App Store needed. Save data and read study notes completely offline!' : 'অ্যাপটি সরাসরি আপনার ফোনে ইনস্টল করুন। সম্পূর্ণ ইন্টারনেট ছাড়াই রিভিশন দিতে পারবেন।'}</p>
          </div>
          <button
            id="btn-install-pwa"
            onClick={() => alert(lang === 'en' ? 'Click on your browser menu to "Add to Home Screen" to install offline!' : 'অফলাইনে পড়ার জন্য ব্রাউজার মেনু থেকে "Add to Home Screen" সিলেক্ট করুন!')}
            className="bg-white text-teal-700 hover:bg-teal-50 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl transition-all cursor-pointer whitespace-nowrap shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Download size={16} />
            <span>{lang === 'en' ? 'Install Offline App' : 'অফলাইন অ্যাপ ডাউনলোড করুন'}</span>
          </button>
        </div>
      </section>

      {/* SECTION 13: FOOTER */}
      <footer id="footer-section" className="bg-[#1A1A2E] text-white pt-12 pb-6 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">{t.appName}</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{t.heroSubheading.slice(0, 100)}...</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
              <li><button onClick={() => onNavigate('offerings')} className="hover:text-white transition-colors cursor-pointer">Our Offerings</button></li>
              <li><button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors cursor-pointer">Gallery</button></li>
              <li><button onClick={() => onNavigate('live-test')} className="hover:text-white transition-colors cursor-pointer">Live Test Zone</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">Syllabus Boards</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => { setBoardSelected('WBBSE'); onNavigate('syllabus'); }} className="hover:text-white transition-colors cursor-pointer">WBBSE Secondary (Classes 1-10)</button></li>
              <li><button onClick={() => { setBoardSelected('WBCHSE'); onNavigate('syllabus'); }} className="hover:text-white transition-colors cursor-pointer">WBCHSE Higher Secondary (11-12)</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-4">Contact Support</h4>
            <p className="text-xs text-gray-300 font-sans">Email: support@aanmonastudy.com</p>
            <p className="text-xs text-gray-300 font-sans mt-1">WhatsApp: +91 90001 90001</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>{t.footerText}</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
