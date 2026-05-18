// HotelOps Mock Data — Central data store for demo
export const HOTEL_NAME = "Grand Meridian Hotel";

// ──────────────────────────────────────────────
// ROOMS
// ──────────────────────────────────────────────
export const initialRooms = [
  { id: 1, roomNo: "101", floor: 1, type: "Standard", status: "ready", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "10:05", guestName: null, vip: false },
  { id: 2, roomNo: "102", floor: 1, type: "Standard", status: "occupied", assignedStaff: "Priya", currentIssue: null, eta: null, lastUpdated: "08:30", guestName: "Mr. Sharma", vip: false },
  { id: 3, roomNo: "103", floor: 1, type: "Deluxe", status: "cleaning", assignedStaff: "Priya", currentIssue: null, eta: "11:30", lastUpdated: "11:10", guestName: null, vip: false },
  { id: 4, roomNo: "104", floor: 1, type: "Standard", status: "ready", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "09:45", guestName: null, vip: false },
  { id: 5, roomNo: "201", floor: 2, type: "Suite", status: "occupied", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "07:00", guestName: "Ms. Kapoor", vip: true },
  { id: 6, roomNo: "202", floor: 2, type: "Standard", status: "ready", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "10:00", guestName: null, vip: false },
  { id: 7, roomNo: "203", floor: 2, type: "Deluxe", status: "maintenance", assignedStaff: "Rahul", currentIssue: "AC Cooling Failure", eta: "11:45", lastUpdated: "10:42", guestName: null, vip: false },
  { id: 8, roomNo: "204", floor: 2, type: "Standard", status: "cleaning", assignedStaff: "Sunita", currentIssue: null, eta: "11:20", lastUpdated: "11:00", guestName: null, vip: false },
  { id: 9, roomNo: "205", floor: 2, type: "Deluxe", status: "ready", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "09:30", guestName: null, vip: false },
  { id: 10, roomNo: "301", floor: 3, type: "Suite", status: "occupied", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "06:00", guestName: "Mr. Verma", vip: true },
  { id: 11, roomNo: "302", floor: 3, type: "Deluxe", status: "maintenance", assignedStaff: "Rahul", currentIssue: "AC Repeated Failure", eta: "12:00", lastUpdated: "10:15", guestName: null, vip: false },
  { id: 12, roomNo: "303", floor: 3, type: "Standard", status: "ready", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "09:00", guestName: null, vip: false },
  { id: 13, roomNo: "304", floor: 3, type: "Standard", status: "cleaning", assignedStaff: "Meera", currentIssue: null, eta: "11:40", lastUpdated: "11:15", guestName: null, vip: false },
  { id: 14, roomNo: "401", floor: 4, type: "Suite", status: "occupied", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "05:00", guestName: "Ms. Patel", vip: false },
  { id: 15, roomNo: "402", floor: 4, type: "Deluxe", status: "occupied", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "09:20", guestName: "Mr. Singh", vip: false },
  { id: 16, roomNo: "403", floor: 4, type: "Standard", status: "ready", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "10:10", guestName: null, vip: false },
  { id: 17, roomNo: "404", floor: 4, type: "Standard", status: "cleaning", assignedStaff: "Priya", currentIssue: null, eta: "11:50", lastUpdated: "11:20", guestName: null, vip: false },
  { id: 18, roomNo: "501", floor: 5, type: "Presidential", status: "occupied", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "04:00", guestName: "VIP Guest", vip: true },
  { id: 19, roomNo: "502", floor: 5, type: "Suite", status: "maintenance", assignedStaff: "Deepak", currentIssue: "Water Leakage", eta: "12:30", lastUpdated: "10:00", guestName: null, vip: false },
  { id: 20, roomNo: "503", floor: 5, type: "Suite", status: "ready", assignedStaff: null, currentIssue: null, eta: null, lastUpdated: "08:45", guestName: null, vip: false },
];

