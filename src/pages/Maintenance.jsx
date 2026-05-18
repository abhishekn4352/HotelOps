import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import {
  Wrench, Plus, AlertTriangle, Clock, CheckCircle, Brain,
  User, MapPin, TrendingUp, X, Zap
} from 'lucide-react';

const priorityDot = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
const statusBadge = {
  'in-progress': 'badge-cleaning', pending: 'badge-pending',
  resolved: 'badge-completed', overdue: 'badge-overdue',
};

function RiskBar({ score }) {
  const color = score >= 80 ? 'bg-red-500' : score >= 60 ? 'bg-orange-500' : score >= 40 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${color}`} />
      </div>
      <span className={`text-xs font-semibold ${score >= 80 ? 'text-red-400' : score >= 60 ? 'text-orange-400' : 'text-yellow-400'}`}>{score}</span>
    </div>
  );
}

function TicketCard({ ticket, onResolve }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl border p-4 transition-all ${
        ticket.status === 'resolved' ? 'border-white/5 opacity-70' :
        ticket.priority === 'critical' ? 'border-red-500/30 bg-red-900/5' : 'border-white/8 hover:border-white/15'
      }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2.5">
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[ticket.priority]}`} />
          <div>
            <p className="text-sm font-semibold text-slate-200">{ticket.issueType}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={10} /> Room {ticket.roomNo}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <User size={10} /> {ticket.technician}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={10} /> {ticket.reportedAt}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`badge-${ticket.priority}`}>{ticket.priority}</span>
          <span className={statusBadge[ticket.status] || 'badge-pending'}>
            {ticket.status === 'in-progress' ? 'Active' : ticket.status}
          </span>
        </div>
      </div>

      {/* Repair history alert */}
      {ticket.repairHistory >= 3 && (
        <div className="flex items-center gap-1.5 bg-purple-900/20 border border-purple-500/20 rounded-lg px-2.5 py-1.5 mb-3">
          <Brain size={11} className="text-purple-400 flex-shrink-0" />
          <p className="text-xs text-purple-300">
            AI Alert: Repaired {ticket.repairHistory}× — high risk (score {ticket.riskScore})
          </p>
        </div>
      )}

      {/* Delay warning */}
      {ticket.actualTime && ticket.actualTime > ticket.estimatedTime && (
        <div className="flex items-center gap-1.5 bg-orange-900/20 border border-orange-500/20 rounded-lg px-2.5 py-1.5 mb-3">
          <AlertTriangle size={11} className="text-orange-400 flex-shrink-0" />
          <p className="text-xs text-orange-300">
            Delay: Est. {ticket.estimatedTime}min → Actual {ticket.actualTime}min
          </p>
        </div>
      )}

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Risk Score</span>
        </div>
        <RiskBar score={ticket.riskScore} />
      </div>

      {ticket.status !== 'resolved' && (
        <button onClick={() => onResolve(ticket.id)} className="btn-success py-1.5 text-xs mt-2 w-full justify-center">
          <CheckCircle size={12} /> Mark Resolved
        </button>
      )}
    </motion.div>
  );
}

function NewTicketModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ issueType: '', roomNo: '', priority: 'medium', technician: '' });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...form, status: 'pending', reportedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      repairHistory: 1, riskScore: 40, estimatedTime: 30, actualTime: null,
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="glass rounded-2xl border border-white/10 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">New Maintenance Ticket</h2>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={form.issueType} onChange={(e) => upd('issueType', e.target.value)} placeholder="Issue type (e.g. AC Failure)" className="inp" />
          <input required value={form.roomNo} onChange={(e) => upd('roomNo', e.target.value)} placeholder="Room / Location" className="inp" />
          <select value={form.priority} onChange={(e) => upd('priority', e.target.value)} className="inp">
            {['critical', 'high', 'medium', 'low'].map((p) => <option key={p}>{p}</option>)}
          </select>
          <input value={form.technician} onChange={(e) => upd('technician', e.target.value)} placeholder="Assign technician" className="inp" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Create Ticket</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Maintenance() {
  const { maintenanceTickets, addTask } = useHotelStore();
  const [tickets, setTickets] = useState(maintenanceTickets);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (ticket) => setTickets((t) => [{ id: Date.now(), ...ticket }, ...t]);
  const handleResolve = (id) => setTickets((t) => t.map((x) => x.id === id ? { ...x, status: 'resolved' } : x));

  const filtered = tickets.filter((t) => filter === 'all' || t.status === filter || t.priority === filter);

  const active = tickets.filter((t) => t.status !== 'resolved');
  const highRisk = tickets.filter((t) => t.riskScore >= 70);
  const delayed = tickets.filter((t) => t.actualTime && t.actualTime > t.estimatedTime);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wrench size={22} className="text-red-400" /> Maintenance Center
          </h1>
          <p className="text-slate-400 text-sm">{tickets.length} total tickets</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 border border-red-500/20 bg-red-900/5">
          <p className="text-2xl font-bold text-red-400">{active.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Active Issues</p>
        </div>
        <div className="glass rounded-xl p-4 border border-purple-500/20 bg-purple-900/5">
          <div className="flex items-center gap-1.5 mb-1">
            <Brain size={14} className="text-purple-400" />
            <p className="text-xs text-purple-400 font-medium">AI Risk</p>
          </div>
          <p className="text-2xl font-bold text-purple-400">{highRisk.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">High-risk equipment</p>
        </div>
        <div className="glass rounded-xl p-4 border border-orange-500/20 bg-orange-900/5">
          <p className="text-2xl font-bold text-orange-400">{delayed.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Delayed repairs</p>
        </div>
      </div>

      {/* Predictive maintenance banner */}
      {highRisk.length > 0 && (
        <div className="glass rounded-xl border border-purple-500/30 bg-purple-900/10 p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
            <Brain size={16} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-300 mb-1">Predictive Maintenance Engine</p>
            <p className="text-xs text-slate-400">
              {highRisk.length} equipment item{highRisk.length > 1 ? 's' : ''} flagged as high-risk based on repair frequency.
              Rooms: {highRisk.map((t) => t.roomNo).join(', ')}. Recommend proactive inspection.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'in-progress', 'resolved', 'critical', 'high'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all capitalize ${filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
        <span className="text-xs text-slate-500 self-center ml-2">{filtered.length} tickets</span>
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onResolve={handleResolve} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && <NewTicketModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  );
}
