import React, { useRef, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  Cloud,
  Download,
  Upload,
  RotateCcw,
  Smartphone,
  LayoutGrid,
  Wifi,
  WifiOff
} from 'lucide-react';
import { AppSyncData, ViewMode } from '../types';

interface SyncControlPanelProps {
  syncData: AppSyncData;
  isSyncing: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onManualSync: () => void;
  onResetData: () => void;
  onImportData: (imported: AppSyncData) => void;
}

export const SyncControlPanel: React.FC<SyncControlPanelProps> = ({
  syncData,
  isSyncing,
  viewMode,
  onViewModeChange,
  onManualSync,
  onResetData,
  onImportData,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '--:--:--';
    }
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(syncData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cogo_sync_backup_v${syncData.version || 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed && typeof parsed === 'object') {
            onImportData(parsed);
          }
        } catch {
          alert('Tệp JSON không hợp lệ!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Sync Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#0e6245] tracking-tight">
              Cogo
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#e8f7ee] text-[#0e6245] border border-[#c2ecd3]">
              Đồng bộ dữ liệu
            </span>
          </div>

          {/* Sync status badge */}
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11.5px] font-medium transition ${
                isSyncing
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Đang đồng bộ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã đồng bộ lúc {formatTime(syncData.lastSyncedAt)}</span>
                </>
              )}
            </div>

            {/* Network indicator */}
            <div className="hidden sm:flex items-center text-slate-400" title={isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}>
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-500" />
              )}
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          {/* Switch view modes */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              id="btn-mode-interactive"
              onClick={() => onViewModeChange('interactive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'interactive'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#0e6245]" />
              <span>Dùng thử app</span>
            </button>
            <button
              type="button"
              id="btn-mode-mockup"
              onClick={() => onViewModeChange('mockup-preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'mockup-preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#0e6245]" />
              <span>Đối chiếu 3 màn hình</span>
            </button>
          </div>

          {/* Sync operations */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onManualSync}
              disabled={isSyncing}
              title="Đồng bộ lại với máy chủ"
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              <Cloud className="w-3.5 h-3.5 text-[#0e6245]" />
              <span className="hidden sm:inline">Đồng bộ đám mây</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              title="Tải tệp JSON sao lưu đồng bộ"
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Xuất</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Nhập tệp sao lưu JSON"
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Nhập</span>
            </button>

            <button
              type="button"
              onClick={onResetData}
              title="Khôi phục dữ liệu mẫu ban đầu như ảnh"
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Khôi phục gốc</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
