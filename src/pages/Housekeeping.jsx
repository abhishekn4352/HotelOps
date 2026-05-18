import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import {
  Sparkles, Plus, Filter, Search, CheckCircle, Clock,
  User, MapPin, AlertTriangle, ChevronDown, X
} from 'lucide-react';

const priorityConfig = {
  critical: { badge: 'badge-critical', dot: 'bg-red-500', order: 0 },
  high:     { badge: 'badge-high',     dot: 'bg-orange-500', order: 1 },
  medium:   { badge: 'badge-medium',   dot: 'bg-yellow-500', order: 2 },
  low:      { badge: 'badge-low',      dot: 'bg-green-500',  order: 3 },
};
const statusConfig = {
  'in-progress': { badge: 'badge-cleaning',  label: 'In Progress' },
  pending:       { badge: 'badge-pending',   label: 'Pending' },
  completed:     { badge: 'badge-completed', label: 'Done' },
  overdue:       { badge: 'badge-overdue',   label: 'Overdue' },
};

function TaskCard({ task, onUpdate }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2.5 flex-1">
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityConfig[task.priority]?.dot}`} />
          <div>
            <p className="text-sm font-semibold text-slate-200">{task.taskType}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={10} /> {task.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <User size={10} /> {task.assignedTo || 'Unassigned'}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={10} /> {task.createdAt}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={priorityConfig[task.priority]?.badge}>{task.priority}</span>
          <span className={statusConfig[task.status]?.badge}>{statusConfig[task.status]?.label}</span>
        </div>
      </div>

      {task.reason && (
        <p className="text-xs text-slate-500 mt-2 italic border-l-2 border-white/10 pl-2">{task.reason}</p>
      )}

      {task.status !== 'completed' && (
        <div className="flex gap-2 mt-3">
          {task.status === 'pending' && (
            <button onClick={() => onUpdate(task.id, 'in-progress')} className="btn-primary py-1.5 text-xs">
              Start Task
            </button>
          )}
          {task.status === 'in-progress' && (
            <button onClick={() => onUpdate(task.id, 'completed')} className="btn-success py-1.5 text-xs">
              <CheckCircle size={12} /> Complete
            </button>
          )}
          {task.status === 'overdue' && (
            <button onClick={() => onUpdate(task.id, 'in-progress')} className="btn-danger py-1.5 text-xs">
              <AlertTriangle size={12} /> Start Now
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function NewTaskModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ taskType: '', location: '', priority: 'medium', assignedTo: '', reason: '' });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, department: 'Housekeeping', status: 'pending', eta: null });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="glass rounded-2xl border border-white/10 p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">New Housekeeping Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={form.taskType} onChange={(e) => set('taskType', e.target.value)} placeholder="Task type (e.g. Checkout Cleaning)" className="inp" />
          <input required value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Location (e.g. Room 205)" className="inp" />
          <select value={form.priority} onChange={(e) => set('priority', e.target.value)} className="inp">
            {['critical', 'high', 'medium', 'low'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input value={form.assignedTo} onChange={(e) => set('assignedTo', e.target.value)} placeholder="Assign to staff" className="inp" />
          <input value={form.reason} onChange={(e) => set('reason', e.target.value)} placeholder="Reason / notes" className="inp" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Create Task</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Housekeeping() {
  const { tasks, updateTaskStatus, addTask } = useHotelStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const hkTasks = tasks.filter((t) => t.department === 'Housekeeping');
  const filtered = hkTasks.filter((t) => {
    const matchFilter = filter === 'all' || t.status === filter || t.priority === filter;
    const matchSearch = t.taskType.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }).sort((a, b) => (priorityConfig[a.priority]?.order || 9) - (priorityConfig[b.priority]?.order || 9));

  const statusCounts = {
    pending: hkTasks.filter((t) => t.status === 'pending').length,
    'in-progress': hkTasks.filter((t) => t.status === 'in-progress').length,
    overdue: hkTasks.filter((t) => t.status === 'overdue').length,
    completed: hkTasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles size={22} className="text-amber-400" /> Housekeeping Board
          </h1>
          <p className="text-slate-400 text-sm">{hkTasks.length} tasks — real-time updates</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'pending', label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-500/10' },
          { key: 'in-progress', label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { key: 'overdue', label: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/10' },
          { key: 'completed', label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(({ key, label, color, bg }) => (
          <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
            className={`${bg} rounded-xl p-4 border ${filter === key ? 'border-indigo-500/50' : 'border-white/5'} text-left transition-all hover:border-white/15`}>
            <p className={`text-2xl font-bold ${color}`}>{statusCounts[key]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="inp pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'in-progress', 'overdue', 'critical', 'high'].map((f) => (
            <button key={f} onClick={() => setFilter(f === filter ? 'all' : f)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all capitalize ${filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={updateTaskStatus} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Sparkles size={40} className="mx-auto mb-3 opacity-30" />
          <p>No tasks match your filter</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && <NewTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />}
      </AnimatePresence>
    </div>
  );
}
