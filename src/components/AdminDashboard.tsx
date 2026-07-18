/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Home, Users, Bell, BarChart3, ShieldCheck, CheckCircle2, AlertCircle, Trash2, PlusCircle
} from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { type UserProfile, type Announcement } from '../types';
import { INITIAL_USERS, ANNOUNCEMENTS } from '../mockData';

interface AdminDashboardProps {
  lang: Language;
  currentUser: UserProfile;
}

export default function AdminDashboard({ lang, currentUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'announcements' | 'analytics'>('users');
  const t = i18n[lang];

  // User list states
  const [userList, setUserList] = useState<UserProfile[]>(INITIAL_USERS);

  // Announcement states
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    ANNOUNCEMENTS.map(a => ({
      id: a.id,
      textEn: a.textEn,
      textBn: a.textBn,
      date: '2026-06-29',
      isPinned: false
    }))
  );
  const [newAnnEn, setNewAnnEn] = useState('');
  const [newAnnBn, setNewAnnBn] = useState('');

  const handleToggleVerification = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, isVerified: !u.isVerified };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    const ok = window.confirm(lang === 'en' ? 'Are you sure you want to remove this user from the system?' : 'আপনি কি এই ব্যবহারকারীকে সরিয়ে দিতে চান?');
    if (ok) {
      setUserList(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnEn) return;

    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      textEn: newAnnEn,
      textBn: newAnnBn || newAnnEn,
      date: new Date().toISOString().split('T')[0],
      isPinned: true
    };

    setAnnouncements(prev => [ann, ...prev]);
    ANNOUNCEMENTS.unshift(ann); // sync with master store

    setNewAnnEn('');
    setNewAnnBn('');
    alert(lang === 'en' ? 'Announcement pinned successfully to all portals!' : 'ঘোষণাটি সফলভাবে পিন করা হয়েছে!');
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    const idx = ANNOUNCEMENTS.findIndex(a => a.id === id);
    if (idx !== -1) ANNOUNCEMENTS.splice(idx, 1);
  };

  return (
    <div id="admin-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-white p-5 rounded-3xl border border-orange-100 shadow-sm shrink-0 flex flex-col gap-2 h-fit text-left">
        <div className="pb-4 border-b border-orange-50 mb-3 flex items-center gap-2.5">
          <div className="bg-red-50 text-red-600 p-2 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-4">Admin Portal</h4>
            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block mt-0.5">
              Superuser Mode
            </span>
          </div>
        </div>

        {[
          { id: 'users', label: lang === 'en' ? 'Approve Users' : 'অনুমোদন সেটিংস', icon: Users },
          { id: 'announcements', label: lang === 'en' ? 'Post Announcements' : 'ঘোষণা বোর্ড', icon: Bell },
          { id: 'analytics', label: lang === 'en' ? 'Platform Analytics' : 'প্ল্যাটফর্ম এনালাইটিক্স', icon: BarChart3 }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`admin-sidebar-btn-${item.id}`}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-red-500 text-white shadow-md shadow-red-100'
                  : 'text-gray-600 hover:bg-red-50/50 hover:text-red-500'
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
        
        {/* TAB: APPROVE USERS QUEUE */}
        {activeTab === 'users' && (
          <div id="admin-tab-users" className="space-y-6 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {lang === 'en' ? 'Review & Approve Registrations' : 'ব্যবহারকারী অনুমোদন সূচি'}
            </h3>

            <div className="divide-y divide-orange-50 bg-[#FFF9F0] p-4 rounded-3xl border border-orange-100/50">
              {userList.map((user) => (
                <div key={user.id} id={`user-row-${user.id}`} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 text-xs">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      user.role === 'TEACHER' ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {user.role}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 font-sans mt-1">
                      {lang === 'en' ? user.fullNameEn : user.fullNameBn}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">
                      School: {user.schoolName || 'Not Set'} • Whatsapp: {user.whatsapp}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      id={`btn-verify-user-${user.id}`}
                      onClick={() => handleToggleVerification(user.id)}
                      className={`py-1.5 px-3 rounded-lg font-bold text-[10px] transition-all border ${
                        user.isVerified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {user.isVerified ? '✓ Verified' : 'Verify Now'}
                    </button>
                    <button
                      id={`btn-delete-user-${user.id}`}
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all border border-red-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: POST PINNED ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div id="admin-tab-announcements" className="space-y-6 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {lang === 'en' ? 'Global Broadcast Announcements' : 'সার্বজনীন পিন ঘোষণা'}
            </h3>

            {/* Post custom notices */}
            <form id="add-announcement-form" onSubmit={handleAddAnnouncement} className="bg-[#FFF9F0] p-5 rounded-3xl border border-orange-100 space-y-4">
              <span className="block text-xs font-bold text-orange-800 uppercase tracking-wider">Publish Live Notice banner</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  id="notice-text-en"
                  type="text"
                  required
                  value={newAnnEn}
                  onChange={(e) => setNewAnnEn(e.target.value)}
                  placeholder="Notice in English..."
                  className="p-2 text-xs border border-gray-200 rounded-xl bg-white"
                />
                <input
                  id="notice-text-bn"
                  type="text"
                  value={newAnnBn}
                  onChange={(e) => setNewAnnBn(e.target.value)}
                  placeholder="ঘোষণা বাংলায়..."
                  className="p-2 text-xs border border-gray-200 rounded-xl bg-white"
                />
              </div>

              <button
                id="btn-pin-announcement"
                type="submit"
                className="py-2 px-5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <PlusCircle size={14} />
                <span>Pin notice banner</span>
              </button>
            </form>

            {/* List announcements */}
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} id={`ann-card-${ann.id}`} className="bg-white p-4 rounded-2xl border border-orange-150 shadow-sm flex justify-between items-center text-xs text-left">
                  <div className="space-y-1">
                    <span className="bg-red-50 text-red-600 text-[8px] font-black px-2 py-0.5 rounded border border-red-100 uppercase">
                      PINNED NOTICE
                    </span>
                    <p className="text-gray-800 font-sans mt-1">
                      {lang === 'en' ? ann.textEn : ann.textBn}
                    </p>
                    <span className="text-[9px] text-gray-400 block font-mono">Published: {ann.date}</span>
                  </div>

                  <button
                    id={`btn-del-ann-${ann.id}`}
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PLATFORM METRICS */}
        {activeTab === 'analytics' && (
          <div id="admin-tab-analytics" className="space-y-6 animate-fade-in text-left">
            <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase border-b border-orange-50 pb-2">
              {lang === 'en' ? 'Platform Enrollment Analytics' : 'প্ল্যাটফর্ম এনালাইটিক্স'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="bg-[#FFF9F0] p-5 rounded-3xl border border-orange-100">
                <span className="block text-xs font-bold text-gray-600 uppercase tracking-widest border-b border-orange-50 pb-2">Traffic overview</span>
                <div className="space-y-3 pt-3 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total API calls / day:</span>
                    <strong className="font-mono text-[#FF6B35]">1,500 hits</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active WebSocket relays:</span>
                    <strong className="font-mono text-teal-600">45 active</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF9F0] p-5 rounded-3xl border border-orange-100">
                <span className="block text-xs font-bold text-gray-600 uppercase tracking-widest border-b border-orange-50 pb-2">Database records</span>
                <div className="space-y-3 pt-3 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cached PDF guidelines:</span>
                    <strong className="font-mono text-[#FF6B35]">25 cached</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">WBBSE registered class:</span>
                    <strong className="font-mono text-teal-600">Classes 1-12</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
