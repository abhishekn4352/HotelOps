import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import {
  BedDouble, ClipboardList, Wrench, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Users, Package, Activity, Brain, LogOut, ArrowRight, Zap, Play, ChevronRight, RefreshCw, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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
                  className={`w-6 h-6 rounded-md ${statusColor[r.status]} cursor-pointer flex items-center justify-center relative`}
                >
                  {r.vip && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-slate-900 flex items-center justify-center">
                      <Star size={6} className="text-slate-900 fill-slate-900" />
                    </div>
                  )}
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

// ── Demo Flow Scenario Data ─────────────────────────────
const demoSteps = [
  {
    step: 1,
    title: "1. Guest Checkout Room 203",
    description: "Front Desk clicks checkout: Room 203 becomes Cleaning status. High-priority housekeeping task is auto-created.",
    actionText: "Trigger Checkout",
    action: (store) => {
      // Find room 203
      const room203 = store.rooms.find(r => r.roomNo === "203");
      if (room203) {
        store.updateRoomStatus(room203.id, 'cleaning', { guestName: null, assignedStaff: 'Priya', lastUpdated: '10:20' });
        store.addTask({
          id: 101,
          taskType: "Checkout Cleaning",
          department: "Housekeeping",
          location: "Room 203",
          priority: "high",
          status: "pending",
          assignedTo: "Priya",
          reason: "New guest arriving in 45 minutes"
        });
        store.addTimelineEvent({
          event: "Room 203 — Guest checked out from Front Desk",
          type: "checkout",
          dept: "Front Desk"
        });
        toast.success("Guest Checked Out: Room 203 Cleaning task auto-created!");
      }
    }
  },
  {
    step: 2,
    title: "2. Housekeeping Priya Starts Cleaning",
    description: "Housekeeper Priya accepts and starts cleaning Room 203. Status updates from Pending to In Progress.",
    actionText: "Start Cleaning",
    action: (store) => {
      store.updateTaskStatus(101, 'in-progress');
      store.addTimelineEvent({
        event: "Priya started cleaning Room 203",
        type: "cleaning",
        dept: "Housekeeping"
      });
      toast.success("Housekeeping Started: Room 203 status changed to In Progress");
    }
  },
  {
    step: 3,
    title: "3. AC Failure Reported during cleaning",
    description: "Priya detects AC cooling issue and reports it. Maintenance ticket auto-created, Room status becomes Maintenance Required.",
    actionText: "Report Issue",
    action: (store) => {
      const room203 = store.rooms.find(r => r.roomNo === "203");
      if (room203) {
        store.reportRoomIssue(room203.id, "AC Cooling Failure");
        store.addTimelineEvent({
          event: "AC cooling issue detected in Room 203 during cleaning",
          type: "issue",
          dept: "Housekeeping"
        });
        toast.error("AC Issue Reported: Room 203 changed to Maintenance Required (Red)");
      }
    }
  },
  {
    step: 4,
    title: "4. AI Predictive Maintenance Alert",
    description: "AI scans history: Room 203 AC repaired 3 times this month. AI alerts Manager of repeated failure risk.",
    actionText: "Generate AI Alert",
    action: (store) => {
      const newAlert = {
        id: 201,
        type: "predictive",
        title: "Recurring AC Failure — Room 203",
        message: "AC repaired 3 times this month. Recommend full HVAC inspection before next guest.",
        severity: "critical",
        time: "10:43",
        dismissed: false
      };
      // Insert alert
      store.setState((s) => ({ aiAlerts: [newAlert, ...s.aiAlerts] }));
      store.addTimelineEvent({
        event: "AI Alert: Room 203 AC repaired 3 times this month — Predictive warning",
        type: "ai",
        dept: "AI System"
      });
      toast.error("AI Alert: Predictive maintenance warning fired!");
    }
  },
  {
    step: 5,
    title: "5. Technician Rahul Assigned to Repair",
    description: "Maintenance technician Rahul instantly receives task to repair AC in Room 203.",
    actionText: "Assign Technician",
    action: (store) => {
      store.addTask({
        id: 102,
        taskType: "AC Repair",
        department: "Maintenance",
        location: "Room 203",
        priority: "critical",
        status: "in-progress",
        assignedTo: "Rahul",
        reason: "AC cooling failure repair"
      });
      store.addTimelineEvent({
        event: "Technician Rahul assigned to AC Repair — Room 203",
        type: "assign",
        dept: "Maintenance"
      });
      toast.success("Technician Assigned: Rahul is on the task");
    }
  },
  {
    step: 6,
    title: "6. AI Delay Risk Warning",
    description: "AI tracks repair duration: Estimated 20 min, current is 38 min. Proactive manager delay alert generated.",
    actionText: "Generate Delay Alert",
    action: (store) => {
      const delayAlert = {
        id: 202,
        type: "delay",
        title: "Repair Delay Detected — Room 203",
        message: "AC repair estimated 20 mins. Current duration: 38 mins. Check technician status.",
        severity: "warning",
        time: "11:05",
        dismissed: false
      };
      store.setState((s) => ({ aiAlerts: [delayAlert, ...s.aiAlerts] }));
      store.addTimelineEvent({
        event: "AI Alert: AC repair delay detected in Room 203",
        type: "alert",
        dept: "AI System"
      });
      toast.error("AI Delay Warning: Repair is taking longer than expected");
    }
  },
  {
    step: 7,
    title: "7. Scheduled Lobby Cleaning Delay",
    description: "AI detects scheduled lobby floor cleaning task is overdue by 25 mins, fires manager delay alert.",
    actionText: "Lobby Overdue Alert",
    action: (store) => {
      const overdueAlert = {
        id: 203,
        type: "delay",
        title: "Lobby Cleaning Overdue",
        message: "Main Lobby cleaning overdue by 25 minutes. Public hygiene risk.",
        severity: "warning",
        time: "11:00",
        dismissed: false
      };
      store.setState((s) => ({ aiAlerts: [overdueAlert, ...s.aiAlerts] }));
      store.addTimelineEvent({
        event: "AI Alert: Main Lobby cleaning overdue by 25 mins",
        type: "alert",
        dept: "AI System"
      });
      toast.error("AI Warning: Lobby cleaning task overdue!");
    }
  },
  {
    step: 8,
    title: "8. Emergency Lobby Cleanup",
    description: "Guest spills drink in lobby. Front Desk creates urgent request. Task escalated to Urgent priority, assigned to Sunita.",
    actionText: "Emergency Cleanup",
    action: (store) => {
      store.addTask({
        id: 103,
        taskType: "Emergency Lobby Cleanup",
        department: "Housekeeping",
        location: "Lobby",
        priority: "critical",
        status: "in-progress",
        assignedTo: "Sunita",
        reason: "Spilled drink — slip hazard"
      });
      store.addTimelineEvent({
        event: "Emergency Lobby Cleanup task escalated to Urgent priority",
        type: "alert",
        dept: "Front Desk"
      });
      toast.success("Emergency Cleanup Escalated to Urgent priority!");
    }
  },
  {
    step: 9,
    title: "9. Guest Towel Request",
    description: "Guest from Room 402 requests extra towels. Front Desk enters request; AI auto-categorizes & assigns to Meera.",
    actionText: "Towel Request",
    action: (store) => {
      store.addGuestRequest({
        id: 301,
        roomNo: "402",
        guestName: "Mr. Singh",
        request: "Extra towels needed",
        category: "Housekeeping",
        priority: "medium",
        status: "pending",
        assignedTo: "Meera"
      });
      store.addTimelineEvent({
        event: "Guest request: Extra towels needed — Room 402",
        type: "guest",
        dept: "Guest Services"
      });
      toast.success("Guest Request Created: Towels for Room 402");
    }
  },
  {
    step: 10,
    title: "10. Low Inventory Alert Fired",
    description: "Housekeeping updates stock. Towel inventory on Floor 2 drops below threshold (45/80). Refill alert created.",
    actionText: "Trigger Inventory Low",
    action: (store) => {
      // Update inventory towels stock
      const towel = store.inventory.find(i => i.itemName === "Towels");
      if (towel) {
        store.updateInventory(towel.id, 45);
      }
      const invAlert = {
        id: 204,
        type: "inventory",
        title: "Low Stock: Towels — Floor 2",
        message: "Floor 2 towel inventory below threshold (45/80). Refill request created.",
        severity: "warning",
        time: "11:10",
        dismissed: false
      };
      store.setState((s) => ({ aiAlerts: [invAlert, ...s.aiAlerts] }));
      store.addTimelineEvent({
        event: "Inventory alert: Floor 2 towels below threshold",
        type: "inventory",
        dept: "System"
      });
      toast.error("Inventory Alert: Towels critically low on Floor 2");
    }
  },
  {
    step: 11,
    title: "11. Maintenance Rahul Resolves Issue",
    description: "Rahul completes AC repair. Room status returns to Cleaning Pending so housekeeping can finish.",
    actionText: "Resolve AC Issue",
    action: (store) => {
      const room203 = store.rooms.find(r => r.roomNo === "203");
      if (room203) {
        store.updateRoomStatus(room203.id, 'cleaning', { currentIssue: null });
        store.updateTaskStatus(102, 'completed');
        store.addTimelineEvent({
          event: "AC Repair completed in Room 203 by Rahul",
          type: "resolved",
          dept: "Maintenance"
        });
        toast.success("AC Repaired: Room 203 returned to Cleaning Pending");
      }
    }
  },
  {
    step: 12,
    title: "12. Cleaning Completed — Room Ready",
    description: "Housekeeping Priya completes final cleaning. Room status updates to Ready. Front Desk notified instantly.",
    actionText: "Complete Cleaning",
    action: (store) => {
      const room203 = store.rooms.find(r => r.roomNo === "203");
      if (room203) {
        store.updateRoomStatus(room203.id, 'ready', { assignedStaff: null });
        store.updateTaskStatus(101, 'completed');
        store.addTimelineEvent({
          event: "Room 203 final checkout cleaning completed. Room READY",
          type: "ready",
          dept: "Housekeeping"
        });
        toast.success("Success: Room 203 is now READY for Check-in!");
      }
    }
  },
  {
    step: 13,
    title: "13. Front Desk Assigns Next Guest",
    description: "Front Desk assigns next incoming guest to Room 203. Room status changes to Occupied.",
    actionText: "Assign Next Guest",
    action: (store) => {
      const room203 = store.rooms.find(r => r.roomNo === "203");
      if (room203) {
        store.updateRoomStatus(room203.id, 'occupied', { guestName: "Mrs. Sen", lastUpdated: "11:40" });
        store.addTimelineEvent({
          event: "Room 203 checked in by Front Desk (Mrs. Sen)",
          type: "checkin",
          dept: "Front Desk"
        });
        toast.success("Demo Walkthrough Complete: Room 203 checked-in successfully!");
      }
    }
  }
];

