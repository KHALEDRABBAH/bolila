'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatPanel from '@/components/ChatPanel';
import TestimonialForm from '@/components/TestimonialForm';
import PhoneInput from '@/components/PhoneInput';
import { 
  FileText, Clock, CheckCircle, XCircle, Eye, 
  Plus, LogOut, User, AlertCircle, Loader2 
} from 'lucide-react';

interface Application {
  id: string;
  referenceCode: string;
  status: string;
  createdAt: string;
  service: { key: string };
  documents: { id: string; type: string; fileName: string }[];
  payment: { status: string; amount: number } | null;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}

export default function Dashboard() {
  const t = useTranslations('apply');
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', country: '', city: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check auth
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) { router.push(`/${locale}/login`); return; }
        const meData = await meRes.json();
        setUser(meData.user);
        setEditForm({
          phone: meData.user.phone || '',
          country: meData.user.country || '',
          city: meData.user.city || '',
        });

        // Redirect admin to admin dashboard
        if (meData.user.role === 'ADMIN') { router.push(`/${locale}/admin`); return; }

        // Load applications
        const appsRes = await fetch('/api/applications');
        const appsData = await appsRes.json();
        if (appsRes.ok) setApplications(appsData.applications);
      } catch {
        router.push(`/${locale}/login`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [locale, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/login`);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: Connect to /api/auth/profile when backend is ready
    // Mocking the success for frontend
    setTimeout(() => {
      setUser(prev => prev ? { ...prev, ...editForm } : prev);
      setIsEditingProfile(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingAvatar(true);
    // TODO: Connect to /api/auth/avatar when backend is ready
    // Mocking success
    setTimeout(() => {
      setIsUploadingAvatar(false);
    }, 1000);
  };

  const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    DRAFT: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100' },
    SUBMITTED: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    UNDER_REVIEW: { icon: Eye, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    APPROVED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    REJECTED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  };

  const serviceLabels: Record<string, string> = {
    study: '🎓 Study Connection',
    internship: '💼 Internship Connection',
    scholarship: '🏆 Scholarship Connection',
    sabbatical: '✈️ Sabbatical Vacation',
    employment: '🔧 Employment Connection',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

          {/* Welcome header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">
                {user ? `${user.firstName} ${user.lastName}` : 'Dashboard'}
              </h1>
              <p className="text-gray-500 mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/apply" className="btn-primary text-sm">
                <Plus className="w-4 h-4 me-2" /> {t('title')}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                <LogOut className="w-4 h-4 me-2" /> Logout
              </button>
            </div>
          </div>

          {/* Profile card */}
          {user && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] z-0 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 border-b pb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {isUploadingAvatar ? (
                        <Loader2 className="w-6 h-6 animate-spin text-gold" />
                      ) : (
                        <span className="group-hover:hidden">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleAvatarSelect} />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-xl text-primary">{user.firstName} {user.lastName}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
                  <TestimonialForm />
                  {!isEditingProfile && (
                    <button onClick={() => setIsEditingProfile(true)} className="text-sm font-medium text-gold hover:text-gold/80 transition-colors bg-gold/10 px-3 py-1.5 rounded-lg">
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="col-span-full md:col-span-1">
                      <label className="text-gray-500 block mb-1">Phone</label>
                      <PhoneInput 
                        value={editForm.phone} 
                        onChange={val => setEditForm({ ...editForm, phone: val })} 
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Country</label>
                      <input 
                        type="text" 
                        value={editForm.country} 
                        onChange={e => setEditForm({ ...editForm, country: e.target.value })} 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-gold" 
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">City</label>
                      <input 
                        type="text" 
                        value={editForm.city} 
                        onChange={e => setEditForm({ ...editForm, city: e.target.value })} 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-gold" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-end pt-2">
                    <button onClick={() => setIsEditingProfile(false)} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50">
                      Cancel
                    </button>
                    <button onClick={handleSaveProfile} disabled={isSaving} className="btn-primary py-2 px-6 text-sm disabled:opacity-50">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div><span className="text-gray-400 block mb-1">Phone</span><span className="font-medium text-primary">{user.phone}</span></div>
                  <div><span className="text-gray-400 block mb-1">Country</span><span className="font-medium text-primary">{user.country}</span></div>
                  <div><span className="text-gray-400 block mb-1">City</span><span className="font-medium text-primary">{user.city}</span></div>
                </div>
              )}
            </div>
          )}

          {/* Applications */}
          <div>
            <h2 className="font-heading font-semibold text-xl text-primary mb-4">
              My Applications ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-primary mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">Start your international journey by applying for one of our services.</p>
                <Link href="/apply" className="btn-primary">
                  <Plus className="w-4 h-4 me-2" /> Apply Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map(app => {
                  const config = statusConfig[app.status] || statusConfig.DRAFT;
                  const StatusIcon = config.icon;
                  return (
                    <div key={app.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-gold">{app.referenceCode}</span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {app.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-700 font-medium">{serviceLabels[app.service.key] || app.service.key}</p>
                          <p className="text-gray-400 text-sm mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">
                            {app.documents.length}/4 documents
                          </div>
                          <div className="text-sm">
                            {app.payment ? (
                              <span className={app.payment.status === 'SUCCEEDED' ? 'text-green-600' : 'text-yellow-600'}>
                                ${Number(app.payment.amount)} — {app.payment.status}
                              </span>
                            ) : (
                              <span className="text-gray-400">No payment</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <ChatPanel />
        </div>
      </div>
      <Footer />
    </div>
  );
}
