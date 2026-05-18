import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Plus, X } from 'lucide-react';

const statusConfig = {
  ok:       { badge: 'badge-ready',    bar: 'bg-emerald-500', bg: 'bg-emerald-900/5',  border: 'border-emerald-500/20' },
  low:      { badge: 'badge-overdue',  bar: 'bg-amber-500',   bg: 'bg-amber-900/5',   border: 'border-amber-500/20' },
  critical: { badge: 'badge-critical', bar: 'bg-red-500',     bg: 'bg-red-900/5',     border: 'border-red-500/30' },
};

const categoryColors = {
  Linen: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Toiletries: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Cleaning: 'bg-green-500/10 text-green-400 border-green-500/20',
  Hygiene: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Amenities: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

function InventoryCard({ item, onUpdate }) {
  const pct = Math.min(100, Math.round((item.stockLevel / item.threshold) * 100));
  const cfg = statusConfig[item.status];
  const [adjusting, setAdjusting] = useState(false);
  const [newStock, setNewStock] = useState(item.stockLevel);

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl border p-4 transition-all ${cfg.border} ${cfg.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-200">{item.itemName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${categoryColors[item.category] || ''}`}>
              {item.category}
            </span>
            <span className="text-xs text-slate-500">Floor: {item.floor}</span>
          </div>
        </div>
        <span className={cfg.badge}>{item.status === 'ok' ? 'OK' : item.status === 'low' ? 'Low' : 'Critical'}</span>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>{item.stockLevel} {item.unit}</span>
          <span>Threshold: {item.threshold}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${cfg.bar}`} />
        </div>
        <p className="text-xs text-slate-500 mt-1">{pct}% of threshold</p>
      </div>

      {item.status !== 'ok' && (
        <div className="flex items-center gap-1.5 text-xs mb-3 px-2.5 py-1.5 rounded-lg border"
          style={{ background: item.status === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', borderColor: item.status === 'critical' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)' }}>
          <AlertTriangle size={10} className={item.status === 'critical' ? 'text-red-400' : 'text-amber-400'} />
          <span className={item.status === 'critical' ? 'text-red-300' : 'text-amber-300'}>
            {item.status === 'critical' ? 'Immediate restock required' : 'Stock running low — reorder soon'}
          </span>
        </div>
      )}

      {adjusting ? (
        <div className="flex gap-2">
          <input type="number" value={newStock} onChange={(e) => setNewStock(Number(e.target.value))} min={0}
            className="inp py-1.5 text-xs" />
          <button onClick={() => { onUpdate(item.id, newStock); setAdjusting(false); }} className="btn-success py-1.5 text-xs px-3">
            Save
          </button>
          <button onClick={() => setAdjusting(false)} className="btn-secondary py-1.5 text-xs px-3">
            <X size={12} />
          </button>
        </div>
      ) : (
        <button onClick={() => { setNewStock(item.stockLevel); setAdjusting(true); }} className="btn-secondary py-1.5 text-xs w-full justify-center">
          <RefreshCw size={11} /> Update Stock
        </button>
      )}
    </motion.div>
  );
}

export default function Inventory() {
  const { inventory, updateInventory } = useHotelStore();
  const [filter, setFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const critical = inventory.filter((i) => i.status === 'critical').length;
  const low = inventory.filter((i) => i.status === 'low').length;
  const ok = inventory.filter((i) => i.status === 'ok').length;
  const categories = [...new Set(inventory.map((i) => i.category))];

  const filtered = inventory.filter((i) => {
    const matchStatus = filter === 'all' || i.status === filter;
    const matchCat = catFilter === 'all' || i.category === catFilter;
    return matchStatus && matchCat;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={22} className="text-cyan-400" /> Inventory Dashboard
          </h1>
          <p className="text-slate-400 text-sm">{inventory.length} items tracked — AI-monitored</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 border border-red-500/20 bg-red-900/5 cursor-pointer" onClick={() => setFilter('critical')}>
          <p className="text-2xl font-bold text-red-400">{critical}</p>
          <p className="text-xs text-slate-500 mt-0.5">Critical</p>
        </div>
        <div className="glass rounded-xl p-4 border border-amber-500/20 bg-amber-900/5 cursor-pointer" onClick={() => setFilter('low')}>
          <p className="text-2xl font-bold text-amber-400">{low}</p>
          <p className="text-xs text-slate-500 mt-0.5">Low Stock</p>
        </div>
        <div className="glass rounded-xl p-4 border border-emerald-500/20 bg-emerald-900/5 cursor-pointer" onClick={() => setFilter('ok')}>
          <p className="text-2xl font-bold text-emerald-400">{ok}</p>
          <p className="text-xs text-slate-500 mt-0.5">In Stock</p>
        </div>
      </div>

      {/* AI Alert banner */}
      {(critical > 0 || low > 0) && (
        <div className="glass rounded-xl border border-amber-500/30 bg-amber-900/10 p-4 flex items-start gap-3">
          <TrendingDown size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-1">AI Inventory Alert</p>
            <p className="text-xs text-slate-400">
              {critical} item{critical !== 1 ? 's' : ''} critically low, {low} below threshold.
              Auto-reorder requests have been sent to procurement.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'critical', 'low', 'ok'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all capitalize ${filter === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
            {f === 'all' ? 'All Items' : f}
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 self-center" />
        {categories.map((c) => (
          <button key={c} onClick={() => setCatFilter(catFilter === c ? 'all' : c)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${catFilter === c ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((item) => (
          <InventoryCard key={item.id} item={item} onUpdate={updateInventory} />
        ))}
      </div>
    </div>
  );
}
