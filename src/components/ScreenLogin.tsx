import React, { useState } from 'react';
import { Phone, ArrowRight, Sparkles } from 'lucide-react';
import { CogoHeader } from './CogoHeader';
import { AuthTabs } from './AuthTabs';
import { UserProfile } from '../types';

interface ScreenLoginProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  initialPhone?: string;
}

export const ScreenLogin: React.FC<ScreenLoginProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
  initialPhone = '0912 345 678'
}) => {
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        phone: phone.trim(),
      });
    }, 350);
  };

  const handleQuickFill = () => {
    setPhone('0912 345 678');
    setError(null);
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
            Chào mừng bạn!
          </h1>
          <p className="text-[13.5px] text-[#64748B] mt-1 font-normal">
            Đăng nhập bằng số điện thoại để tiếp tục
          </p>
        </div>

        {/* Tab Switcher */}
        <AuthTabs
          activeTab="login"
          onChange={(tab) => {
            if (tab === 'register') onNavigateToRegister();
          }}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-phone-input" className="text-[13px] font-semibold text-[#334155]">
                Số điện thoại
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] text-[#0e6245] hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                Mẫu: 0912 345 678
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-[#94A3B8]">
                <Phone className="w-[18px] h-[18px] stroke-[1.8]" />
              </div>
              <input
                id="login-phone-input"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="0912 345 678"
                className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0e6245] focus:bg-white focus:ring-2 focus:ring-[#0e6245]/20 rounded-2xl text-[15px] font-medium text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-500 mt-2 font-medium">
              {error}
            </p>
          )}

          {/* Action Button */}
          <button
            type="submit"
            id="btn-login-submit"
            disabled={isLoading}
            className="w-full mt-6 py-3.5 px-5 rounded-2xl bg-[#618F7D] hover:bg-[#527e6d] active:scale-[0.99] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Legal Terms */}
      <div className="pt-6 pb-2 text-center">
        <p className="text-[11.5px] text-[#94A3B8] leading-relaxed max-w-[280px] mx-auto">
          Bằng việc tiếp tục, bạn đồng ý với{' '}
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              alert('Điều khoản dịch vụ Cogo: Cam kết bảo vệ dữ liệu sinh viên, đi chung an toàn và văn minh.');
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
