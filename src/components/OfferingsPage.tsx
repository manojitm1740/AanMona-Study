/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BookOpen, Video, HelpCircle, FileDown, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { CLASSES_DATA } from '../mockData';
import { type UserProfile } from '../types';

interface OfferingsPageProps {
  lang: Language;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
}

export default function OfferingsPage({ lang, currentUser, onOpenAuth, onNavigate }: OfferingsPageProps) {
  const [boardTab, setBoardTab] = useState<'WBBSE' | 'WBCHSE'>('WBBSE');
  const t = i18n[lang];

  const handleClassClick = (classId: string) => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      // Redirect to specific student dashboard
      onNavigate('dashboard-student');
    }
  };

  return (
    <div id="offerings-page-root" className="space-y-12 pb-16">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans">{t.offerings}</h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto font-sans">
            {lang === 'en' 
              ? 'Complete curated curriculum packages with detailed notes, worksheets, test series, and teacher guidance folders.' 
              : 'আমাদের মডিউলে রয়েছে বিষয়ভিত্তিক নোটস, পিডিএফ ওয়ার্কশিট, অনলাইন মক টেস্ট এবং ডাউট সলভিং ক্লাসের সুবিধা।'}
          </p>
        </div>
      </div>

      {/* Board Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-center gap-4">
          <button
            id="offerings-tab-wbbse"
            onClick={() => setBoardTab('WBBSE')}
            className={`py-2.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              boardTab === 'WBBSE'
                ? 'bg-[#FF6B35] text-white border-2 border-[#FF6B35]'
                : 'bg-white text-gray-700 border-2 border-orange-100 hover:bg-orange-50/50'
            }`}
          >
            {t.board_wbbse}
          </button>
          <button
            id="offerings-tab-wbchse"
            onClick={() => setBoardTab('WBCHSE')}
            className={`py-2.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              boardTab === 'WBCHSE'
                ? 'bg-[#FF6B35] text-white border-2 border-[#FF6B35]'
                : 'bg-white text-gray-700 border-2 border-orange-100 hover:bg-orange-50/50'
            }`}
          >
            {t.board_wbchse}
          </button>
        </div>

        {/* Info Banner */}
        {!currentUser && (
          <div id="login-invite-banner" className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl max-w-3xl mx-auto flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-left text-xs">
              <span className="font-bold block mb-1">
                {lang === 'en' ? 'Authorization Required' : 'নিবন্ধন বা লগ-ইন প্রয়োজন'}
              </span>
              <span>
                {lang === 'en' 
                  ? 'Accessing deep study content (Kits, Practice Tests) requires a free verified account. Public Live Tests are open to all without login!' 
                  : 'পূর্ণ সিলেবাস নোটস ও টিচার স্টাডি কিটস পড়তে আপনার অ্যাকাউন্ট দিয়ে লগ-ইন করুন। লাইভ মক টেস্ট সবাই দিতে পারবেন!'}
              </span>
            </div>
          </div>
        )}

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLASSES_DATA.filter(c => c.board === boardTab).map((cls) => (
            <div
              key={cls.id}
              id={`offering-card-${cls.id}`}
              onClick={() => handleClassClick(cls.id)}
              className="bg-white rounded-3xl border border-orange-100 p-6 shadow-sm hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gradient-to-br from-[#FF6B35] to-[#FFE66D] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg">
                    {formatNumber(cls.id, lang)}
                  </div>
                  <span className="bg-orange-50 text-[#FF6B35] text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full border border-orange-100">
                    {cls.board}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">
                  {lang === 'en' ? cls.nameEn : cls.nameBn}
                </h3>

                <p className="text-xs text-gray-500 mb-4 font-sans">
                  {lang === 'en' 
                    ? `West Bengal Board comprehensive support for Class ${cls.id} students.`
                    : `পশ্চিমবঙ্গ বোর্ডের অধীনস্থ শ্রেণি ${formatNumber(cls.id, lang)}-এর ছাত্র-ছাত্রীদের সম্পূর্ণ পাঠ্যসহায়িকা।`}
                </p>

                {/* Subject List tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cls.subjects.map(s => (
                    <span key={s.id} className="bg-orange-50/50 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {lang === 'en' ? s.nameEn : s.nameBn}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resource checklist mapping */}
              <div className="border-t border-orange-50 pt-4 mt-auto">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 font-sans mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#FF6B35]" />
                    <span>{lang === 'en' ? 'Chapter Notes' : 'চ্যাপ্টার নোটস'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video size={14} className="text-teal-500" />
                    <span>{lang === 'en' ? 'Live Lectures' : 'লাইভ ক্লাস'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-yellow-500" />
                    <span>{lang === 'en' ? 'Mock Quizzes' : 'মক টেস্টসমূহ'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileDown size={14} className="text-emerald-500" />
                    <span>{lang === 'en' ? 'PDF Study Guides' : 'ডাউনলোডেবল পিডিএফ'}</span>
                  </div>
                </div>

                <button
                  id={`btn-offering-learn-${cls.id}`}
                  className="w-full py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:shadow-md hover:shadow-orange-100 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{currentUser ? t.dashboard : t.signIn}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
