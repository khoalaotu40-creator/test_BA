import { AppSyncData, UserProfile, VerificationData, RideShareItem } from '../types';

export const VIETNAMESE_UNIVERSITIES = [
  'Đại học Bách Khoa - ĐHQG TP.HCM',
  'Đại học Quốc Tế - ĐHQG TP.HCM',
  'Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
  'Đại học Công nghệ Thông tin - ĐHQG TP.HCM',
  'Đại học Khoa học Xã hội và Nhân văn - ĐHQG TP.HCM',
  'Đại học Kinh tế TP.HCM (UEH)',
  'Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE)',
  'Đại học Ngoại thương (Cơ sở II)',
  'Đại học Y Dược TP.HCM',
  'Đại học Tôn Đức Thắng (TDTU)',
  'Đại học Sài Gòn (SGU)',
  'Đại học Mở TP.HCM',
  'Đại học FPT TP.HCM',
  'Đại học Bách Khoa Hà Nội',
  'Đại học Quốc gia Hà Nội',
  'Đại học Kinh tế Quốc dân (NEU)'
];

// High quality realistic student card SVG representation
export const SAMPLE_STUDENT_CARD_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="560" height="340" viewBox="0 0 560 340" fill="none">
  <rect width="560" height="340" rx="16" fill="%23FFFFFF"/>
  <rect width="560" height="70" rx="16" fill="%230F5C3E"/>
  <rect y="50" width="560" height="20" fill="%230F5C3E"/>
  <circle cx="45" cy="35" r="22" fill="%23FFFFFF" opacity="0.95"/>
  <text x="45" y="41" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="%230F5C3E" text-anchor="middle">BK</text>
  <text x="80" y="32" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="%23FFFFFF">ĐẠI HỌC BÁCH KHOA - ĐHQG TP.HCM</text>
  <text x="80" y="50" font-family="Arial, sans-serif" font-size="11" fill="%23D1FAE5">HO CHI MINH CITY UNIVERSITY OF TECHNOLOGY</text>
  <text x="280" y="105" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="%231E293B" text-anchor="middle">THẺ SINH VIÊN / STUDENT CARD</text>
  
  <!-- Avatar placeholder -->
  <rect x="35" y="125" width="120" height="155" rx="8" fill="%23E2E8F0" stroke="%23CBD5E1" stroke-width="2"/>
  <circle cx="95" cy="175" r="28" fill="%2394A3B8"/>
  <path d="M60 250 C60 215, 130 215, 130 250 Z" fill="%2394A3B8"/>
  
  <!-- Student info -->
  <text x="180" y="150" font-family="Arial, sans-serif" font-size="12" fill="%2364748B">Họ và tên / Full Name:</text>
  <text x="180" y="172" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="%230F172A">NGUYỄN VĂN A</text>
  
  <text x="180" y="202" font-family="Arial, sans-serif" font-size="12" fill="%2364748B">Mã số SV / Student ID:</text>
  <text x="180" y="224" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="%230F5C3E" letter-spacing="1.5">21127089</text>
  
  <text x="180" y="252" font-family="Arial, sans-serif" font-size="12" fill="%2364748B">Khoa / Faculty: <tspan font-weight="bold" fill="%231E293B">Khoa Khoa Học &amp; Kỹ Thuật Máy Tính</tspan></text>
  <text x="180" y="272" font-family="Arial, sans-serif" font-size="12" fill="%2364748B">Khoá học / Academic Year: <tspan font-weight="bold" fill="%231E293B">2021 - 2025</tspan></text>
  
  <!-- Barcode -->
  <rect x="35" y="295" width="490" height="25" fill="%23F8FAFC" rx="4"/>
  <path d="M45 300 h4 v15 h-4 z M52 300 h2 v15 h-2 z M57 300 h6 v15 h-6 z M67 300 h3 v15 h-3 z M73 300 h5 v15 h-5 z M82 300 h2 v15 h-2 z M87 300 h6 v15 h-6 z M96 300 h3 v15 h-3 z M102 300 h4 v15 h-4 z M110 300 h6 v15 h-6 z M120 300 h2 v15 h-2 z M125 300 h5 v15 h-5 z M134 300 h3 v15 h-3 z M140 300 h7 v15 h-7 z M150 300 h4 v15 h-4 z M158 300 h2 v15 h-2 z M163 300 h5 v15 h-5 z M172 300 h6 v15 h-6 z M182 300 h3 v15 h-3 z M188 300 h5 v15 h-5 z M197 300 h2 v15 h-2 z M202 300 h6 v15 h-6 z M212 300 h4 v15 h-4 z M220 300 h3 v15 h-3 z M226 300 h6 v15 h-6 z M236 300 h2 v15 h-2 z M241 300 h5 v15 h-5 z M250 300 h4 v15 h-4 z M258 300 h6 v15 h-6 z M268 300 h3 v15 h-3 z M274 300 h5 v15 h-5 z M283 300 h2 v15 h-2 z M288 300 h6 v15 h-6 z M298 300 h4 v15 h-4 z M306 300 h3 v15 h-3 z M312 300 h6 v15 h-6 z M322 300 h2 v15 h-2 z M327 300 h5 v15 h-5 z M336 300 h3 v15 h-3 z M342 300 h7 v15 h-7 z M352 300 h4 v15 h-4 z M360 300 h2 v15 h-2 z M365 300 h5 v15 h-5 z M374 300 h6 v15 h-6 z M384 300 h3 v15 h-3 z M390 300 h5 v15 h-5 z M399 300 h2 v15 h-2 z M404 300 h6 v15 h-6 z M414 300 h4 v15 h-4 z M422 300 h3 v15 h-3 z M428 300 h6 v15 h-6 z M438 300 h2 v15 h-2 z M443 300 h5 v15 h-5 z M452 300 h4 v15 h-4 z M460 300 h6 v15 h-6 z M470 300 h3 v15 h-3 z M476 300 h5 v15 h-5 z M485 300 h2 v15 h-2 z M490 300 h6 v15 h-6 z M500 300 h4 v15 h-4 z M508 300 h3 v15 h-3 z M514 300 h6 v15 h-6 z" fill="%23334155"/>
