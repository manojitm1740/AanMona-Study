/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BookOpen, CheckSquare, Download, Folder, RefreshCw, Smartphone } from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { CLASSES_DATA } from '../mockData';

interface SyllabusPageProps {
  lang: Language;
}

export default function SyllabusPage({ lang }: SyllabusPageProps) {
  const [boardTab, setBoardTab] = useState<'WBBSE' | 'WBCHSE'>('WBBSE');
  const [selectedClassId, setSelectedClassId] = useState<string>('10');
  const [syncing, setSyncing] = useState(false);

  const t = i18n[lang];

  // Filters classes based on board
  const filteredClasses = CLASSES_DATA.filter(c => c.board === boardTab);
  
  // Finds selected class structure
  const selectedClass = CLASSES_DATA.find(c => c.id === selectedClassId) || CLASSES_DATA[0];

  const handleSyllabusSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert(lang === 'en' ? 'Syllabus successfully synced and cached for offline reading!' : 'সিলেবাস সফলভাবে নতুন নিয়মে আপডেট করা হয়েছে এবং অফলাইনে ক্যাশ করা হয়েছে!');
    }, 1500);
  };

  const handleDownloadPdf = (subjectName: string) => {
    alert(lang === 'en' 
      ? `Downloading official Board syllabus PDF for ${subjectName}...` 
      : `অফিসিয়াল পর্ষদ সিলেবাস পিডিএফ ডাউনলোড শুরু হচ্ছে: ${subjectName}...`
    );
  };

  return (
    <div id="syllabus-page-root" className="space-y-12 pb-16">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-sans">{t.syllabus}</h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto font-sans">
            {lang === 'en' 
              ? 'Official updated West Bengal Secondary and Higher Secondary Board chapter classifications and marks distributions.' 
              : 'পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ এবং উচ্চমাধ্যমিক শিক্ষা সংসদ অনুমোদিত সর্বশেষ সিলেবাস ও অধ্যায়ভিত্তিক নম্বর বিভাজন।'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Controls Layout */}
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 text-left">
          
          {/* Board Selector Tabs */}
          <div className="flex gap-2 bg-orange-50/50 p-1 rounded-2xl border border-orange-100 w-fit">
            <button
              id="syllabus-board-wbbse"
              onClick={() => { setBoardTab('WBBSE'); setSelectedClassId('10'); }}
              className={`py-2 px-5 rounded-xl font-bold text-xs transition-all ${
                boardTab === 'WBBSE' ? 'bg-[#FF6B35] text-white shadow-sm' : 'text-gray-600 hover:text-[#FF6B35]'
              }`}
            >
              WBBSE (Classes 1-10)
            </button>
            <button
              id="syllabus-board-wbchse"
              onClick={() => { setBoardTab('WBCHSE'); setSelectedClassId('12'); }}
              className={`py-2 px-5 rounded-xl font-bold text-xs transition-all ${
                boardTab === 'WBCHSE' ? 'bg-[#FF6B35] text-white shadow-sm' : 'text-gray-600 hover:text-[#FF6B35]'
              }`}
            >
              WBCHSE (Classes 11-12)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Class Dropdown */}
            <div className="flex items-center gap-2 bg-orange-50/20 py-2 px-4 rounded-xl border border-orange-100">
              <span className="text-xs font-bold text-gray-600">{t.classSelector}:</span>
              <select
                id="syllabus-class-dropdown"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-[#FF6B35] focus:outline-none focus:ring-0"
              >
                {filteredClasses.map(c => (
                  <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameBn}</option>
                ))}
              </select>
            </div>

            {/* Offline cache update trigger */}
            <button
              id="btn-sync-syllabus"
              disabled={syncing}
              onClick={handleSyllabusSync}
              className="py-2 px-4 bg-teal-500 text-white hover:bg-teal-600 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:bg-teal-300"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? t.loading : (lang === 'en' ? 'Sync Official Board' : 'পর্ষদ আপডেট নিন')}</span>
            </button>
          </div>
        </div>

        {/* PWA offline warning */}
        <div id="syllabus-offline-notice" className="bg-teal-50/50 border border-teal-100 text-teal-800 p-4 rounded-2xl flex items-start gap-3 text-left">
          <Smartphone className="w-5 h-5 text-teal-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs">
            <span className="font-bold block mb-1">{lang === 'en' ? 'Syllabus Cached for Offline Reading' : 'সিলেবাস অফলাইনে পড়ার জন্য সংরক্ষিত'}</span>
            <span>{lang === 'en' ? 'These syllabus parameters are backed up inside your browser cache. You can view them anywhere without internet!' : 'এই সিলেবাসের সকল তথ্যাদি আপনার ব্রাউজারে সংরক্ষিত হয়েছে। ইন্টারনেট ছাড়াও এটি পড়তে পারবেন।'}</span>
          </div>
        </div>

        {/* Selected Class Subjects Syllabus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedClass.subjects.map((subject) => (
            <div
              key={subject.id}
              id={`syllabus-subject-${subject.id}`}
              className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm text-left flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-orange-50 text-[#FF6B35] p-3 rounded-2xl">
                    <BookOpen size={20} />
                  </div>
                  <button
                    id={`btn-download-syllabus-${subject.id}`}
                    onClick={() => handleDownloadPdf(lang === 'en' ? subject.nameEn : subject.nameBn)}
                    className="p-2 text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 rounded-xl transition-all"
                    title={lang === 'en' ? 'Download Syllabus PDF' : 'পিডিএফ ডাউনলোড করুন'}
                  >
                    <Download size={18} />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-sans">
                    {lang === 'en' ? subject.nameEn : subject.nameBn}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wide">
                    Board: {selectedClass.board} • {formatNumber(subject.chapters.length, lang)} {lang === 'en' ? 'Chapters' : 'টি অধ্যায়'}
                  </p>
                </div>

                {/* Chapters List */}
                <div className="space-y-3 pt-3 border-t border-orange-50">
                  <span className="block text-[10px] font-bold text-orange-800 uppercase tracking-widest">
                    {lang === 'en' ? 'Chapter Outlines' : 'অধ্যায় সূচি'}
                  </span>
                  <div className="space-y-2">
                    {subject.chapters.map((ch, idx) => (
                      <div key={ch.id} className="flex items-start gap-2 text-xs font-sans text-gray-600">
                        <CheckSquare size={14} className="text-teal-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-gray-800">
                            {formatNumber(idx + 1, lang)}. {lang === 'en' ? ch.nameEn : ch.nameBn}
                          </strong>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                            {lang === 'en' ? ch.notesEn.slice(0, 70) : ch.notesBn.slice(0, 70)}...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
