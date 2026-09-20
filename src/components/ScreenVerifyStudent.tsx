import React, { useState, useRef } from 'react';
import {
  Landmark,
  CreditCard,
  ChevronDown,
  Info,
  Camera,
  Upload,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { VIETNAMESE_UNIVERSITIES, SAMPLE_STUDENT_CARD_IMAGE } from '../data/mockData';
import { CameraCaptureModal } from './CameraCaptureModal';
import { VerificationData } from '../types';

interface ScreenVerifyStudentProps {
  onBack?: () => void;
  onSubmitVerification: (data: VerificationData) => void;
  initialData?: Partial<VerificationData>;
}

export const ScreenVerifyStudent: React.FC<ScreenVerifyStudentProps> = ({
  onSubmitVerification,
  initialData
}) => {
  const [university, setUniversity] = useState(
    initialData?.university || 'Đại học Bách Khoa - ĐHQG TP.HCM'
  );
  const [studentId, setStudentId] = useState(initialData?.studentId || '21127089');
  const [cardImage, setCardImage] = useState<string | null>(
    initialData?.cardImage || null
  );
  const [cardImageName, setCardImageName] = useState<string>(
    initialData?.cardImageName || 'the_sinh_vien_mat_truoc.png'
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [searchUni, setSearchUni] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredUnis = VIETNAMESE_UNIVERSITIES.filter((uni) =>
    uni.toLowerCase().includes(searchUni.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, JPEG)');
        return;
      }
      setCardImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCardImage(reader.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSample = () => {
    setUniversity('Đại học Bách Khoa - ĐHQG TP.HCM');
    setStudentId('21127089');
    setCardImage(SAMPLE_STUDENT_CARD_IMAGE);
    setCardImageName('the_sinh_vien_bk_21127089.png');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!university.trim()) {
      setErrorMsg('Vui lòng chọn trường Đại học / Cao đẳng');
      return;
    }
    if (!studentId.trim()) {
      setErrorMsg('Vui lòng nhập Mã số sinh viên (MSSV)');
      return;
    }
    if (!cardImage) {
      setErrorMsg('Vui lòng chụp ảnh hoặc tải lên ảnh thẻ sinh viên (Mặt trước)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitVerification({
        university,
        studentId: studentId.trim(),
        cardImage,
        cardImageName,
        submittedAt: new Date().toISOString(),
        status: 'verified',
      });
    }, 450);
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[640px] p-5 sm:p-6 bg-white select-none">
      <div>
        {/* Top Step Progress Indicator */}
        <div className="flex items-center gap-2 pt-1 pb-4">
          <div className="h-1.5 flex-1 rounded-full bg-[#0e5c3a]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#0e5c3a]" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[24px] font-extrabold text-[#111827] tracking-tight">
            Xác thực sinh viên
          </h1>
          <button
            type="button"
            onClick={handleUseSample}
            className="text-[11.5px] text-[#0e5c3a] bg-[#eaf7f1] hover:bg-[#d8f2e5] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition"
          >
            <Sparkles className="w-3 h-3 text-[#0e5c3a]" />
            Dùng mẫu ảnh
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: School & MSSV */}
          <div className="bg-white border border-[#E5E9F0] rounded-2xl p-4 shadow-2xs space-y-3.5">
            {/* Trường Đại học */}
            <div className="relative">
              <label className="block text-[13px] font-semibold text-[#1F2937] mb-1.5">
                Trường Đại học / Cao đẳng <span className="text-rose-500">*</span>
              </label>

              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#F4F7FA] border border-[#E2E8F0] hover:border-[#0e5c3a]/50 rounded-xl px-3.5 py-3 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Landmark className="w-4 h-4 text-[#0e5c3a] shrink-0 stroke-[2]" />
                  <span className="text-[13.5px] font-medium text-[#1E293B] truncate">
                    {university}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* University dropdown modal/menu */}
              {isDropdownOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 max-h-56 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Tìm tên trường..."
                    value={searchUni}
                    onChange={(e) => setSearchUni(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl mb-2 focus:border-[#0e5c3a] outline-none"
                    autoFocus
                  />
                  <div className="space-y-1">
                    {filteredUnis.map((uni) => (
                      <button
                        key={uni}
                        type="button"
                        onClick={() => {
                          setUniversity(uni);
                          setIsDropdownOpen(false);
                          setSearchUni('');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl transition truncate flex items-center justify-between ${
                          university === uni
                            ? 'bg-[#E8F6EF] text-[#0e5c3a] font-bold'
                            : 'text-gray-700 hover:bg-gray-100 font-medium'
                        }`}
                      >
                        <span className="truncate">{uni}</span>
                        {university === uni && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mã số sinh viên (MSSV) */}
            <div>
              <label htmlFor="mssv-input" className="block text-[13px] font-semibold text-[#1F2937] mb-1.5">
                Mã số sinh viên (MSSV) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[#0e5c3a]">
                  <CreditCard className="w-4 h-4 stroke-[2]" />
                </div>
                <input
                  id="mssv-input"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Nhập MSSV (VD: 21127089)"
                  className="w-full pl-10 pr-4 py-3 bg-[#EEF2F8] border border-transparent focus:border-[#0e5c3a] focus:bg-white focus:ring-2 focus:ring-[#0e5c3a]/20 rounded-xl text-[14px] font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8]"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#64748B]">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#64748B]" />
                <span>Cần khớp với thông tin trên thẻ sinh viên</span>
              </div>
            </div>
          </div>

          {/* Card 2: Front Student Card Photo */}
          <div className="bg-white border border-[#E5E9F0] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[13px] font-semibold text-[#1F2937]">
                Ảnh chụp thẻ sinh viên (Mặt trước) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF7F2] text-[#0e5c3a] text-[11px] font-bold border border-[#C5E8D8]">
                <Sparkles className="w-3 h-3" />
                <span>Cần rõ nét</span>
              </div>
            </div>

            {/* Dropzone / Upload box matching reference image */}
            <div className="bg-[#F4F7FB] border border-[#E2E8F0] rounded-2xl p-4 text-center">
              {cardImage ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs max-h-48 group">
                    <img
                      src={cardImage}
                      alt="Thẻ sinh viên mặt trước"
                      className="w-full h-auto object-contain max-h-44 mx-auto"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="bg-[#0e5c3a] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> Đã nạp ảnh
                      </span>
                      <button
                        type="button"
                        onClick={() => setCardImage(null)}
                        className="p-1 bg-white/90 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-md transition shadow-xs"
                        title="Xoá ảnh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="text-xs text-[#0e5c3a] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" /> Chụp lại
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-gray-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" /> Tải ảnh khác
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Central Graphic */}
                  <div className="relative inline-flex items-center justify-center w-14 h-11 bg-[#E0E7FF]/70 text-[#1E3A8A] rounded-xl mb-2.5">
                    <CreditCard className="w-7 h-7 stroke-[1.8] text-[#3B82F6]" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0e5c3a] text-white flex items-center justify-center shadow-xs">
                      <Camera className="w-3 h-3 stroke-[2]" />
                    </div>
                  </div>

                  <h4 className="text-[13.5px] font-bold text-[#1E293B]">
                    Chụp ảnh hoặc tải lên từ thư viện
                  </h4>
                  <p className="text-[11.5px] text-[#64748B] mt-1 mb-4 leading-relaxed max-w-[260px] mx-auto">
                    Đảm bảo họ tên, ảnh chân dung và MSSV hiển thị rõ ràng, không bị chói loá
                  </p>

                  {/* Two Action Buttons */}
                  <div className="flex items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="flex-1 py-2.5 px-3 bg-[#0d4f36] hover:bg-[#093d2a] active:scale-[0.98] text-white rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>Chụp trực tiếp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 px-3 bg-[#BFF2DB] hover:bg-[#a6e8cb] active:scale-[0.98] text-[#0d4f36] rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>Tải ảnh lên</span>
                    </button>
                  </div>
                </>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bottom Primary Button */}
          <button
            type="submit"
            id="btn-verify-submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-5 rounded-2xl bg-[#094830] hover:bg-[#073825] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Gửi thông tin xác thực</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setCardImage(dataUrl);
          setCardImageName('the_sinh_vien_chup_camera.jpg');
          setErrorMsg(null);
        }}
      />
    </div>
  );
};
