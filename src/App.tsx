import React, { useState, useEffect } from 'react';
import { ScreenLogin } from './components/ScreenLogin';
import { ScreenRegister } from './components/ScreenRegister';
import { ScreenVerifyStudent } from './components/ScreenVerifyStudent';
import { ScreenVerifiedProfile } from './components/ScreenVerifiedProfile';
import { PhoneFrame } from './components/PhoneFrame';
import { SyncControlPanel } from './components/SyncControlPanel';
import { SyncService } from './services/syncService';
import { AppSyncData, ScreenId, ViewMode, UserProfile, VerificationData, RideShareItem } from './types';
import { INITIAL_SYNC_DATA, SAMPLE_STUDENT_CARD_IMAGE } from './data/mockData';
import { ArrowRight, CheckCircle2, Smartphone, ShieldCheck } from 'lucide-react';

export default function App() {
  const [syncData, setSyncData] = useState<AppSyncData>(INITIAL_SYNC_DATA);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('login');
  const [viewMode, setViewMode] = useState<ViewMode>('interactive');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Initialize and subscribe to sync service
  useEffect(() => {
    // Initial local read
    const local = SyncService.getLocalData();
    setSyncData(local);

    // Subscribe to changes
    const unsubscribe = SyncService.subscribe((data, syncing) => {
      setSyncData(data);
      setIsSyncing(syncing);
    });

    // Pull latest data from server
    SyncService.pullFromServer().catch((e) => console.log('Initial sync error', e));

    return () => unsubscribe();
  }, []);

  const showToast = (message: string) => {
    setSyncToast(message);
    setTimeout(() => {
      setSyncToast(null);
    }, 3000);
  };

  // Login handler
  const handleLogin = async (userLogin: Partial<UserProfile>) => {
    const phone = userLogin.phone || '0912 345 678';
    let user = syncData.users.find((u) => u.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));

    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        fullName: 'Nguyễn Văn A',
        phone,
        bio: 'Sinh viên ĐH Quốc Tế - ĐHQG TP.HCM',
        university: 'Đại học Bách Khoa - ĐHQG TP.HCM',
        studentId: '21127089',
        studentCardImage: SAMPLE_STUDENT_CARD_IMAGE,
        isVerified: true,
        verificationStatus: 'verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const updatedData: Partial<AppSyncData> = {
      currentUser: user,
      users: syncData.users.some((u) => u.id === user?.id)
        ? syncData.users
        : [...syncData.users, user],
    };

    await SyncService.pushToServer(updatedData);
    showToast(`Đăng nhập thành công! Đã đồng bộ tài khoản.`);

    if (user.isVerified) {
      setActiveScreen('verified-profile');
    } else {
      setActiveScreen('verify');
    }
  };

  // Register handler
  const handleRegister = async (regData: { fullName: string; phone: string; bio: string }) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: regData.fullName,
      phone: regData.phone,
      bio: regData.bio,
      university: 'Đại học Bách Khoa - ĐHQG TP.HCM',
      studentId: '',
      studentCardImage: undefined,
      isVerified: false,
      verificationStatus: 'unverified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUsers = [...syncData.users.filter((u) => u.phone !== regData.phone), newUser];

    await SyncService.pushToServer({
      currentUser: newUser,
      users: updatedUsers,
    });

    showToast(`Tạo tài khoản thành công! Bước tiếp: Xác thực sinh viên`);
    setActiveScreen('verify');
  };

  // Student verification handler
  const handleVerifyStudent = async (verification: VerificationData) => {
    const currentUser = syncData.currentUser || {
      id: `user-${Date.now()}`,
      fullName: 'Nguyễn Văn A',
      phone: '0912 345 678',
      bio: 'Sinh viên ĐH Bách Khoa',
      isVerified: true,
      verificationStatus: 'verified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUser: UserProfile = {
      ...currentUser,
      university: verification.university,
      studentId: verification.studentId,
      studentCardImage: verification.cardImage || undefined,
      isVerified: true,
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUsers = syncData.users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    if (!updatedUsers.some((u) => u.id === updatedUser.id)) {
      updatedUsers.push(updatedUser);
    }

    await SyncService.pushToServer({
      currentUser: updatedUser,
      users: updatedUsers,
      verification,
    });

    showToast(`Xác thực thành công! Dữ liệu đã đồng bộ lên hệ thống Cogo.`);
    setActiveScreen('verified-profile');
  };

  // Reset to default sample
  const handleReset = async () => {
    if (window.confirm('Khôi phục lại dữ liệu mẫu gốc ban đầu?')) {
      const fresh = await SyncService.resetToDefaults();
      setSyncData(fresh);
      setActiveScreen('login');
      showToast('Đã khôi phục dữ liệu mẫu gốc ban đầu.');
    }
  };

  // Add new ride
  const handleAddRide = async (ride: Partial<RideShareItem>) => {
    const newRideItem = ride as RideShareItem;
    const updatedRides = [newRideItem, ...syncData.rides];
    await SyncService.pushToServer({ rides: updatedRides });
    showToast('Đã đăng chuyến đi mới & đồng bộ cho các bạn cùng trường!');
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] text-slate-800 flex flex-col font-sans">
      {/* Top Sync Control Header */}
      <SyncControlPanel
        syncData={syncData}
        isSyncing={isSyncing}
        viewMode={viewMode}
        onViewModeChange={(m) => setViewMode(m)}
        onManualSync={() => {
          SyncService.pullFromServer();
          showToast('Đang đồng bộ lại với máy chủ...');
        }}
        onResetData={handleReset}
        onImportData={(imported) => {
          SyncService.saveLocalData(imported);
          SyncService.pushToServer(imported);
          showToast('Đã nhập dữ liệu đồng bộ thành công!');
        }}
      />

      {/* Sync toast */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0e5c3a] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#A7F3D0]" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        {viewMode === 'interactive' ? (
          /* Interactive Phone View Mode */
          <div className="w-full flex flex-col items-center space-y-5">
            {/* Step switcher tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveScreen('login')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeScreen === 'login'
                    ? 'bg-[#0e5c3a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen('register')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeScreen === 'register'
                    ? 'bg-[#0e5c3a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Đăng ký tài khoản
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen('verify')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeScreen === 'verify'
                    ? 'bg-[#0e5c3a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Xác thực sinh viên
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen('verified-profile')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  activeScreen === 'verified-profile'
                    ? 'bg-[#0e5c3a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>4. Đã xác thực</span>
              </button>
            </div>

            {/* Smartphone Simulation Frame */}
            <PhoneFrame>
              {activeScreen === 'login' && (
                <ScreenLogin
                  onNavigateToRegister={() => setActiveScreen('register')}
                  onLoginSuccess={handleLogin}
                  initialPhone={syncData.currentUser?.phone || '0912 345 678'}
                />
              )}

              {activeScreen === 'register' && (
                <ScreenRegister
                  onNavigateToLogin={() => setActiveScreen('login')}
                  onRegisterSuccess={handleRegister}
                  currentUser={syncData.currentUser}
                />
              )}

              {activeScreen === 'verify' && (
                <ScreenVerifyStudent
                  onBack={() => setActiveScreen('register')}
                  onSubmitVerification={handleVerifyStudent}
                  initialData={syncData.verification}
                />
              )}

              {activeScreen === 'verified-profile' && (
                <ScreenVerifiedProfile
                  user={
                    syncData.currentUser || {
                      id: 'user-001',
                      fullName: 'Nguyễn Văn A',
                      phone: '0912 345 678',
                      bio: 'Sinh viên ĐH Bách Khoa',
                      university: 'Đại học Bách Khoa - ĐHQG TP.HCM',
                      studentId: '21127089',
                      studentCardImage: SAMPLE_STUDENT_CARD_IMAGE,
                      isVerified: true,
                      verificationStatus: 'verified',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }
                  }
                  rides={syncData.rides}
                  onReVerify={() => setActiveScreen('verify')}
                  onLogout={() => {
                    setActiveScreen('login');
                    showToast('Đã đăng xuất.');
                  }}
                  onAddRide={handleAddRide}
                />
              )}
            </PhoneFrame>
          </div>
        ) : (
          /* Side-by-side 3 Mockup Screens View Mode (Direct copy of reference image) */
          <div className="w-full space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Đối chiếu 3 màn hình mẫu chuẩn thiết kế
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tái hiện nguyên bản các màn hình trong mẫu thiết kế Cogo với đầy đủ tính năng tương tác và đồng bộ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start justify-center">
              {/* Screen 1: Đăng nhập (Giao diện gốc) */}
              <PhoneFrame label="Đăng nhập (Giao diện gốc)" isCompact>
                <ScreenLogin
                  onNavigateToRegister={() => {
                    setViewMode('interactive');
                    setActiveScreen('register');
                  }}
                  onLoginSuccess={(u) => {
                    handleLogin(u);
                    setViewMode('interactive');
                  }}
                  initialPhone={syncData.currentUser?.phone || '0912 345 678'}
                />
              </PhoneFrame>

              {/* Screen 2: Đăng ký tài khoản (Giao diện gốc) */}
              <PhoneFrame label="Đăng ký tài khoản (Giao diện gốc)" isCompact>
                <ScreenRegister
                  onNavigateToLogin={() => {
                    setViewMode('interactive');
                    setActiveScreen('login');
                  }}
                  onRegisterSuccess={(reg) => {
                    handleRegister(reg);
                    setViewMode('interactive');
                  }}
                  currentUser={syncData.currentUser}
                />
              </PhoneFrame>

              {/* Screen 3: Xác thực Thẻ sinh viên & MSSV */}
              <PhoneFrame label="Xác thực Thẻ sinh viên & MSSV" isCompact>
                <ScreenVerifyStudent
                  onSubmitVerification={(v) => {
                    handleVerifyStudent(v);
                    setViewMode('interactive');
                  }}
                  initialData={syncData.verification}
                />
              </PhoneFrame>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
