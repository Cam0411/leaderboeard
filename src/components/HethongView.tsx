import React, { useState, useEffect } from 'react';
import { SystemLog, SystemMetrics } from '../types';
import { Server, Cpu, Database, Network, Terminal, RefreshCw, Send, Trash2, ShieldAlert, CheckCircle, Zap } from 'lucide-react';

interface HethongViewProps {
  logs: SystemLog[];
  metrics: SystemMetrics;
  onAddLog: (message: string, type: 'INFO' | 'WARN' | 'ERROR') => void;
  onClearLogs: () => void;
  onUpdateMetrics: (metrics: SystemMetrics) => void;
}

export default function HethongView({ logs, metrics, onAddLog, onClearLogs, onUpdateMetrics }: HethongViewProps) {
  const [customLogText, setCustomLogText] = useState('');
  const [customLogType, setCustomLogType] = useState<'INFO' | 'WARN' | 'ERROR'>('INFO');
  const [logFilter, setLogFilter] = useState<string>('all');

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  // Handle custom log sumission
  const handleSendLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLogText.trim()) return;

    onAddLog(customLogText, customLogType);
    setCustomLogText('');
  };

  // Simulates standard tasks
  const handleSimulateLoad = () => {
    const randomLoad = Math.min(98, Math.max(10, Math.floor(metrics.serverLoad + (Math.random() * 25 - 10))));
    const randomMem = Math.min(95, Math.max(30, Math.floor(metrics.memoryUsage + (Math.random() * 15 - 5))));
    const randomNet = parseFloat((Math.min(5.0, Math.max(0.2, metrics.networkInGbps + (Math.random() * 0.8 - 0.3)))).toFixed(1));

    onUpdateMetrics({
      serverLoad: randomLoad,
      memoryUsage: randomMem,
      networkInGbps: randomNet
    });

    if (randomLoad > 75) {
      onAddLog(`CẢNH BÁO: Tải lượng máy chủ ảo tăng vọt lên mức đặc biệt: ${randomLoad}%.`, 'WARN');
    } else {
      onAddLog(`Tín hiệu hệ thống: Trạng thái nạp tải ổn định ở mức trung bình (${randomLoad}%).`, 'INFO');
    }
  };

  // Optimize and clean resources
  const handleOptimizeResources = () => {
    onUpdateMetrics({
      serverLoad: 25,
      memoryUsage: 45,
      networkInGbps: 0.8
    });
    
    onAddLog("TIẾN TRÌNH: Kích hoạt hệ thống ép dọn bộ nhớ rác và giải phóng tài nguyên CPU thành công.", "INFO");
    onAddLog("Hệ thống khôi phục trạng thái nhàn rỗi (CPU: 25%, RAM: 45%).", "INFO");
  };

  // Auto-scroller for simple log terminal feel
  const logEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Hệ Thống <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-white">Simulator</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Giám sát tài nguyên máy chủ ảo, bộ nhớ vật lý, tốc độ truyền tài nguyên và can thiệp điều khiển trực tiếp hệ thống log.
        </p>
      </div>

      {/* Meter widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Server load */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-neonCyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Cpu className="w-10 h-10 text-neonCyan mb-3 drop-shadow-[0_0_8px_#00f0ff] animate-pulse" />
          <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">Server Load</h3>
          <p className="text-3.5xl font-extrabold text-white tracking-tight">{metrics.serverLoad}<span className="text-lg text-slate-500">%</span></p>
          
          <div className="w-full bg-[#0a0a14] h-2 rounded-full overflow-hidden mt-4 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                metrics.serverLoad > 80 ? 'bg-neonPink' : metrics.serverLoad > 60 ? 'bg-yellow-400' : 'bg-neonCyan'
              }`}
              style={{ width: `${metrics.serverLoad}%` }}
            />
          </div>

          <p className={`text-[10px] mt-3.5 font-bold flex items-center gap-1.5 ${metrics.serverLoad > 80 ? 'text-neonPink' : 'text-green-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${metrics.serverLoad > 80 ? 'bg-neonPink animate-ping' : 'bg-green-400'}`} />
            {metrics.serverLoad > 80 ? 'Tải lượng cao' : 'Hoạt động tối ưu'}
          </p>
        </div>

        {/* Memory status */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-neonPurple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Database className="w-10 h-10 text-neonPurple mb-3 drop-shadow-[0_0_8px_#8a2be2]" />
          <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">RAM Allocated</h3>
          <p className="text-3.5xl font-extrabold text-white tracking-tight">{metrics.memoryUsage}<span className="text-lg text-slate-500">%</span></p>

          <div className="w-full bg-[#0a0a14] h-2 rounded-full overflow-hidden mt-4 border border-white/5">
            <div
              className="h-full bg-neonPurple rounded-full transition-all duration-500"
              style={{ width: `${metrics.memoryUsage}%` }}
            />
          </div>

          <p className="text-[10px] text-yellow-400 mt-3.5 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            Cảnh báo rác nhẹ ({100 - metrics.memoryUsage}% trống)
          </p>
        </div>

        {/* Network speed */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Network className="w-10 h-10 text-green-400 mb-3 drop-shadow-[0_0_8px_#4ade80]" />
          <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">Bandwidth CDN</h3>
          <p className="text-3.5xl font-extrabold text-white tracking-tight">{metrics.networkInGbps}<span className="text-lg text-slate-500"> GB/s</span></p>

          <div className="w-full bg-[#0a0a14] h-2 rounded-full overflow-hidden mt-4 border border-white/5">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${(metrics.networkInGbps / 5.0) * 100}%` }}
            />
          </div>

          <p className="text-[10px] text-green-400 mt-3.5 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Băng thông Châu Âu ổn định
          </p>
        </div>

      </div>

      {/* Control Tools Frame */}
      <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-amber-400" />
          Bàn Điều Khiển Can Thiệp
        </h3>
        <p className="text-xs text-slate-400">Điều chỉnh nhanh trạng thái phần cứng của simulator để kiểm thử phản ứng cảnh báo của toàn hệ thống.</p>
        
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleSimulateLoad}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neonCyan" /> Tăng tải ngẫu nhiên
          </button>
          
          <button
            onClick={handleOptimizeResources}
            className="px-4 py-2 rounded-lg bg-neonCyan/10 hover:bg-neonCyan/20 text-neonCyan text-xs font-bold border border-neonCyan/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Giải phóng bộ nhớ & CPU
          </button>
        </div>
      </div>

      {/* TERMINAL LOG CONTAINER */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col border border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Terminal className="text-slate-400 w-5 h-5" />
            System Console Logs
          </h3>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Pills */}
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5 text-xs text-slate-400 font-medium">
              {['all', 'INFO', 'WARN', 'ERROR'].map(type => (
                <button
                  key={type}
                  onClick={() => setLogFilter(type)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    logFilter === type ? 'bg-white/10 text-white font-semibold' : 'hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'Tất cả' : type}
                </button>
              ))}
            </div>

            <button
              onClick={onClearLogs}
              className="text-xs text-neonPink hover:underline flex items-center gap-1 bg-neonPink/10 px-2.5 py-1 rounded-lg border border-neonPink/15 hover:bg-neonPink/15 transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Clear logs
            </button>
          </div>
        </div>

        {/* Real logs feed */}
        <div className="bg-slate-950/90 rounded-xl p-5 font-mono text-xs md:text-sm h-64 overflow-y-auto custom-scrollbar text-slate-400 space-y-2 border border-white/10 shadow-inner flex flex-col">
          {filteredLogs.length === 0 ? (
            <p className="text-slate-600 text-center py-10 italic">_ Danh sách rỗng hoặc không khớp bộ lọc.</p>
          ) : (
            filteredLogs.map(log => {
              let typeColor = "text-green-400";
              if (log.type === 'WARN') typeColor = "text-yellow-400";
              if (log.type === 'ERROR') typeColor = "text-neonPink font-bold";

              return (
                <p key={log.id} className="leading-relaxed hover:bg-white/2 p-0.5 rounded transition-colors">
                  <span className="text-slate-600">[{log.timestamp}]</span>{' '}
                  <span className={`${typeColor} font-semibold`}>{log.type}</span>:{' '}
                  <span className="text-slate-300">{log.message}</span>
                </p>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>

        {/* Handcrafted manual logger input */}
        <form onSubmit={handleSendLog} className="mt-4 flex gap-2">
          <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5 text-xs">
            {(['INFO', 'WARN', 'ERROR'] as const).map(ty => (
              <button
                key={ty}
                type="button"
                onClick={() => setCustomLogType(ty)}
                className={`px-2 py-1 rounded cursor-pointer ${
                  customLogType === ty 
                    ? ty === 'INFO' ? 'bg-green-500/20 text-green-400' : ty === 'WARN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neonPink/20 text-neonPink font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {ty}
              </button>
            ))}
          </div>

          <input
            type="text"
            required
            placeholder="Ghi thêm tin nhắn log hệ thống rảnh tay..."
            value={customLogText}
            onChange={(e) => setCustomLogText(e.target.value)}
            className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neonCyan"
          />

          <button
            type="submit"
            className="bg-white/5 hover:bg-white/10 text-white rounded-lg px-4 py-2 border border-white/15 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-neonCyan" /> Ghi Log
          </button>
        </form>

      </div>

    </div>
  );
}
