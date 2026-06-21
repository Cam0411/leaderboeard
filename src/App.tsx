import React, { useState, useEffect } from 'react';
import { Player, Campaign, SystemLog, SystemMetrics } from './types';
import { initialPlayers, initialCampaigns, initialLogs, initialMetrics } from './sampleData';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import NhansuView from './components/NhansuView';
import ChiendichView from './components/ChiendichView';
import HethongView from './components/HethongView';
import { Menu, Box } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core Application Shared State
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [metrics, setMetrics] = useState<SystemMetrics>(initialMetrics);

  // Update a single player state
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  // Add a brand new player
  const handleAddPlayer = (newPlayerData: Omit<Player, 'id'> & { id?: string }) => {
    const nextIndex = players.length + 1;
    const newId = newPlayerData.id || `PM_${String(nextIndex).padStart(3, '0')}`;
    const newPlayer: Player = {
      ...newPlayerData,
      id: newId,
    };
    setPlayers(prev => [...prev, newPlayer]);
    
    // Log event
    handleAddLog(`Khởi tạo nhân sự mới: PM ${newPlayer.name} (${newPlayer.role}) tham gia hệ thống.`, 'INFO');
  };

  // Add a new campaign
  const handleAddCampaign = (newCampData: Omit<Campaign, 'id'>) => {
    const nextIndex = campaigns.length + 1;
    const newId = `CAMP_${String(nextIndex).padStart(3, '0')}`;
    const newCamp: Campaign = {
      ...newCampData,
      id: newId,
    };
    setCampaigns(prev => [...prev, newCamp]);

    // Log event
    handleAddLog(`Khởi động chiến dịch mới: '${newCamp.name}' [${newCamp.phase}].`, 'INFO');
  };

  // Update a campaign
  const handleUpdateCampaign = (updatedCamp: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCamp.id ? updatedCamp : c));
  };

  // Full-overwrite for campaign updates
  const handleUpdateCampaignsList = (updatedList: Campaign[]) => {
    setCampaigns(updatedList);
  };

  // Log Generator
  const handleAddLog = (message: string, type: 'INFO' | 'WARN' | 'ERROR') => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestampStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const newLog: SystemLog = {
      id: `log_custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timestampStr,
      type,
      message,
    };

    setLogs(prev => [...prev, newLog]);
  };

  // Clear log entries
  const handleClearLogs = () => {
    setLogs([]);
  };

  // Update System metrics
  const handleUpdateMetrics = (updatedMetrics: SystemMetrics) => {
    setMetrics(updatedMetrics);
  };

  // Live simulation background ticker: Appends custom simulated logs every 45 seconds to keep dashboard vivid
  useEffect(() => {
    const logsTemplates = [
      { msg: 'Lưu lượng máy chủ mô phỏng tăng nhẹ do PM kiểm thử quy trình.', type: 'INFO' },
      { msg: 'Chu kỳ sao lưu cơ sở dữ liệu hoàn tất an toàn.', type: 'INFO' },
      { msg: 'Phát hiện cảnh báo hành vi xử lý quá hạn Phase 3 từ PM_004.', type: 'WARN' },
      { msg: 'Đồng bộ hóa CDN quốc tế thành công cho tất cả các nút truyền tải.', type: 'INFO' }
    ];

    const timer = setInterval(() => {
      // 1. Pick random template
      const template = logsTemplates[Math.floor(Math.random() * logsTemplates.length)];
      handleAddLog(template.msg, template.type as any);

      // 2. Slightly fluctuate metrics to make dashboard look "vivid"
      setMetrics(prev => {
        const loadFluctuates = Math.min(95, Math.max(15, prev.serverLoad + Math.floor(Math.random() * 9 - 4)));
        const memFluctuates = Math.min(95, Math.max(20, prev.memoryUsage + Math.floor(Math.random() * 5 - 2)));
        const netFluctuates = parseFloat(Math.min(4.8, Math.max(0.4, prev.networkInGbps + (Math.random() * 0.4 - 0.2))).toFixed(1));
        return {
          serverLoad: loadFluctuates,
          memoryUsage: memFluctuates,
          networkInGbps: netFluctuates
        };
      });
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bgDark text-slate-200 antialiased relative">
      
      {/* Animated Aesthetic Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Orb-1: Top Left Neon Cyan */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-neonCyan/10 blur-[100px] animate-pulse duration-[8000ms]" />
        {/* Orb-2: Bottom Right Neon Purple */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-neonPurple/10 blur-[90px] animate-pulse duration-[12000ms]" />
        {/* Orb-3: Mid Screen Neon Pink */}
        <div className="absolute top-[40%] left-[35%] w-[25vw] h-[25vw] rounded-full bg-neonPink/5 blur-[80px]" />
      </div>

      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Right Area container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Mobile Header (Visible below MD) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-surface/30 backdrop-blur-md border-b border-white/5 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonCyan to-neonPurple flex items-center justify-center">
              <Box className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">
              SYS<span className="text-neonCyan">CORE</span>
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-slate-300 hover:text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Outer scroll container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && (
              <DashboardView
                players={players}
                onUpdatePlayer={handleUpdatePlayer}
                onAddPlayer={handleAddPlayer}
              />
            )}

            {activeTab === 'nhansu' && (
              <NhansuView
                players={players}
                campaigns={campaigns}
                onUpdatePlayer={handleUpdatePlayer}
                onUpdateCampaigns={handleUpdateCampaignsList}
              />
            )}

            {activeTab === 'chiendich' && (
              <ChiendichView
                campaigns={campaigns}
                players={players}
                onAddCampaign={handleAddCampaign}
                onUpdateCampaign={handleUpdateCampaign}
              />
            )}

            {activeTab === 'hethong' && (
              <HethongView
                logs={logs}
                metrics={metrics}
                onAddLog={handleAddLog}
                onClearLogs={handleClearLogs}
                onUpdateMetrics={handleUpdateMetrics}
              />
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
