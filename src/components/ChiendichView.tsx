import React, { useState } from 'react';
import { Campaign, Player } from '../types';
import { Briefcase, Plus, Calendar, AlertCircle, X, Users, Check, Flame, Sliders } from 'lucide-react';

interface ChiendichViewProps {
  campaigns: Campaign[];
  players: Player[];
  onAddCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  onUpdateCampaign: (campaign: Campaign) => void;
}

export default function ChiendichView({ campaigns, players, onAddCampaign, onUpdateCampaign }: ChiendichViewProps) {
  const [isAddCampModalOpen, setIsAddCampModalOpen] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampPhase, setNewCampPhase] = useState('Phase 1');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampDeadline, setNewCampDeadline] = useState('2026-09-01');
  const [newCampCat, setNewCampCat] = useState('Hạ tầng');
  
  const [editingCampId, setEditingCampId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState<number>(0);

  const handleSubmitNewCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) return;

    onAddCampaign({
      name: newCampName,
      phase: newCampPhase,
      description: newCampDesc,
      teamIds: [],
      deadline: newCampDeadline,
      progress: 10,
      category: newCampCat
    });

    // Reset Form
    setNewCampName('');
    setNewCampPhase('Phase 1');
    setNewCampDesc('');
    setNewCampDeadline('2026-09-01');
    setNewCampCat('Hạ tầng');
    setIsAddCampModalOpen(false);
  };

  const startEditProgress = (camp: Campaign) => {
    setEditingCampId(camp.id);
    setEditProgress(camp.progress);
  };

  const saveProgressChange = (camp: Campaign) => {
    onUpdateCampaign({
      ...camp,
      progress: editProgress
    });
    setEditingCampId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Vận Hành <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonPink to-gold">Chiến Dịch</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Giám sát thời hạn, phân phối khối lượng công việc và cập nhật tiến độ tự động qua từng cột mốc (Phase 1 - 4).
          </p>
        </div>
        <button
          onClick={() => setIsAddCampModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-neonPink/20 hover:bg-neonPink/30 text-neonPink border border-neonPink/30 hover:shadow-[0_0_15px_rgba(255,0,85,0.25)] transition-all font-medium flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Khởi tạo chiến dịch
        </button>
      </div>

      {/* Campaigns list */}
      <div className="space-y-6">
        {campaigns.length === 0 ? (
          <div className="text-center p-12 bg-white/2 rounded-xl border border-dashed border-white/10">
            <p className="text-slate-500">Chưa có chiến dịch nào được khởi chạy trên hệ thống.</p>
          </div>
        ) : (
          campaigns.map(camp => {
            const assignedPms = players.filter(p => camp.teamIds.includes(p.id));
            const isEditing = editingCampId === camp.id;

            // Compute border accent based on category
            let accentBorder = "border-l-neonCyan";
            let phaseColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
            if (camp.phase === 'Phase 1') {
              phaseColor = "bg-green-500/10 text-green-400 border-green-500/20";
              accentBorder = "border-l-green-400";
            } else if (camp.phase === 'Phase 2') {
              phaseColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
              accentBorder = "border-l-yellow-400";
            } else if (camp.phase === 'Phase 3') {
              phaseColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
              accentBorder = "border-l-sky-400";
            } else if (camp.phase === 'Phase 4') {
              phaseColor = "bg-neonPink/20 text-neonPink border-neonPink/30";
              accentBorder = "border-l-neonPink";
            }

            return (
              <div
                key={camp.id}
                className={`glass-panel rounded-2xl p-6 border-l-4 ${accentBorder} hover:border-l-white transition-all`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  {/* Campaign Core Info */}
                  <div className="flex-1 space-y-3.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">{camp.name}</h2>
                      <span className={`text-[10px] uppercase font-bold tracking-wider border px-2.5 py-0.5 rounded-full ${phaseColor}`}>
                        {camp.phase}
                      </span>
                      <span className="text-[10px] bg-white/5 border border-white/5 text-slate-400 font-semibold px-2 py-0.5 rounded-md">
                        {camp.category}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl">
                      {camp.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
                      
                      {/* Roster list */}
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">Điều phối:</span>
                        {assignedPms.length === 0 ? (
                          <span className="text-slate-500 italic">Chưa bổ nhiệm (Đang chờ)</span>
                        ) : (
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {assignedPms.map(pm => (
                              <div
                                key={pm.id}
                                title={`${pm.name} (${pm.role})`}
                                className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#14141e] flex items-center justify-center font-bold text-[10px] text-white cursor-help select-none"
                              >
                                {pm.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-4 h-4 text-neonPink" />
                        <span>Hạn hoàn thành: <span className="text-white font-semibold font-mono">{camp.deadline}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Progress Bar & Editor */}
                  <div className="w-full md:w-64 flex flex-col justify-center bg-white/2 border border-white/5 p-4 rounded-xl space-y-3.5">
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Tiến độ cơ sở:</span>
                      <span className="text-neonCyan font-bold font-mono text-sm">{camp.progress}%</span>
                    </div>

                    {!isEditing ? (
                      <>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-neonCyan to-neonPurple rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                            style={{ width: `${camp.progress}%` }}
                          />
                        </div>

                        <button
                          onClick={() => startEditProgress(camp)}
                          className="w-full py-1.5 rounded bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 transition-colors border border-white/5 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sliders className="w-3 h-3" /> Điều chỉnh tiến độ
                        </button>
                      </>
                    ) : (
                      <div className="space-y-3">
                        {/* Range slider */}
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={editProgress}
                            onChange={(e) => setEditProgress(Number(e.target.value))}
                            className="flex-1 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-neonCyan"
                          />
                          <span className="text-xs text-white font-bold w-8 text-right font-mono">{editProgress}%</span>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingCampId(null)}
                            className="flex-1 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] text-slate-400 hover:text-white cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => saveProgressChange(camp)}
                            className="flex-1 py-1 bg-neonCyan/20 hover:bg-neonCyan/30 rounded text-[10px] text-neonCyan font-bold cursor-pointer"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: ADD CAMPAIGN */}
      {isAddCampModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f1c] border border-white/15 w-full max-w-md rounded-2xl p-6 relative overflow-hidden animate-fadeInUp">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsAddCampModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Briefcase className="text-neonPink w-5 h-5" />
              Khởi Tạo Dự Án Mới
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Thiết lập mục tiêu và thông tin hệ thống để điều phối các PM vận hành.
            </p>

            <form onSubmit={handleSubmitNewCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tên chiến dịch / dự án</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chiến dịch Q3 Push"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonPink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Giai đoạn (Phase)</label>
                  <select
                    value={newCampPhase}
                    onChange={(e) => setNewCampPhase(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonPink"
                  >
                    <option value="Phase 1">Phase 1 (Khởi tạo)</option>
                    <option value="Phase 2">Phase 2 (Xây dựng)</option>
                    <option value="Phase 3">Phase 3 (Tối ưu)</option>
                    <option value="Phase 4">Phase 4 (Hoàn tất)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phân loại</label>
                  <select
                    value={newCampCat}
                    onChange={(e) => setNewCampCat(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonPink"
                  >
                    <option value="Hạ tầng">Hạ tầng mạng</option>
                    <option value="Tiếp thị">Tiếp thị & Viral</option>
                    <option value="Phát triển">Phát triển phần mềm</option>
                    <option value="Vận hành">Vận hành sản phẩm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hạn chót hoàn thành (Deadline)</label>
                <input
                  type="date"
                  required
                  value={newCampDeadline}
                  onChange={(e) => setNewCampDeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonPink font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mô tả chi tiết và mục tiêu</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Nhập nội dung tóm tắt đầu việc và kỳ vọng hiệu suất bàn giao..."
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonPink placeholder-slate-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCampModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors font-semibold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-neonPink/25 hover:bg-neonPink/35 border border-neonPink/40 text-neonPink font-bold text-xs cursor-pointer"
                >
                  Khởi chạy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
