import { Player, Campaign, SystemLog, SystemMetrics } from './types';

export const initialPlayers: Player[] = [
  {
    id: "PM_001",
    name: "Thanh Thúy",
    score: 1000,
    role: "Senior PM",
    project: "Project Global Expansion",
    efficiency: 98,
    status: 'online',
    playtimeHistory: [6.5, 7.8, 5.5, 9.2, 8.1],
    violationsRate: 15
  },
  {
    id: "PM_002",
    name: "Dương Nguyên Cẩm",
    score: 800,
    role: "Project Manager",
    project: "Đang chờ việc",
    efficiency: 85,
    status: 'idle',
    playtimeHistory: [5.2, 6.4, 7.0, 5.8, 8.0],
    violationsRate: 22
  },
  {
    id: "PM_003",
    name: "Hoàng Vy",
    score: 670,
    role: "Project Manager",
    project: "Marketing Q3 Push",
    efficiency: 90,
    status: 'online',
    playtimeHistory: [7.1, 5.9, 6.8, 8.4, 7.5],
    violationsRate: 18
  },
  {
    id: "PM_004",
    name: "Kim Anh",
    score: 650,
    role: "Project Manager",
    project: "Alpha Campaign",
    efficiency: 92,
    status: 'offline',
    playtimeHistory: [8.0, 7.4, 6.2, 7.9, 9.1],
    violationsRate: 25
  },
  {
    id: "PM_005",
    name: "Diễm Hương",
    score: 500,
    role: "Junior PM",
    project: "Website Redesign",
    efficiency: 79,
    status: 'online',
    playtimeHistory: [9.5, 8.2, 7.8, 8.9, 10.0],
    violationsRate: 35
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: "CAMP_001",
    name: "Project Global Expansion",
    phase: "Phase 3",
    description: "Mở rộng hạ tầng máy chủ sang khu vực Châu Âu và tối ưu hóa hệ thống tải nội dung CDN.",
    teamIds: ["PM_001", "PM_002"],
    deadline: "2026-08-15",
    progress: 75,
    category: "Hạ tầng"
  },
  {
    id: "CAMP_002",
    name: "Marketing Q3 Push",
    phase: "Phase 1",
    description: "Chiến dịch tuyển dụng thành viên mới qua các kênh social và nâng cao tương tác người dùng cũ.",
    teamIds: ["PM_003"],
    deadline: "2026-09-30",
    progress: 20,
    category: "Tiếp thị"
  },
  {
    id: "CAMP_003",
    name: "Website Redesign v3.0",
    phase: "Phase 2",
    description: "Cải tiến giao diện người dùng website chính thức theo hướng tối giản (Glassmorphism & Neon).",
    teamIds: ["PM_005"],
    deadline: "2026-07-25",
    progress: 45,
    category: "Phát triển"
  }
];

export const initialLogs: SystemLog[] = [
  { id: "log_1", timestamp: "2026-06-21 15:20:01", type: "INFO", message: "User PM_001 (Thanh Thúy) đăng nhập thành công." },
  { id: "log_2", timestamp: "2026-06-21 15:21:14", type: "INFO", message: "Cơ sở dữ liệu chiến dịch Alpha đã được đồng bộ hóa." },
  { id: "log_3", timestamp: "2026-06-21 15:25:33", type: "WARN", message: "Phát hiện độ trễ cao tại máy chủ phân tán EU-Node-3. Đang tự động định tuyến tải lượng tải..." },
  { id: "log_4", timestamp: "2026-06-21 15:28:45", type: "ERROR", message: "Lỗi kéo nạp dữ liệu API ngoài: Đã vượt quá thời gian phản hồi (timeout 5000ms)." },
  { id: "log_5", timestamp: "2026-06-21 15:29:10", type: "INFO", message: "Tiến trình tự khắc phục hoàn thành thành công. Trạng thái máy chủ ổn định trở lại." },
  { id: "log_6", timestamp: "2026-06-21 15:30:00", type: "INFO", message: "Khởi động tiến trình sao lưu định kỳ: backup_daily_db." }
];

export const initialMetrics: SystemMetrics = {
  serverLoad: 42,
  memoryUsage: 78,
  networkInGbps: 1.2
};