// ──────────────────────────────────────────────
// TASKS
// ──────────────────────────────────────────────
export const initialTasks = [
  { id: 1, taskType: "Checkout Cleaning", department: "Housekeeping", location: "Room 203", priority: "high", status: "in-progress", assignedTo: "Priya", createdAt: "10:22", eta: "11:15", reason: "New guest arriving in 45 minutes" },
  { id: 2, taskType: "AC Repair", department: "Maintenance", location: "Room 203", priority: "critical", status: "in-progress", assignedTo: "Rahul", createdAt: "10:42", eta: "11:45", reason: "AC cooling failure detected during cleaning" },
  { id: 3, taskType: "Lobby Floor Cleaning", department: "Housekeeping", location: "Lobby", priority: "medium", status: "overdue", assignedTo: "Sunita", createdAt: "09:00", eta: "09:30", reason: "Scheduled recurring 2-hour task" },
  { id: 4, taskType: "Extra Towels Delivery", department: "Housekeeping", location: "Room 402", priority: "medium", status: "pending", assignedTo: "Meera", createdAt: "11:05", eta: "11:25", reason: "Guest request via front desk" },
  { id: 5, taskType: "Water Leakage Fix", department: "Maintenance", location: "Room 502", priority: "critical", status: "in-progress", assignedTo: "Deepak", createdAt: "10:00", eta: "11:00", reason: "Water leakage detected on Floor 5" },
  { id: 6, taskType: "Pool Maintenance", department: "Housekeeping", location: "Pool Area", priority: "medium", status: "pending", assignedTo: "Ramesh", createdAt: "10:30", eta: "12:00", reason: "Daily scheduled pool maintenance" },
  { id: 7, taskType: "Elevator Cleaning", department: "Housekeeping", location: "All Elevators", priority: "medium", status: "completed", assignedTo: "Sunita", createdAt: "08:00", eta: "09:00", reason: "Morning sanitation schedule" },
  { id: 8, taskType: "Deep Cleaning", department: "Housekeeping", location: "Room 302", priority: "high", status: "pending", assignedTo: "Meera", createdAt: "11:10", eta: "13:00", reason: "Post maintenance deep clean required" },
  { id: 9, taskType: "WiFi Issue", department: "Maintenance", location: "Room 401", priority: "medium", status: "pending", assignedTo: "Deepak", createdAt: "11:00", eta: "11:30", reason: "Guest reported no internet connectivity" },
  { id: 10, taskType: "VIP Room Preparation", department: "Housekeeping", location: "Room 501", priority: "critical", status: "completed", assignedTo: "Priya", createdAt: "07:00", eta: "09:00", reason: "VIP guest arriving at 10 AM" },
  { id: 11, taskType: "Gym Equipment Check", department: "Maintenance", location: "Gym", priority: "low", status: "pending", assignedTo: "Rahul", createdAt: "09:00", eta: "14:00", reason: "Weekly scheduled inspection" },
  { id: 12, taskType: "Banquet Hall Setup", department: "Housekeeping", location: "Banquet Hall", priority: "high", status: "in-progress", assignedTo: "Sunita", createdAt: "10:00", eta: "13:00", reason: "Corporate event at 2 PM" },
];

