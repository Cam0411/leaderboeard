import React, { useState } from 'react';
import { Player, Campaign } from '../types';
import { Users, Search, Filter, Ban, CheckCircle, RefreshCcw, Briefcase, Award, TrendingUp, ShieldAlert, Check } from 'lucide-react';

interface NhansuViewProps {
  players: Player[];
  campaigns: Campaign[];
  onUpdatePlayer: (updated: Player) => void;
  onUpdateCampaigns: (campaigns: Campaign[]) => void;
}

export default function NhansuView({ players, campaigns, onUpdatePlayer, onUpdateCampaigns }: NhansuViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPm, setSelectedPm] = useState<Player | null>(null);

  // Filtered list
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Assign PM to a Campaign
  const handleAssignToProject = (pm: Player, campaignId: string) => {
    // 1. If assigned to another project, remove from previous project first
    const updatedCampaigns = campaigns.map(camp => {
      // Remove PM from existing campaign if present
      let updatedTeamIds = camp.teamIds.filter(id => id !== pm.id);
      
      // Add PM to new campaign
      if (camp.id === campaignId) {
        if (!updatedTeamIds.includes(pm.id)) {
          updatedTeamIds = [...updatedTeamIds, pm.id];
        }
      }
      return { ...camp, teamIds: updatedTeamIds };
    });

    onUpdateCampaigns(updatedCampaigns);

    // 2. Update player's assigned project text
    const campName = campaigns.find(c => c.id === campaignId)?.name || 'Đang chờ việc';
    onUpdatePlayer({
      ...pm,
      project: campName
    });

    // Update state
    if (selectedPm && selectedPm.id === pm.id) {
      setSelectedPm({ ...pm, project: campName });
    }
  };

  // Release PM from active project (make idle)
  const handleReleaseProject = (pm: Player) => {
    const updatedCampaigns = campaigns.map(camp => ({
      ...camp,
      teamIds: camp.teamIds.filter(id => id !== pm.id)
    }));

    onUpdateCampaigns(updatedCampaigns);

    onUpdatePlayer({
      ...pm,
      project: 'Đang chờ việc'
    });

    if (selectedPm && selectedPm.id === pm.id) {
      setSelectedPm({ ...pm, project: 'Đang chờ việc' });
    }
  };

  // Change status of PM
  const handleToggleStatus = (pm: Player, newStatus: 'online' | 'idle' | 'offline') => {
    const updated = { ...pm, status: newStatus };
    onUpdatePlayer(updated);
    if (selectedPm && selectedPm.id === pm.id) {
      setSelectedPm(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Hồ Sơ <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonPurple to-neonCyan">Nhân Sự</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Đánh giá năng lực nghiệp vụ, theo dõi tiến trình và điều phối Project Managers vào các chiến dịch phù hợp.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/30 backdrop-blur-md p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên, ID hoặc chức vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neonPurple placeholder-slate-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pr-1">
          <div className="flex bg-slate-900 border border-white/10 rounded-lg p-1 text-xs">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'online', label: 'Online' },
              { id: 'idle', label: 'Idle' },
              { id: 'offline', label: 'Offline' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-neonPurple/20 text-neonPurple font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panel splitting list vs details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PM Inventory Card Grid (7/12 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlayers.length === 0 ? (
            <div className="col-span-2 text-center p-12 bg-white/2 rounded-xl border border-dashed border-white/10">
              <p className="text-slate-500">Không tìm thấy Project Manager nào khớp điều kiện lọc.</p>
            </div>
          ) : (
            filteredPlayers.map(pm => {
              const statusColors = pm.status === 'online' 
                ? 'bg-green-400 border-green-500/20 text-green-400' 
                : pm.status === 'idle' 
                ? 'bg-yellow-400 border-yellow-500/20 text-yellow-400' 
                : 'bg-slate-500 border-slate-500/25 text-slate-400';

              const isSelected = selectedPm?.id === pm.id;

              return (
                <div
                  key={pm.id}
                  onClick={() => setSelectedPm(pm)}
                  className={`glass-panel p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                    isSelected ? 'border-neonPurple shadow-[0_0_20px_rgba(138,43,226,0.15)] bg-neonPurple/5' : ''
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 ${statusColors}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pm.status === 'online' ? 'bg-green-400 animate-pulse' : pm.status === 'idle' ? 'bg-yellow-400' : 'bg-slate-400'}`} />
                      {pm.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/15 flex items-center justify-center text-sm font-bold text-white uppercase select-none">
                      {pm.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-neonPurple transition-colors">{pm.name}</h3>
                      <p className="text-xs text-slate-500">{pm.role} • ID: {pm.id}</p>
                    </div>
                  </div>

                  {/* Project & Speed gauge */}
                  <div className="space-y-3.5 border-t border-white/5 pt-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Chiến dịch đảm nhiệm:</span>
                      <span className={`font-semibold ${pm.project !== 'Đang chờ việc' ? 'text-white' : 'text-slate-500 italic'}`}>
                        {pm.project}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400 text-xs font-sans">Hiệu suất nghiệp vụ:</span>
                        <span className="text-neonPurple font-bold">{pm.efficiency}%</span>
                      </div>
                      <div className="w-full bg-[#0a0a14] h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-neonPurple to-neonCyan shadow-[0_0_6px_#8a2be2] rounded-full transition-all duration-300"
                          style={{ width: `${pm.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Button prompt indicator */}
                  <div className="mt-4 text-[11px] text-right text-slate-500 group-hover:text-neonCyan transition-colors">
                    Chi tiết & điều phối &rarr;
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PM DETAIL DRAWER (5/12 cols) */}
        <div className="lg:col-span-5">
          {selectedPm ? (
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-neonPurple/20 bg-gradient-to-b from-[#0f0f1c]/40 to-black/20 animate-fadeInUp">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setSelectedPm(null)}
                  className="text-slate-500 hover:text-white p-1 hover:bg-white/5 rounded-lg text-xs"
                >
                  Đóng &times;
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neonPurple to-neonCyan p-0.5 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
                  <div className="w-full h-full bg-[#0d0d18] rounded-2xl flex items-center justify-center font-bold text-xl text-white">
                    {selectedPm.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedPm.name}</h3>
                  <p className="text-sm text-slate-400 font-mono text-neonPurple">{selectedPm.id} • {selectedPm.role}</p>
                </div>
              </div>

              {/* Status selectors */}
              <div className="mb-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Thiết lập trạng thái hoạt động</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'online', label: 'Online', color: 'text-green-400 bg-green-400/5 border-green-500/20' },
                    { id: 'idle', label: 'Idle', color: 'text-yellow-400 bg-yellow-400/5 border-yellow-500/20' },
                    { id: 'offline', label: 'Offline', color: 'text-slate-400 bg-slate-400/5 border-slate-500/20' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleStatus(selectedPm, item.id as any)}
                      className={`py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        selectedPm.status === item.id 
                          ? 'border-neonPurple bg-neonPurple/15 text-white' 
                          : 'border-white/5 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        item.id === 'online' ? 'bg-green-400' : item.id === 'idle' ? 'bg-yellow-400' : 'bg-slate-400'
                      }`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Performance Indexes */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award className="w-4 h-4 text-neonPurple" />
                    <span className="text-xs text-slate-400 font-medium">Tích lũy</span>
                  </div>
                  <p className="text-lg font-bold text-white">{selectedPm.score.toLocaleString()} <span className="text-xs font-normal text-neonPurple font-mono">GC</span></p>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-neonPink" />
                    <span className="text-xs text-slate-400 font-medium">Vi phạm thủ tục</span>
                  </div>
                  <p className="text-lg font-bold text-white">{selectedPm.violationsRate}% <span className="text-xs font-normal text-slate-400">(Avg)</span></p>
                </div>
              </div>

              {/* Task coordinator */}
              <div className="border-t border-white/5 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Điều phối vào chiến dịch</h4>
                  {selectedPm.project !== 'Đang chờ việc' && (
                    <button
                      onClick={() => handleReleaseProject(selectedPm)}
                      className="text-xs text-neonPink hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="w-3 h-3" /> Thu hồi dự án
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500">PM đang tham gia: <span className="text-slate-300 font-semibold">{selectedPm.project}</span></p>
                  
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {campaigns.map(camp => {
                      const isCurrent = selectedPm.project === camp.name;
                      return (
                        <button
                          key={camp.id}
                          disabled={isCurrent}
                          onClick={() => handleAssignToProject(selectedPm, camp.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                            isCurrent 
                              ? 'bg-neonPurple/5 border-neonPurple/30 text-neonPurple cursor-default' 
                              : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <div>
                              <p className="font-semibold text-white">{camp.name}</p>
                              <p className="text-[10px] text-slate-500">{camp.phase}</p>
                            </div>
                          </div>
                          {isCurrent ? (
                            <Check className="w-4 h-4 text-neonPurple" />
                          ) : (
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">Bổ nhiệm</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Users className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="font-bold text-white text-base">Thông tin nhân sự</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs px-4">
                Chọn một Project Manager bất kỳ trên danh sách để thiết lập trạng thái, đánh giá chỉ số vi phạm hành vi, hoặc phân phối chiến dịch vận hành.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
