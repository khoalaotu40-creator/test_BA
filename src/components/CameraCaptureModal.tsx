import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { SAMPLE_STUDENT_CARD_IMAGE } from '../data/mockData';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const startCamera = async () => {
    setIsStarting(true);
    setHasPermission(null);
    setCapturedImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable', err);
      setHasPermission(false);
    } finally {
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play();
    }
  };

  const handleUseCaptured = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleUseSampleCard = () => {
    onCapture(SAMPLE_STUDENT_CARD_IMAGE);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0e6245]" />
            <h3 className="font-bold text-gray-900 text-base">
              Chụp ảnh thẻ sinh viên (Mặt trước)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative bg-slate-900 aspect-4/3 flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Thẻ sinh viên vừa chụp"
              className="w-full h-full object-cover"
            />
          ) : hasPermission === false ? (
            <div className="p-6 text-center text-white space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-200">
                Không thể truy cập camera trên thiết bị hoặc trình duyệt.
              </p>
              <button
                type="button"
                onClick={handleUseSampleCard}
                className="px-4 py-2 bg-[#0e6245] text-white text-xs font-semibold rounded-xl hover:bg-[#0b4d36] transition"
              >
                Dùng mẫu thẻ Bách Khoa chuẩn
              </button>
            </div>
          ) : isStarting ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs text-gray-300">Đang bật máy ảnh...</span>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Card framing guide */}
              <div className="absolute inset-5 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <span className="text-[11px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded-md self-start">
                  Căn thẻ vào khung hình
                </span>
                <span className="text-[10px] text-gray-200 bg-black/60 px-2 py-0.5 rounded-md self-end">
                  Rõ họ tên &amp; MSSV
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-gray-50 flex items-center justify-between gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleUseSampleCard}
            className="text-xs text-[#0e6245] font-semibold hover:underline"
          >
            Dùng thẻ sinh viên mẫu
          </button>

          <div className="flex items-center gap-2">
            {capturedImage ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Chụp lại
                </button>
                <button
                  type="button"
                  onClick={handleUseCaptured}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0e6245] rounded-xl hover:bg-[#0a4833] transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" /> Dùng ảnh này
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleTakePhoto}
                disabled={!hasPermission}
                className="px-5 py-2.5 bg-[#0e6245] text-white text-xs font-bold rounded-xl hover:bg-[#0b4d36] transition flex items-center gap-2 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" /> Chụp ảnh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
