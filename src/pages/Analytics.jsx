import React from 'react';
import { motion } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import { analyticsData } from '../data/mockData';
import {
  BarChart2, TrendingUp, Clock, CheckCircle, Users, Wrench, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass border border-white/10 rounded-xl px-3 py-2 text-xs">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { tasks, rooms, staff } = useHotelStore();
  const { weeklyStats, taskCompletion, maintenanceCategories, roomTurnaround, staffProductivity } = analyticsData;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 size={22} className="text-indigo-400" /> Analytics Dashboard
        </h1>
        <p className="text-slate-400 text-sm">Operational intelligence — last 7 days</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Tasks', value: weeklyStats.totalTasks, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Completed', value: weeklyStats.completedTasks, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Avg Turnaround', value: weeklyStats.avgTurnaround, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Critical Alerts', value: weeklyStats.criticalAlerts, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Guest Requests', value: weeklyStats.guestRequests, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Inventory Alerts', value: weeklyStats.inventoryAlerts, icon: Wrench, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} whileHover={{ y: -2 }} className={`glass rounded-xl p-4 border border-white/5 ${bg}`}>
            <Icon size={16} className={`${color} mb-2`} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task completion over time */}
        <div className="glass rounded-2xl border border-white/5 p-5">
          <h2 className="text-base font-bold text-white mb-4">Task Completion (Today)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={taskCompletion} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="url(#colorPending)" strokeWidth={2} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance breakdown */}
        <div className="glass rounded-2xl border border-white/5 p-5">
          <h2 className="text-base font-bold text-white mb-4">Maintenance Categories</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={maintenanceCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {maintenanceCategories.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {maintenanceCategories.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.fill }} />
                    <span className="text-xs text-slate-400">{c.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-300">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room turnaround time */}
        <div className="glass rounded-2xl border border-white/5 p-5">
          <h2 className="text-base font-bold text-white mb-4">Room Turnaround Time (min)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={roomTurnaround} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="room" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="time" fill="#6366f1" radius={[6, 6, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Staff productivity */}
        <div className="glass rounded-2xl border border-white/5 p-5">
          <h2 className="text-base font-bold text-white mb-4">Staff Productivity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={staffProductivity} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} name="Tasks" />
              <Bar dataKey="efficiency" fill="#6366f1" radius={[4, 4, 0, 0]} name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hotspot rooms */}
      <div className="glass rounded-2xl border border-white/5 p-5">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" /> Most Problematic Rooms
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="tbl-header">Room</th>
                <th className="tbl-header">Issues (Month)</th>
                <th className="tbl-header">Last Issue</th>
                <th className="tbl-header">Turnaround</th>
                <th className="tbl-header">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {[
                { room: '302', issues: 4, last: 'AC Failure', turnaround: '90 min', risk: 'critical', riskPct: 92 },
                { room: '203', issues: 3, last: 'AC Failure', turnaround: '75 min', risk: 'high', riskPct: 85 },
                { room: '502', issues: 2, last: 'Water Leakage', turnaround: '120 min', risk: 'high', riskPct: 78 },
                { room: '304', issues: 2, last: 'Electrical', turnaround: '50 min', risk: 'medium', riskPct: 60 },
              ].map((r) => (
                <tr key={r.room} className="tbl-row">
                  <td className="tbl-cell font-bold text-white">Room {r.room}</td>
                  <td className="tbl-cell">{r.issues}×</td>
                  <td className="tbl-cell">{r.last}</td>
                  <td className="tbl-cell">{r.turnaround}</td>
                  <td className="tbl-cell">
                    <span className={`badge-${r.risk}`}>{r.risk} ({r.riskPct})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
