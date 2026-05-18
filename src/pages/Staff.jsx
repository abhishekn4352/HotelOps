import React from 'react';
import { motion } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import { Users, CheckCircle, Activity, Star } from 'lucide-react';

const deptColor = {
  Housekeeping: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Maintenance: 'bg-red-500/10 text-red-400 border-red-500/20',
  'Front Desk': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};
const statusDot = { available: 'bg-emerald-500', busy: 'bg-amber-500', offline: 'bg-slate-500' };

function StaffCard({ member }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base">
              {member.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${statusDot[member.status]}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{member.name}</p>
            <p className="text-xs text-slate-500">{member.role}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${deptColor[member.department] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
          {member.department}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Done', value: member.tasksCompleted, color: 'text-emerald-400' },
          { label: 'Active', value: member.tasksActive, color: 'text-amber-400' },
          { label: 'Efficiency', value: `${member.efficiency}%`, color: 'text-indigo-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center bg-white/3 rounded-lg p-2">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Efficiency bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Performance</span>
          <span className={member.efficiency >= 90 ? 'text-emerald-400' : member.efficiency >= 80 ? 'text-amber-400' : 'text-red-400'}>
            {member.efficiency >= 90 ? '⭐ Excellent' : member.efficiency >= 80 ? '👍 Good' : '📋 Needs Support'}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${member.efficiency}%` }} transition={{ duration: 0.8, delay: 0.1 }}
            className={`h-full rounded-full ${member.efficiency >= 90 ? 'bg-emerald-500' : member.efficiency >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        <div className={`w-2 h-2 rounded-full ${statusDot[member.status]}`} />
        <span className="text-xs text-slate-400 capitalize">{member.status}</span>
        {member.floor && <span className="text-xs text-slate-500">• Floor {member.floor}</span>}
      </div>
    </motion.div>
  );
}

export default function Staff() {
  const { staff } = useHotelStore();
  const available = staff.filter((s) => s.status === 'available').length;
  const busy = staff.filter((s) => s.status === 'busy').length;
  const topPerformer = [...staff].sort((a, b) => b.efficiency - a.efficiency)[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users size={22} className="text-violet-400" /> Staff Management
        </h1>
        <p className="text-slate-400 text-sm">{staff.length} active staff members</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 border border-emerald-500/20 bg-emerald-900/5">
          <p className="text-2xl font-bold text-emerald-400">{available}</p>
          <p className="text-xs text-slate-500 mt-0.5">Available</p>
        </div>
        <div className="glass rounded-xl p-4 border border-amber-500/20 bg-amber-900/5">
          <p className="text-2xl font-bold text-amber-400">{busy}</p>
          <p className="text-xs text-slate-500 mt-0.5">On Task</p>
        </div>
        <div className="glass rounded-xl p-4 border border-indigo-500/20 bg-indigo-900/5">
          <div className="flex items-center gap-1.5 mb-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <p className="text-xs text-slate-400">Top Performer</p>
          </div>
          <p className="text-sm font-bold text-white truncate">{topPerformer?.name}</p>
          <p className="text-xs text-indigo-400">{topPerformer?.efficiency}% efficiency</p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {staff.map((member) => (
          <StaffCard key={member.id} member={member} />
        ))}
      </div>

      {/* Tasks summary table */}
      <div className="glass rounded-2xl border border-white/5 p-5">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={16} className="text-indigo-400" /> Staff Task Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="tbl-header">Name</th>
                <th className="tbl-header">Department</th>
                <th className="tbl-header">Tasks Done</th>
                <th className="tbl-header">Active</th>
                <th className="tbl-header">Status</th>
                <th className="tbl-header">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="tbl-row">
                  <td className="tbl-cell font-medium text-slate-200">{s.name}</td>
                  <td className="tbl-cell">{s.department}</td>
                  <td className="tbl-cell text-emerald-400 font-bold">{s.tasksCompleted}</td>
                  <td className="tbl-cell text-amber-400">{s.tasksActive}</td>
                  <td className="tbl-cell">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${statusDot[s.status]}`} />
                      <span className="capitalize text-xs">{s.status}</span>
                    </div>
                  </td>
                  <td className="tbl-cell">
                    <span className={s.efficiency >= 90 ? 'text-emerald-400 font-bold' : s.efficiency >= 80 ? 'text-amber-400' : 'text-red-400'}>
                      {s.efficiency}%
                    </span>
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
