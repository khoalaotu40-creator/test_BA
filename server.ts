import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface ServerUser {
  id: string;
  fullName: string;
  phone: string;
  bio?: string;
  university?: string;
  studentId?: string;
  isVerified: boolean;
  verificationStatus: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ServerVerification {
  university: string;
  studentId: string;
  cardImage: string | null;
  cardImageName?: string;
  status: string;
  submittedAt: string;
}

interface ServerStore {
  version: number;
  lastSyncedAt: string;
  users: ServerUser[];
  currentUser: ServerUser | null;
  verification: ServerVerification;
  rides: any[];
}

// In-memory persistent state on server
let syncStore: ServerStore = {
  version: 1,
  lastSyncedAt: new Date().toISOString(),
  users: [
    {
      id: "user-001",
      fullName: "Nguyễn Văn A",
      phone: "0912 345 678",
      bio: "Sinh viên ĐH Quốc Tế - ĐHQG TP.HCM",
      university: "Đại học Bách Khoa - ĐHQG TP.HCM",
      studentId: "21127089",
      isVerified: true,
      verificationStatus: "verified",
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  currentUser: {
    id: "user-001",
    fullName: "Nguyễn Văn A",
    phone: "0912 345 678",
    bio: "Sinh viên ĐH Quốc Tế - ĐHQG TP.HCM",
    university: "Đại học Bách Khoa - ĐHQG TP.HCM",
    studentId: "21127089",
    isVerified: true,
    verificationStatus: "verified",
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  verification: {
    university: "Đại học Bách Khoa - ĐHQG TP.HCM",
    studentId: "21127089",
    cardImage: null,
    cardImageName: "the_sinh_vien.png",
    status: "verified",
    submittedAt: new Date().toISOString(),
  },
  rides: [
    {
      id: "ride-1",
      userId: "user-001",
      userName: "Nguyễn Văn A",
      userPhone: "0912 345 678",
      userUniversity: "Đại học Bách Khoa - ĐHQG TP.HCM",
      isVerified: true,
      type: "driver",
      departure: "Ký túc xá Khu B, ĐHQG TP.HCM",
      destination: "Cơ sở 1 ĐH Bách Khoa (268 Lý Thường Kiệt, Q.10)",
      date: "Hôm nay",
      time: "07:15 sáng",
      seats: 2,
      priceNote: "Chia sẻ xăng 15k/bạn",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ride-2",
      userId: "user-002",
      userName: "Trần Thị Mai",
      userPhone: "0988 123 456",
      userUniversity: "Đại học Kinh tế TP.HCM (UEH)",
      isVerified: true,
      type: "driver",
      departure: "Quận Bình Thạnh (Ngã tư Hàng Xanh)",
      destination: "UEH Cơ sở Nguyễn Tri Phương, Q.10",
      date: "Hôm nay",
      time: "08:00 sáng",
      seats: 1,
      priceNote: "Đi chung vui là chính",
      createdAt: new Date().toISOString(),
    },
  ],
};

async function startServer() {
  const app = express();
  // In AI Studio container, port 3000 is required by the reverse proxy.
  // On platforms like Render (where process.env.RENDER is 'true'), adapt to process.env.PORT.
  const PORT = process.env.RENDER ? (Number(process.env.PORT) || 3000) : 3000;

  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Cogo Sync API", time: new Date().toISOString() });
  });

  // GET full sync state
  app.get("/api/sync", (_req, res) => {
    res.json({
      success: true,
      data: syncStore,
      serverTime: new Date().toISOString(),
    });
  });

  // POST full sync state from client
  app.post("/api/sync", (req, res) => {
    try {
      const incoming = req.body;
      if (!incoming) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
      }

      syncStore = {
        ...syncStore,
        ...incoming,
        version: (syncStore.version || 1) + 1,
        lastSyncedAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        message: "Đồng bộ dữ liệu thành công",
        data: syncStore,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message || "Lỗi đồng bộ" });
    }
  });

  // POST login
  app.post("/api/auth/login", (req, res) => {
    const { phone } = req.body;
    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại" });
    }

    const cleanedPhone = phone.trim().replace(/\s+/g, "");
    let user = syncStore.users.find((u) => u.phone.replace(/\s+/g, "") === cleanedPhone);

    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        fullName: "Sinh viên mới",
        phone: phone.trim(),
        bio: "Sinh viên mới tham gia Cogo",
        university: "Đại học Bách Khoa - ĐHQG TP.HCM",
        studentId: "",
        isVerified: false,
        verificationStatus: "unverified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      syncStore.users.push(user);
    }

    syncStore.currentUser = user;
    syncStore.lastSyncedAt = new Date().toISOString();
    syncStore.version += 1;

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      user,
      syncData: syncStore,
    });
  });

  // POST register
  app.post("/api/auth/register", (req, res) => {
    const { fullName, phone, bio } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đủ họ tên và số điện thoại" });
    }

    const cleanedPhone = phone.trim().replace(/\s+/g, "");
    let user = syncStore.users.find((u) => u.phone.replace(/\s+/g, "") === cleanedPhone);

    if (user) {
      user.fullName = fullName.trim();
      user.bio = bio?.trim() || user.bio;
      user.updatedAt = new Date().toISOString();
    } else {
      user = {
        id: `user-${Date.now()}`,
        fullName: fullName.trim(),
        phone: phone.trim(),
        bio: bio?.trim() || "",
        university: "",
        studentId: "",
        isVerified: false,
        verificationStatus: "unverified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      syncStore.users.push(user);
    }

    syncStore.currentUser = user;
    syncStore.lastSyncedAt = new Date().toISOString();
    syncStore.version += 1;

    res.json({
      success: true,
      message: "Đăng ký thành công, vui lòng xác thực sinh viên",
      user,
      syncData: syncStore,
    });
  });

  // POST verify student
  app.post("/api/verify-student", (req, res) => {
    const { university, studentId, cardImage, cardImageName } = req.body;

    if (!university || !studentId) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn trường và nhập MSSV" });
    }

    syncStore.verification = {
      university,
      studentId,
      cardImage: cardImage || syncStore.verification.cardImage,
      cardImageName: cardImageName || "the_sinh_vien.png",
      status: "verified",
      submittedAt: new Date().toISOString(),
    };

    if (syncStore.currentUser) {
      syncStore.currentUser.university = university;
      syncStore.currentUser.studentId = studentId;
      syncStore.currentUser.isVerified = true;
      syncStore.currentUser.verificationStatus = "verified";
      syncStore.currentUser.verifiedAt = new Date().toISOString();

      const idx = syncStore.users.findIndex((u) => u.id === syncStore.currentUser?.id);
      if (idx >= 0) {
        syncStore.users[idx] = { ...syncStore.currentUser };
      }
    }

    syncStore.lastSyncedAt = new Date().toISOString();
    syncStore.version += 1;

    res.json({
      success: true,
      message: "Xác thực thẻ sinh viên thành công!",
      verification: syncStore.verification,
      user: syncStore.currentUser,
      syncData: syncStore,
    });
  });

  // POST reset state
  app.post("/api/sync/reset", (_req, res) => {
    syncStore = {
      version: 1,
      lastSyncedAt: new Date().toISOString(),
      users: [
        {
          id: "user-001",
          fullName: "Nguyễn Văn A",
          phone: "0912 345 678",
          bio: "Sinh viên ĐH Quốc Tế - ĐHQG TP.HCM",
          university: "Đại học Bách Khoa - ĐHQG TP.HCM",
          studentId: "21127089",
          isVerified: true,
          verificationStatus: "verified",
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      currentUser: {
        id: "user-001",
        fullName: "Nguyễn Văn A",
        phone: "0912 345 678",
        bio: "Sinh viên ĐH Quốc Tế - ĐHQG TP.HCM",
        university: "Đại học Bách Khoa - ĐHQG TP.HCM",
        studentId: "21127089",
        isVerified: true,
        verificationStatus: "verified",
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      verification: {
        university: "Đại học Bách Khoa - ĐHQG TP.HCM",
        studentId: "21127089",
        cardImage: null,
        status: "verified",
        submittedAt: new Date().toISOString(),
      },
      rides: [
        {
          id: "ride-1",
          userId: "user-001",
          userName: "Nguyễn Văn A",
          userPhone: "0912 345 678",
          userUniversity: "Đại học Bách Khoa - ĐHQG TP.HCM",
          isVerified: true,
          type: "driver",
          departure: "Ký túc xá Khu B, ĐHQG TP.HCM",
          destination: "Cơ sở 1 ĐH Bách Khoa (268 Lý Thường Kiệt, Q.10)",
          date: "Hôm nay",
          time: "07:15 sáng",
          seats: 2,
          priceNote: "Chia sẻ xăng 15k/bạn",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    res.json({ success: true, message: "Đã khôi phục dữ liệu mẫu ban đầu", data: syncStore });
  });

  // Vite middleware for development or static in production
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cogo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
