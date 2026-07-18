/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Award, Clock, FileText, Flag, RefreshCw, Send, ShieldAlert, CheckCircle, UserCheck, PhoneCall } from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { MOCK_LIVE_TESTS, INITIAL_LEADERBOARD } from '../mockData';
import { type UserProfile, type LiveTest, type TestResult, type Question } from '../types';
import confetti from 'canvas-confetti';

interface LiveTestZoneProps {
  lang: Language;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export default function LiveTestZone({ lang, currentUser, onOpenAuth }: LiveTestZoneProps) {
  const [selectedClass, setSelectedClass] = useState<string>(currentUser?.studentClass || '10');
  
  // Registration before starting test for guest
  const [showGuestForm, setShowGuestForm] = useState<LiveTest | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestWhatsapp, setGuestWhatsapp] = useState('');
  const [guestError, setGuestError] = useState('');

  // Active testing state
  const [activeTest, setActiveTest] = useState<LiveTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({}); // { questionId: selectedIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({}); // { questionId: true/false }
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<TestResult | null>(null);

  // Tab state for history and leaderboard (for logged in)
  const [activeTab, setActiveTab] = useState<'tests' | 'leaderboard' | 'history'>('tests');
  const [localHistory, setLocalHistory] = useState<TestResult[]>([]);

  const t = i18n[lang];

  // Fetch tests for the class
  const classTests = MOCK_LIVE_TESTS.filter(test => test.classId === selectedClass);

  // Handle countdown timer inside active test
  useEffect(() => {
    if (!activeTest || testCompleted) return;

    if (timeLeft <= 0) {
      handleForceSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, timeLeft, testCompleted]);

  const startTest = (test: LiveTest) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(test.durationMinutes * 60);
    setTestCompleted(false);
    setFinalResult(null);
  };

