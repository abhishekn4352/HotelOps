import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import {
  LayoutDashboard, BedDouble, Sparkles, Wrench, Users, Package,
  Bell, BarChart2, Building2, ClipboardList, ChevronLeft, ChevronRight,
  Moon, Sun, LogOut, MessageSquare, Menu, X, Zap
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rooms', label: 'Room Status', icon: BedDouble },
  { to: '/housekeeping', label: 'Housekeeping', icon: Sparkles },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/public-areas', label: 'Public Areas', icon: Building2 },
  { to: '/guest-requests', label: 'Guest Requests', icon: ClipboardList },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/staff', label: 'Staff', icon: Users },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/ai-assistant', label: 'AI Assistant', icon: MessageSquare },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, notifications, currentUser, aiAlerts } = useHotelStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeAlerts = aiAlerts.filter((a) => !a.dismissed).length;

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${!sidebarOpen && !mobile ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        {(sidebarOpen || mobile) && (
          <div>
            <p className="text-white font-bold text-base leading-none">HotelOps</p>
            <p className="text-indigo-400 text-xs mt-0.5">Operations Platform</p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => mobile && setMobileOpen(false)}
              className={`nav-item ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {(sidebarOpen || mobile) && (
                <span className="truncate">{label}</span>
              )}
              {(sidebarOpen || mobile) && label === 'Notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {(sidebarOpen || mobile) && label === 'AI Assistant' && activeAlerts > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeAlerts}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className={`border-t border-white/5 p-3 ${!sidebarOpen && !mobile ? 'flex justify-center' : ''}`}>
        {(sidebarOpen || mobile) ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-slate-500 text-xs truncate capitalize">{currentUser.role}</p>
            </div>
            <button onClick={toggleDarkMode} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5">
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            {currentUser.avatar}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col glass border-r border-white/5 flex-shrink-0 relative z-30"
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all z-10"
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 w-60 glass border-r border-white/5 z-50 md:hidden">
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 glass border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="live-indicator" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <button onClick={toggleDarkMode} className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 hidden md:flex">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut size={18} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
