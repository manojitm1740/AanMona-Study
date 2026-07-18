/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, FolderPlus, FileText, Video, Users, User as UserIcon, Plus, Trash2, 
  RefreshCw, Check, CheckCircle, ShieldAlert, GraduationCap, ExternalLink, Download
} from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { type UserProfile, type TeacherKit, type DriveItem, type Question } from '../types';
import { CLASSES_DATA, INITIAL_KITS } from '../mockData';
import { googleSignIn } from '../firebase';
import { CreateTest } from './CreateTest';

interface TeacherDashboardProps {
  lang: Language;
  currentUser: UserProfile;
  googleAccessToken: string | null;
  onLinkGoogleToken: (token: string) => void;
}

export default function TeacherDashboard({
  lang,
  currentUser,
  googleAccessToken,
  onLinkGoogleToken
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'kits' | 'create-test' | 'live' | 'profile'>('home');
  const t = i18n[lang];

  // Teacher Kits states
  const [kits, setKits] = useState<TeacherKit[]>(INITIAL_KITS);
  const [showAddKitModal, setShowAddKitModal] = useState(false);
  const [newKitName, setNewKitName] = useState('');
  const [newKitClass, setNewKitClass] = useState('10');
  const [newKitSubject, setNewKitSubject] = useState('physical-science');
  const [newKitChapter, setNewKitChapter] = useState('phys-light');
  const [newKitNotes, setNewKitNotes] = useState('');
  const [newKitFiles, setNewKitFiles] = useState<{ name: string; url: string; size: string }[]>([]);
  const [newKitLinks, setNewKitLinks] = useState<{ title: string; url: string }[]>([]);
  
  // Custom file add states
  const [customFileName, setCustomFileName] = useState('');
  const [customLinkTitle, setCustomLinkTitle] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('');

  // Google Drive integration inside kit creator
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState('');

  // Live broadcast state
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Fetch Google Drive Files for Teacher import
  const fetchDriveFiles = async (token: string) => {
    setLoadingDrive(true);
    setDriveError('');
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fpdf%27+or+mimeType%3D%27application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document%27&fields=files(id,name,mimeType,webViewLink,size)&pageSize=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Stale Google session.');
      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      setDriveError(err.message || 'Error querying Google Drive');
    } finally {
      setLoadingDrive(false);
    }
  };

  useEffect(() => {
    if (googleAccessToken && showAddKitModal) {
      fetchDriveFiles(googleAccessToken);
    }
  }, [googleAccessToken, showAddKitModal]);

  const handleGoogleConnect = async () => {
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

  const handleImportDriveFile = (file: DriveItem) => {
    setNewKitFiles(prev => [
      ...prev,
      {
        name: file.name,
        url: file.webViewLink || '#',
        size: file.size ? `${(parseInt(file.size) / (1024 * 1024)).toFixed(1)} MB` : 'Google Drive Document'
      }
    ]);
    alert(lang === 'en' ? `Successfully linked Google Drive asset: ${file.name} to Teacher Kit.` : `গুগল ড্রাইভ ফাইল "${file.name}" সফলভাবে যুক্ত করা হয়েছে।`);
  };

  const handleAddLocalFile = () => {
    if (!customFileName) return;
    setNewKitFiles(prev => [...prev, { name: customFileName, url: '#', size: 'Local PDF Upload' }]);
    setCustomFileName('');
  };

  const handleAddLink = () => {
    if (!customLinkTitle || !customLinkUrl) return;
    setNewKitLinks(prev => [...prev, { title: customLinkTitle, url: customLinkUrl }]);
    setCustomLinkTitle('');
    setCustomLinkUrl('');
  };

  const handleCreateKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKitName) return;

    // Destructive mutation warning guidelines: Present warning when modifying or publishing kits
    const proceed = window.confirm(lang === 'en' ? 'Are you sure you want to publish this Teacher Study Kit to your active student portals?' : 'আপনি কি নতুন টিচার স্টাডি কিটটি ছাত্র-ছাত্রীদের জন্য প্রকাশ করতে চান?');
    if (!proceed) return;

    const kit: TeacherKit = {
      id: `kit-${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn,
      name: newKitName,
      classId: newKitClass,
      subjectId: newKitSubject,
      chapterId: newKitChapter,
      isPublished: true,
      notesText: newKitNotes,
      files: newKitFiles,
      externalLinks: newKitLinks,
      images: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setKits(prev => [kit, ...prev]);
    INITIAL_KITS.unshift(kit); // Update state fallback

    // Reset fields
    setNewKitName('');
    setNewKitNotes('');
    setNewKitFiles([]);
    setNewKitLinks([]);
    setShowAddKitModal(false);
  };

  const handleDeleteKit = (kitId: string) => {
    // Destructive action check guidelines: window.confirm
    const confirmed = window.confirm(lang === 'en' ? 'Are you sure you want to delete this Teacher Kit? This action is irreversible.' : 'আপনি কি এই কিটটি ডিলিট করতে চান? এটি আর ফেরত পাওয়া যাবে না।');
    if (!confirmed) return;

    setKits(prev => prev.filter(k => k.id !== kitId));
    const index = INITIAL_KITS.findIndex(k => k.id === kitId);
    if (index !== -1) INITIAL_KITS.splice(index, 1);
  };

  return (
    <div id="teacher-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-white p-5 rounded-3xl border border-orange-100 shadow-sm shrink-0 flex flex-col gap-2 h-fit text-left">
        <div className="pb-4 border-b border-orange-50 mb-3 flex items-center gap-2.5">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
            alt="teacher-avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/20"
          />
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-4">{lang === 'en' ? currentUser.fullNameEn : currentUser.fullNameBn}</h4>
            <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider block mt-0.5">
              Verified Instructor
            </span>
          </div>
        </div>

        {[
          { id: 'home', label: lang === 'en' ? 'Teacher Overview' : 'শিক্ষক ড্যাশবোর্ড', icon: Home },
          { id: 'kits', label: lang === 'en' ? 'Manage Study Kits' : 'স্টাডি কিটস তৈরি', icon: FolderPlus },
          { id: 'create-test', label: lang === 'en' ? 'Publish Mock Test' : 'মক টেস্ট তৈরি', icon: FileText },
          { id: 'live', label: lang === 'en' ? 'Start Live Class' : 'লাইভ ক্লাস ব্রডকাস্ট', icon: Video },
          { id: 'profile', label: lang === 'en' ? 'Profile Info' : 'শিক্ষক প্রোফাইল', icon: UserIcon }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`teacher-sidebar-btn-${item.id}`}
              onClick={() => { setActiveTab(item.id as any); setIsBroadcasting(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-100'
                  : 'text-gray-600 hover:bg-teal-50/50 hover:text-teal-600'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-sm text-left relative min-h-[550px]">
        
        {/* TAB: TEACHER HOME */}
        {activeTab === 'home' && (
          <div id="teacher-tab-home" className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-3xl border border-orange-100/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-sans">
                  {lang === 'en' ? 'AanMona Educator Portal' : 'আনমনা শিক্ষক পোর্টালে স্বাগতম'}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  {lang === 'en' ? 'Author high standard chapter notes, link Google Drive reference books, and evaluate mock test grades.' : 'সহজেই ছাত্র-ছাত্রীদের জন্য স্টাডি কিটস ও চ্যাপ্টার মক টেস্ট প্রস্তুত করুন।'}
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="py-2 px-4 bg-white border border-teal-200 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-50 transition-all flex items-center gap-2"
              >
                <Download size={14} />
                {lang === 'en' ? 'Export Report PDF' : 'পিডিএফ ডাউনলোড'}
              </button>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-orange-100 text-center space-y-1 shadow-sm">
                <Users size={24} className="text-[#FF6B35] mx-auto mb-2" />
                <span className="block text-xl font-bold text-gray-900 font-sans">{formatNumber('250', lang)}+</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assigned Students</span>
              </div>

              <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-orange-100 text-center space-y-1 shadow-sm">
                <FolderPlus size={24} className="text-teal-600 mx-auto mb-2" />
                <span className="block text-xl font-bold text-gray-900 font-sans">{formatNumber(kits.length, lang)}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kits Published</span>
              </div>

              <div className="bg-[#FFF9F0] p-5 rounded-2xl border border-orange-100 text-center space-y-1 shadow-sm">
                <FileText size={24} className="text-yellow-600 mx-auto mb-2" />
                <span className="block text-xl font-bold text-gray-900 font-sans">{formatNumber('3', lang)}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Scheduled Tests</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MANAGE STUDY KITS */}
        {activeTab === 'kits' && (
          <div id="teacher-tab-kits" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-orange-50 pb-3">
              <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase">
                {lang === 'en' ? 'My Published Study Kits' : 'আমার প্রকাশিত স্টাডি কিটস'}
              </h3>
              <button
                id="btn-add-kit-modal"
                onClick={() => setShowAddKitModal(true)}
                className="py-2 px-4 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Plus size={14} />
                <span>{lang === 'en' ? 'Create New Kit' : 'নতুন কিট তৈরি'}</span>
              </button>
            </div>

            {/* List of study kits authored */}
            <div className="space-y-4">
              {kits.map((kit) => (
                <div
                  key={kit.id}
                  id={`kit-row-${kit.id}`}
                  className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left group hover:border-teal-300 transition-all"
                >
                  <div>
                    <span className="bg-teal-50 text-teal-700 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded border border-teal-100 uppercase">
                      Class {formatNumber(kit.classId, lang)} • {kit.subjectId}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 font-sans mt-2">{kit.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Published: {kit.createdAt}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      id={`btn-delete-kit-${kit.id}`}
                      onClick={() => handleDeleteKit(kit.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100 cursor-pointer"
                      title="Delete Study Kit"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CREATE KIT FORM MODAL */}
            {showAddKitModal && (
              <div id="add-kit-modal" className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border-t-4 border-teal-500 shadow-2xl text-left flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center border-b border-orange-50 pb-3 mb-4">
                    <h3 className="text-md font-bold text-gray-900 font-sans flex items-center gap-2">
                      <FolderPlus className="text-teal-500" size={20} />
                      <span>{t.saveKit}</span>
                    </h3>
                    <button onClick={() => setShowAddKitModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>

                  <form id="create-kit-form" onSubmit={handleCreateKitSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Kit Name / Subject Topic Bundle</label>
                      <input
                        id="kit-name-input"
                        type="text"
                        required
                        value={newKitName}
                        onChange={(e) => setNewKitName(e.target.value)}
                        placeholder="e.g. Class 10 — Current Electricity Math Notes"
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{t.classSelector}</label>
                        <select
                          id="kit-class-select"
                          value={newKitClass}
                          onChange={(e) => setNewKitClass(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
                        >
                          <option value="1">Class 1</option>
                          <option value="5">Class 5</option>
                          <option value="10">Class 10</option>
                          <option value="12">Class 12</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{t.subject}</label>
                        <select
                          id="kit-subject-select"
                          value={newKitSubject}
                          onChange={(e) => setNewKitSubject(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
                        >
                          <option value="physical-science">Physical Science</option>
                          <option value="math">Mathematics</option>
                          <option value="life-science">Life Science</option>
                          <option value="evs">EVS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{t.chapter}</label>
                        <select
                          id="kit-chapter-select"
                          value={newKitChapter}
                          onChange={(e) => setNewKitChapter(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
                        >
                          <option value="phys-light">Light</option>
                          <option value="phys-electricity">Electricity</option>
                          <option value="math-quadratic">Quadratic</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Lesson Briefs / Outline instructions</label>
                      <textarea
                        id="kit-notes-input"
                        value={newKitNotes}
                        onChange={(e) => setNewKitNotes(e.target.value)}
                        placeholder="Provide text details or study steps for your students..."
                        rows={3}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* GOOGLE DRIVE INTEGRATION INSIDE KIT CREATOR */}
                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-dashed border-teal-200 space-y-3">
                      <span className="block text-[11px] font-bold text-teal-800 uppercase tracking-widest flex items-center gap-1">
                        <GraduationCap size={14} /> Link Google Drive Study PDFs
                      </span>

                      {googleAccessToken ? (
                        <div className="space-y-2">
                          {loadingDrive ? (
                            <div className="text-center py-4 text-xs text-gray-400">Loading Drive items...</div>
                          ) : driveFiles.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                              {driveFiles.map((file) => (
                                <div key={file.id} className="bg-white p-2.5 rounded-xl border border-teal-100 flex justify-between items-center text-[10px]">
                                  <span className="font-bold text-gray-800 truncate max-w-[120px]">{file.name}</span>
                                  <button
                                    type="button"
                                    id={`btn-import-kit-${file.id}`}
                                    onClick={() => handleImportDriveFile(file)}
                                    className="py-1 px-2.5 bg-teal-500 text-white rounded font-bold uppercase tracking-wider text-[8px]"
                                  >
                                    Link file
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400">No PDFs found in your Google Drive.</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-gray-500 leading-normal max-w-sm">Connect Google Drive to select your syllabus books and attach them directly to this Teacher Kit folder.</p>
                          <button
                            type="button"
                            id="btn-link-drive-creator"
                            onClick={handleGoogleConnect}
                            className="py-1.5 px-4 bg-teal-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-sm shrink-0"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48">
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            </svg>
                            <span>Connect Drive</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Added Resources list overview inside creator */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-[#FFF9F0] rounded-xl border border-orange-100">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Linked PDFs ({newKitFiles.length})</span>
                        <div className="space-y-1">
                          {newKitFiles.map((file, idx) => (
                            <span key={idx} className="block text-[9px] text-gray-700 bg-white p-1 rounded border border-gray-150 truncate">
                              📎 {file.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          <input
                            id="kit-local-file-name"
                            type="text"
                            value={customFileName}
                            onChange={(e) => setCustomFileName(e.target.value)}
                            placeholder="Add local pdf file name..."
                            className="flex-1 p-1 text-[9px] border border-gray-200 bg-white"
                          />
                          <button type="button" onClick={handleAddLocalFile} className="bg-teal-500 text-white px-2 rounded font-black text-[10px]">+</button>
                        </div>
                      </div>

                      <div className="p-3 bg-[#FFF9F0] rounded-xl border border-orange-100">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">External Links ({newKitLinks.length})</span>
                        <div className="space-y-1">
                          {newKitLinks.map((link, idx) => (
                            <span key={idx} className="block text-[9px] text-gray-700 bg-white p-1 rounded border border-gray-150 truncate">
                              🔗 {link.title}
                            </span>
                          ))}
                        </div>
                        <div className="space-y-1 mt-2">
                          <input
                            id="kit-ext-link-title"
                            type="text"
                            value={customLinkTitle}
                            onChange={(e) => setCustomLinkTitle(e.target.value)}
                            placeholder="Link Title (e.g. Simulator)"
                            className="w-full p-1 text-[9px] border border-gray-200 bg-white"
                          />
                          <div className="flex gap-1.5">
                            <input
                              id="kit-ext-link-url"
                              type="text"
                              value={customLinkUrl}
                              onChange={(e) => setCustomLinkUrl(e.target.value)}
                              placeholder="URL (http://...)"
                              className="flex-1 p-1 text-[9px] border border-gray-200 bg-white"
                            />
                            <button type="button" onClick={handleAddLink} className="bg-teal-500 text-white px-2 rounded font-black text-[10px]">+</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      id="btn-submit-kit-creator"
                      type="submit"
                      className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-md mt-4 cursor-pointer"
                    >
                      {lang === 'en' ? 'Publish Kit Folder' : 'কিট ফোল্ডার প্রকাশ করুন'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: CREATE TEST */}
        {activeTab === 'create-test' && (
          <CreateTest lang={lang} onPublish={(test) => console.log('Publishing test', test)} />
        )}

        {/* TAB: START LIVE CLASS */}
        {activeTab === 'live' && (
          <div id="teacher-tab-live" className="space-y-6 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {t.liveClasses}
            </h3>

            {isBroadcasting ? (
              <div className="bg-gray-900 text-white p-6 rounded-3xl border-4 border-teal-400 shadow-xl space-y-4 min-h-[350px] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="bg-red-600 text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase animate-blink">
                    Broadcasting Live stream
                  </span>
                  <button
                    id="btn-stop-broadcast"
                    onClick={() => setIsBroadcasting(false)}
                    className="py-1 px-3 bg-white/20 hover:bg-white/40 text-white text-xs rounded-lg"
                  >
                    End Session
                  </button>
                </div>

                <div className="text-center py-12 space-y-2">
                  <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <Video size={32} className="text-white" />
                  </div>
                  <h4 className="text-md font-bold font-sans">Active WebRTC Jitsi Stream server transmitting...</h4>
                  <p className="text-xs text-teal-200">Sync status: Synced chat room & audio channels.</p>
                </div>

                <p className="text-[10px] text-gray-400 text-center font-mono">Teacher broadcast stream key: jitsi-broadcast-secret-subhabrata</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col justify-between text-left gap-4 max-w-lg mx-auto py-8 text-center">
                <Video size={44} className="text-[#FF6B35] mx-auto animate-float" />
                <h4 className="text-md font-bold text-gray-900 font-sans">Start Synced WebRTC Classroom Session</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">Launch lightweight Jitsi interactive doubt sessions synced directly into all WBBSE student portal tabs.</p>
                
                <button
                  id="btn-start-jitsi-meet"
                  onClick={() => setIsBroadcasting(true)}
                  className="py-2.5 px-6 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 mx-auto"
                >
                  <span>{t.startLiveSession}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: PROFILE */}
        {activeTab === 'profile' && (
          <div id="teacher-profile" className="space-y-4 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {t.profile}
            </h3>
            <p className="text-xs text-gray-500 font-sans">Email: {currentUser.email}</p>
            <p className="text-xs text-gray-500 font-sans">Registered School: {currentUser.schoolName || 'N/A'}</p>
            <p className="text-xs text-gray-500 font-sans">Registered: {currentUser.registrationDate}</p>
          </div>
        )}

      </main>
    </div>
  );
}
