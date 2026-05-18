import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import { ClipboardList, Plus, CheckCircle, Clock, User, MapPin, Star, X } from 'lucide-react';

const categoryColor = {
  Housekeeping: 'text-amber-400', Maintenance: 'text-red-400',
  Laundry: 'text-blue-400', 'Food & Beverage': 'text-green-400',
};
const categoryBg = {
  Housekeeping: 'bg-amber-500/10', Maintenance: 'bg-red-500/10',
  Laundry: 'bg-blue-500/10', 'Food & Beverage': 'bg-green-500/10',
};
const priorityDot = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };

function RequestCard({ req, onUpdate }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2.5 flex-1">
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[req.priority]}`} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-200">{req.request}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={10} /> Room {req.roomNo}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <User size={10} /> {req.guestName}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={10} /> {req.createdAt}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${categoryColor[req.category]} ${categoryBg[req.category]} border-current/30`}>
            {req.category}
          </span>
          {req.status === 'completed' ? (
            <span className="badge-completed">Done</span>
          ) : req.status === 'in-progress' ? (
            <span className="badge-cleaning">Active</span>
          ) : (
            <span className="badge-pending">Pending</span>
          )}
        </div>
      </div>

      {req.assignedTo && (
        <p className="text-xs text-slate-500 mb-3">Assigned: {req.assignedTo}</p>
      )}

      {req.status !== 'completed' && (
        <div className="flex gap-2">
          {req.status === 'pending' && (
            <button onClick={() => onUpdate(req.id, 'in-progress')} className="btn-primary py-1.5 text-xs">
              Accept
            </button>
          )}
          {req.status === 'in-progress' && (
            <button onClick={() => onUpdate(req.id, 'completed')} className="btn-success py-1.5 text-xs">
              <CheckCircle size={12} /> Complete
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function NewRequestModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ roomNo: '', guestName: '', request: '', category: 'Housekeeping', priority: 'medium', assignedTo: '' });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, status: 'pending' });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="glass rounded-2xl border border-white/10 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">New Guest Request</h2>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.roomNo} onChange={(e) => upd('roomNo', e.target.value)} placeholder="Room No." className="inp" />
            <input required value={form.guestName} onChange={(e) => upd('guestName', e.target.value)} placeholder="Guest Name" className="inp" />
          </div>
          <input required value={form.request} onChange={(e) => upd('request', e.target.value)} placeholder="Request description" className="inp" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={(e) => upd('category', e.target.value)} className="inp">
              {['Housekeeping', 'Maintenance', 'Laundry', 'Food & Beverage'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={form.priority} onChange={(e) => upd('priority', e.target.value)} className="inp">
              {['critical', 'high', 'medium', 'low'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <input value={form.assignedTo} onChange={(e) => upd('assignedTo', e.target.value)} placeholder="Assign to (optional)" className="inp" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Create Request</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function GuestRequests() {
  const { guestRequests, updateGuestRequestStatus, addGuestRequest } = useHotelStore();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = guestRequests.filter((r) => filter === 'all' || r.status === filter || r.category === filter);
  const pending = guestRequests.filter((r) => r.status === 'pending').length;
  const active = guestRequests.filter((r) => r.status === 'in-progress').length;
  const done = guestRequests.filter((r) => r.status === 'completed').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList size={22} className="text-teal-400" /> Guest Requests
          </h1>
          <p className="text-slate-400 text-sm">{guestRequests.length} total requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending', value: pending, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'In Progress', value: active, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Completed', value: done, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`glass rounded-xl p-4 border ${border} ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'in-progress', 'completed', 'Housekeeping', 'Maintenance', 'Laundry'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map((req) => (
            <RequestCard key={req.id} req={req} onUpdate={updateGuestRequestStatus} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && <NewRequestModal onClose={() => setShowModal(false)} onAdd={addGuestRequest} />}
      </AnimatePresence>
    </div>
  );
}
