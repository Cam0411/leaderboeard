import React, { useState } from 'react';
import { Player } from '../types';
import { Trophy, Clock, ShieldAlert, Coins, AlertTriangle, Download, Clipboard, Plus, UserCheck, X, Edit2, TrendingUp } from 'lucide-react';

interface DashboardViewProps {
  players: Player[];
  onUpdatePlayer: (updated: Player) => void;
  onAddPlayer: (player: Omit<Player, 'id'> & { id?: string }) => void;
}

export default function DashboardView({ players, onUpdatePlayer, onAddPlayer }: DashboardViewProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hoveredLinePoint, setHoveredLinePoint] = useState<number | null>(null);
  const [selectedPmForTimeline, setSelectedPmForTimeline] = useState<string>('all');

  // Form states for adding/editing
  const [formName, setFormName] = useState('');
  const [formScore, setFormScore] = useState(0);
  const [formRole, setFormRole] = useState('Project Manager');
  const [formEfficiency, setFormEfficiency] = useState(90);
  const [formStatus, setFormStatus] = useState<'online' | 'idle' | 'offline'>('online');
  const [formViolations, setFormViolations] = useState(20);

  // Sorting player score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const maxScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 1000;

  // Calculate Overall Averages
  const totalScore = players.reduce((sum, p) => sum + p.score, 0);
  const avgViolations = players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.violationsRate, 0) / players.length) : 0;
  const avgEfficiency = players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.efficiency, 0) / players.length) : 0;

  // Compute standard playtime arrays based on whether all are selected or a single PM
  let activeTimeline: number[] = [6.5, 7.8, 5.5, 9.2, 8.1]; // default overall average
  if (selectedPmForTimeline !== 'all') {
    const pm = players.find(p => p.id === selectedPmForTimeline);
    if (pm && pm.playtimeHistory && pm.playtimeHistory.length > 0) {
      activeTimeline = pm.playtimeHistory;
    }
  } else {
    // calculate average of all players for each index (min 5 points)
    const pointsCount = 5;
    const computedPoints = Array(pointsCount).fill(0);
    const counts = Array(pointsCount).fill(0);
    
    players.forEach(p => {
      p.playtimeHistory.forEach((val, idx) => {
        if (idx < pointsCount) {
          computedPoints[idx] += val;
          counts[idx] += 1;
        }
      });
    });
    
    activeTimeline = computedPoints.map((sum, idx) => {
      const count = counts[idx] || 1;
      return parseFloat((sum / count).toFixed(1));
    });
  }

  // Handle Export CSV
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Rank,ID,Ten PM,Vai Tro,GlobalCoin,Hieu Suat (%25),Sai sot (%25),Trang Thai\n";
    
    sortedPlayers.forEach((player, idx) => {
      csvContent += `${idx + 1},${player.id},${player.name},${player.role},${player.score},${player.efficiency},${player.violationsRate},${player.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "syscore_leaderboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy data to clipboard formatted for Excel/Google Sheets (TSV)
  const [copyFeedback, setCopyFeedback] = useState(false);
  const copyToClipboard = () => {
    let text = "Xếp Hạng\tMã PM\tHọ và Tên\tChức Vụ\tĐiểm GlobalCoin\tHiệu Suất (%)\tHành Vi Sai Lệch (%)\tTrạng Thái\n";
    sortedPlayers.forEach((p, idx) => {
      text += `${idx + 1}\t${p.id}\t${p.name}\t${p.role}\t${p.score}\t${p.efficiency}%\t${p.violationsRate}%\t${p.status}\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }).catch(err => {
      console.error("Không thể copy: ", err);
    });
  };

  const openEditModal = (player: Player) => {
    setSelectedPlayer(player);
    setFormName(player.name);
    setFormScore(player.score);
    setFormRole(player.role);
    setFormEfficiency(player.efficiency);
    setFormStatus(player.status);
    setFormViolations(player.violationsRate);
    setIsEditModalOpen(true);
  };

  const saveEditedPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    onUpdatePlayer({
      ...selectedPlayer,
      name: formName,
      score: Number(formScore),
      role: formRole,
      efficiency: Number(formEfficiency),
      status: formStatus,
      violationsRate: Number(formViolations)
    });
    setIsEditModalOpen(false);
    setSelectedPlayer(null);
  };

  const handleAddNewPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    onAddPlayer({
      name: formName,
      score: Number(formScore) || 200,
      role: formRole,
      project: "Đang chờ việc",
      efficiency: Number(formEfficiency) || 80,
      status: formStatus,
      playtimeHistory: [5.0, 6.0, 7.5, 6.2, 8.0],
      violationsRate: Number(formViolations) || 20
    });

    setIsAddModalOpen(false);
    // Reset fields
    setFormName('');
    setFormScore(0);
    setFormRole('Project Manager');
    setFormEfficiency(90);
    setFormStatus('online');
    setFormViolations(20);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Quản Trị <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonCyan to-neonPurple">Hiệu Suất</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl">
            Giám sát năng lực điều phối, thời lượng kiểm soát và tỷ lệ xử lý rủi ro của Project Managers theo thời gian thực.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setFormName('');
              setFormScore(300);
              setFormRole('Project Manager');
              setFormEfficiency(85);
              setFormStatus('online');
              setFormViolations(15);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-lg bg-neonCyan/15 hover:bg-neonCyan/25 text-neonCyan border border-neonCyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all font-medium flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm PM mới
          </button>
          
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-lg bg-surface hover:bg-white/10 text-sm font-medium hover:border-neonCyan/50 transition-colors flex items-center gap-2 border border-white/10 text-white cursor-pointer"
          >
            <Download className="w-4 h-4 text-neonCyan" /> Tải file CSV
          </button>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2.5 rounded-lg bg-surface hover:bg-white/10 text-sm font-medium hover:border-neonPurple/50 transition-colors flex items-center gap-2 border border-white/10 text-white relative cursor-pointer"
          >
            <Clipboard className="w-4 h-4 text-neonPurple" /> 
            {copyFeedback ? 'Đã sao chép!' : 'Excel / Sheets'}
          </button>
        </div>
      </div>

      {/* Main Grid: Leaderboard (Left) vs Charts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEADERBOARD SECTION (4 columns) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col h-[640px] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-neonCyan/5 rounded-full blur-2xl" />
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <Trophy className="text-gold w-5 h-5 drop-shadow-[0_0_6px_#ffd700]" />
              Bảng Xếp Hạng
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider bg-neonCyan/10 text-neonCyan px-3 py-1.5 rounded-md border border-neonCyan/20">
              GlobalCoin
            </span>
          </div>
          
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Danh sách nhân sự được sắp xếp theo thành tích tích lũy. Click chọn một dòng để điều chỉnh nhanh số điểm/coin.
          </p>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {sortedPlayers.map((player, index) => {
              const rank = index + 1;
              const percent = (player.score / maxScore) * 100;
              
              // Colors based on Rank
              let rankStyle = "text-slate-400";
              let cardBg = "border-white/5 bg-white/5";
              let scoreColor = "text-slate-200";
              let barColor = "from-neonCyan to-blue-500 shadow-[0_0_8px_rgba(0,240,255,0.5)]";

              if (rank === 1) {
                rankStyle = "text-gold";
                cardBg = "border-gold/25 bg-gradient-to-r from-gold/10 to-transparent shadow-[inset_0_0_15px_rgba(255,215,0,0.05)]";
                scoreColor = "text-gold font-bold";
                barColor = "from-gold to-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.5)]";
              } else if (rank === 2) {
                rankStyle = "text-silver";
                cardBg = "border-silver/20 bg-gradient-to-r from-silver/5 to-transparent";
                scoreColor = "text-silver font-medium";
                barColor = "from-slate-300 to-slate-400 shadow-[0_0_8px_rgba(192,192,192,0.4)]";
              } else if (rank === 3) {
                rankStyle = "text-bronze";
                cardBg = "border-bronze/15 bg-gradient-to-r from-bronze/5 to-transparent";
                scoreColor = "text-orange-400";
                barColor = "from-orange-400 to-amber-600 shadow-[0_0_8px_rgba(205,127,50,0.4)]";
              }

              return (
                <div
                  key={player.id}
                  onClick={() => openEditModal(player)}
                  className={`group p-4 rounded-xl border ${cardBg} hover:border-neonCyan/40 transition-all duration-300 relative cursor-pointer`}
                >
                  {rank === 1 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-950/80 border border-white/10 flex items-center justify-center text-sm font-semibold">
                        <span className={rankStyle}>{rank}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-white font-medium text-sm group-hover:text-neonCyan transition-colors">
                            {player.name}
                          </h3>
                          <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-slate-500">
                          {player.role} • <span className={player.status === 'online' ? 'text-green-400' : player.status === 'idle' ? 'text-yellow-400' : 'text-slate-500'}>
                            {player.status === 'online' ? 'Online' : player.status === 'idle' ? 'Idle' : 'Offline'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-lg font-bold tracking-tight ${scoreColor}`}>
                        {player.score.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 block -mt-1 font-mono">GC</span>
                    </div>
                  </div>

                  {/* Progress Energy bar */}
                  <div className="w-full bg-[#0a0a14] h-1.5 rounded-full overflow-hidden mt-1 border border-white/5">
                    <div
                      className={`h-full bg-gradient-to-r ${barColor} relative rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHARTS SECTION (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Timeline Line Chart: Playtime duration */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2.5 text-white">
                  <Clock className="text-neonCyan w-5 h-5 drop-shadow-[0_0_6px_#00f0ff]" />
                  Thời Lượng Hoạt Động (Phiên 1 - 5)
                </h2>
                <p className="text-xs text-slate-400">Thời gian tham gia phiên chơi, đo lường bằng phút (Khung chuẩn: 5 - 10 phút/phiên).</p>
              </div>

              {/* Toggles */}
              <select
                value={selectedPmForTimeline}
                onChange={(e) => setSelectedPmForTimeline(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-200 px-2 py-1.5 focus:outline-none focus:border-neonCyan"
              >
                <option value="all">Xem tất cả (Trung bình)</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Custom SVG Line Chart representation */}
            <div className="relative w-full h-[220px] bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col">
              <div className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono">Thời gian (Phút)</div>
              
              <div className="flex-1 w-full relative">
                {/* Y-Axis guide grid-lines */}
                {[10, 8, 6, 4].map((gridVal, i) => {
                  const percentTop = ((11 - gridVal) / 8) * 100; // range 3 - 11
                  return (
                    <div
                      key={gridVal}
                      className="absolute left-0 right-0 border-t border-white/5 flex items-center justify-start text-[10px] text-slate-500 font-mono"
                      style={{ top: `${percentTop}%` }}
                    >
                      <span className="absolute -left-1 transform -translate-x-full pr-1">{gridVal}m</span>
                    </div>
                  );
                })}

                {/* Draw SVG Line */}
                <svg className="w-full h-full overflow-visible absolute top-0 left-0" viewBox="0 0 500 150" restoreAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Polyline Path generator */}
                  {(() => {
                    const points = activeTimeline.map((val, i) => {
                      const x = (i / 4) * 500;
                      // transform val range (3m to 11m) inside top bounds (0 to 150h)
                      const y = 150 - ((val - 3) / 8) * 150;
                      return { x, y, val, index: i };
                    });

                    // Build line command
                    const lineCmd = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                    const fillCmd = `${lineCmd} L 500 150 L 0 150 Z`;

                    return (
                      <>
                        {/* Area fill */}
                        <path d={fillCmd} fill="url(#chartGlow)" />
                        
                        {/* Glowing Line */}
                        <path
                          d={lineCmd}
                          fill="none"
                          stroke="#00f0ff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                        />

                        {/* Point Circles */}
                        {points.map((p, idx) => (
                          <g key={idx} className="cursor-pointer group">
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="8"
                              fill="#05050a"
                              stroke="#00f0ff"
                              strokeWidth="2.5"
                              onMouseEnter={() => setHoveredLinePoint(idx)}
                              onMouseLeave={() => setHoveredLinePoint(null)}
                            />
                            {hoveredLinePoint === idx && (
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="12"
                                fill="rgba(0, 240, 255, 0.2)"
                                stroke="#00f0ff"
                                strokeWidth="1"
                              />
                            )}
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredLinePoint !== null && (
                  <div
                    className="absolute z-10 bg-slate-950/95 border border-neonCyan/40 px-3 py-1.5 rounded-lg text-xs font-bold text-neonCyan shadow-md transform -translate-x-1/2 -translate-y-full transition-all"
                    style={{
                      left: `${(hoveredLinePoint / 4) * 100}%`,
                      top: `${100 - ((activeTimeline[hoveredLinePoint] - 3) / 8) * 100}%`,
                      marginTop: '-14px'
                    }}
                  >
                    Phiên {hoveredLinePoint + 1}: {activeTimeline[hoveredLinePoint]} phút
                  </div>
                )}
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 border-t border-white/10 pt-1 font-mono">
                <span>Phiên 1</span>
                <span>Phiên 2</span>
                <span>Phiên 3</span>
                <span>Phiên 4</span>
                <span>Phiên 5</span>
              </div>
            </div>
          </div>

          {/* Bottom Side-by-Side Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pie donut: Risk procedural classification */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="text-neonPurple w-44 h-4 w-4 drop-shadow-[0_0_4px_rgba(138,43,226,0.5)]" />
                  Kiểm Soát Quy Trình
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Đầu việc đạt chuẩn (Thành công) vs đầu việc vi phạm quy trình bị phạt trong Phase 3 & 4.
                </p>
              </div>

              {/* Custom SVG Doughnut Chart */}
              <div className="flex items-center justify-around gap-2 mt-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="rgba(255, 0, 85, 0.75)"
                      strokeWidth="3.2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#8a2be2" // Success color purple
                      strokeWidth="3.4"
                      // Stroke properties mapping to the success rate
                      strokeDasharray={`${100 - avgViolations} ${avgViolations}`}
                      strokeDashoffset="0"
                      className="drop-shadow-[0_0_4px_rgba(138,43,100,0.5)]"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-extrabold text-white leading-none">
                      {100 - avgViolations}%
                    </span>
                    <span className="text-[9px] text-[#8a2be2] font-semibold mt-0.5 leading-none">
                      Hợp Lệ
                    </span>
                  </div>
                </div>

                {/* legend items */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-neonPurple" />
                    <span className="text-slate-200">Chuẩn: {100 - avgViolations}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-neonPink" />
                    <span className="text-slate-400">Sai sót: {avgViolations}%</span>
                  </div>
                  <div className="border-t border-white/10 pt-1 text-[10px] text-slate-400 mt-1">
                    Trung bình đội PM
                  </div>
                </div>
              </div>
            </div>

            {/* Micro summary data block */}
            <div className="grid grid-rows-2 gap-4">
              <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border-l-2 border-neonCyan">
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Tổng điểm hệ thống</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {totalScore.toLocaleString()} <span className="text-xs font-normal text-neonCyan font-mono">GC</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-neonCyan/10 flex items-center justify-center">
                  <Coins className="text-neonCyan w-5 h-5" />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border-l-2 border-neonPink">
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider font-sans">Hiệu suất trung bình</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {avgEfficiency}% <span className="text-xs font-normal text-neutral-400">tối ưu</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-neonPink/10 flex items-center justify-center">
                  <TrendingUp className="text-neonPink w-5 h-5" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL: EDIT / COIN ADJUSTMENT WINDOW */}
      {isEditModalOpen && selectedPlayer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f1c] border border-white/15 w-full max-w-md rounded-2xl p-6 relative overflow-hidden animate-fadeInUp">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <UserCheck className="text-neonCyan w-5 h-5" />
              Cập Nhật PM & Điều Chỉnh Điểm
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cập nhật hồ sơ năng lực và cộng/trừ GlobalCoin trực tiếp cho {selectedPlayer.name}.
            </p>

            <form onSubmit={saveEditedPlayer} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mã định danh PM (ID)</label>
                <input
                  type="text"
                  disabled
                  value={selectedPlayer.id}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-slate-500 font-mono text-sm focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonCyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Điểm GlobalCoin (GC)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-neonCyan font-bold text-sm focus:outline-none focus:border-neonCyan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Chức vụ / Vai trò</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonCyan"
                  >
                    <option value="Senior PM">Senior PM</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Junior PM">Junior PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hiệu suất (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formEfficiency}
                    onChange={(e) => setFormEfficiency(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-neonCyan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vi phạm (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formViolations}
                    onChange={(e) => setFormViolations(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-neonCyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Trạng thái hệ thống</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['online', 'idle', 'offline'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormStatus(st)}
                      className={`py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer uppercase ${
                        formStatus === st
                          ? 'bg-neonCyan/15 border-neonCyan text-white'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fast adjustments coins */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
                <p className="text-[11px] text-slate-400">Nút chỉnh nhanh GlobalCoin:</p>
                <div className="flex gap-2">
                  {[-100, -50, +55, +100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormScore(prev => Math.max(0, prev + amt))}
                      className="flex-1 py-1 rounded bg-black/40 hover:bg-slate-800 border border-white/5 text-xs font-semibold text-white transition-opacity cursor-pointer"
                    >
                      {amt > 0 ? `+${amt}` : amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors font-semibold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-neonCyan/20 hover:bg-neonCyan/30 border border-neonCyan/40 text-neonCyan font-bold text-xs cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f1c] border border-white/15 w-full max-w-md rounded-2xl p-6 relative overflow-hidden animate-fadeInUp">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Plus className="text-neonCyan w-5 h-5" />
              Khởi Tạo Project Manager Mới
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Nhập thông tin nhân sự tham gia vận hành dự án mô phỏng hiệu suất.
            </p>

            <form onSubmit={handleAddNewPlayer} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Họ và tên PM</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonCyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Điểm Coin ban đầu</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="200"
                    value={formScore === 0 ? '' : formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonCyan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vai trò</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neonCyan"
                  >
                    <option value="Senior PM">Senior PM</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Junior PM">Junior PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hiệu suất khởi điểm (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formEfficiency}
                    onChange={(e) => setFormEfficiency(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-neonCyan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sai sót kỹ thuật (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={formViolations}
                    onChange={(e) => setFormViolations(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-neonCyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Trạng thái định dạng</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['online', 'idle', 'offline'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormStatus(st)}
                      className={`py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer uppercase ${
                        formStatus === st
                          ? 'bg-neonCyan/15 border-neonCyan text-white'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors font-semibold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-neonCyan/25 hover:bg-neonCyan/35 border border-neonCyan/40 text-neonCyan font-bold text-xs cursor-pointer"
                >
                  Tạo nhân sự
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
