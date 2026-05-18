import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import { Bell, CheckCheck, Brain, Package, AlertTriangle, ClipboardList, Wrench, X } from 'lucide-react';

const typeIcon = {
  task: ClipboardList, alert: AlertTriangle, ai: Brain, inventory: Package,
  maintenance: Wrench, guest: Bell, default: Bell,
};
const typeColor = {
  task: 'text-indigo-400 bg-indigo-500/10', alert: 'text-red-400 bg-red-500/10',
  ai: 'text-purple-400 bg-purple-500/10', inventory: 'text-cyan-400 bg-cyan-500/10',
  maintenance: 'text-red-400 bg-red-500/10', guest: 'text-teal-400 bg-teal-500/10',
  default: 'text-slate-400 bg-slate-500/10',
};

export default function Notifications() {
  const { notifications, aiAlerts, markNotificationRead, markAllRead, dismissAlert } = useHotelStore();
  const unread = notifications.filter((n) => !n.read).length;
  const activeAlerts = aiAlerts.filter((a) => !a.dismissed);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell size={22} className="text-yellow-400" /> Notifications
          </h1>
          <p className="text-slate-400 text-sm">{unread} unread · {activeAlerts.length} active AI alerts</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* AI Alerts section */}
      {activeAlerts.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-purple-300 flex items-center gap-2 mb-3">
            <Brain size={16} /> AI Alerts ({activeAlerts.length})
          </h2>
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <motion.div key={alert.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`glass rounded-xl border p-4 flex items-start gap-3 ${
                  alert.severity === 'critical' ? 'border-red-500/30 bg-red-900/5' : 'border-orange-500/20 bg-orange-900/5'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  alert.type === 'predictive' ? 'bg-purple-500/20' : alert.type === 'inventory' ? 'bg-cyan-500/20' : 'bg-orange-500/20'
                }`}>
                  {alert.type === 'predictive' ? <Brain size={14} className="text-purple-400" /> :
                   alert.type === 'inventory' ? <Package size={14} className="text-cyan-400" /> :
                   <AlertTriangle size={14} className="text-orange-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold ${alert.severity === 'critical' ? 'text-red-300' : 'text-orange-300'}`}>
                      {alert.title}
                    </p>
                    <span className={alert.severity === 'critical' ? 'badge-critical' : 'badge-high'}>{alert.severity}</span>
                  </div>
                  <p className="text-xs text-slate-400">{alert.message}</p>
                  <p className="text-xs text-slate-600 mt-1">{alert.time}</p>
                </div>
                <button onClick={() => dismissAlert(alert.id)} className="text-slate-500 hover:text-slate-300">
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* System notifications */}
      <div>
        <h2 className="text-base font-semibold text-slate-300 mb-3">
          System Notifications {notifications.length > 0 && `(${notifications.length})`}
        </h2>
        {notifications.length === 0 ? (
          <div className="glass rounded-2xl border border-white/5 p-10 text-center">
            <Bell size={36} className="mx-auto mb-3 text-slate-600" />
            <p className="text-slate-500 text-sm">No new notifications</p>
            <p className="text-slate-600 text-xs mt-1">Operational updates will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {notifications.map((n) => {
                const Icon = typeIcon[n.type] || typeIcon.default;
                const colors = typeColor[n.type] || typeColor.default;
                return (
                  <motion.div key={n.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className={`glass rounded-xl border p-4 flex items-start gap-3 cursor-pointer hover:border-white/10 transition-all ${
                      !n.read ? 'border-indigo-500/20 bg-indigo-900/5' : 'border-white/5'
                    }`}
                    onClick={() => markNotificationRead(n.id)}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-slate-200">{n.title}</p>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400">{n.message}</p>
                      <p className="text-xs text-slate-600 mt-1">{n.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
