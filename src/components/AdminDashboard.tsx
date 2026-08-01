import React, { useState, useRef, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Project, BlogArticle, ResearchPaper } from '../types';
import { apiRequest } from '../lib/api';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  User, 
  Upload, 
  Save, 
  Check, 
  Inbox, 
  Layers, 
  BookOpen, 
  Activity, 
  RefreshCw, 
  CheckCircle,
  FileText,
  Mail,
  Camera,
  Key,
  AlertCircle,
  LogOut,
  PanelBottom,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  darkMode?: boolean;
  onBackToSite?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ darkMode = false, onBackToSite }) => {
  const { 
    profile, 
    projects, 
    articles, 
    researchPapers, 
    contactMessages, 
    systemServices,
    footerConfig,
    adminPasskey,
    updateAdminPasskey,
    updateFooterConfig,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addArticle,
    updateArticle,
    deleteArticle,
    addResearchPaper,
    updateResearchPaper,
    deleteResearchPaper,
    markMessageAsRead,
    deleteContactMessage,
    resetToDefaults
  } = useSite();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('habib_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [newPasskey, setNewPasskey] = useState<string>('');
  const [passkeySuccessMsg, setPasskeySuccessMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'articles' | 'inbox' | 'research' | 'telemetry' | 'footer'>('profile');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Footer Form State
  const [footerForm, setFooterForm] = useState(footerConfig);
  const [newFooterTag, setNewFooterTag] = useState<string>('');
  const footerFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFooterForm(footerConfig);
  }, [footerConfig]);

  const handleFooterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const updated = { ...footerForm, footerPhotoUrl: result };
        setFooterForm(updated);
        updateFooterConfig(updated);
        showToast('Footer photo uploaded and applied live!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Project Modal / Edit State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);

  // Article Modal / Edit State
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [isNewArticle, setIsNewArticle] = useState<boolean>(false);

  // Research Modal / Edit State
  const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null);
  const [isNewPaper, setIsNewPaper] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveFooter = () => {
    updateFooterConfig(footerForm);
    showToast('Footer settings saved successfully and updated live across the portfolio.');
  };

  const handleAddFooterTag = () => {
    const trimmed = newFooterTag.trim();
    if (trimmed && !footerForm.specializationTags.includes(trimmed)) {
      setFooterForm({
        ...footerForm,
        specializationTags: [...footerForm.specializationTags, trimmed]
      });
      setNewFooterTag('');
    }
  };

  const handleRemoveFooterTag = (tagToRemove: string) => {
    setFooterForm({
      ...footerForm,
      specializationTags: footerForm.specializationTags.filter(t => t !== tagToRemove)
    });
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const entered = passcode.trim();
    if (entered && entered === adminPasskey) {
      setIsAuthenticated(true);
      sessionStorage.setItem('habib_admin_auth', 'true');
      setPasscode('');
    } else {
      setAuthError('Access Denied: Incorrect Admin Security Key.');
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('habib_admin_auth');
    setPasscode('');
    setAuthError(null);
  };

  const handleUpdatePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskey.trim()) return;
    try {
      await apiRequest('/api/admin/passkey', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey,
        },
        body: JSON.stringify({ passkey: newPasskey.trim() }),
      });
      updateAdminPasskey(newPasskey.trim());
      setPasskeySuccessMsg('Admin Security Passkey updated successfully!');
      setNewPasskey('');
      setTimeout(() => setPasskeySuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to update passkey:', err);
      setPasskeySuccessMsg('Failed to update passkey.');
    }
  };

  // Handle Photo File Upload via Cloudinary
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiRequest("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-passkey": adminPasskey,
        },
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;

      if (res.ok && data?.url) {
        setProfileForm(prev => ({ ...prev, photoUrl: data.url }));
        showToast("Profile photo uploaded to Cloudinary successfully!");
      } else {
        showToast(data?.error || "Upload API is unavailable. Deploy and connect the Express backend before uploading images.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Error uploading photo.");
    }
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    showToast('Profile information and photo updated successfully!');
  };

  if (!isAuthenticated) {
    return (
      <section id="admin" className={`px-4 py-32 min-h-[70vh] flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-[#0b0c0e] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'
      }`}>
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl text-center space-y-5 ${
          darkMode ? 'bg-[#151619] border-white/20' : 'bg-white border-gray-200'
        }`}>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase">Restricted Area</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Admin Management Portal</h2>
            <p className={`text-xs font-mono leading-relaxed max-w-xs mx-auto ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
              This console is restricted exclusively to Habib. Enter passkey to unlock administrative features.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-mono flex items-center justify-center space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-3 pt-1">
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter Admin Passkey..."
                className={`w-full px-4 py-3 rounded-xl border text-xs text-center font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-200 text-[#1d1d1f] placeholder-gray-400'
                }`}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0066cc] text-white font-semibold text-xs hover:bg-[#0077ed] transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>Authenticate & Unlock</span>
            </button>
          </form>

          <p className={`text-[10px] font-mono ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
            Protected by end-to-end local session key verification.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className={`py-24 transition-colors duration-300 border-b ${
      darkMode ? 'bg-[#0b0c0e] text-white border-white/10' : 'bg-[#f5f5f7] text-[#1d1d1f] border-gray-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-4 ${
          darkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-semibold tracking-tight">Management Operations Center</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                Full CRUD Content Management for Habib’s Systems Portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all portfolio data to default state?')) {
                  resetToDefaults();
                  setProfileForm({ ...profile });
                  showToast('Portfolio data reset to default settings.');
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
              title="Reset state to initial mock defaults"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={onBackToSite || handleLock}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                darkMode ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              }`}
              title={onBackToSite ? "Back to Site" : "Lock Console & Exit"}
            >
              {onBackToSite ? <ArrowRight className="w-3.5 h-3.5 rotate-180" /> : <LogOut className="w-3.5 h-3.5" />}
              <span>{onBackToSite ? 'Back to Site' : 'Lock Console'}</span>
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center space-x-2 shadow-sm animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className={`mt-8 flex overflow-x-auto no-scrollbar whitespace-nowrap gap-2 border-b pb-4 ${
          darkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'profile' 
                ? 'bg-[#0066cc] text-white font-bold shadow-sm' 
                : darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'projects' 
                ? 'bg-[#0066cc] text-white font-bold shadow-sm' 
                : darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'articles' 
                ? 'bg-[#0066cc] text-white font-bold shadow-sm' 
                : darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all relative ${
              activeTab === 'inbox' 
                ? 'bg-[#0066cc] text-white font-bold shadow-sm' 
                : darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Contact Messages ({contactMessages.length})</span>
            {contactMessages.some(m => !m.read) && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'research' 
                ? 'bg-[#0066cc] text-white font-bold shadow-sm' 
                : darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Research ({researchPapers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'telemetry' 
                ? 'bg-[#0066cc] text-white font-bold shadow-sm' 
                : darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry Status</span>
          </button>

          <button
            onClick={() => setActiveTab('footer')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'footer' 
                ? 'bg-[#0066cc] text-white font-bold shadow-sm' 
                : darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-gray-100'
            }`}
          >
            <PanelBottom className="w-3.5 h-3.5" />
            <span>Footer Settings</span>
          </button>
        </div>

        {/* Tab 1: Profile & Photo Editor */}
        {activeTab === 'profile' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Live Preview & Photo Uploader */}
            <div className={`p-6 rounded-3xl border space-y-6 ${
              darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase">
                Profile Photo & Preview
              </h3>

              {/* Avatar Preview */}
              <div className="flex flex-col items-center space-y-3">
                <div className={`relative w-36 h-36 rounded-full overflow-hidden p-1 shadow-2xl transition-all ${
                  darkMode ? 'bg-gradient-to-tr from-blue-600 to-amber-500 ring-4 ring-white/15' : 'bg-white ring-4 ring-blue-500/20 shadow-gray-300'
                }`}>
                  <img
                    src={profileForm.photoUrl}
                    alt={profileForm.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-mono"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span>Change Photo</span>
                  </button>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-base">{profileForm.name}</h4>
                  <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    {profileForm.role}
                  </p>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-white/10">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-[#0066cc] text-white font-medium text-xs hover:bg-[#0077ed] transition-all flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Local Image File</span>
                </button>

                <div className="space-y-1">
                  <label className={`text-[11px] font-mono block ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    Image Web URL:
                  </label>
                  <input
                    type="url"
                    value={profileForm.photoUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Profile Text Fields */}
            <form onSubmit={handleSaveProfile} className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 ${
              darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-bold font-mono tracking-wider uppercase">
                  Profile Details & Slogans
                </h3>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0066cc] text-white font-semibold text-xs hover:bg-[#0077ed] transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Title / Primary Role</label>
                  <input
                    type="text"
                    required
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Hero Slogan / Headline</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Bio / Systems Focus Summary</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Contact Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Phone (Optional)</label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-xs font-mono flex items-center space-x-1.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    <span>GitHub Profile URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username"
                    value={profileForm.githubUrl || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-mono flex items-center space-x-1.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    <span>LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/your-username"
                    value={profileForm.linkedinUrl || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-mono flex items-center space-x-1.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    <span>Medium Profile / Publication URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://medium.com/@your-username"
                    value={profileForm.mediumUrl || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, mediumUrl: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-mono flex items-center space-x-1.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    <span>Twitter / X Profile URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://x.com/your-username"
                    value={profileForm.twitterUrl || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, twitterUrl: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Response SLA</label>
                <input
                  type="text"
                  value={profileForm.responseSla}
                  onChange={(e) => setProfileForm({ ...profileForm, responseSla: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0066cc] text-white font-semibold text-xs hover:bg-[#0077ed] transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile & Apply Site-Wide</span>
                </button>
              </div>
            </form>

            {/* Security Passkey Management Card */}
            <div className={`p-6 rounded-2xl border space-y-5 ${
              darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold">Admin Security Passkey</h4>
                  <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    Update the secret passkey used to unlock this administrative console.
                  </p>
                </div>
              </div>

              {passkeySuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-mono flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{passkeySuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePasskey} className="flex flex-col sm:flex-row gap-3 pt-1">
                <input
                  type="password"
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  placeholder="Enter new secret passkey..."
                  className={`flex-1 h-11 px-3.5 rounded-xl text-xs font-mono border focus:outline-none ${
                    darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                  }`}
                  required
                />
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-all shadow-sm flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Lock className="w-4 h-4" />
                  <span>Save New Passkey</span>
                </button>
              </form>

              <button
                onClick={handleLock}
                className={`w-full py-2.5 rounded-xl border text-xs font-mono font-semibold transition-all flex items-center justify-center space-x-2 ${
                  darkMode ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Projects Management */}
        {activeTab === 'projects' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Projects Catalog</h3>
                <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                  Manage system case studies, architecture diagrams, and metrics.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProject({
                    id: `proj-${Date.now()}`,
                    title: 'New Architecture Project',
                    subtitle: 'High Throughput Service',
                    tagline: 'Distributed microservice pipeline',
                    summary: 'Engineered an end-to-end distributed system...',
                    architectureOverview: 'Client -> Nginx Load Balancer -> Express -> Redis -> DB',
                    category: 'RAG & AI',
                    techStack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
                    metrics: [
                      { label: 'Throughput', value: '10k QPS', change: 'Zero degradation' },
                      { label: 'Latency', value: '< 2ms', change: 'Redis L2 Cache' }
                    ],
                    keyHighlights: ['Designed resilient queue failover mechanics.'],
                    diagram: {
                      nodes: [
                        { id: 'client', label: 'Client API', type: 'client', status: 'active' },
                        { id: 'express', label: 'Express Node', type: 'service', status: 'active' }
                      ],
                      links: [
                        { from: 'client', to: 'express', label: 'HTTPS' }
                      ]
                    },
                    codeSnippet: {
                      language: 'typescript',
                      filename: 'service.ts',
                      code: '// TypeScript microservice'
                    }
                  });
                  setIsNewProject(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#0066cc] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className={`p-5 rounded-2xl border space-y-3 ${
                  darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {proj.category}
                      </span>
                      <h4 className="font-bold text-sm mt-1">{proj.title}</h4>
                      <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>{proj.subtitle}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsNewProject(false);
                        }}
                        className={`p-2 rounded-lg border transition-all ${
                          darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete project "${proj.title}"?`)) {
                            deleteProject(proj.id);
                            showToast('Project deleted successfully.');
                          }
                        }}
                        className={`p-2 rounded-lg border transition-all text-red-500 ${
                          darkMode ? 'bg-white/5 border-white/10 hover:bg-red-500/20' : 'bg-gray-100 border-gray-200 hover:bg-red-50'
                        }`}
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-[#424245]'}`}>
                    {proj.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        darkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Articles CMS Management */}
        {activeTab === 'articles' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Blog & Technical Articles</h3>
                <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                  Publish or update engineering articles and deep-dive guides.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingArticle({
                    id: `art-${Date.now()}`,
                    title: 'New Engineering Guide',
                    slug: 'new-engineering-guide',
                    excerpt: 'Deep-dive technical overview of microservices scalability...',
                    content: '### Overview\n\nDetailed breakdown of architectural decisions...',
                    category: 'RAG Architecture',
                    readTime: '6 min read',
                    publishedAt: 'Today',
                    author: {
                      name: profile.name,
                      role: profile.role,
                      avatar: profile.photoUrl
                    },
                    tags: ['Node.js', 'Express', 'Architecture'],
                    views: 0
                  });
                  setIsNewArticle(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#0066cc] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Article</span>
              </button>
            </div>

            <div className="space-y-3">
              {articles.map((art) => (
                <div key={art.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {art.category}
                      </span>
                      <span className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                        {art.publishedAt} • {art.readTime}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm">{art.title}</h4>
                    <p className={`text-xs line-clamp-1 ${darkMode ? 'text-slate-300' : 'text-[#424245]'}`}>
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingArticle(art);
                        setIsNewArticle(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center space-x-1 ${
                        darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete article "${art.title}"?`)) {
                          deleteArticle(art.id);
                          showToast('Article deleted.');
                        }
                      }}
                      className={`p-2 rounded-lg border transition-all text-red-500 ${
                        darkMode ? 'bg-white/5 border-white/10 hover:bg-red-500/20' : 'bg-gray-100 border-gray-200 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Contact Messages Inbox */}
        {activeTab === 'inbox' && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold">Contact Form Messages & Leads</h3>
              <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                Inbound requests transmitted via Habib’s Contact Section.
              </p>
            </div>

            {contactMessages.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border font-mono text-xs ${
                darkMode ? 'bg-[#151619] border-white/10 text-slate-400' : 'bg-white border-gray-200 text-[#86868b]'
              }`}>
                No inbound contact messages in inbox.
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((msg) => (
                  <div key={msg.id} className={`p-6 rounded-2xl border space-y-3 transition-colors ${
                    !msg.read
                      ? darkMode ? 'bg-blue-950/30 border-blue-500/30' : 'bg-blue-50/80 border-blue-200'
                      : darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-white/10">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm">{msg.name}</h4>
                          <span className="text-xs text-[#0066cc] font-mono">&lt;{msg.email}&gt;</span>
                          {msg.company && (
                            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>at {msg.company}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Scope: {msg.projectType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className={darkMode ? 'text-slate-400' : 'text-[#86868b]'}>{msg.timestamp}</span>
                        {!msg.read && (
                          <button
                            onClick={() => markMessageAsRead(msg.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteContactMessage(msg.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed font-sans ${darkMode ? 'text-slate-200' : 'text-[#1d1d1f]'}`}>
                      "{msg.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Research Papers */}
        {activeTab === 'research' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Research Papers & Whitepapers</h3>
                <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                  Manage systems evaluation research and benchmark datasets.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {researchPapers.map((paper) => (
                <div key={paper.id} className={`p-5 rounded-2xl border space-y-2 ${
                  darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {paper.category}
                    </span>
                    <span className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                      {paper.publishedDate}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm">{paper.title}</h4>
                  <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-[#424245]'}`}>{paper.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Telemetry Status */}
        {activeTab === 'telemetry' && (
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-bold">Live Microservice Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemServices.map((svc) => (
                <div key={svc.name} className={`p-5 rounded-2xl border space-y-2 font-mono ${
                  darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{svc.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {svc.status.toUpperCase()}
                    </span>
                  </div>
                  <p className={`text-[11px] font-sans ${darkMode ? 'text-slate-300' : 'text-[#424245]'}`}>{svc.detail}</p>
                  <div className={`flex items-center justify-between text-[10px] pt-2 border-t ${
                    darkMode ? 'border-white/5 text-slate-400' : 'border-gray-100 text-[#86868b]'
                  }`}>
                    <span>Avg Latency: <strong>{svc.latency}</strong></span>
                    <span>Uptime: <strong className="text-emerald-600 dark:text-emerald-400">{svc.uptime}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Footer Management */}
        {activeTab === 'footer' && (
          <div className="mt-8 space-y-8">
            <div className={`p-6 rounded-3xl border space-y-6 ${
              darkMode ? 'bg-[#151619] border-white/10' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                    <PanelBottom className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Footer Configuration & Layout</h3>
                    <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                      Customize global footer tagline, system operational status badge, section visibility, and specialization tags.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveFooter}
                  className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0066cc] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all shadow-md shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Footer Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Footer Profile Photo Section */}
                <div className="md:col-span-2 p-5 rounded-2xl border space-y-4 bg-blue-500/5 border-blue-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative shrink-0">
                        <img
                          src={footerForm.footerPhotoUrl || profileForm.photoUrl || profile.photoUrl}
                          alt="Footer Avatar Preview"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/50 shadow-md bg-gray-200"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#151619]" title="Live Footer Avatar Status" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500">
                            Footer Profile Photo
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                            footerForm.footerPhotoUrl 
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-500' 
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                          }`}>
                            {footerForm.footerPhotoUrl ? 'Custom Footer Photo Active' : 'Using Main Profile Photo'}
                          </span>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Upload a custom photo for the footer or fallback to your primary profile photo.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={footerFileInputRef}
                        onChange={handleFooterPhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => footerFileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[#0066cc] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all shadow-sm flex items-center space-x-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Custom Footer Photo</span>
                      </button>

                      {footerForm.footerPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...footerForm, footerPhotoUrl: "" };
                            setFooterForm(updated);
                            updateFooterConfig(updated);
                            showToast('Footer photo reset to main profile photo.');
                          }}
                          className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                            darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                          title="Reset to main profile photo"
                        >
                          Reset to Main Photo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <label className={`flex items-center space-x-2.5 cursor-pointer text-xs font-medium ${
                      darkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      <input
                        type="checkbox"
                        checked={footerForm.showFooterPhoto !== false}
                        onChange={(e) => {
                          const updated = { ...footerForm, showFooterPhoto: e.target.checked };
                          setFooterForm(updated);
                          updateFooterConfig(updated);
                        }}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span>Display Profile Photo in Footer Brand Column</span>
                    </label>

                    <input
                      type="text"
                      value={footerForm.footerPhotoUrl || ''}
                      onChange={(e) => {
                        const updated = { ...footerForm, footerPhotoUrl: e.target.value };
                        setFooterForm(updated);
                        updateFooterConfig(updated);
                      }}
                      placeholder="Or paste photo URL (https://...)"
                      className={`w-full sm:w-1/2 max-w-xs px-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none ${
                        darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-800'
                      }`}
                    />
                  </div>
                </div>

                {/* Footer Tagline / Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className={`text-xs font-mono font-medium ${darkMode ? 'text-slate-300' : 'text-[#1d1d1f]'}`}>
                    Footer Tagline / Bio Summary
                  </label>
                  <textarea
                    rows={2}
                    value={footerForm.tagline}
                    onChange={(e) => setFooterForm({ ...footerForm, tagline: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                    placeholder="Footer overview description..."
                  />
                </div>

                {/* Copyright Notice */}
                <div className="space-y-2">
                  <label className={`text-xs font-mono font-medium ${darkMode ? 'text-slate-300' : 'text-[#1d1d1f]'}`}>
                    Copyright Line Notice
                  </label>
                  <input
                    type="text"
                    value={footerForm.copyrightText}
                    onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                    }`}
                  />
                </div>

                {/* System Status Text & State */}
                <div className="space-y-2">
                  <label className={`text-xs font-mono font-medium ${darkMode ? 'text-slate-300' : 'text-[#1d1d1f]'}`}>
                    System Operational Status Badge
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={footerForm.systemStatusState}
                      onChange={(e) => setFooterForm({ ...footerForm, systemStatusState: e.target.value as any })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-mono border focus:outline-none ${
                        darkMode ? 'bg-[#1e2025] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                      }`}
                    >
                      <option value="operational">Operational (Green)</option>
                      <option value="degraded">Degraded (Amber)</option>
                      <option value="maintenance">Maintenance (Rose)</option>
                    </select>
                    <input
                      type="text"
                      value={footerForm.systemStatusText}
                      onChange={(e) => setFooterForm({ ...footerForm, systemStatusText: e.target.value })}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                        darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-[#1d1d1f]'
                      }`}
                      placeholder="All Systems Operational"
                    />
                  </div>
                </div>

                {/* Visibility Toggles */}
                <div className="space-y-3 md:col-span-2 pt-2 border-t border-gray-200 dark:border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500">
                    Footer Section Display Controls
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      footerForm.showNavLinks 
                        ? darkMode ? 'bg-blue-500/10 border-blue-500/40 text-white' : 'bg-blue-50 border-blue-200 text-blue-900'
                        : darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      <input
                        type="checkbox"
                        checked={footerForm.showNavLinks}
                        onChange={(e) => setFooterForm({ ...footerForm, showNavLinks: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-xs font-medium">Show Navigation Links</span>
                    </label>

                    <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      footerForm.showOpsLinks 
                        ? darkMode ? 'bg-blue-500/10 border-blue-500/40 text-white' : 'bg-blue-50 border-blue-200 text-blue-900'
                        : darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      <input
                        type="checkbox"
                        checked={footerForm.showOpsLinks}
                        onChange={(e) => setFooterForm({ ...footerForm, showOpsLinks: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-xs font-medium">Show Management Links</span>
                    </label>

                    <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      footerForm.showSpecializationTags 
                        ? darkMode ? 'bg-blue-500/10 border-blue-500/40 text-white' : 'bg-blue-50 border-blue-200 text-blue-900'
                        : darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      <input
                        type="checkbox"
                        checked={footerForm.showSpecializationTags}
                        onChange={(e) => setFooterForm({ ...footerForm, showSpecializationTags: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-xs font-medium">Show Specialization Tags</span>
                    </label>
                  </div>
                </div>

                {/* Specialization Stack Manager */}
                <div className="space-y-3 md:col-span-2 pt-2 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500">
                      Specialization Tech Stack Tags ({footerForm.specializationTags.length})
                    </h4>
                    <span className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      Click tag '✕' to remove or add a new tag below
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 max-h-48 overflow-y-auto">
                    {footerForm.specializationTags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                          darkMode ? 'bg-white/10 border-white/10 text-slate-200 hover:border-red-500/50' : 'bg-white border-gray-200 text-gray-800 hover:border-red-300'
                        }`}
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFooterTag(tag)}
                          className="text-gray-400 hover:text-red-500 ml-1 font-bold"
                          title="Remove Tag"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFooterTag}
                      onChange={(e) => setNewFooterTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFooterTag();
                        }
                      }}
                      placeholder="Add new technology tag (e.g. Next.js, GraphQL)..."
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none ${
                        darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-[#1d1d1f]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddFooterTag}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all flex items-center space-x-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tag</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Editing Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-4 my-8 ${
            darkMode ? 'bg-[#151619] border-white/20 text-white' : 'bg-white border-gray-200 text-[#1d1d1f]'
          }`}>
            <h3 className="text-base font-bold font-mono">
              {isNewProject ? 'Add New Architecture Project' : 'Edit Project Details'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono">Project Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono">Subtitle</label>
                <input
                  type="text"
                  value={editingProject.subtitle}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono">Summary</label>
              <textarea
                rows={3}
                value={editingProject.summary}
                onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={editingProject.techStack.join(', ')}
                onChange={(e) => setEditingProject({ ...editingProject, techStack: e.target.value.split(',').map(s => s.trim()) })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono border"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewProject) {
                    addProject(editingProject);
                    showToast('New project created!');
                  } else {
                    updateProject(editingProject.id, editingProject);
                    showToast('Project updated!');
                  }
                  setEditingProject(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0066cc] text-white font-semibold text-xs hover:bg-[#0077ed]"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-4 my-8 ${
            darkMode ? 'bg-[#151619] border-white/20 text-white' : 'bg-white border-gray-200 text-[#1d1d1f]'
          }`}>
            <h3 className="text-base font-bold font-mono">
              {isNewArticle ? 'Publish New Article' : 'Edit Article'}
            </h3>

            <div className="space-y-1">
              <label className="text-[11px] font-mono">Article Title</label>
              <input
                type="text"
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono">Excerpt</label>
              <textarea
                rows={2}
                value={editingArticle.excerpt}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono">Article Content (Markdown)</label>
              <textarea
                rows={6}
                value={editingArticle.content}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                  darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono border"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewArticle) {
                    addArticle(editingArticle);
                    showToast('Article published!');
                  } else {
                    updateArticle(editingArticle.id, editingArticle);
                    showToast('Article saved!');
                  }
                  setEditingArticle(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0066cc] text-white font-semibold text-xs hover:bg-[#0077ed]"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