  const handleAttemptClick = (test: LiveTest) => {
    if (currentUser) {
      startTest(test);
    } else {
      setShowGuestForm(test);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestError('');

    if (!guestName || !guestWhatsapp) {
      setGuestError(lang === 'en' ? 'Please fill out both fields.' : 'অনুগ্রহ করে দুটি ফিল্ডই পূরণ করুন।');
      return;
    }

    if (showGuestForm) {
      const testToStart = showGuestForm;
      setShowGuestForm(null);
      startTest(testToStart);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleForceSubmit = () => {
    calculateResults();
  };

  const handleSubmitClick = () => {
    const confirmed = window.confirm(t.testConfirmSubmit);
    if (confirmed) {
      calculateResults();
    }
  };

  const calculateResults = () => {
    if (!activeTest) return;

    let score = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    activeTest.questions.forEach(q => {
      const chosen = selectedAnswers[q.id];
      if (chosen === undefined) {
        skipped++;
      } else if (chosen === q.correctOptionIndex) {
        correct++;
        score += Math.floor(activeTest.totalMarks / activeTest.questions.length);
      } else {
        wrong++;
      }
    });

    const percentage = Math.round((score / activeTest.totalMarks) * 100);

    const result: TestResult = {
      testId: activeTest.id,
      testNameEn: `${activeTest.chapterNameEn} Live Test`,
      testNameBn: `${activeTest.chapterNameBn} লাইভ টেস্ট`,
      score,
      totalMarks: activeTest.totalMarks,
      correctAnswersCount: correct,
      wrongAnswersCount: wrong,
      skippedCount: skipped,
      percentage,
      rank: percentage > 80 ? 2 : percentage > 50 ? 5 : 8,
      date: new Date().toISOString().split('T')[0],
      studentName: currentUser ? (lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn) : guestName
    };

    setFinalResult(result);
    setTestCompleted(true);

    // Save to history
    setLocalHistory(prev => [result, ...prev]);

    // Celebrate high score (over 70%) with confetti!
    if (percentage >= 70) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="live-test-zone-root" className="space-y-12 pb-16">
      
      {/* 1. ACTIVE TESTING INTERFACE */}
      {activeTest && !testCompleted && (
        <div id="test-hall-mode" className="fixed inset-0 bg-[#FFF9F0] z-50 flex flex-col p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 flex-1">
            
            {/* Header: Test details and Timer */}
            <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="bg-red-50 text-[#EF233C] text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase border border-red-100">
                  {lang === 'en' ? 'Exam Room Active' : 'পরীক্ষা কক্ষ সক্রিয়'}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2 font-sans">
                  {lang === 'en' ? activeTest.chapterNameEn : activeTest.chapterNameBn} — {lang === 'en' ? 'Mock Test' : 'মক টেস্ট'}
                </h2>
              </div>

              {/* Timer Countdown Panel */}
              <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl border font-mono font-bold text-lg shadow-sm ${
                timeLeft < 300 ? 'bg-red-50 border-red-200 text-[#EF233C] animate-pulse' : 'bg-orange-50 border-orange-200 text-[#FF6B35]'
              }`}>
                <Clock size={20} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Test Core Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
              
              {/* Question card container (8 cols) */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-6 text-left min-h-[400px] flex flex-col justify-between">
                
                {/* Question Text */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 font-mono">
                      Question {formatNumber(currentQuestionIndex + 1, lang)} of {formatNumber(activeTest.questions.length, lang)}
                    </span>
                    <button
                      id={`flag-question-btn-${currentQuestionIndex}`}
                      onClick={() => handleToggleFlag(activeTest.questions[currentQuestionIndex].id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                        flaggedQuestions[activeTest.questions[currentQuestionIndex].id]
                          ? 'bg-amber-50 border-amber-300 text-[#FFB703]'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Flag size={14} />
                      <span>{lang === 'en' ? 'Review Later' : 'চিহ্নিত করুন'}</span>
                    </button>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-[#1A1A2E] font-sans leading-relaxed">
                    {lang === 'en' ? activeTest.questions[currentQuestionIndex].questionEn : activeTest.questions[currentQuestionIndex].questionBn}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-3 pt-4">
                    {activeTest.questions[currentQuestionIndex].optionsEn.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[activeTest.questions[currentQuestionIndex].id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          id={`option-btn-${optIdx}`}
                          onClick={() => handleSelectOption(activeTest.questions[currentQuestionIndex].id, optIdx)}
                          className={`w-full p-4 rounded-2xl text-xs sm:text-sm text-left border font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50/70 border-[#FF6B35] text-[#FF6B35] shadow-sm shadow-orange-100'
                              : 'bg-white border-gray-150 hover:bg-orange-50/20 text-gray-700'
                          }`}
                        >
                          <span>{lang === 'en' ? opt : activeTest.questions[currentQuestionIndex].optionsBn[optIdx]}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#FF6B35] bg-[#FF6B35]' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls: Prev, Next, Submit */}
                <div className="border-t border-orange-50 pt-6 flex justify-between items-center mt-6">
                  <button
                    id="prev-question-btn"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="py-2 px-5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {t.prevQuestion}
                  </button>

                  {currentQuestionIndex < activeTest.questions.length - 1 ? (
                    <button
                      id="next-question-btn"
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="py-2 px-6 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition-all cursor-pointer"
                    >
                      {t.nextQuestion}
                    </button>
                  ) : (
                    <button
                      id="submit-test-btn"
                      onClick={handleSubmitClick}
                      className="py-2 px-6 bg-[#FF6B35] text-white rounded-xl text-xs font-bold hover:shadow-md transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>{t.submitTest}</span>
                      <Send size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Navigator Palette (4 cols) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-800 tracking-wide uppercase border-b border-orange-50 pb-2">
                  {lang === 'en' ? 'Question Navigator' : 'প্রশ্ন প্যালেট'}
                </h3>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2">
                  {activeTest.questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions[q.id];
                    const isActive = currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.id}
                        id={`palette-btn-${idx}`}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`py-2 px-1 rounded-xl font-bold text-xs border transition-all text-center cursor-pointer ${
                          isActive
                            ? 'border-[#FF6B35] bg-[#FF6B35] text-white'
                            : isFlagged
                            ? 'border-[#FFB703] bg-amber-50 text-[#FFB703]'
                            : isAnswered
                            ? 'border-[#06D6A0] bg-emerald-50 text-[#06D6A0]'
                            : 'border-gray-150 bg-white text-gray-400'
                        }`}
                      >
                        {formatNumber(idx + 1, lang)}
                      </button>
                    );
                  })}
                </div>

                {/* Palette color code indicators */}
                <div className="border-t border-orange-50 pt-4 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                    <span className="w-3 h-3 rounded bg-emerald-50 border border-[#06D6A0]"></span>
                    <span>{lang === 'en' ? 'Answered' : 'উত্তর দিয়েছেন'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                    <span className="w-3 h-3 rounded bg-amber-50 border border-[#FFB703]"></span>
                    <span>{lang === 'en' ? 'Flagged / Review' : 'রিভিউয়ের জন্য চিহ্নিত'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                    <span className="w-3 h-3 rounded bg-white border border-gray-200"></span>
                    <span>{lang === 'en' ? 'Not Visited' : 'দেখা হয়নি'}</span>
                  </div>
                </div>

                <button
                  id="terminate-test-btn"
                  onClick={() => {
                    const ok = window.confirm(lang === 'en' ? 'Are you sure you want to exit the test room? Unsaved responses will be discarded.' : 'আপনি কি পরীক্ষা কক্ষ থেকে বের হতে চান?');
                    if (ok) setActiveTest(null);
                  }}
                  className="w-full py-2 border border-red-200 text-[#EF233C] hover:bg-red-50 text-xs font-bold rounded-xl mt-4 cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel Exam' : 'পরীক্ষা বাতিল করুন'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPLETED TEST RESULTS ZONE */}
      {testCompleted && finalResult && (
        <div id="test-result-panel" className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-orange-100 shadow-xl space-y-8 text-center animate-fade-in">
          
          <div className="space-y-2">
            <div className="bg-yellow-50 text-[#FFB703] w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner animate-float">
              <Award size={36} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 font-sans">
              {finalResult.percentage >= 70 ? t.congratulations : t.keepTrying}
            </h2>
            <p className="text-gray-400 text-xs">
              {lang === 'en' ? `Result slip generated for ${finalResult.studentName}` : `${finalResult.studentName}-এর জন্য ফলাফল শংসাপত্র প্রস্তুত হয়েছে।`}
            </p>
          </div>

          {/* Marks & statistics dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-orange-50/50 rounded-2xl">
            <div>
              <span className="block text-2xl font-black text-[#FF6B35] font-mono">
                {formatNumber(finalResult.score, lang)} / {formatNumber(finalResult.totalMarks, lang)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{t.marksObtained}</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-teal-600 font-mono">
                {formatNumber(finalResult.percentage, lang)}%
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{t.scorePercentage}</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-emerald-600 font-mono">
                {formatNumber(finalResult.correctAnswersCount, lang)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{lang === 'en' ? 'Correct' : 'সঠিক'}</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-red-600 font-mono">
                {formatNumber(finalResult.wrongAnswersCount, lang)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{lang === 'en' ? 'Wrong' : 'ভুল'}</span>
            </div>
          </div>

          {/* PDF Generation option block */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="btn-print-result"
              onClick={() => {
                alert(lang === 'en' ? 'AanMona Study is printing/generating your PDF report card...' : 'আনমনা স্টাডি আপনার ফলাফলের শংসাপত্র প্রস্তুত করছে...');
                window.print();
              }}
              className="py-2.5 px-6 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t.downloadResultPdf}</span>
            </button>
            <button
              id="btn-close-results"
              onClick={() => { setTestCompleted(false); setActiveTest(null); setFinalResult(null); }}
              className="py-2.5 px-6 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Return to Test Hub' : 'টেস্ট হাবে ফিরে যান'}
            </button>
          </div>
        </div>
      )}

      {/* 3. PUBLIC GUEST START REGISTRATION MODAL */}
      {showGuestForm && (
        <div id="guest-details-modal" className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-t-4 border-[#FF6B35] shadow-2xl relative text-left space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-sans flex items-center gap-2">
              <PhoneCall className="text-[#FF6B35] shrink-0" size={20} />
              <span>{lang === 'en' ? 'Enter Guest Details' : 'তথ্য দিন (লগ-ইন ছাড়া পরীক্ষা)'}</span>
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              {lang === 'en' 
                ? 'Register your name and whatsapp number to attempt this free Live test. We will deliver your marksheet report directly over WhatsApp!' 
                : 'সম্পূর্ণ বিনামূল্যে লাইভ মক টেস্টটি দিতে আপনার নাম ও হোয়াটসঅ্যাপ দিন। আপনার ফলাফলের রিপোর্ট আমরা হোয়াটসঅ্যাপে পাঠিয়ে দেব!'}
            </p>

            <form id="guest-form" onSubmit={handleGuestSubmit} className="space-y-4">
              {guestError && <div className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg">{guestError}</div>}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t.enterName}</label>
                <input
                  id="guest-name-input"
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sayan Das"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t.enterWhatsapp}</label>
                <input
                  id="guest-whatsapp-input"
                  type="tel"
                  required
                  value={guestWhatsapp}
                  onChange={(e) => setGuestWhatsapp(e.target.value)}
                  placeholder="e.g. 9830098300"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  id="guest-submit-btn"
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {lang === 'en' ? 'Verify & Start Test' : 'ভেরিফাই ও পরীক্ষা শুরু করুন'}
                </button>
                <button
                  type="button"
                  id="guest-cancel-btn"
                  onClick={() => setShowGuestForm(null)}
                  className="py-2 px-4 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MAIN TESTING ZONE DASHBOARD */}
      {!activeTest && !testCompleted && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          
          {/* Section banner */}
          <div className="bg-[#FFF9F0] border border-orange-100 p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 bg-[#EF233C] text-white text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase animate-blink">
                🔴 {lang === 'en' ? 'Active Exam Terminal' : 'পরীক্ষা টার্মিনাল'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">{lang === 'en' ? 'Free Live Test Zone' : 'ফ্রি লাইভ টেস্ট জোন'}</h1>
              <p className="text-xs text-gray-500 max-w-xl">{lang === 'en' ? 'No account forced. Select your target school class below to instantly load ongoing tests.' : 'পাবলিক টেস্টে কোনো লগ-ইন বাধ্যতামূলক নয়। আপনার শ্রেণি নির্বাচন করে টেস্ট দিন।'}</p>
            </div>

            {/* Class selection dropdown */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-orange-100 shadow-sm">
              <span className="text-xs font-bold text-gray-600 whitespace-nowrap">{t.classSelector}:</span>
              <select
                id="live-test-class-dropdown"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-[#FF6B35] focus:outline-none focus:ring-0"
              >
                <option value="1">Class 1</option>
                <option value="5">Class 5</option>
                <option value="10">Class 10 (Secondary)</option>
                <option value="12">Class 12 (Higher Secondary)</option>
              </select>
            </div>
          </div>

          {/* Main Workspace for Logged-In User Profile details */}
          {currentUser && (
            <div className="flex border-b border-orange-100">
              <button
                id="test-tab-active"
                onClick={() => setActiveTab('tests')}
                className={`py-2.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === 'tests' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {lang === 'en' ? 'Available Tests' : 'উপলব্ধ পরীক্ষা সমূহ'}
              </button>
              <button
                id="test-tab-leaderboard"
                onClick={() => setActiveTab('leaderboard')}
                className={`py-2.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === 'leaderboard' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {t.leaderboard}
              </button>
              <button
                id="test-tab-history"
                onClick={() => setActiveTab('history')}
                className={`py-2.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === 'history' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {lang === 'en' ? 'My Attempt History' : 'আমার ইতিহাস'}
              </button>
            </div>
          )}

          {/* CONTENT ACCORDING TO TABS */}
          {activeTab === 'tests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {classTests.length > 0 ? (
                classTests.map((test) => (
                  <div
                    key={test.id}
                    id={`live-test-card-${test.id}`}
                    className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden text-left"
                  >
                    {/* Blinking Live Tag indicator */}
                    <span className="absolute top-4 right-4 bg-red-50 text-[#EF233C] text-[9px] font-black px-2 py-0.5 rounded border border-red-100 animate-blink">
                      {lang === 'en' ? 'LIVE NOW' : 'লাইভ চলছে'}
                    </span>

                    <div className="space-y-4">
                      <div className="bg-orange-50 text-[#FF6B35] w-10 h-10 rounded-2xl flex items-center justify-center font-bold">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 font-sans">
                          {lang === 'en' ? test.chapterNameEn : test.chapterNameBn}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-wider">
                          Subject: {test.subjectId}
                        </p>
                      </div>

                      {/* Info matrix details */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500 pt-2 border-t border-orange-50">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-400" />
                          <span>{formatNumber(test.durationMinutes, lang)} {lang === 'en' ? 'Minutes' : 'মিনিট'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award size={14} className="text-yellow-600" />
                          <span>{formatNumber(test.totalMarks, lang)} {lang === 'en' ? 'Marks' : 'নম্বর'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn-attempt-test-${test.id}`}
                      onClick={() => handleAttemptClick(test)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:shadow-md hover:shadow-orange-100 text-white font-bold text-xs rounded-xl transition-all mt-6 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>{t.attemptNow}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-16 bg-white rounded-3xl border border-orange-100/50 space-y-2">
                  <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-gray-500">{t.noLiveTests}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-sm pt-4">
              <div className="px-6 pb-3 border-b border-orange-50">
                <h4 className="text-sm font-bold text-gray-800 tracking-wider uppercase">
                  {lang === 'en' ? 'Class Leaderboard Standings' : 'শ্রেণির মেধা তালিকা'}
                </h4>
              </div>
              <div className="divide-y divide-orange-50">
                {INITIAL_LEADERBOARD.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-6 py-3.5 hover:bg-orange-50/20 text-xs font-sans">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        item.rank === 1 ? 'bg-yellow-100 text-yellow-700' : item.rank === 2 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {formatNumber(item.rank, lang)}
                      </span>
                      <span className="font-bold text-gray-800">{lang === 'en' ? item.nameEn : item.nameBn}</span>
                    </div>
                    <span className="font-mono font-bold text-[#FF6B35]">{formatNumber(item.score, lang)} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {localHistory.length > 0 ? (
                localHistory.map((result, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 font-sans">{lang === 'en' ? result.testNameEn : result.testNameBn}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono">Date taken: {result.date}</p>
                    </div>
                    <div className="bg-orange-50 py-1.5 px-4 rounded-xl border border-orange-100 text-center text-xs font-bold shrink-0">
                      <span className="text-[#FF6B35] font-mono">{formatNumber(result.score, lang)}/{formatNumber(result.totalMarks, lang)}</span>
                      <span className="block text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">{t.scorePercentage}: {formatNumber(result.percentage, lang)}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-orange-100/50">
                  <p className="text-xs text-gray-400">{lang === 'en' ? "You haven't attempted any mock tests yet in this session." : "আপনি এখনো কোনো পরীক্ষা দেননি।"}</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
