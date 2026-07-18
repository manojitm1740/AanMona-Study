/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Landmark, Milestone, Sparkles, Users } from 'lucide-react';
import { i18n, type Language } from '../i18n';

interface AboutPageProps {
  lang: Language;
}

export default function AboutPage({ lang }: AboutPageProps) {
  const t = i18n[lang];

  return (
    <div id="about-page-root" className="space-y-12 pb-16 text-left">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans">{t.about}</h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto font-sans">
            {lang === 'en' 
              ? 'Learn about our core initiatives, teaching methodologies, and digital expansion plans for Bengal.' 
              : 'পশ্চিমবঙ্গের ছাত্র-ছাত্রীদের সামগ্রিক বিকাশে আমাদের মূল চিন্তাভাবনা এবং কার্যক্রমের ইতিহাস।'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Mission section */}
        <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900 font-sans flex items-center gap-2">
            <Sparkles className="text-[#FF6B35]" size={20} />
            <span>{t.aboutMission}</span>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            {t.aboutMissionText}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            {lang === 'en'
              ? 'By integrating robust offline storage caches, Google Drive files mapping, and lightweight text modules, we enable students from Purulia to Cooch Behar to study smoothly without continuous 4G/5G connections.'
              : 'পুরুলিয়া থেকে কোচবিহার - পশ্চিমবঙ্গের যেকোনো কোণের পড়ুয়া যাতে নিরবচ্ছিন্ন ইন্টারনেট সংযোগ ছাড়াই সাবলীলভাবে তার পড়াশোনা চালিয়ে যেতে পারে, সেই উদ্দেশ্যেই এই অফলাইন ও ড্রাইভ ইন্টিগ্রেশন ব্যবস্থার সূচনা।'}
          </p>
        </div>

        {/* Milestones / Core values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-3">
            <div className="bg-orange-50 text-[#FF6B35] p-3 rounded-2xl w-fit">
              <Users size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900 font-sans">
              {lang === 'en' ? 'Verified Educators' : 'যাচাইকৃত শিক্ষক মণ্ডলী'}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {lang === 'en'
                ? 'All study guides, videos, and worksheets undergo multi-tier reviews by senior school teachers before publication.'
                : 'সকল নোট ও তথ্য প্রকাশের পূর্বে অভিজ্ঞ সরকারি বিদ্যালয়ের পর্ষদ স্তরের শিক্ষকদের দ্বারা যাচাই করা হয়।'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-3">
            <div className="bg-teal-50 text-teal-600 p-3 rounded-2xl w-fit">
              <Landmark size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900 font-sans">
              {lang === 'en' ? 'Board Level Standard' : 'পর্ষদ স্তরের মানদণ্ড'}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {lang === 'en'
                ? 'Strictly compliant with West Bengal Board of Secondary (WBBSE) and Higher Secondary (WBCHSE) frameworks.'
                : 'পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ এবং উচ্চমাধ্যমিক শিক্ষা সংসদের সিলেবাসের হুবহু অনুরূপ পাঠক্রম।'}
            </p>
          </div>
        </div>

        {/* Institution address or contact card */}
        <div className="bg-[#FFF9F0] border border-orange-100 p-6 rounded-3xl text-center space-y-2">
          <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider font-mono">
            {lang === 'en' ? 'AanMona Study Head Office' : 'আনমনা স্টাডি প্রধান কার্যালয়'}
          </h3>
          <p className="text-xs text-gray-600 font-sans">
            Salt Lake Sector V, GP Block, Kolkata, West Bengal, Pin 700091
          </p>
          <p className="text-xs text-[#FF6B35] font-bold font-sans mt-2">
            WhatsApp Contact: +91 90001 90001
          </p>
        </div>
      </div>
    </div>
  );
}
