import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface CogoHeaderProps {
  showShieldBadge?: boolean;
}

export const CogoHeader: React.FC<CogoHeaderProps> = ({ showShieldBadge = true }) => {
  return (
    <div className="flex items-center justify-between w-full pt-1 pb-2">
      {/* Brand Logo */}
      <div className="flex items-center">
        <span className="text-[32px] font-extrabold tracking-tight text-[#0e6245] select-none font-['Plus_Jakarta_Sans',sans-serif]">
          Cogo
        </span>
      </div>

      {/* Trust Badge */}
      {showShieldBadge && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5ed] border border-[#c1e8d2] text-[#0d5c3a] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#0d5c3a] stroke-[2.2]" />
          <span className="text-[11.5px] font-semibold tracking-tight whitespace-nowrap">
            Đi chung an toàn
          </span>
        </div>
      )}
    </div>
  );
};
