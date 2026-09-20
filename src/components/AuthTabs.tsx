import React from 'react';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
  onChange: (tab: 'login' | 'register') => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="w-full bg-[#ECEFF2] p-1.5 rounded-2xl flex items-center gap-1 select-none">
      <button
        type="button"
        id="tab-login-btn"
        onClick={() => onChange('login')}
        className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150 text-center ${
          activeTab === 'login'
            ? 'bg-white text-[#193b2d] shadow-sm'
            : 'text-[#657385] hover:text-[#2d3748]'
        }`}
      >
        Đăng nhập
      </button>
      <button
        type="button"
        id="tab-register-btn"
        onClick={() => onChange('register')}
        className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150 text-center ${
          activeTab === 'register'
            ? 'bg-white text-[#193b2d] shadow-sm'
            : 'text-[#657385] hover:text-[#2d3748]'
        }`}
      >
        Đăng ký
      </button>
    </div>
  );
};