// ──────────────────────────────────────────────
// MAINTENANCE TICKETS
// ──────────────────────────────────────────────
export const initialMaintenanceTickets = [
  { id: 1, issueType: "AC Cooling Failure", roomNo: "203", priority: "critical", status: "in-progress", technician: "Rahul", reportedAt: "10:42", repairHistory: 3, riskScore: 85, estimatedTime: 20, actualTime: 38 },
  { id: 2, issueType: "AC Repeated Failure", roomNo: "302", priority: "critical", status: "in-progress", technician: "Rahul", reportedAt: "10:15", repairHistory: 4, riskScore: 92, estimatedTime: 30, actualTime: 55 },
  { id: 3, issueType: "Water Leakage", roomNo: "502", priority: "critical", status: "in-progress", technician: "Deepak", reportedAt: "10:00", repairHistory: 2, riskScore: 78, estimatedTime: 45, actualTime: 65 },
  { id: 4, issueType: "WiFi Connectivity", roomNo: "401", priority: "medium", status: "pending", technician: "Deepak", reportedAt: "11:00", repairHistory: 1, riskScore: 30, estimatedTime: 20, actualTime: null },
  { id: 5, issueType: "Furniture Damage", roomNo: "104", priority: "low", status: "resolved", technician: "Suresh", reportedAt: "08:00", repairHistory: 1, riskScore: 15, estimatedTime: 60, actualTime: 55 },
  { id: 6, issueType: "Electrical Failure", roomNo: "304", priority: "high", status: "resolved", technician: "Suresh", reportedAt: "07:30", repairHistory: 2, riskScore: 60, estimatedTime: 45, actualTime: 50 },
  { id: 7, issueType: "Plumbing Issue", roomNo: "201", priority: "high", status: "resolved", technician: "Deepak", reportedAt: "06:00", repairHistory: 3, riskScore: 70, estimatedTime: 30, actualTime: 40 },
  { id: 8, issueType: "Elevator Breakdown", roomNo: "Elevator B", priority: "critical", status: "resolved", technician: "Rahul", reportedAt: "05:00", repairHistory: 2, riskScore: 75, estimatedTime: 120, actualTime: 135 },
];

// ──────────────────────────────────────────────
// INVENTORY
// ──────────────────────────────────────────────
export const initialInventory = [
  { id: 1, itemName: "Towels", category: "Linen", stockLevel: 45, threshold: 80, unit: "pcs", floor: 2, status: "low" },
  { id: 2, itemName: "Bedsheets", category: "Linen", stockLevel: 120, threshold: 100, unit: "sets", floor: "All", status: "ok" },
  { id: 3, itemName: "Pillow Covers", category: "Linen", stockLevel: 95, threshold: 80, unit: "pcs", floor: "All", status: "ok" },
  { id: 4, itemName: "Soap Bars", category: "Toiletries", stockLevel: 30, threshold: 100, unit: "pcs", floor: 3, status: "critical" },
  { id: 5, itemName: "Shampoo Bottles", category: "Toiletries", stockLevel: 40, threshold: 80, unit: "bottles", floor: 3, status: "low" },
  { id: 6, itemName: "Cleaning Chemical A", category: "Cleaning", stockLevel: 12, threshold: 20, unit: "liters", floor: "Store", status: "low" },
  { id: 7, itemName: "Toilet Paper", category: "Toiletries", stockLevel: 200, threshold: 150, unit: "rolls", floor: "All", status: "ok" },
  { id: 8, itemName: "Hand Sanitizer", category: "Hygiene", stockLevel: 8, threshold: 30, unit: "bottles", floor: "Public", status: "critical" },
  { id: 9, itemName: "Floor Cleaner", category: "Cleaning", stockLevel: 25, threshold: 20, unit: "liters", floor: "Store", status: "ok" },
  { id: 10, itemName: "Water Bottles", category: "Amenities", stockLevel: 60, threshold: 100, unit: "bottles", floor: "All", status: "low" },
  { id: 11, itemName: "Minibar Snacks", category: "Amenities", stockLevel: 150, threshold: 80, unit: "items", floor: "All", status: "ok" },
  { id: 12, itemName: "Bath Towels (Large)", category: "Linen", stockLevel: 20, threshold: 60, unit: "pcs", floor: 4, status: "critical" },
];

