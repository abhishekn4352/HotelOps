import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import {
  BedDouble, ClipboardList, Wrench, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Users, Package, Activity, Brain, LogOut, ArrowRight, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { activityTimeline } from '../data/mockData';

// ── Helper ──────────────────────────────────────────────
const getStatusCounts = (rooms) => ({
  ready: rooms.filter((r) => r.status === 'ready').length,
  occupied: rooms.filter((r) => r.status === 'occupied').length,
  cleaning: rooms.filter((r) => r.status === 'cleaning').length,
  maintenance: rooms.filter((r) => r.status === 'maintenance').length,
});

const timelineTypeColor = {
  checkout: 'bg-blue-500', task: 'bg-indigo-500', assign: 'bg-violet-500',
  cleaning: 'bg-amber-500', issue: 'bg-red-500', maintenance: 'bg-rose-500',
  ai: 'bg-purple-500', alert: 'bg-orange-500', guest: 'bg-teal-500',
  inventory: 'bg-cyan-500', resolved: 'bg-emerald-500', ready: 'bg-green-500',
  checkin: 'bg-sky-500',
};

const StatCard = ({ icon: Icon, label, value, sub, color, link }) => (
  <Link to={link || '#'}>
    <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-5 cursor-pointer hover:border-white/15 border border-white/5 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <ArrowRight size={14} className="text-slate-600 mt-1" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-300">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </motion.div>
  </Link>
);

// ── Room Mini Map ───────────────────────────────────────
const statusColor = {
  ready: 'bg-emerald-500', occupied: 'bg-blue-500',
  cleaning: 'bg-amber-500', maintenance: 'bg-red-500',
};
const statusLabel = { ready: 'Ready', occupied: 'Occupied', cleaning: 'Cleaning', maintenance: 'Maint.' };

function RoomMiniMap({ rooms }) {
  const floors = [1, 2, 3, 4, 5];
  return (
    <div className="space-y-2">
      {floors.map((floor) => {
        const floorRooms = rooms.filter((r) => r.floor === floor);
        return (
          <div key={floor} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-12 flex-shrink-0">Floor {floor}</span>
            <div className="flex flex-wrap gap-1.5">
              {floorRooms.map((r) => (
                <motion.div
                  key={r.id}
                  whileHover={{ scale: 1.3 }}
                  title={`Room ${r.roomNo} — ${statusLabel[r.status]}${r.assignedStaff ? ` (${r.assignedStaff})` : ''}`}
                  className={`w-6 h-6 rounded-md ${statusColor[r.status]} cursor-pointer flex items-center justify-center`}
                >
                  <span className="text-white text-[8px] font-bold">{r.roomNo.slice(-2)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
        {Object.entries(statusLabel).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${statusColor[k]}`} />
            <span className="text-xs text-slate-400">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Alerts Panel ─────────────────────────────────────
function AIAlertsPanel({ alerts, onDismiss }) {
  const active = alerts.filter((a) => !a.dismissed).slice(0, 4);
  return (
    <div className="space-y-2">
      {active.map((alert) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-3 rounded-xl border flex items-start gap-3 ${
            alert.severity === 'critical'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-orange-500/10 border-orange-500/30'
          }`}
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
            alert.severity === 'critical' ? 'bg-red-500/20' : 'bg-orange-500/20'
          }`}>
            {alert.type === 'predictive' ? <Brain size={12} className="text-purple-400" /> :
             alert.type === 'inventory' ? <Package size={12} className="text-cyan-400" /> :
             <AlertTriangle size={12} className="text-orange-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-0.5 ${alert.severity === 'critical' ? 'text-red-300' : 'text-orange-300'}`}>
              {alert.title}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
          </div>
          <button onClick={() => onDismiss(alert.id)} className="text-slate-600 hover:text-slate-400 flex-shrink-0">
            <span className="text-xs">✕</span>
          </button>
        </motion.div>
      ))}
      {active.length === 0 && (
        <div className="text-center py-6 text-slate-500">
          <CheckCircle size={24} className="mx-auto mb-2 text-emerald-500" />
          <p className="text-sm">All clear — no active alerts</p>
        </div>
      )}
    </div>
  );
}

// ── Tasks Quick View ────────────────────────────────────
const priorityDot = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
const taskStatusBadge = {
  'in-progress': 'badge-cleaning', pending: 'badge-pending', completed: 'badge-completed', overdue: 'badge-overdue',
};

export default function Dashboard() {
  const { rooms, tasks, aiAlerts, dismissAlert, guestRequests, inventory, staff } = useHotelStore();
  const [tick, setTick] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const counts = getStatusCounts(rooms);
  const activeTasks = tasks.filter((t) => ['in-progress', 'pending', 'overdue'].includes(t.status));
  const criticalTasks = tasks.filter((t) => t.priority === 'critical' && t.status !== 'completed');
  const pendingRequests = guestRequests.filter((r) => r.status === 'pending').length;
  const lowStockItems = inventory.filter((i) => i.status !== 'ok').length;
  const availableStaff = staff.filter((s) => s.status === 'available').length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Grand Meridian Hotel — Live as of {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-indicator" />
          <span className="text-xs text-emerald-400 font-medium">Real-time</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard icon={BedDouble} label="Rooms Ready" value={counts.ready} sub={`${counts.occupied} occupied`} color="bg-emerald-600" link="/rooms" />
        <StatCard icon={Activity} label="Cleaning" value={counts.cleaning} sub="In progress" color="bg-amber-600" link="/rooms" />
        <StatCard icon={Wrench} label="Maintenance" value={counts.maintenance} sub="Active issues" color="bg-red-600" link="/maintenance" />
        <StatCard icon={ClipboardList} label="Active Tasks" value={activeTasks.length} sub={`${criticalTasks.length} critical`} color="bg-indigo-600" link="/housekeeping" />
        <StatCard icon={Users} label="Staff Free" value={availableStaff} sub={`of ${staff.length} total`} color="bg-violet-600" link="/staff" />
        <StatCard icon={Package} label="Low Stock" value={lowStockItems} sub="Items need restock" color="bg-cyan-600" link="/inventory" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Map */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BedDouble size={18} className="text-indigo-400" /> Live Room Map
            </h2>
            <Link to="/rooms" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <RoomMiniMap rooms={rooms} />
        </div>

        {/* AI Alerts */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain size={18} className="text-purple-400" /> AI Alerts
            </h2>
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
              {aiAlerts.filter((a) => !a.dismissed).length} active
            </span>
          </div>
          <AIAlertsPanel alerts={aiAlerts} onDismiss={dismissAlert} />
        </div>
      </div>

      {/* Tasks + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList size={18} className="text-indigo-400" /> Active Tasks
            </h2>
            <Link to="/housekeeping" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {activeTasks.slice(0, 6).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{task.taskType}</p>
                  <p className="text-xs text-slate-500">{task.location} • {task.assignedTo}</p>
                </div>
                <span className={taskStatusBadge[task.status]}>
                  {task.status === 'in-progress' ? 'Active' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-teal-400" /> Live Activity
            </h2>
            <div className="live-indicator" />
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activityTimeline.map((event) => (
              <div key={event.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${timelineTypeColor[event.type] || 'bg-slate-500'}`} />
                  <div className="w-px flex-1 bg-white/5 mt-1" style={{ minHeight: 12 }} />
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <p className="text-xs text-slate-200 leading-relaxed">{event.event}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-600">{event.time}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-600">{event.dept}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Requests quick row */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" /> Quick Metrics
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Guest Requests Pending', value: pendingRequests, icon: ClipboardList, color: 'text-teal-400' },
            { label: 'Avg Turnaround', value: '42 min', icon: Clock, color: 'text-blue-400' },
            { label: 'Tasks Today', value: tasks.length, icon: TrendingUp, color: 'text-indigo-400' },
            { label: 'AI Alerts Active', value: aiAlerts.filter(a => !a.dismissed).length, icon: Brain, color: 'text-purple-400' },
          ].map((m) => (
            <div key={m.label} className="bg-white/3 rounded-xl p-4 text-center">
              <m.icon size={20} className={`mx-auto mb-2 ${m.color}`} />
              <p className="text-2xl font-bold text-white">{m.value}</p>
              <p className="text-xs text-slate-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
