import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import {
  BedDouble, Filter, Search, LogOut, Wrench, CheckCircle,
  Clock, User, AlertTriangle, Star, Plus, X
} from 'lucide-react';

const STATUS_CONFIG = {
  ready:       { label: 'Ready',       color: 'bg-emerald-500', border: 'border-emerald-500/40', bg: 'bg-emerald-900/10', badge: 'badge-ready',       dot: 'bg-emerald-500' },
  occupied:    { label: 'Occupied',    color: 'bg-blue-500',    border: 'border-blue-500/40',    bg: 'bg-blue-900/10',    badge: 'badge-occupied',    dot: 'bg-blue-500' },
  cleaning:    { label: 'Cleaning',    color: 'bg-amber-500',   border: 'border-amber-500/40',   bg: 'bg-amber-900/10',   badge: 'badge-cleaning',    dot: 'bg-amber-500' },
  maintenance: { label: 'Maintenance', color: 'bg-red-500',     border: 'border-red-500/40',     bg: 'bg-red-900/10',     badge: 'badge-maintenance', dot: 'bg-red-500' },
};

const FILTERS = ['all', 'ready', 'occupied', 'cleaning', 'maintenance'];

function RoomCard({ room, onCheckout, onReport, onMarkReady }) {
  const cfg = STATUS_CONFIG[room.status];
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className={`glass rounded-2xl border ${cfg.border} ${cfg.bg} p-4 cursor-pointer relative overflow-hidden transition-all`}
      onClick={() => setShowActions(!showActions)}
    >
      {/* VIP badge */}
      {room.vip && (
        <div className="absolute top-2 right-2">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
        </div>
      )}

      {/* Status stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${cfg.color}`} />

      {/* Room number */}
      <div className="flex items-start justify-between mt-1 mb-3">
        <div>
          <p className="text-2xl font-bold text-white">{room.roomNo}</p>
          <p className="text-xs text-slate-500 capitalize">{room.type}</p>
        </div>
        <span className={cfg.badge}>{cfg.label}</span>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        {room.assignedStaff && (
          <div className="flex items-center gap-1.5">
            <User size={11} className="text-slate-500" />
            <span className="text-xs text-slate-400">{room.assignedStaff}</span>
          </div>
        )}
        {room.guestName && (
          <div className="flex items-center gap-1.5">
            <BedDouble size={11} className="text-slate-500" />
            <span className="text-xs text-slate-400">{room.guestName}</span>
          </div>
        )}
        {room.currentIssue && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={11} className="text-red-400" />
            <span className="text-xs text-red-400 truncate">{room.currentIssue}</span>
          </div>
        )}
        {room.eta && (
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-slate-500" />
            <span className="text-xs text-slate-400">ETA: {room.eta}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 mt-3">Updated {room.lastUpdated}</p>

      {/* Quick Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-0 bottom-0 bg-slate-900/95 rounded-b-2xl p-3 border-t border-white/5 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-300">Actions — Room {room.roomNo}</span>
              <button onClick={() => setShowActions(false)} className="text-slate-500 hover:text-white">
                <X size={13} />
              </button>
            </div>
            {room.status === 'occupied' && (
              <button onClick={() => { onCheckout(room.id); setShowActions(false); }} className="btn-danger text-xs py-1.5">
                <LogOut size={12} /> Checkout
              </button>
            )}
            {(room.status === 'cleaning' || room.status === 'maintenance') && (
              <button onClick={() => { onReport(room.id, 'Issue Reported'); setShowActions(false); }} className="btn-danger text-xs py-1.5">
                <AlertTriangle size={12} /> Report Issue
              </button>
            )}
            {(room.status === 'cleaning') && (
              <button onClick={() => { onMarkReady(room.id); setShowActions(false); }} className="btn-success text-xs py-1.5">
                <CheckCircle size={12} /> Mark Ready
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RoomStatus() {
  const { rooms, checkoutRoom, reportRoomIssue, updateRoomStatus } = useHotelStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [floor, setFloor] = useState('all');

  const filtered = rooms.filter((r) => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchSearch = r.roomNo.includes(search) || (r.guestName || '').toLowerCase().includes(search.toLowerCase());
    const matchFloor = floor === 'all' || r.floor === Number(floor);
    return matchFilter && matchSearch && matchFloor;
  });

  const counts = Object.fromEntries(
    ['ready', 'occupied', 'cleaning', 'maintenance'].map((s) => [s, rooms.filter((r) => r.status === s).length])
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Room Status</h1>
          <p className="text-slate-400 text-sm">{rooms.length} total rooms across {[...new Set(rooms.map(r => r.floor))].length} floors</p>
        </div>
      </div>

      {/* Summary Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['ready', 'occupied', 'cleaning', 'maintenance'].map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
              className={`glass rounded-xl p-4 border ${filter === s ? cfg.border : 'border-white/5'} transition-all text-left hover:border-white/20`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-xs font-medium text-slate-400 capitalize">{s}</span>
              </div>
              <p className="text-2xl font-bold text-white">{counts[s]}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room or guest..."
            className="inp pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all capitalize ${
                filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'
              }`}>
              {f === 'all' ? 'All Rooms' : f}
            </button>
          ))}
          <select value={floor} onChange={(e) => setFloor(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-400 focus:outline-none cursor-pointer">
            <option value="all">All Floors</option>
            {[1,2,3,4,5].map((f) => <option key={f} value={f}>Floor {f}</option>)}
          </select>
        </div>
        <span className="text-xs text-slate-500">{filtered.length} rooms</span>
      </div>

      {/* Room Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        <AnimatePresence>
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onCheckout={checkoutRoom}
              onReport={reportRoomIssue}
              onMarkReady={(id) => updateRoomStatus(id, 'ready', { assignedStaff: null, currentIssue: null })}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <BedDouble size={40} className="mx-auto mb-3 opacity-30" />
          <p>No rooms match your filter</p>
        </div>
      )}
    </div>
  );
}