// ──────────────────────────────────────────────
// STAFF
// ──────────────────────────────────────────────
export const initialStaff = [
  { id: 1, name: "Priya Sharma", role: "Housekeeping", department: "Housekeeping", status: "busy", tasksCompleted: 8, tasksActive: 2, floor: 2, avatar: "PS", efficiency: 94 },
  { id: 2, name: "Rahul Gupta", role: "Technician", department: "Maintenance", status: "busy", tasksCompleted: 5, tasksActive: 2, floor: 2, avatar: "RG", efficiency: 87 },
  { id: 3, name: "Sunita Rao", role: "Housekeeper", department: "Housekeeping", status: "available", tasksCompleted: 6, tasksActive: 1, floor: 1, avatar: "SR", efficiency: 91 },
  { id: 4, name: "Meera Joshi", role: "Housekeeper", department: "Housekeeping", status: "busy", tasksCompleted: 4, tasksActive: 2, floor: 3, avatar: "MJ", efficiency: 88 },
  { id: 5, name: "Deepak Kumar", role: "Technician", department: "Maintenance", status: "busy", tasksCompleted: 7, tasksActive: 2, floor: 5, avatar: "DK", efficiency: 82 },
  { id: 6, name: "Ramesh Patel", role: "Housekeeper", department: "Housekeeping", status: "available", tasksCompleted: 3, tasksActive: 1, floor: 4, avatar: "RP", efficiency: 85 },
  { id: 7, name: "Suresh Nair", role: "Technician", department: "Maintenance", status: "available", tasksCompleted: 9, tasksActive: 0, floor: 1, avatar: "SN", efficiency: 96 },
  { id: 8, name: "Anita Singh", role: "Front Desk", department: "Front Desk", status: "available", tasksCompleted: 12, tasksActive: 0, floor: "Lobby", avatar: "AS", efficiency: 98 },
];

// ──────────────────────────────────────────────
// PUBLIC AREAS
// ──────────────────────────────────────────────
export const initialPublicAreas = [
  { id: 1, name: "Main Lobby", type: "Lobby", status: "overdue", lastCleaned: "09:00", nextScheduled: "11:00", assignedTo: "Sunita", frequency: "2 hours" },
  { id: 2, name: "Elevator A", type: "Elevator", status: "clean", lastCleaned: "10:30", nextScheduled: "12:30", assignedTo: "Ramesh", frequency: "2 hours" },
  { id: 3, name: "Elevator B", type: "Elevator", status: "clean", lastCleaned: "10:00", nextScheduled: "12:00", assignedTo: "Ramesh", frequency: "2 hours" },
  { id: 4, name: "Pool Area", type: "Pool", status: "pending", lastCleaned: "07:00", nextScheduled: "12:00", assignedTo: "Ramesh", frequency: "Daily" },
  { id: 5, name: "Gym", type: "Gym", status: "clean", lastCleaned: "08:00", nextScheduled: "14:00", assignedTo: "Suresh", frequency: "Daily" },
  { id: 6, name: "Restaurant Area", type: "Restaurant", status: "clean", lastCleaned: "10:00", nextScheduled: "13:00", assignedTo: "Sunita", frequency: "3 hours" },
  { id: 7, name: "Banquet Hall", type: "Banquet", status: "in-progress", lastCleaned: "08:00", nextScheduled: "13:00", assignedTo: "Sunita", frequency: "Per event" },
  { id: 8, name: "Corridor Floor 2", type: "Corridor", status: "overdue", lastCleaned: "08:30", nextScheduled: "10:30", assignedTo: "Meera", frequency: "2 hours" },
  { id: 9, name: "Corridor Floor 3", type: "Corridor", status: "clean", lastCleaned: "10:15", nextScheduled: "12:15", assignedTo: "Meera", frequency: "2 hours" },
  { id: 10, name: "Conference Room A", type: "Conference", status: "pending", lastCleaned: "09:00", nextScheduled: "Before event", assignedTo: null, frequency: "Per event" },
];

