import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  label?: string;
  isCompact?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  label,
  isCompact = false,
}) => {
  return (
    <div className="flex flex-col items-center">
      {label && (
        <div className="mb-3 text-center">
          <span className="text-[13px] font-semibold text-slate-500 tracking-wide">
            {label}
          </span>
        </div>
      )}

      {/* Smartphone Device Exterior Frame */}
      <div
        className={`relative w-full ${
          isCompact ? 'max-w-[360px]' : 'max-w-[390px]'
        } bg-[#090D14] p-3 rounded-[46px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-[3.5px] border-[#1E293B] select-none`}
      >
        {/* Physical buttons simulation */}
        <div className="absolute -left-[5px] top-24 w-[3px] h-9 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[5px] top-36 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[5px] top-52 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-[5px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

        {/* Screen Bezel and Inner Glass */}
        <div className="relative bg-white rounded-[38px] overflow-hidden flex flex-col min-h-[670px] max-h-[780px] shadow-inner">
          {/* iOS-style Status Bar */}
          <div className="pt-2 px-6 pb-1 bg-white flex items-center justify-between z-10 select-none">
            <span className="text-[13px] font-bold text-slate-900 tracking-tight">
              09:41
            </span>
            {/* Dynamic Island / Speaker */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#1E293B] mr-2" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
            </div>
            {/* System Icons */}
            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5 stroke-[2]" />
              <Wifi className="w-3.5 h-3.5 stroke-[2]" />
              <Battery className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          {/* Inner Content Area */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-white">
            {children}
          </div>

          {/* Home indicator bar */}
          <div className="py-2 bg-white flex justify-center items-center">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
