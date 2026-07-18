/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, X, Key, Phone, User as UserIcon, ShieldAlert } from 'lucide-react';
import { i18n, type Language, formatNumber } from '../i18n';
import { UserRole, type UserProfile } from '../types';
import { INITIAL_USERS, CLASSES_DATA } from '../mockData';
import { googleSignIn } from '../firebase';

interface AuthModalProps {
  lang: Language;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, googleToken?: string) => void;
}

export default function AuthModal({ lang, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot' | 'findid'>('signin');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Sign In inputs
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signinError, setSigninError] = useState('');

  // Sign Up inputs
  const [fullNameEn, setFullNameEn] = useState('');
  const [fullNameBn, setFullNameBn] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState('10');
  const [stream, setStream] = useState<'Science' | 'Arts' | 'Commerce' | ''>('');
  const [schoolName, setSchoolName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>(UserRole.STUDENT);
  const [isRegistering, setIsRegistering] = useState(false);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

  // Forgot password inputs
  const [forgotInput, setForgotInput] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Find ID inputs
  const [findIdInput, setFindIdInput] = useState('');
  const [foundMaskedId, setFoundMaskedId] = useState('');

  const t = i18n[lang];

  // Try signing in using static credentials first
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSigninError('');

    if (!loginId || !password) {
      setSigninError(lang === 'en' ? 'Please enter your login details.' : 'অনুগ্রহ করে সব তথ্য দিন।');
      return;
    }

    // Match with initial users in mockData
    const foundUser = INITIAL_USERS.find(
      (u) =>
        (u.email.toLowerCase() === loginId.toLowerCase() || u.whatsapp === loginId || u.fullNameEn.toLowerCase() === loginId.toLowerCase()) &&
        u.role === role
    );

    if (foundUser) {
      // Simulate login (password is 'password' for all initial users)
      if (password === 'password') {
        onLoginSuccess(foundUser);
        onClose();
      } else {
        setSigninError(lang === 'en' ? 'Incorrect Password.' : 'ভুল পাসওয়ার্ড।');
      }
    } else {
      setSigninError(
        lang === 'en'
          ? `No matching ${role.toLowerCase()} found. For default credentials use: student@aanmona.com, teacher@aanmona.com, or admin@aanmona.com with password 'password'`
          : `এই রোলের জন্য কোনো ব্যবহারকারী পাওয়া যায়নি। পরীক্ষা করার জন্য default credentials ব্যবহার করুন: password 'password'`
      );
    }
  };

  // Google Sign In (for Workspace integrations)
  const handleGoogleSignIn = async () => {
    setSigninError('');
    try {
      const result = await googleSignIn();
      if (result) {
        // Create or find a matching user profile for Google user
        const googleUser = result.user;
        const existingUserProfile = INITIAL_USERS.find(u => u.email.toLowerCase() === googleUser.email?.toLowerCase());

        const profile: UserProfile = existingUserProfile || {
          id: googleUser.uid,
          email: googleUser.email || 'google_user@aanmona.com',
          fullNameEn: googleUser.displayName || 'Google User',
          fullNameBn: googleUser.displayName || 'গুগল ব্যবহারকারী',
          whatsapp: '9999999999',
          role: UserRole.STUDENT,
          isVerified: true, // Auto-verified through google
          schoolName: 'Google Unified School',
          studentClass: '10',
          avatar: googleUser.photoURL || undefined,
          registrationDate: new Date().toISOString().split('T')[0]
        };

        onLoginSuccess(profile, result.accessToken);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setSigninError(lang === 'en' ? 'Google Authentication failed.' : 'গুগল প্রমাণীকরণ ব্যর্থ হয়েছে।');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSigninError('');
    setSignupSuccessMessage('');

    if (!fullNameEn || !whatsapp || !email || !signupPassword) {
      setSigninError(lang === 'en' ? 'Please fill out all required fields.' : 'সব প্রয়োজনীয় তথ্য দিন।');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSigninError(lang === 'en' ? 'Passwords do not match.' : 'পাসওয়ার্ড দুটি মেলেনি।');
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      // Create new user (pending approval)
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        fullNameEn,
        fullNameBn: fullNameBn || fullNameEn,
        whatsapp,
        role: signupRole,
        isVerified: signupRole === UserRole.STUDENT ? false : false, // Teachers and students need admin verification as requested
        schoolName,
        studentClass: signupRole === UserRole.STUDENT ? studentClass : undefined,
        stream: signupRole === UserRole.STUDENT && ['11', '12'].includes(studentClass) ? stream : undefined,
        registrationDate: new Date().toISOString().split('T')[0]
      };

      // Push to initial users so it can be simulated in memory
      INITIAL_USERS.push(newUser);

      setSignupSuccessMessage(
        lang === 'en'
          ? 'Registration successful! Your account is pending admin verification. You can sign in using your credentials to view public zones.'
          : 'নিবন্ধন সফল হয়েছে! আপনার অ্যাকাউন্টটি অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে। আপনি এখন লগ ইন করতে পারেন।'
      );
      
      // Auto fill sign in
      setLoginId(email);
      setRole(signupRole);
      setPassword(signupPassword);
      setTimeout(() => {
        setActiveTab('signin');
      }, 3500);
    }, 1500);
  };

  const handleForgotPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotInput) return;
      setForgotStep(2);
    } else {
      if (!otp || !newPass) return;
      setForgotSuccess(
        lang === 'en' ? 'Password reset successfully!' : 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'
      );
      setTimeout(() => {
        setForgotStep(1);
        setActiveTab('signin');
        setForgotSuccess('');
        setPassword(newPass);
      }, 2000);
    }
  };

  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findIdInput) return;
    const match = INITIAL_USERS.find(u => u.whatsapp === findIdInput || u.email === findIdInput);
    if (match) {
      const parts = match.email.split('@');
      const prefix = parts[0];
      const masked = prefix.slice(0, 3) + '***' + prefix.slice(-2) + '@' + parts[1];
      setFoundMaskedId(masked);
    } else {
      setFoundMaskedId(lang === 'en' ? 'No account registered with this info.' : 'কোনো অ্যাকাউন্ট পাওয়া যায়নি।');
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div 
        id="auth-modal-card" 
        className="bg-[#FFF9F0] w-full max-w-lg rounded-2xl shadow-2xl border-t-4 border-[#FF6B35] relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Banner with book illustration background vibe */}
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] p-6 text-white relative">
          <button 
            id="close-auth-modal" 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all text-white"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-[#FF6B35] animate-float">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans">{t.appName}</h2>
              <p className="text-white/90 text-sm font-sans">{t.appTagline}</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-orange-100 bg-white">
          <button
            id="tab-signin"
            onClick={() => { setActiveTab('signin'); setSigninError(''); }}
            className={`flex-1 py-3 text-center text-sm font-semibold transition-all ${
              activeTab === 'signin' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-orange-50/50' : 'text-[#6B7280] hover:bg-orange-50/20'
            }`}
          >
            {t.signIn}
          </button>
          <button
            id="tab-signup"
            onClick={() => { setActiveTab('signup'); setSigninError(''); }}
            className={`flex-1 py-3 text-center text-sm font-semibold transition-all ${
              activeTab === 'signup' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-orange-50/50' : 'text-[#6B7280] hover:bg-orange-50/20'
            }`}
          >
            {t.signUp}
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-6 overflow-y-auto flex-1">
          {signinError && (
            <div id="auth-error-banner" className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold mb-4 border border-red-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{signinError}</span>
            </div>
          )}

          {signupSuccessMessage && (
            <div id="signup-success-banner" className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs font-semibold mb-4 border border-emerald-200">
              {signupSuccessMessage}
            </div>
          )}

          {activeTab === 'signin' && (
            <form id="signin-form" onSubmit={handleSignIn} className="space-y-4">
              {/* Role Toggle Chips */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A2E] mb-2">{t.roleSelector}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN].map((r) => {
                    const roleLabel = r === UserRole.STUDENT ? t.studentRole : r === UserRole.TEACHER ? t.teacherRole : t.adminRole;
                    return (
                      <button
                        key={r}
                        type="button"
                        id={`role-btn-${r.toLowerCase()}`}
                        onClick={() => setRole(r)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          role === r
                            ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-sm shadow-orange-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {roleLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {lang === 'en' ? 'User ID / Email / WhatsApp' : 'ইউজার আইডি / ইমেল / হোয়াটসঅ্যাপ'}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                      id="login-id-input"
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="e.g. student@aanmona.com"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t.passwordLabel}</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra toggles */}
              <div className="flex items-center justify-between text-xs text-gray-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    id="remember-me-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <button
                  type="button"
                  id="link-forgot-tab"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[#FF6B35] hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>

              {/* Sign In CTA */}
              <button
                id="btn-submit-signin"
                type="submit"
                className="w-full py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:shadow-lg hover:shadow-orange-200 transition-all text-sm"
              >
                {t.signIn}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-orange-100"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">{lang === 'en' ? 'OR' : 'অথবা'}</span>
                <div className="flex-grow border-t border-orange-100"></div>
              </div>

              {/* Google Sign In button for Google Drive workspace permission */}
              <button
                type="button"
                id="btn-google-drive-signin"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-orange-200 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span className="text-gray-700 text-xs font-bold font-sans">{t.googleSignInBtn}</span>
              </button>

              <div className="text-center text-xs text-gray-600 mt-2">
                <button
                  type="button"
                  id="link-findid-tab"
                  onClick={() => setActiveTab('findid')}
                  className="text-teal-600 hover:underline font-semibold"
                >
                  {t.findUserId}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'signup' && (
            <form id="signup-form" onSubmit={handleSignUp} className="space-y-4">
              {/* Role Toggle Chips for register */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t.roleSelector}</label>
                <div className="flex gap-2">
                  {[UserRole.STUDENT, UserRole.TEACHER].map((r) => {
                    const roleLabel = r === UserRole.STUDENT ? t.studentRole : t.teacherRole;
                    return (
                      <button
                        key={r}
                        type="button"
                        id={`signup-role-${r.toLowerCase()}`}
                        onClick={() => setSignupRole(r)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                          signupRole === r
                            ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {roleLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Names and basic inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name (English)
                  </label>
                  <input
                    id="signup-name-en"
                    type="text"
                    value={fullNameEn}
                    onChange={(e) => setFullNameEn(e.target.value)}
                    required
                    placeholder="Rohit Sen"
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    নাম (বাংলা)
                  </label>
                  <input
                    id="signup-name-bn"
                    type="text"
                    value={fullNameBn}
                    onChange={(e) => setFullNameBn(e.target.value)}
                    placeholder="রোহিত সেন"
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.whatsappLabel}
                  </label>
                  <input
                    id="signup-whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    placeholder="9876543210"
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@aanmona.com"
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>

              {/* Student specific fields */}
              {signupRole === UserRole.STUDENT && (
                <div className="grid grid-cols-2 gap-3 bg-teal-50/50 p-3 rounded-lg border border-teal-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t.classSelector}
                    </label>
                    <select
                      id="signup-class-select"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none"
                    >
                      {CLASSES_DATA.map(c => (
                        <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameBn}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t.streamSelector}
                    </label>
                    <select
                      id="signup-stream-select"
                      value={stream}
                      disabled={!['11', '12'].includes(studentClass)}
                      onChange={(e) => setStream(e.target.value as any)}
                      className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none disabled:bg-gray-100"
                    >
                      <option value="">N/A</option>
                      <option value="Science">{t.scienceStream}</option>
                      <option value="Arts">{t.artsStream}</option>
                      <option value="Commerce">{t.commerceStream}</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.schoolNameLabel}
                </label>
                <input
                  id="signup-school"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Howrah Zilla School"
                  className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.passwordLabel}
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.confirmPasswordLabel}
                  </label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>

              {/* Upload ID component */}
              <div className="bg-orange-50/50 p-2.5 rounded-lg border border-dashed border-[#FF6B35]/40 text-center">
                <span className="block text-[11px] font-semibold text-orange-800">
                  {lang === 'en' ? 'Upload Student ID / Marksheet (Optional, for fast verification)' : 'স্টুডেন্ট আইডি / অ্যাডমিট কার্ড আপলোড করুন (দ্রুত অনুমোদনের জন্য)'}
                </span>
                <input id="signup-id-file" type="file" className="text-xs text-gray-500 mt-1 mx-auto cursor-pointer" />
              </div>

              <button
                id="btn-submit-signup"
                type="submit"
                disabled={isRegistering}
                className="w-full py-2.5 rounded-lg font-bold text-white bg-teal-500 hover:bg-teal-600 shadow-sm transition-all text-sm disabled:bg-gray-400"
              >
                {isRegistering ? t.loading : t.signUp}
              </button>
            </form>
          )}

          {activeTab === 'forgot' && (
            <form id="forgot-form" onSubmit={handleForgotPass} className="space-y-4 py-4">
              <h3 className="text-sm font-bold text-[#1A1A2E]">
                {lang === 'en' ? 'Reset Account Password' : 'পাসওয়ার্ড রিসেট করুন'}
              </h3>
              
              {forgotSuccess && (
                <div id="forgot-success" className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs font-semibold">
                  {forgotSuccess}
                </div>
              )}

              {forgotStep === 1 ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">
                    {lang === 'en' ? 'Enter your registered Email or WhatsApp Number to receive a 6-digit OTP.' : 'একটি ৬ অঙ্কের ওটিপি পেতে আপনার রেজিস্টার করা ইমেল বা হোয়াটসঅ্যাপ দিন।'}
                  </p>
                  <input
                    id="forgot-contact-input"
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="email@example.com or 9876543210"
                    className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                  />
                  <button
                    id="btn-forgot-step1"
                    type="submit"
                    className="w-full py-2 bg-[#FF6B35] text-white rounded-lg font-bold text-sm"
                  >
                    {lang === 'en' ? 'Send OTP' : 'ওটিপি পাঠান'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-[#06D6A0] font-semibold flex items-center gap-1">
                    <Phone size={14} /> {lang === 'en' ? 'OTP sent successfully (Simulated "123456")' : 'ওটিপি পাঠানো হয়েছে (পরীক্ষার জন্য "123456")'}
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Enter OTP</label>
                    <input
                      id="forgot-otp-input"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white text-center tracking-widest font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                    <input
                      id="forgot-new-password"
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                  <button
                    id="btn-forgot-step2"
                    type="submit"
                    className="w-full py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm"
                  >
                    {lang === 'en' ? 'Verify & Reset' : 'ওটিপি যাচাই করুন'}
                  </button>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  id="link-signin-tab"
                  onClick={() => { setActiveTab('signin'); setForgotStep(1); }}
                  className="text-xs text-gray-500 hover:underline"
                >
                  {lang === 'en' ? 'Back to Sign In' : 'লগ-ইন পেজে ফিরে যান'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'findid' && (
            <form id="findid-form" onSubmit={handleFindId} className="space-y-4 py-4">
              <h3 className="text-sm font-bold text-[#1A1A2E]">
                {t.findUserId}
              </h3>
              <p className="text-xs text-gray-600">
                {lang === 'en' ? 'Enter WhatsApp Number to find your system registered User ID:' : 'আপনার নিবন্ধিত ইউজার আইডি দেখতে হোয়াটসঅ্যাপ নম্বরটি দিন:'}
              </p>
              <input
                id="findid-whatsapp-input"
                type="tel"
                required
                value={findIdInput}
                onChange={(e) => setFindIdInput(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full p-2 text-sm rounded-lg border border-gray-200 bg-white"
              />
              <button
                id="btn-findid-submit"
                type="submit"
                className="w-full py-2 bg-teal-500 text-white rounded-lg font-bold text-sm"
              >
                {lang === 'en' ? 'Lookup Account' : 'খুঁজুন'}
              </button>

              {foundMaskedId && (
                <div id="findid-result" className="bg-orange-50 text-orange-900 p-3 rounded-lg text-center font-mono text-xs border border-orange-100">
                  <span className="font-sans block text-[10px] text-gray-500 mb-1">
                    {lang === 'en' ? 'Masked Registered Email Found:' : 'নিবন্ধিত ইমেল পাওয়া গেছে:'}
                  </span>
                  <strong>{foundMaskedId}</strong>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  id="link-signin-tab-2"
                  onClick={() => { setActiveTab('signin'); setFoundMaskedId(''); }}
                  className="text-xs text-gray-500 hover:underline"
                >
                  {lang === 'en' ? 'Back to Sign In' : 'লগ-ইন পেজে ফিরে যান'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
