import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelStore } from '../store/hotelStore';
import { MessageSquare, Send, Bot, User, Brain, Zap } from 'lucide-react';

const SUGGESTED_QUERIES = [
  "Which rooms are delayed?",
  "Show urgent maintenance issues",
  "Which floor has highest workload?",
  "Rooms with repeated AC failures?",
  "What's the current inventory status?",
  "Who are the available staff?",
  "List all overdue tasks",
  "Show me today's guest requests",
];

function buildResponse(query, { rooms, tasks, maintenanceTickets, inventory, staff, guestRequests, aiAlerts }) {
  const q = query.toLowerCase();

  if (q.includes('delayed') || q.includes('overdue')) {
    const overdueTasks = tasks.filter((t) => t.status === 'overdue');
    const delayedRooms = rooms.filter((r) => r.status === 'maintenance' && r.currentIssue);
    return `🔴 **Delayed Operations:**\n\n**Overdue tasks (${overdueTasks.length}):**\n${
      overdueTasks.map((t) => `• ${t.taskType} — ${t.location} (${t.assignedTo})`).join('\n') || '  None'
    }\n\n**Rooms with active issues (${delayedRooms.length}):**\n${
      delayedRooms.map((r) => `• Room ${r.roomNo}: ${r.currentIssue} (${r.assignedStaff})`).join('\n') || '  None'
    }`;
  }

  if (q.includes('maintenance') || q.includes('urgent') || q.includes('repair')) {
    const criticals = maintenanceTickets.filter((t) => t.priority === 'critical' && t.status !== 'resolved');
    return `🔧 **Urgent Maintenance Issues (${criticals.length}):**\n${
      criticals.map((t) => `• **${t.issueType}** — Room ${t.roomNo}\n  Technician: ${t.technician} | Risk: ${t.riskScore}/100\n  Status: ${t.status}`).join('\n\n')
    }`;
  }

  if (q.includes('floor') || q.includes('workload')) {
    const floorCounts = {};
    tasks.filter((t) => t.status !== 'completed').forEach((t) => {
      const match = t.location.match(/\d+/);
      const floor = match ? `Floor ${match[0][0]}` : 'Other';
      floorCounts[floor] = (floorCounts[floor] || 0) + 1;
    });
    const sorted = Object.entries(floorCounts).sort((a, b) => b[1] - a[1]);
    return `📊 **Workload by Floor:**\n${
      sorted.map(([f, n], i) => `${i === 0 ? '🔴' : i === 1 ? '🟠' : '🟡'} **${f}**: ${n} active tasks`).join('\n')
    }`;
  }

  if (q.includes('ac') || q.includes('recurring') || q.includes('repeated')) {
    const acIssues = maintenanceTickets.filter((t) => t.issueType.toLowerCase().includes('ac') && t.repairHistory >= 2);
    return `⚡ **Rooms with Recurring AC Issues:**\n${
      acIssues.map((t) => `• **Room ${t.roomNo}** — Repaired ${t.repairHistory}× | Risk Score: ${t.riskScore}/100\n  Status: ${t.status} | Technician: ${t.technician}`).join('\n\n')
    }\n\n🤖 AI Recommendation: Schedule full HVAC inspection for these rooms.`;
  }

  if (q.includes('inventory') || q.includes('stock')) {
    const lowItems = inventory.filter((i) => i.status !== 'ok');
    return `📦 **Inventory Status:**\n\n**⚠️ Critical/Low Stock (${lowItems.length} items):**\n${
      lowItems.map((i) => `• ${i.itemName}: ${i.stockLevel}/${i.threshold} ${i.unit} (${i.status.toUpperCase()}) — Floor ${i.floor}`).join('\n')
    }`;
  }

  if (q.includes('staff') || q.includes('available')) {
    const avail = staff.filter((s) => s.status === 'available');
    const busy = staff.filter((s) => s.status === 'busy');
    return `👥 **Staff Status:**\n\n**Available (${avail.length}):**\n${
      avail.map((s) => `• ${s.name} (${s.role}) — ${s.department}`).join('\n')
    }\n\n**Busy (${busy.length}):**\n${
      busy.map((s) => `• ${s.name} — ${s.tasksActive} active tasks`).join('\n')
    }`;
  }

  if (q.includes('guest') || q.includes('request')) {
    const pending = guestRequests.filter((r) => r.status === 'pending');
    return `🛎️ **Guest Requests (${pending.length} pending):**\n${
      pending.map((r) => `• Room ${r.roomNo} (${r.guestName}): "${r.request}" — ${r.category} (${r.priority})`).join('\n')
    }`;
  }

  if (q.includes('room') || q.includes('status')) {
    const counts = {
      ready: rooms.filter((r) => r.status === 'ready').length,
      occupied: rooms.filter((r) => r.status === 'occupied').length,
      cleaning: rooms.filter((r) => r.status === 'cleaning').length,
      maintenance: rooms.filter((r) => r.status === 'maintenance').length,
    };
    return `🏨 **Current Room Status:**\n• ✅ Ready: ${counts.ready} rooms\n• 🔵 Occupied: ${counts.occupied} rooms\n• 🟡 Cleaning: ${counts.cleaning} rooms\n• 🔴 Maintenance: ${counts.maintenance} rooms\n\nTotal: ${rooms.length} rooms`;
  }

  return `🤖 I can help you with:\n• Room status & delayed operations\n• Maintenance & urgent issues\n• Staff availability\n• Inventory levels\n• Guest requests\n• Floor-wise workload\n• AC & recurring failures\n\nTry asking: "Which rooms are delayed?" or "Show urgent maintenance issues"`;
}

function ChatMessage({ msg }) {
  const isBot = msg.sender === 'bot';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-purple-600/30' : 'bg-indigo-600/30'}`}>
        {isBot ? <Bot size={15} className="text-purple-300" /> : <User size={15} className="text-indigo-300" />}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isBot ? 'glass border border-white/8 text-slate-300' : 'bg-indigo-600 text-white'
      } ${isBot ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}>
        {msg.text.split('\n').map((line, i) => (
          <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
            {line.includes('**') ? (
              <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ) : line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export default function AIAssistant() {
  const store = useHotelStore();
  const [messages, setMessages] = useState([{
    id: 0, sender: 'bot',
    text: `Hello! I'm your HotelOps AI Assistant 🤖\n\nI have real-time access to all hotel operations. Ask me anything about:\n• Room status & delays\n• Maintenance issues\n• Staff availability\n• Inventory levels\n• Guest requests`,
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = buildResponse(text, store);
      setMessages((m) => [...m, { id: Date.now() + 1, sender: 'bot', text: response }]);
      setTyping(false);
    }, 800 + Math.random() * 400);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="glass border-b border-white/5 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center">
          <Brain size={20} className="text-purple-300" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">AI Operations Assistant</h1>
          <p className="text-xs text-slate-400">Real-time hotel intelligence — always online</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="live-indicator" />
          <span className="text-xs text-emerald-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center flex-shrink-0">
              <Bot size={15} className="text-purple-300" />
            </div>
            <div className="glass border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  className="w-2 h-2 rounded-full bg-purple-400" />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested queries */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SUGGESTED_QUERIES.slice(0, 4).map((q) => (
            <button key={q} onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-600/10 text-purple-300 hover:bg-purple-600/20 whitespace-nowrap transition-all flex-shrink-0">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="glass border-t border-white/5 p-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about rooms, maintenance, staff..."
            className="inp flex-1"
          />
          <button type="submit" disabled={!input.trim() || typing} className="btn-primary px-4 disabled:opacity-50">
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
