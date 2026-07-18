/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, BookOpen, GraduationCap, Award, Download, Video, MessageCircle, BarChart3, 
  Trophy, Bell, User as UserIcon, RefreshCw, PlusCircle, ExternalLink, ShieldCheck, 
  HelpCircle, CheckCircle, FileText, Send, SendHorizontal, AlertCircle
} from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { type UserProfile, type TeacherKit, type DriveItem, type ChatMessage } from '../types';
import { CLASSES_DATA, INITIAL_KITS, INITIAL_LEADERBOARD, ANNOUNCEMENTS } from '../mockData';
import { googleSignIn, logout as googleLogout } from '../firebase';

interface StudentDashboardProps {
  lang: Language;
  currentUser: UserProfile;
  googleAccessToken: string | null;
  onUpdateUser: (profile: UserProfile) => void;
  onLinkGoogleToken: (token: string) => void;
  onLogoutGoogle: () => void;
}

export default function StudentDashboard({
  lang,
  currentUser,
  googleAccessToken,
  onUpdateUser,
  onLinkGoogleToken,
  onLogoutGoogle
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'content' | 'tests' | 'downloads' | 'live-classes' | 'chat' | 'progress' | 'drive' | 'profile'>('home');
  const t = i18n[lang];

  // Syllabus / Lessons states
  const studentClassStructure = CLASSES_DATA.find(c => c.id === currentUser.studentClass) || CLASSES_DATA[2]; // fallback to Class 10
  const [selectedSubject, setSelectedSubject] = useState<string>(studentClassStructure.subjects[0]?.id || 'physical-science');
  const [selectedChapter, setSelectedChapter] = useState<string>(studentClassStructure.subjects[0]?.chapters[0]?.id || 'phys-light');

  // Google Drive states
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState('');

  // Class chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', roomId: 'class-10', senderId: 'teacher-user', senderName: 'Dr. Subhabrata Roy', senderRole: 'TEACHER' as any, text: 'Hello class! Please make sure to attempt the Light Refraction Live Test before tonight.', timestamp: '10:15 AM' },
    { id: '2', roomId: 'class-10', senderId: 'student-ver', senderName: 'Rohit Sen', senderRole: 'STUDENT' as any, text: 'Sure sir, I am revising the ray diagrams from your Study Kit right now!', timestamp: '10:18 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Download logs simulation
  const [downloadLogs, setDownloadLogs] = useState<string[]>([
    'WBBSE_Class10_Light_Official_Notes.pdf'
  ]);

  // Bookmarked notes simulation
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Record<string, boolean>>({});

  // Trigger Jitsi Meet simulation
  const [jitsiMeetingActive, setJitsiMeetingActive] = useState(false);

  // Fetch Google Drive Files if token is available
  const fetchDriveFiles = async (token: string) => {
    setLoadingDrive(true);
    setDriveError('');
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fpdf%27+or+mimeType%3D%27application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document%27&fields=files(id,name,mimeType,webViewLink,size)&pageSize=20`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) {
        throw new Error(lang === 'en' ? 'Unauthorized or stale Google credentials.' : 'গুগল প্রমাণীকরণ সেশন শেষ হয়েছে।');
      }
      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || 'Error listing Drive items');
    } finally {
      setLoadingDrive(false);
    }
  };

  useEffect(() => {
    if (googleAccessToken && activeTab === 'drive') {
      fetchDriveFiles(googleAccessToken);
    }
  }, [googleAccessToken, activeTab]);

  const handleGoogleAuth = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        onLinkGoogleToken(result.accessToken);
        fetchDriveFiles(result.accessToken);
      }
    } catch (err) {
      alert('Failed to connect to Google Drive');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomId: 'class-10',
      senderId: currentUser.id,
      senderName: lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn,
      senderRole: currentUser.role,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleBookmark = (chapterId: string) => {
    setBookmarkedNotes(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleDownloadFile = (fileName: string) => {
    if (!downloadLogs.includes(fileName)) {
      setDownloadLogs(prev => [...prev, fileName]);
    }
    alert(lang === 'en' ? `Downloading ${fileName} to local files... Caching for PWA offline viewing.` : `${fileName} সফলভাবে অফলাইন ব্যবহারের জন্য ডাউনলোড করা হলো।`);
  };

  // Find kits for assigned class
  const classKits = INITIAL_KITS.filter(kit => kit.classId === currentUser.studentClass && kit.isPublished);

  const activeSubjectData = studentClassStructure.subjects.find(s => s.id === selectedSubject);
  const activeChapterData = activeSubjectData?.chapters.find(c => c.id === selectedChapter);

  return (
    <div id="student-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white p-5 rounded-3xl border border-orange-100 shadow-sm shrink-0 flex flex-col gap-2 h-fit text-left">
        <div className="pb-4 border-b border-orange-50 mb-3 text-center sm:text-left flex items-center gap-2.5">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#FF6B35]/20 mx-auto sm:mx-0"
          />
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-4">{lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn}</h4>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">
              Class {formatNumber(currentUser.studentClass || '10', lang)} • {currentUser.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>

        {[
          { id: 'home', label: lang === 'en' ? 'Overview Home' : 'ড্যাশবোর্ড হোম', icon: Home },
          { id: 'content', label: lang === 'en' ? 'My Study Lessons' : 'পড়ার লেসনসমূহ', icon: BookOpen },
          { id: 'tests', label: lang === 'en' ? 'Chapter Mock Tests' : 'অধ্যায় মক টেস্ট', icon: Award },
          { id: 'downloads', label: lang === 'en' ? 'My Saved PDFs' : 'সংরক্ষিত ফাইলস', icon: Download },
          { id: 'live-classes', label: lang === 'en' ? 'Live Lecture Room' : 'লাইভ ক্লাস রুম', icon: Video },
          { id: 'chat', label: lang === 'en' ? 'Class Group Chat' : 'গ্রুপ চ্যাট', icon: MessageCircle },
          { id: 'progress', label: lang === 'en' ? 'Performance Progress' : 'আমার অগ্রগতি', icon: BarChart3 },
          { id: 'drive', label: lang === 'en' ? 'My Google Drive' : 'আমার গুগল ড্রাইভ', icon: GraduationCap },
          { id: 'profile', label: lang === 'en' ? 'Profile Details' : 'প্রোফাইল সেটিংস', icon: UserIcon }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`student-sidebar-btn-${item.id}`}
              onClick={() => { setActiveTab(item.id as any); setJitsiMeetingActive(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white shadow-md shadow-orange-100'
                  : 'text-gray-600 hover:bg-orange-50/50 hover:text-[#FF6B35]'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* 2. MAIN CONTENT PLATFORM */}
      <main className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-sm text-left relative min-h-[550px]">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4 border-b border-orange-50 pb-2">
          <span>{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</span>
          <span>/</span>
          <span className="text-[#FF6B35]">{t[activeTab as keyof typeof t] || activeTab}</span>
        </div>

        {/* Notification Bell */}
        <div className="absolute top-8 right-8">
          <button className="relative p-2 bg-orange-50 text-[#FF6B35] rounded-full hover:bg-orange-100 transition-all">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* Unverified profile check alert banner */}
        {!currentUser.isVerified && (
          <div id="unverified-student-banner" className="bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl p-4 text-xs font-semibold mb-6 flex items-start gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Verification Pending</span>
              <span>{t.unverifiedWarning}</span>
            </div>
          </div>
        )}

        {/* TAB: OVERVIEW HOME */}
        {activeTab === 'home' && (
          <div id="tab-content-home" className="space-y-8 animate-fade-in">
            {/* Greeting cards */}
            <div className="bg-gradient-to-r from-orange-50 to-teal-50 p-6 rounded-3xl border border-orange-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-sans">
                  {lang === 'en' ? 'Welcome Back,' : 'স্বাগতম,'} {lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn}!
                </h2>
                <p className="text-xs text-gray-500 font-sans">
                  {lang === 'en' ? 'Keep learning high quality notes and test your knowledge.' : 'আনমনা স্টাডি দিয়ে প্রতিদিন অধ্যায় মক টেস্ট দিন ও অগ্রগতি ট্র্যাক করুন।'}
                </p>
              </div>
              <div className="bg-white p-2.5 px-4 rounded-xl border border-orange-100 text-center font-bold text-xs shrink-0 text-[#FF6B35]">
                {lang === 'en' ? 'Daily Streak: 3 Days 🔥' : 'ডেইলি স্ট্রেইক: ৩ দিন 🔥'}
              </div>
            </div>

            {/* Quick dashboard overview widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Today schedule alerts */}
              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-b border-orange-50 pb-2 flex items-center gap-1.5">
                  <Video size={14} className="text-teal-500 animate-pulse" />
                  <span>{lang === 'en' ? "Today's Live Classes" : "আজকের লাইভ ক্লাসসমূহ"}</span>
                </h3>
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100/50 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-gray-800">Light Ray Diagrams Discussion</span>
                    <span className="block text-[10px] text-gray-400 font-mono mt-1">HOD Dr. S Roy • 6:30 PM Today</span>
                  </div>
                  <button
                    id="btn-goto-classes-home"
                    onClick={() => setActiveTab('live-classes')}
                    className="py-1 px-3 bg-teal-500 text-white rounded-lg font-bold text-[10px]"
                  >
                    {lang === 'en' ? 'Join' : 'যুক্ত হোন'}
                  </button>
                </div>
              </div>

              {/* Announcements widget */}
              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest border-b border-orange-50 pb-2 flex items-center gap-1.5">
                  <Bell size={14} className="text-[#FF6B35] animate-bounce" />
                  <span>{t.announcements}</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {ANNOUNCEMENTS.slice(0, 2).map((ann, idx) => (
                    <div key={idx} className="p-2.5 bg-orange-50/30 rounded-xl border border-orange-100/50">
                      <span className="text-gray-700 font-sans">{lang === 'en' ? ann.textEn : ann.textBn}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: STUDY LESSONS */}
        {activeTab === 'content' && (
          <div id="tab-content-lessons" className="space-y-6 animate-fade-in">
            {/* Subject/Chapter filter headers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t.subject}</label>
                <select
                  id="lesson-subject-select"
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    const sub = studentClassStructure.subjects.find(s => s.id === e.target.value);
                    if (sub?.chapters[0]) setSelectedChapter(sub.chapters[0].id);
                  }}
                  className="w-full p-2 text-xs rounded-xl border border-orange-150 bg-white font-bold"
                >
                  {studentClassStructure.subjects.map(s => (
                    <option key={s.id} value={s.id}>{lang === 'en' ? s.nameEn : s.nameBn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t.chapter}</label>
                <select
                  id="lesson-chapter-select"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-orange-150 bg-white font-bold"
                >
                  {activeSubjectData?.chapters.map(c => (
                    <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameBn}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note text viewer with bookmark indicator */}
            {activeChapterData ? (
              <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-orange-50">
                  <h3 className="text-lg font-bold text-gray-900 font-sans">
                    {lang === 'en' ? activeChapterData.nameEn : activeChapterData.nameBn}
                  </h3>
                  <button
                    id={`bookmark-btn-${activeChapterData.id}`}
                    onClick={() => toggleBookmark(activeChapterData.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      bookmarkedNotes[activeChapterData.id]
                        ? 'bg-yellow-50 border-yellow-200 text-[#FFB703]'
                        : 'bg-white border-gray-150 text-gray-400 hover:text-gray-600'
                    }`}
                    title={lang === 'en' ? 'Bookmark Note' : 'বুকমার্ক করুন'}
                  >
                    <Trophy size={16} />
                  </button>
                </div>

                <div className="text-sm text-gray-700 leading-relaxed font-sans space-y-4 bg-[#FFF9F0] p-5 rounded-2xl border border-orange-50">
                  <p>{lang === 'en' ? activeChapterData.notesEn : activeChapterData.notesBn}</p>
                </div>

                {/* Teacher Kits associated with this specific chapter */}
                {classKits.filter(kit => kit.chapterId === selectedChapter).map((kit) => (
                  <div key={kit.id} className="p-5 bg-teal-50/40 rounded-2xl border border-teal-100 text-xs text-left mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-teal-800 uppercase tracking-widest text-[10px]">
                        Teacher study folder / kit
                      </span>
                      <span className="text-[10px] text-gray-400">By {kit.teacherName}</span>
                    </div>

                    <p className="text-gray-600 leading-relaxed font-sans italic">"{kit.notesText}"</p>

                    {/* Files / PDFs list */}
                    {kit.files.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="block font-bold text-gray-700">{lang === 'en' ? 'Kits Materials:' : 'কিটের ডাউনলোড ফাইলস:'}</span>
                        {kit.files.map((file, fIdx) => (
                          <div key={fIdx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-teal-100/50">
                            <span className="font-semibold text-gray-800">{file.name}</span>
                            <button
                              id={`btn-dl-kit-file-${fIdx}`}
                              onClick={() => handleDownloadFile(file.name)}
                              className="py-1 px-3 bg-teal-500 text-white font-bold rounded-lg text-[10px]"
                            >
                              Download PDF ({file.size || '1.5 MB'})
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* External links mapping */}
                    {kit.externalLinks.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="block font-bold text-gray-700">{lang === 'en' ? 'Interactive Links & Simulators:' : 'ইন্টারেক্টিভ সিমুলেটর লিঙ্ক:'}</span>
                        {kit.externalLinks.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-teal-600 hover:underline font-semibold font-sans block"
                          >
                            <ExternalLink size={12} />
                            <span>{link.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs">No Chapter content mapped.</p>
            )}
          </div>
        )}

        {/* TAB: MOCK TESTS */}
        {activeTab === 'tests' && (
          <div id="tab-content-tests" className="space-y-6 animate-fade-in text-center py-8">
            <Award size={48} className="text-[#FF6B35] mx-auto animate-float" />
            <h3 className="text-lg font-bold text-gray-900">{lang === 'en' ? 'Attempt Chapter-wise Mock Tests' : 'অধ্যায় ভিত্তিক মক টেস্ট দিন'}</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {lang === 'en' ? 'Solve mock tests curated directly from WBBSE and WBCHSE boards to evaluate preparation speeds.' : 'পর্ষদ স্তরের প্রশ্নের আদলে অধ্যায় ভিত্তিক মক টেস্ট দিয়ে নিজের র্যাঙ্ক ও গতি উন্নত করুন।'}
            </p>
            <button
              id="btn-goto-livetests"
              onClick={() => setActiveTab('drive')} // Or trigger view change
              className="py-2.5 px-6 bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:shadow-md hover:shadow-orange-150 text-white font-bold text-xs rounded-xl mt-4"
            >
              {lang === 'en' ? 'Go to Exam Zone' : 'পরীক্ষা দিতে ক্লিক করুন'}
            </button>
          </div>
        )}

        {/* TAB: SAVED DOWNLOADED PDFS */}
        {activeTab === 'downloads' && (
          <div id="tab-content-downloads" className="space-y-4 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {t.downloads}
            </h3>

            {downloadLogs.length > 0 ? (
              <div className="space-y-3">
                {downloadLogs.map((log, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-orange-150 shadow-sm flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="text-teal-500" size={16} />
                      <span className="font-semibold text-gray-800">{log}</span>
                    </div>
                    <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg font-bold border border-teal-100">
                      Saved Offline Cache (IndexedDB)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No PDFs saved offline yet.</p>
            )}
          </div>
        )}

        {/* TAB: LIVE CLASSES */}
        {activeTab === 'live-classes' && (
          <div id="tab-content-live" className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-[#1A1A2E] tracking-wider uppercase border-b border-orange-50 pb-2">
              {t.upcomingLiveClass}
            </h3>

            {jitsiMeetingActive ? (
              <div className="bg-gray-900 text-white p-6 rounded-3xl border-4 border-teal-400 shadow-xl space-y-4 min-h-[350px] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="bg-red-600 text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase animate-blink">
                    Live Broadcast Stream
                  </span>
                  <button
                    id="btn-leave-jitsi-meet"
                    onClick={() => setJitsiMeetingActive(false)}
                    className="py-1 px-3 bg-white/20 hover:bg-white/40 text-white text-xs rounded-lg"
                  >
                    Leave Room
                  </button>
                </div>

                <div className="text-center py-12 space-y-2">
                  <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <Video size={32} className="text-white" />
                  </div>
                  <h4 className="text-md font-bold font-sans">Jitsi WebRTC Streaming Server Initialized</h4>
                  <p className="text-xs text-teal-200">{t.jitsiActiveRoom}</p>
                </div>

                <p className="text-[10px] text-gray-400 text-center font-mono">Stream Key ID: jitsi-meet-aanmona-class10-math</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col justify-between text-left gap-4">
                <div className="flex justify-between items-start">
                  <div className="bg-orange-50 text-[#FF6B35] p-3 rounded-2xl">
                    <Video size={24} />
                  </div>
                  <span className="bg-teal-50 text-teal-700 text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase border border-teal-100">
                    Online in 5 Mins
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 font-sans">Class 10 Light ray diagrams session</h4>
                  <p className="text-xs text-gray-400 mt-1">Instructor: Dr. Subhabrata Roy • Scheduled: 6:30 PM</p>
                </div>

                <button
                  id="btn-jitsi-join"
                  onClick={() => setJitsiMeetingActive(true)}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  {t.joinLiveSession}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: CLASS GROUP CHAT */}
        {activeTab === 'chat' && (
          <div id="tab-content-chat" className="bg-white rounded-3xl border border-orange-100 shadow-sm flex flex-col h-[450px] overflow-hidden">
            {/* Header chatroom */}
            <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-gray-800 block">Class {formatNumber(currentUser.studentClass || '10', lang)} — Central Chatroom</span>
                <span className="text-[9px] text-[#FF6B35] font-black uppercase tracking-widest">Active Members: {formatNumber('24', lang)} Online</span>
              </div>
            </div>

            {/* Message boards */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => {
                const isMyMessage = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] text-gray-400 font-sans mb-0.5">{msg.senderName} ({msg.senderRole})</span>
                    <div className={`p-3 rounded-2xl max-w-sm text-xs font-sans ${
                      isMyMessage ? 'bg-[#FF6B35] text-white rounded-tr-none' : 'bg-orange-50 text-gray-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-400 mt-0.5 font-mono">{msg.timestamp}</span>
                  </div>
                );
              })}
              <div ref={chatBottomRef}></div>
            </div>

            {/* Input form */}
            <form id="chat-input-form" onSubmit={handleSendMessage} className="p-3 border-t border-orange-100 bg-[#FFF9F0] flex gap-2">
              <input
                id="chat-text-input"
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t.chatsPlaceholder}
                className="flex-1 p-2 bg-white text-xs rounded-xl border border-orange-100 focus:outline-none focus:border-[#FF6B35]"
              />
              <button
                id="btn-chat-send"
                type="submit"
                className="bg-[#FF6B35] text-white p-2 rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
              >
                <SendHorizontal size={16} />
              </button>
            </form>
          </div>
        )}

        {/* TAB: PROGRESS TRACKER */}
        {activeTab === 'progress' && (
          <div id="tab-content-progress" className="space-y-6 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {t.progress}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Progress meters */}
              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-widest border-b border-orange-50 pb-1.5">
                  Subject Completion Checklist
                </span>
                <div className="space-y-3">
                  {studentClassStructure.subjects.map(sub => (
                    <div key={sub.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-gray-800">
                        <span>{lang === 'en' ? sub.nameEn : sub.nameBn}</span>
                        <span>{formatNumber('60', lang)}%</span>
                      </div>
                      <div className="w-full bg-orange-50 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#FF6B35] h-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard snippet */}
              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-widest border-b border-orange-50 pb-1.5">
                  Standings Class Rank
                </span>
                <div className="divide-y divide-orange-50">
                  {INITIAL_LEADERBOARD.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-50 text-orange-700 font-bold w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                          {formatNumber(item.rank, lang)}
                        </span>
                        <span className="font-semibold text-gray-800">{lang === 'en' ? item.nameEn : item.nameBn}</span>
                      </div>
                      <span className="font-mono font-semibold text-teal-600">{formatNumber(item.score, lang)} pts</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: GOOGLE DRIVE FILE EXPLORER */}
        {activeTab === 'drive' && (
          <div id="tab-content-drive" className="space-y-6 animate-fade-in text-left">
            <div className="flex items-start justify-between border-b border-orange-50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase">
                  {t.googleDriveIntegration}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-sans">{t.googleDriveDsc}</p>
              </div>
              
              {googleAccessToken && (
                <button
                  id="btn-refresh-drive"
                  onClick={() => fetchDriveFiles(googleAccessToken)}
                  disabled={loadingDrive}
                  className="p-2 text-teal-600 hover:bg-teal-50 border border-teal-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  title={t.refreshDrive}
                >
                  <RefreshCw size={14} className={loadingDrive ? 'animate-spin' : ''} />
                  <span className="text-xs font-bold">{t.refreshDrive}</span>
                </button>
              )}
            </div>

            {googleAccessToken ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">{t.googleDriveConnected}</span>
                    <span className="text-[10px] text-emerald-700/85">In-memory OAuth session is live. Access token secured in memory cache.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">{t.googleDriveFiles}</span>
                  
                  {loadingDrive ? (
                    <div className="text-center py-12 text-xs text-gray-500">
                      <RefreshCw size={24} className="animate-spin text-teal-500 mx-auto mb-2" />
                      <span>{t.loading}</span>
                    </div>
                  ) : driveError ? (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">
                      {driveError}
                    </div>
                  ) : driveFiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {driveFiles.map((file) => (
                        <div key={file.id} className="bg-[#FFF9F0] border border-orange-100 p-4 rounded-2xl flex justify-between items-center text-xs group hover:border-teal-300 hover:bg-white transition-all">
                          <div className="text-left space-y-1">
                            <span className="font-bold text-gray-800 block truncate max-w-[150px]">{file.name}</span>
                            <span className="text-[10px] text-gray-400 block font-mono">{file.mimeType.split('/').pop()?.toUpperCase()}</span>
                          </div>
                          
                          <div className="flex gap-1.5">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-teal-500 rounded-xl transition-all"
                                title="Open File"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDownloadFile(file.name)}
                              className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-teal-500 rounded-xl transition-all"
                              title="Sync to offline downloads"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-xs text-gray-400 bg-[#FFF9F0] rounded-2xl border border-orange-50">
                      {t.noFilesFound}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 text-center space-y-4 py-12 max-w-lg mx-auto">
                <GraduationCap size={44} className="text-[#FF6B35] mx-auto animate-float" />
                <h4 className="text-md font-bold text-gray-900">Unlock your Google Drive study materials</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  Connect your Google account with AanMona Study with permissions to easily browse, study, and cache your online revision sheets.
                </p>
                <button
                  id="btn-authenticate-drive-tab"
                  onClick={handleGoogleAuth}
                  className="py-2.5 px-6 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 mx-auto"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span className="font-sans text-xs font-bold">{t.googleSignInBtn}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: PROFILE DETAILS */}
        {activeTab === 'profile' && (
          <form id="profile-edit-form" onSubmit={(e) => { e.preventDefault(); alert(lang === 'en' ? 'Profile saved successfully!' : 'প্রোফাইল সফলভাবে সংরক্ষণ করা হয়েছে!'); }} className="space-y-6 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {t.profile}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name (English)</label>
                <input
                  id="profile-name-en"
                  type="text"
                  value={currentUser.fullNameEn}
                  onChange={(e) => onUpdateUser({ ...currentUser, fullNameEn: e.target.value })}
                  className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">নাম (বাংলা)</label>
                <input
                  id="profile-name-bn"
                  type="text"
                  value={currentUser.fullNameBn}
                  onChange={(e) => onUpdateUser({ ...currentUser, fullNameBn: e.target.value })}
                  className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t.schoolNameLabel}</label>
                <input
                  id="profile-school"
                  type="text"
                  value={currentUser.schoolName || ''}
                  onChange={(e) => onUpdateUser({ ...currentUser, schoolName: e.target.value })}
                  className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t.whatsappLabel}</label>
                <input
                  id="profile-whatsapp"
                  type="text"
                  value={currentUser.whatsapp}
                  onChange={(e) => onUpdateUser({ ...currentUser, whatsapp: e.target.value })}
                  className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
                />
              </div>
            </div>

            <button
              id="btn-save-profile"
              type="submit"
              className="py-2 px-6 bg-[#FF6B35] text-white font-bold text-xs rounded-xl hover:shadow-md transition-all cursor-pointer"
            >
              {lang === 'en' ? 'Save Profile' : 'সংরক্ষণ করুন'}
            </button>
          </form>
        )}

      </main>
    </div>
  );
}
