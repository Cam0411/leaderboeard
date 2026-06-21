import React from 'react';
import { LayoutDashboard, Users, Briefcase, Settings, Box, CircleDot } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-neonCyan', shadow: 'shadow-[0_0_10px_#00f0ff]', bg: 'from-neonCyan/20' },
    { id: 'nhansu', label: 'Nhân sự', icon: Users, color: 'text-neonPurple', shadow: 'shadow-[0_0_10px_#8a2be2]', bg: 'from-neonPurple/20' },
    { id: 'chiendich', label: 'Chiến dịch', icon: Briefcase, color: 'text-neonPink', shadow: 'shadow-[0_0_10px_#ff0055]', bg: 'from-neonPink/20' },
    { id: 'hethong', label: 'Hệ thống', icon: Settings, color: 'text-slate-300', shadow: 'shadow-[0_0_10px_#cbd5e1]', bg: 'from-slate-400/20' },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 h-full bg-surface/40 backdrop-blur-md border-r border-white/5 z-20 flex-shrink-0 relative">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neonCyan to-neonPurple flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Box className="text-white w-5 h-5" />
          </div>
          <span className="hidden lg:block font-bold text-xl tracking-wide text-white">
            SYS<span className="text-neonCyan">CORE</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.bg} to-transparent opacity-100`} />
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${item.color} ${item.shadow}`} />
                  </>
                )}
                <Icon className={`w-5 h-5 z-10 transition-colors ${isActive ? item.color : 'group-hover:text-white'}`} />
                <span className="hidden lg:block font-medium z-10 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-sm font-bold text-white">
              AD
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-white">Administrator</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-white/10 z-40 md:hidden transition-transform duration-300 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonCyan to-neonPurple flex items-center justify-center">
              <Box className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">
              SYS<span className="text-neonCyan">CORE</span>
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            &times;
          </button>
        </div>

        <nav className="p-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.bg} to-transparent opacity-100`} />
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${item.color} ${item.shadow}`} />
                  </>
                )}
                <Icon className={`w-5 h-5 z-10 ${isActive ? item.color : ''}`} />
                <span className="font-medium z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 absolute bottom-0 left-0 right-0">
          <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-sm font-bold text-white">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