// ──────────────────────────────────────────────
// GUEST REQUESTS
// ──────────────────────────────────────────────
export const initialGuestRequests = [
  { id: 1, roomNo: "402", guestName: "Mr. Singh", request: "Extra towels needed", category: "Housekeeping", priority: "medium", status: "pending", createdAt: "11:05", assignedTo: "Meera" },
  { id: 2, roomNo: "201", guestName: "Ms. Kapoor", request: "Room dining order — breakfast", category: "Food & Beverage", priority: "medium", status: "completed", createdAt: "08:30", assignedTo: "Room Service" },
  { id: 3, roomNo: "301", guestName: "Mr. Verma", request: "Laundry pickup required", category: "Laundry", priority: "medium", status: "in-progress", createdAt: "10:00", assignedTo: "Ramesh" },
  { id: 4, roomNo: "501", guestName: "VIP Guest", request: "Extra pillows (3 sets)", category: "Housekeeping", priority: "high", status: "completed", createdAt: "09:00", assignedTo: "Priya" },
  { id: 5, roomNo: "102", guestName: "Mr. Sharma", request: "Water bottles (6 nos)", category: "Housekeeping", priority: "low", status: "completed", createdAt: "09:30", assignedTo: "Sunita" },
  { id: 6, roomNo: "402", guestName: "Mr. Singh", request: "WiFi not working in room", category: "Maintenance", priority: "high", status: "pending", createdAt: "11:00", assignedTo: "Deepak" },
];

// ──────────────────────────────────────────────
// ACTIVITY TIMELINE
// ──────────────────────────────────────────────
export const activityTimeline = [
  { id: 1, time: "10:20", event: "Room 203 — Guest checked out", type: "checkout", dept: "Front Desk", icon: "LogOut" },
  { id: 2, time: "10:22", event: "Checkout cleaning task auto-created for Room 203", type: "task", dept: "System", icon: "ClipboardList" },
  { id: 3, time: "10:25", event: "Priya assigned to clean Room 203", type: "assign", dept: "Housekeeping", icon: "User" },
  { id: 4, time: "10:28", event: "Housekeeping started — Room 203 status: In Progress", type: "cleaning", dept: "Housekeeping", icon: "Sparkles" },
  { id: 5, time: "10:40", event: "AC cooling issue detected in Room 203", type: "issue", dept: "Housekeeping", icon: "AlertTriangle" },
  { id: 6, time: "10:42", event: "Maintenance ticket auto-created: AC Failure — Room 203 (Priority: Critical)", type: "maintenance", dept: "System", icon: "Wrench" },
  { id: 7, time: "10:43", event: "AI Alert: Room 203 AC repaired 3 times this month — Predictive risk detected", type: "ai", dept: "AI System", icon: "Brain" },
  { id: 8, time: "10:45", event: "Rahul (Technician) assigned to AC repair — Room 203", type: "assign", dept: "Maintenance", icon: "User" },
  { id: 9, time: "11:00", event: "Lobby cleaning overdue by 25 mins — AI delay alert sent to Manager", type: "alert", dept: "AI System", icon: "AlertCircle" },
  { id: 10, time: "11:05", event: "Room 402 — Guest request: Extra towels — Meera assigned", type: "guest", dept: "Guest Services", icon: "Bell" },
  { id: 11, time: "11:10", event: "Inventory alert: Floor 2 towels below threshold (45/80)", type: "inventory", dept: "System", icon: "Package" },
  { id: 12, time: "11:20", event: "Maintenance completed — AC repaired in Room 203", type: "resolved", dept: "Maintenance", icon: "CheckCircle" },
  { id: 13, time: "11:25", event: "Room 203 — Final cleaning in progress", type: "cleaning", dept: "Housekeeping", icon: "Sparkles" },
  { id: 14, time: "11:35", event: "Room 203 → Status: READY — Front desk notified", type: "ready", dept: "System", icon: "CheckCircle" },
  { id: 15, time: "11:40", event: "Front desk assigns Room 203 to next incoming guest", type: "checkin", dept: "Front Desk", icon: "LogIn" },
];