</svg>`;

export const INITIAL_USER: UserProfile = {
  id: 'user-001',
  fullName: 'Nguyễn Văn A',
  phone: '0912 345 678',
  bio: 'Sinh viên ĐH Quốc Tế - ĐHQG TP.HCM',
  university: 'Đại học Bách Khoa - ĐHQG TP.HCM',
  studentId: '21127089',
  studentCardImage: SAMPLE_STUDENT_CARD_IMAGE,
  isVerified: true,
  verificationStatus: 'verified',
  verifiedAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  updatedAt: new Date().toISOString()
};

export const INITIAL_VERIFICATION: VerificationData = {
  university: 'Đại học Bách Khoa - ĐHQG TP.HCM',
  studentId: '21127089',
  cardImage: SAMPLE_STUDENT_CARD_IMAGE,
  cardImageName: 'the_sinh_vien_mat_truoc.png',
  submittedAt: new Date().toISOString(),
  status: 'verified'
};

export const SAMPLE_RIDES: RideShareItem[] = [
  {
    id: 'ride-1',
    userId: 'user-001',
    userName: 'Nguyễn Văn A',
    userPhone: '0912 345 678',
    userUniversity: 'Đại học Bách Khoa - ĐHQG TP.HCM',
    isVerified: true,
    type: 'driver',
    departure: 'Ký túc xá Khu B, ĐHQG TP.HCM',
    destination: 'Cơ sở 1 ĐH Bách Khoa (268 Lý Thường Kiệt, Q.10)',
    date: 'Hôm nay',
    time: '07:15 sáng',
    seats: 2,
    priceNote: 'Chia sẻ xăng 15k/bạn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ride-2',
    userId: 'user-002',
    userName: 'Trần Thị Mai',
    userPhone: '0988 123 456',
    userUniversity: 'Đại học Kinh tế TP.HCM (UEH)',
    isVerified: true,
    type: 'driver',
    departure: 'Quận Bình Thạnh (Ngã tư Hàng Xanh)',
    destination: 'UEH Cơ sở Nguyễn Tri Phương, Q.10',
    date: 'Hôm nay',
    time: '08:00 sáng',
    seats: 1,
    priceNote: 'Đi chung vui là chính',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ride-3',
    userId: 'user-003',
    userName: 'Lê Hoàng Nam',
    userPhone: '0903 789 012',
    userUniversity: 'Đại học Công nghệ Thông tin (UIT)',
    isVerified: true,
    type: 'passenger',
    departure: 'Thủ Đức (Chợ Thủ Đức)',
    destination: 'Khu Công nghệ Cao (SHTP)',
    date: 'Ngày mai',
    time: '07:30 sáng',
    seats: 1,
    priceNote: 'Tìm xe đi ghép',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_SYNC_DATA: AppSyncData = {
  version: 1,
  lastSyncedAt: new Date().toISOString(),
  currentUser: INITIAL_USER,
  users: [INITIAL_USER],
  verification: INITIAL_VERIFICATION,
  rides: SAMPLE_RIDES
};
