import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import { Building2, CheckCircle, AlertTriangle, Clock, User, Plus, RefreshCw, X } from 'lucide-react';

const areaStatusConfig = {
  clean:       { badge: 'badge-ready',       dot: 'bg-emerald-500', label: 'Clean' },
  'in-progress': { badge: 'badge-cleaning', dot: 'bg-amber-500',   label: 'In Progress' },
  pending:     { badge: 'badge-pending',     dot: 'bg-slate-500',   label: 'Pending' },
  overdue:     { badge: 'badge-overdue',     dot: 'bg-red-500',     label: 'Overdue' },
};

const typeIcons = {
  Lobby: '🏛️', Elevator: '🛗', Pool: '🏊', Gym: '💪',
  Restaurant: '🍽️', Banquet: '🎊', Corridor: '🚪', Conference: '📋',
};

function AreaCard({ area, onUpdate }) {
  const cfg = areaStatusConfig[area.status] || areaStatusConfig.pending;
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl border p-4 transition-all ${
        area.status === 'overdue' ? 'border-red-500/30 bg-red-900/5' :
        area.status === 'clean' ? 'border-emerald-500/20' : 'border-white/5 hover:border-white/10'
      }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2">
          <span className="text-xl">{typeIcons[area.type] || '🏨'}</span>
          <div>
            <p className="text-sm font-semibold text-slate-200">{area.name}</p>
            <p className="text-xs text-slate-500">{area.type} • Every {area.frequency}</p>
          </div>
        </div>
        <span className={cfg.badge}>{cfg.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <CheckCircle size={11} className="text-emerald-400" /> Last: {area.lastCleaned}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} /> Next: {area.nextScheduled}
        </div>
        {area.assignedTo && (
          <div className="flex items-center gap-1 col-span-2">
            <User size={11} /> {area.assignedTo}
          </div>
        )}
      </div>
      {area.status === 'overdue' && (
        <div className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-2.5 py-1.5 mb-3 flex items-center gap-1.5">
          <AlertTriangle size={10} />
          Cleaning overdue — public hygiene risk
        </div>
      )}
      <div className="flex gap-2">
        {area.status !== 'clean' && area.status !== 'in-progress' && (
          <button onClick={() => onUpdate(area.id, 'in-progress')} className="btn-primary py-1.5 text-xs flex-1 justify-center">
            Start Cleaning
          </button>
        )}
        {area.status === 'in-progress' && (
          <button onClick={() => onUpdate(area.id, 'clean')} className="btn-success py-1.5 text-xs flex-1 justify-center">
            <CheckCircle size={11} /> Mark Clean
          </button>
        )}
        {area.status === 'clean' && (
          <button onClick={() => onUpdate(area.id, 'pending')} className="btn-secondary py-1.5 text-xs flex-1 justify-center">
            <RefreshCw size={11} /> Schedule Next
          </button>
        )}
      </div>
    </motion.div>
  );
}

function EmergencyModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', type: 'Lobby', assignedTo: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, status: 'in-progress', lastCleaned: '-', nextScheduled: 'ASAP', frequency: 'Emergency' });
    onClose();
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="glass rounded-2xl border border-red-500/30 p-6 w-full max-w-md bg-red-900/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-red-300 flex items-center gap-2">
            <AlertTriangle size={18} /> Emergency Cleaning
          </h2>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Area name (e.g. Lobby Main Entrance)" className="inp" />
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="inp">
            {['Lobby', 'Elevator', 'Restaurant', 'Pool', 'Gym', 'Corridor', 'Conference'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input value={form.assignedTo} onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))} placeholder="Assign staff" className="inp" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-danger flex-1 justify-center">
              <AlertTriangle size={14} /> Create Emergency
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function PublicAreas() {
  const { publicAreas } = useHotelStore();
  const [areas, setAreas] = useState(publicAreas);
  const [showEmergency, setShowEmergency] = useState(false);
  const [filter, setFilter] = useState('all');

  const updateArea = (id, status) => setAreas((a) => a.map((x) => x.id === id ? { ...x, status, lastCleaned: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : x));
  const addEmergency = (area) => setAreas((a) => [{ id: Date.now(), ...area }, ...a]);

  const filtered = areas.filter((a) => filter === 'all' || a.status === filter || a.type === filter);
  const types = [...new Set(areas.map((a) => a.type))];
  const overdue = areas.filter((a) => a.status === 'overdue').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 size={22} className="text-blue-400" /> Public Areas
          </h1>
          <p className="text-slate-400 text-sm">{areas.length} areas — {overdue} overdue</p>
        </div>
        <button onClick={() => setShowEmergency(true)} className="btn-danger">
          <AlertTriangle size={16} /> Emergency Cleaning
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['clean', 'in-progress', 'pending', 'overdue'].map((s) => {
          const cfg = areaStatusConfig[s];
          return (
            <div key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
              className={`glass rounded-xl p-4 border cursor-pointer transition-all ${filter === s ? 'border-indigo-500/50' : 'border-white/5 hover:border-white/15'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} mb-2`} />
              <p className="text-2xl font-bold text-white">{areas.filter((a) => a.status === s).length}</p>
              <p className="text-xs text-slate-500">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${filter === 'all' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>All</button>
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${filter === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map((area) => (
            <AreaCard key={area.id} area={area} onUpdate={updateArea} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} onSubmit={addEmergency} />}
      </AnimatePresence>
    </div>
  );
}
