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
  WifiOff,
  Terminal,
  Activity,
  X,
  Server,
  Check
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

  // Deploy & Server Debug Modal State
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [isLoadingDebug, setIsLoadingDebug] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [copiedDebug, setCopiedDebug] = useState(false);

  const fetchDebugInfo = async () => {
    setIsLoadingDebug(true);
    const start = performance.now();
    try {
      const [healthRes, debugRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/debug'),
      ]);
      const latency = Math.round(performance.now() - start);
      setPingLatency(latency);

      if (debugRes.ok) {
        const json = await debugRes.json();
        setDebugData(json);
      } else {
        const healthJson = await healthRes.json();
        setDebugData({ health: healthJson, error: `Debug HTTP ${debugRes.status}` });
      }
    } catch (err: any) {
      setDebugData({ error: err?.message || 'Không thể kết nối API Server' });
      setPingLatency(null);
    } finally {
      setIsLoadingDebug(false);
    }
  };

  const handleOpenDebug = () => {
    setShowDebugModal(true);
    fetchDebugInfo();
  };

  const handleCopyDebug = () => {
    if (!debugData) return;
    navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
    setCopiedDebug(true);
    setTimeout(() => setCopiedDebug(false), 2000);
  };

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
              onClick={handleOpenDebug}
              title="Kiểm tra trạng thái Deploy và chẩn đoán Server"
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 transition shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Kiểm tra Deploy</span>
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

      {/* Deployment & Diagnostics Modal */}
      {showDebugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e6245]/10 flex items-center justify-center text-[#0e6245]">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Chẩn Đoán Triển Khai & Server (Deploy Debug)</h3>
                  <p className="text-xs text-slate-500">Kiểm tra kết nối runtime, dist bundle và thông số hosting</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={fetchDebugInfo}
                  disabled={isLoadingDebug}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
                  title="Tải lại chẩn đoán"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingDebug ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDebugModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {isLoadingDebug ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#0e6245]" />
                  <span>Đang kết nối và thu thập thông số `/api/debug`...</span>
                </div>
              ) : debugData ? (
                <>
                  {/* Status Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trạng thái</span>
                      <div className="mt-1 flex items-center gap-1.5 font-bold text-emerald-700 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </div>
                      <span className="text-[11px] text-slate-500">{pingLatency ? `${pingLatency}ms ping` : 'API Live'}</span>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Môi trường</span>
                      <div className="mt-1 font-bold text-slate-800 text-sm">
                        {debugData?.deployment?.mode || 'DEVELOPMENT'}
                      </div>
                      <span className="text-[11px] text-slate-500">Port {debugData?.deployment?.listeningPort || '3000'}</span>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Platform</span>
                      <div className="mt-1 font-bold text-slate-800 text-sm truncate">
                        {debugData?.deployment?.isRenderCloud ? 'Render Cloud' : 'Container / Local'}
                      </div>
                      <span className="text-[11px] text-slate-500 truncate">{debugData?.runtime?.nodeVersion || 'Node.js'}</span>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bộ nhớ RAM</span>
                      <div className="mt-1 font-bold text-slate-800 text-sm">
                        {debugData?.runtime?.memoryRssMb ? `${debugData.runtime.memoryRssMb} MB` : '--'}
                      </div>
                      <span className="text-[11px] text-slate-500">Uptime: {debugData?.runtime?.uptimeSeconds ? `${debugData.runtime.uptimeSeconds}s` : '--'}</span>
                    </div>
                  </div>

                  {/* Artifacts Check */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-slate-500" />
                        Kiểm tra tệp tin đóng gói (Production Dist Bundle)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[220px]">
                        {debugData?.fileSystem?.currentWorkingDirectory}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                        <span className="font-medium text-slate-600">dist/index.html (Client SPA)</span>
                        {debugData?.fileSystem?.hasIndexHtml ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> {(debugData.fileSystem.indexHtmlSizeBytes / 1024).toFixed(1)} KB
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold">Chưa build</span>
                        )}
                      </div>

                      <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                        <span className="font-medium text-slate-600">dist/server.cjs (Node Server)</span>
                        {debugData?.fileSystem?.hasServerCjs ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> {(debugData.fileSystem.serverCjsSizeBytes / 1024).toFixed(1)} KB
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">Chế độ dev</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Raw JSON Debug Viewer */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-600 text-[11px]">Dữ liệu chẩn đoán JSON chi tiết (`/api/debug`)</span>
                      <button
                        type="button"
                        onClick={handleCopyDebug}
                        className="text-[11px] text-[#0e6245] hover:underline font-semibold flex items-center gap-1"
                      >
                        {copiedDebug ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Đã sao chép!
                          </>
                        ) : (
                          <>Sao chép JSON</>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10.5px] font-mono overflow-x-auto max-h-52 border border-slate-800 leading-relaxed select-all">
                      {JSON.stringify(debugData, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  Không thể lấy thông số chẩn đoán từ máy chủ.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                API: <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-700">/api/health</code> & <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-700">/api/debug</code>
              </span>
              <button
                type="button"
                onClick={() => setShowDebugModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