// ──────────────────────────────────────────────
// AI ALERTS
// ──────────────────────────────────────────────
export const initialAIAlerts = [
  { id: 1, type: "predictive", title: "Recurring AC Failure — Room 203", message: "AC repaired 3 times this month. Recommend full HVAC inspection before next guest.", severity: "critical", time: "10:43", dismissed: false },
  { id: 2, type: "predictive", title: "High-Risk Equipment — Room 302", message: "AC repaired 4 times. Risk score: 92/100. Immediate replacement recommended.", severity: "critical", time: "10:15", dismissed: false },
  { id: 3, type: "delay", title: "Repair Delay Detected — Room 203", message: "AC repair estimated 20 mins. Current duration: 38 mins. Check technician status.", severity: "warning", time: "11:05", dismissed: false },
  { id: 4, type: "delay", title: "Lobby Cleaning Overdue", message: "Main Lobby cleaning overdue by 25 minutes. Public hygiene risk.", severity: "warning", time: "11:00", dismissed: false },
  { id: 5, type: "inventory", title: "Critical Stock: Soap Bars", message: "Soap bars critically low (30/100). Immediate restocking required for Floor 3.", severity: "critical", time: "10:30", dismissed: false },
  { id: 6, type: "inventory", title: "Low Stock: Towels — Floor 2", message: "Floor 2 towel inventory below threshold (45/80). Refill request created.", severity: "warning", time: "11:10", dismissed: false },
  { id: 7, type: "predictive", title: "Water Leakage Pattern — Floor 5", message: "Second water leakage incident this month on Floor 5. Infrastructure inspection advised.", severity: "warning", time: "10:05", dismissed: false },
  { id: 8, type: "delay", title: "Elevator B Frequent Breakdown", message: "Elevator B broke down twice this week. Schedule preventive maintenance.", severity: "warning", time: "09:00", dismissed: true },
];

// ──────────────────────────────────────────────
// ANALYTICS DATA
// ──────────────────────────────────────────────
export const analyticsData = {
  taskCompletion: [
    { hour: "06:00", completed: 2, pending: 1 },
    { hour: "07:00", completed: 5, pending: 3 },
    { hour: "08:00", completed: 8, pending: 4 },
    { hour: "09:00", completed: 12, pending: 5 },
    { hour: "10:00", completed: 15, pending: 7 },
    { hour: "11:00", completed: 18, pending: 9 },
    { hour: "12:00", completed: 22, pending: 6 },
  ],
  maintenanceCategories: [
    { name: "AC Issues", value: 35, fill: "#ef4444" },
    { name: "Plumbing", value: 20, fill: "#f97316" },
    { name: "Electrical", value: 18, fill: "#eab308" },
    { name: "WiFi", value: 12, fill: "#3b82f6" },
    { name: "Furniture", value: 10, fill: "#8b5cf6" },
    { name: "Other", value: 5, fill: "#6b7280" },
  ],
  roomTurnaround: [
    { room: "201", time: 45 }, { room: "203", time: 75 }, { room: "302", time: 90 },
    { room: "404", time: 30 }, { room: "502", time: 120 }, { room: "103", time: 40 },
  ],
  staffProductivity: [
    { name: "Priya", tasks: 10, efficiency: 94 },
    { name: "Rahul", tasks: 7, efficiency: 87 },
    { name: "Sunita", tasks: 7, efficiency: 91 },
    { name: "Meera", tasks: 6, efficiency: 88 },
    { name: "Deepak", tasks: 9, efficiency: 82 },
    { name: "Suresh", tasks: 9, efficiency: 96 },
  ],
  weeklyStats: {
    totalTasks: 147, completedTasks: 128, avgTurnaround: "42 min",
    criticalAlerts: 8, guestRequests: 24, inventoryAlerts: 5,
  },
};
