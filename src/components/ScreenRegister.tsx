import React, { useState } from 'react';
import { User, Phone, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { CogoHeader } from './CogoHeader';
import { AuthTabs } from './AuthTabs';
import { UserProfile } from '../types';

interface ScreenRegisterProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: (userData: { fullName: string; phone: string; bio: string }) => void;
  currentUser?: UserProfile | null;
}

export const ScreenRegister: React.FC<ScreenRegisterProps> = ({
  onNavigateToLogin,
  onRegisterSuccess,
  currentUser
}) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Nguyễn Văn A');
  const [phone, setPhone] = useState(currentUser?.phone || '0912 345 678');
  const [bio, setBio] = useState(currentUser?.bio || 'VD: Sinh viên ĐH Quốc Tế - ĐHQG...');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên';
    if (!phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess({
        fullName: fullName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      });
    }, 350);
  };

  const handleFillSample = () => {
    setFullName('Nguyễn Văn A');
    setPhone('0912 345 678');
    setBio('Sinh viên ĐH Bách Khoa - ĐHQG TP.HCM');
    setErrors({});
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[580px] p-6 bg-white select-none">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <CogoHeader />

        {/* Headline */}
        <div className="mt-5 mb-5">
          <h1 className="text-[26px] font-extrabold text-[#121926] tracking-tight">
            Tạo tài khoản mới
          </h1>
          <p className="text-[13.5px] text-[#64748B] mt-1 font-normal">
            Kết nối và chia sẻ chuyến đi cùng sinh viên
          </p>
        </div>

        {/* Tab Switcher */}
        <AuthTabs
          activeTab="register"
          onChange={(tab) => {
            if (tab === 'login') onNavigateToLogin();
          }}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* Họ và tên */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reg-fullname-input" className="text-[13px] font-semibold text-[#334155]">
                Họ và tên
              </label>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-[11px] text-[#0e6245] hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                Điền mẫu ảnh
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-[#94A3B8]">
                <User className="w-[18px] h-[18px] stroke-[1.8]" />
              </div>
              <input
                id="reg-fullname-input"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                placeholder="Nguyễn Văn A"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0e6245] focus:bg-white focus:ring-2 focus:ring-[#0e6245]/20 rounded-2xl text-[14.5px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8]"
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label htmlFor="reg-phone-input" className="block text-[13px] font-semibold text-[#334155] mb-1.5">
              Số điện thoại
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-[#94A3B8]">
                <Phone className="w-[18px] h-[18px] stroke-[1.8]" />
              </div>
              <input
                id="reg-phone-input"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder="0912 345 678"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0e6245] focus:bg-white focus:ring-2 focus:ring-[#0e6245]/20 rounded-2xl text-[14.5px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8]"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Trường học / Giới thiệu */}
          <div>
            <label htmlFor="reg-bio-input" className="block text-[13px] font-semibold text-[#334155] mb-1.5">
              Trường học / Giới thiệu
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-[#94A3B8]">
                <FileText className="w-[18px] h-[18px] stroke-[1.8]" />
              </div>
              <input
                id="reg-bio-input"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="VD: Sinh viên ĐH Quốc Tế - ĐHQG..."
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0e6245] focus:bg-white focus:ring-2 focus:ring-[#0e6245]/20 rounded-2xl text-[14px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            id="btn-register-submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-5 rounded-2xl bg-[#618F7D] hover:bg-[#527e6d] active:scale-[0.99] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Xác thực sinh viên</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Legal Terms */}
      <div className="pt-5 pb-2 text-center">
        <p className="text-[11.5px] text-[#94A3B8] leading-relaxed max-w-[280px] mx-auto">
          Bằng việc tiếp tục, bạn đồng ý với{' '}
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              alert('Điều khoản dịch vụ Cogo: Đảm bảo an toàn sinh viên & xác thực danh tính minh bạch.');
            }}
            className="text-[#64748B] underline hover:text-[#0F172A] font-medium"
          >
            Điều khoản dịch vụ
          </a>{' '}
          của Cogo.
        </p>
      </div>
    </div>
  );
};