export default function Dashboard() {
  const store = useHotelStore();
  const { rooms, tasks, aiAlerts, dismissAlert, guestRequests, inventory, staff } = store;
  const [tick, setTick] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

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

  const handleNextStep = () => {
    if (currentStepIdx < demoSteps.length) {
      demoSteps[currentStepIdx].action(store);
      setCurrentStepIdx((idx) => idx + 1);
    }
  };

  const handleResetDemo = () => {
    setCurrentStepIdx(0);
    // Reload original state from mock data
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap size={22} className="text-indigo-400 animate-pulse" /> HotelOps Central
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Grand Meridian Hotel — Live as of {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-indicator" />
          <span className="text-xs text-emerald-400 font-medium">Real-time</span>
        </div>
      </div>

      {/* ── Interactive Demo Simulation Panel ───────────────────────────── */}
      <div className="glass rounded-2xl p-5 border border-indigo-500/30 bg-indigo-950/20 glow-blue">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Interactive Walkthrough
              </span>
              {currentStepIdx >= demoSteps.length && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Completed
                </span>
              )}
            </div>
            {currentStepIdx < demoSteps.length ? (
              <div className="mt-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  {demoSteps[currentStepIdx].title}
                </h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {demoSteps[currentStepIdx].description}
                </p>
              </div>
            ) : (
              <div className="mt-2">
                <h3 className="text-lg font-bold text-emerald-400">All Steps Completed Successfully!</h3>
                <p className="text-sm text-slate-300 mt-1">
                  You completed the entire real-time orchestration story: guest checkout -> housekeeping -> AC issue -> AI prediction -> delay alert -> lobby overdue -> emergency -> towels request -> inventory low stock -> maintenance resolve -> room ready -> check-in.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-stretch md:self-auto justify-end">
            {currentStepIdx < demoSteps.length ? (
              <button
                onClick={handleNextStep}
                className="btn-primary py-2.5 px-5 text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                {demoSteps[currentStepIdx].actionText} <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleResetDemo}
                className="btn-success py-2.5 px-5 text-sm flex items-center gap-1.5 hover:scale-[1.02]"
              >
                Reset Demo <RefreshCw size={14} />
              </button>
            )}
            {currentStepIdx > 0 && currentStepIdx < demoSteps.length && (
              <button
                onClick={handleResetDemo}
                className="btn-secondary py-2.5 px-4 text-sm"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">
            <span>Progress</span>
            <span>{currentStepIdx} of {demoSteps.length} Steps</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex gap-0.5">
            {demoSteps.map((step, idx) => (
              <div
                key={step.step}
                className={`h-full flex-1 transition-all duration-300 ${
                  idx < currentStepIdx
                    ? "bg-indigo-500"
                    : idx === currentStepIdx
                    ? "bg-indigo-400 animate-pulse"
                    : "bg-white/5"
                }`}
              />
            ))}
          </div>
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
            {store.timeline.map((event) => (
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
