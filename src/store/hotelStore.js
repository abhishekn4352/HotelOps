import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  initialRooms,
  initialTasks,
  initialMaintenanceTickets,
  initialInventory,
  initialStaff,
  initialPublicAreas,
  initialGuestRequests,
  activityTimeline,
  initialAIAlerts,
} from '../data/mockData';

export const useHotelStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────
      rooms: initialRooms,
      tasks: initialTasks,
      maintenanceTickets: initialMaintenanceTickets,
      inventory: initialInventory,
      staff: initialStaff,
      publicAreas: initialPublicAreas,
      guestRequests: initialGuestRequests,
      timeline: activityTimeline,
      aiAlerts: initialAIAlerts,
      notifications: [],
      darkMode: true,
      sidebarOpen: true,
      currentUser: { name: "Anita Singh", role: "manager", dept: "Admin", avatar: "AS" },

      // ── Actions ────────────────────────────────────────────
      resetStore: () => {
        set({
          rooms: initialRooms,
          tasks: initialTasks,
          maintenanceTickets: initialMaintenanceTickets,
          inventory: initialInventory,
          staff: initialStaff,
          publicAreas: initialPublicAreas,
          guestRequests: initialGuestRequests,
          timeline: activityTimeline,
          aiAlerts: initialAIAlerts,
          notifications: [],
        });
      },

      // ── Dark Mode ──────────────────────────────────────────
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // ── Notifications ──────────────────────────────────────
      addNotification: (notification) =>
        set((s) => ({
          notifications: [
            {
              id: Date.now(),
              read: false,
              time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              ...notification
            },
            ...s.notifications
          ].slice(0, 50),
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      // ── AI Alerts ──────────────────────────────────────────
      dismissAlert: (id) =>
        set((s) => ({
          aiAlerts: s.aiAlerts.map((a) => (a.id === id ? { ...a, dismissed: true } : a)),
        })),

      // ── Room Operations ────────────────────────────────────
      checkoutRoom: (roomId) => {
        const { rooms, tasks, addNotification } = get();
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return;
        const newTask = {
          id: Date.now(),
          taskType: 'Checkout Cleaning',
          department: 'Housekeeping',
          location: `Room ${room.roomNo}`,
          priority: 'high',
          status: 'pending',
          assignedTo: 'Priya',
          createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          eta: null,
          reason: 'Auto-created after guest checkout',
        };
        set({
          rooms: rooms.map((r) => r.id === roomId ? { ...r, status: 'cleaning', guestName: null, assignedStaff: 'Priya', lastUpdated: newTask.createdAt } : r),
          tasks: [newTask, ...tasks],
        });
        addNotification({ title: `Room ${room.roomNo} checked out`, message: 'Cleaning task auto-created', type: 'task' });
      },

      updateRoomStatus: (roomId, status, extra = {}) => {
        set((s) => ({
          rooms: s.rooms.map((r) => r.id === roomId ? { ...r, status, lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), ...extra } : r),
        }));
      },

      reportRoomIssue: (roomId, issue) => {
        const { rooms, maintenanceTickets, addNotification } = get();
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return;
        const ticket = {
          id: Date.now(),
          issueType: issue,
          roomNo: room.roomNo,
          priority: 'critical',
          status: 'pending',
          technician: 'Rahul',
          reportedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          repairHistory: 1,
          riskScore: 60,
          estimatedTime: 30,
          actualTime: null,
        };
        set({
          rooms: rooms.map((r) => r.id === roomId ? { ...r, status: 'maintenance', currentIssue: issue } : r),
          maintenanceTickets: [ticket, ...maintenanceTickets],
        });
        addNotification({ title: `Maintenance: Room ${room.roomNo}`, message: issue, type: 'alert' });
      },

      // ── Task Operations ────────────────────────────────────
      addTask: (task) =>
        set((s) => ({
          tasks: [{ id: Date.now(), createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), ...task }, ...s.tasks],
        })),

      updateTaskStatus: (taskId, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        })),

      // ── Inventory ──────────────────────────────────────────
      updateInventory: (itemId, stockLevel) =>
        set((s) => ({
          inventory: s.inventory.map((i) => {
            if (i.id !== itemId) return i;
            const status = stockLevel < i.threshold * 0.4 ? 'critical' : stockLevel < i.threshold ? 'low' : 'ok';
            return { ...i, stockLevel, status };
          }),
        })),

      // ── Guest Requests ─────────────────────────────────────
      addGuestRequest: (req) =>
        set((s) => ({
          guestRequests: [{ id: Date.now(), createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), status: 'pending', ...req }, ...s.guestRequests],
        })),

      updateGuestRequestStatus: (reqId, status) =>
        set((s) => ({
          guestRequests: s.guestRequests.map((r) => (r.id === reqId ? { ...r, status } : r)),
        })),

      // ── Timeline ───────────────────────────────────────────
      addTimelineEvent: (event) =>
        set((s) => ({
          timeline: [{ id: Date.now(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), ...event }, ...s.timeline],
        })),
    }),
    {
      name: 'hotelops-orchestrator-storage',
    }
  )
);
