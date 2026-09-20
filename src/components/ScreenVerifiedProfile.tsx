import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  CreditCard,
  Phone,
  Car,
  MapPin,
  Clock,
  Plus,
  RefreshCw,
  LogOut,
  Edit3
} from 'lucide-react';
import { CogoHeader } from './CogoHeader';
import { UserProfile, RideShareItem } from '../types';

interface ScreenVerifiedProfileProps {
  user: UserProfile;
  rides: RideShareItem[];
  onReVerify: () => void;
  onLogout: () => void;
  onAddRide: (ride: Partial<RideShareItem>) => void;
}

export const ScreenVerifiedProfile: React.FC<ScreenVerifiedProfileProps> = ({
  user,
  rides,
  onReVerify,
  onLogout,
  onAddRide
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'rides'>('profile');
  const [showAddRideModal, setShowAddRideModal] = useState(false);
  const [newDeparture, setNewDeparture] = useState('Ký túc xá Khu B, ĐHQG');
  const [newDestination, setNewDestination] = useState('ĐH Bách Khoa (CS1 Q.10)');
  const [newTime, setNewTime] = useState('07:30 sáng');

  const handleCreateRide = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRide({
      id: `ride-${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      userUniversity: user.university || 'ĐH Bách Khoa',
      isVerified: true,
      type: 'driver',
      departure: newDeparture,
      destination: newDestination,
      date: 'Hôm nay',
      time: newTime,
      seats: 2,
      priceNote: 'Chia sẻ xăng',
      createdAt: new Date().toISOString(),
    });
    setShowAddRideModal(false);
  };

  return (
    <div className="flex flex-col h-full min-h-[640px] p-5 bg-white select-none">
      {/* Header */}
      <CogoHeader />

      {/* Verified Status Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#EAF8F1] to-[#D5F2E3] border border-[#BCE8D3] text-[#0d5c3a] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0e5c3a] text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-[16px] text-[#0d4f36] leading-tight">
                Sinh viên đã xác thực
              </h2>
              <CheckCircle2 className="w-4 h-4 text-[#0e5c3a] fill-[#EAF8F1]" />
            </div>
            <p className="text-[12px] text-[#2c6e52] mt-0.5">
              Tài khoản Cogo an toàn, đã đồng bộ hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F1F4F8] p-1 rounded-xl mt-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-lg transition ${
            activeTab === 'profile' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
          }`}
        >
          Hồ sơ &amp; Thẻ SV
        </button>
        <button
          onClick={() => setActiveTab('rides')}
          className={`flex-1 py-2 rounded-lg transition ${
            activeTab === 'rides' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
          }`}
        >
          Chuyến đi chung ({rides.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-0.5">
        {activeTab === 'profile' ? (
          <div className="space-y-4">
            {/* Student Card Digital Preview */}
            {user.studentCardImage && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-white">
                <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span className="font-bold text-[#0e5c3a]">Thẻ sinh viên số hoá</span>
                  <span className="text-[11px] text-gray-400">Mặt trước</span>
                </div>
                <img
                  src={user.studentCardImage}
                  alt="Thẻ sinh viên xác thực"
                  className="w-full h-auto object-cover max-h-52"
                />
              </div>
            )}

            {/* Info Details List */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-200/70">
                <span className="text-gray-500">Họ và tên:</span>
                <span className="font-bold text-gray-900 text-sm">{user.fullName}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-gray-200/70">
                <span className="text-gray-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Số điện thoại:
                </span>
                <span className="font-semibold text-gray-800">{user.phone}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-gray-200/70">
                <span className="text-gray-500 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0e5c3a]" /> Trường:
                </span>
                <span className="font-semibold text-gray-800 text-right max-w-[200px] truncate">
                  {user.university || 'Đại học Bách Khoa'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#0e5c3a]" /> MSSV:
                </span>
                <span className="font-bold text-[#0e5c3a] tracking-wider text-sm">
                  {user.studentId || '21127089'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onReVerify}
                className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0e5c3a]" /> Cập nhật xác thực
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="py-2.5 px-3.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Chuyến đi cùng trường</span>
              <button
                type="button"
                onClick={() => setShowAddRideModal(true)}
                className="text-xs text-white bg-[#0e5c3a] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#0a4833] transition"
              >
                <Plus className="w-3.5 h-3.5" /> Đăng chuyến
              </button>
            </div>

            {rides.map((ride) => (
              <div
                key={ride.id}
                className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-[#0e5c3a]/40 transition shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EAF8F1] text-[#0e5c3a] font-bold flex items-center justify-center text-xs">
                      {ride.userName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{ride.userName}</span>
                      <span className="text-[10px] text-gray-500 block truncate max-w-[150px]">
                        {ride.userUniversity}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#0e5c3a] bg-[#EAF8F1] px-2 py-0.5 rounded-md">
                    {ride.priceNote}
                  </span>
                </div>

                <div className="space-y-1 text-gray-600 pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{ride.departure}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate font-medium text-gray-800">{ride.destination}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ride.date}, {ride.time}
                    </span>
                    <span className="text-gray-500 font-semibold">{ride.seats} chỗ trống</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add ride modal */}
      {showAddRideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-gray-900">Đăng chuyến đi chung</h3>
            <form onSubmit={handleCreateRide} className="space-y-2.5">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Điểm đón:</label>
                <input
                  type="text"
                  value={newDeparture}
                  onChange={(e) => setNewDeparture(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Điểm đến:</label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Giờ khởi hành:</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRideModal(false)}
                  className="flex-1 py-2 rounded-xl border text-gray-600"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#0e5c3a] text-white font-bold"
                >
                  Đăng chuyến
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
