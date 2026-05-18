# HotelOps - AI-Assisted Real-Time Hotel Operations Platform

HotelOps is a modern, real-time hotel operations management system designed to coordinate Front Desk, Housekeeping, Maintenance, Guest Services, Inventory, and Administrative operations in a single scalable platform.

## 🌟 Project Overview

The platform supports:
- **Real-time room tracking**
- **Task coordination** (cross-departmental)
- **Maintenance tickets** & predictive workflows
- **AI-based alerts** (delay detection, smart prioritization)
- **Inventory management**
- **Notifications** (real-time cross-platform)
- **Analytics dashboards** (role-based insights)

## 🚀 Tech Stack

- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: Zustand
- **Backend/BaaS**: Firebase Firestore (Realtime DB)
- **Authentication**: Firebase Authentication
- **AI Integration**: Gemini API / OpenAI API
- **Data Visualization**: Recharts
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

---

## 📁 Architecture & File Organization

The project uses a highly modular, feature-based architecture (ideal for scalable SaaS applications and parallel team development).

```
src/
├── ai/                     # Global AI service orchestrators
├── analytics/              # Global analytics utility functions
├── assets/                 # Static assets (images, fonts, global CSS)
├── components/             # Reusable, domain-agnostic UI components
│   ├── cards/              # Generic card components
│   ├── charts/             # Reusable chart wrappers (Recharts)
│   ├── forms/              # Input fields, select dropdowns, toggles
│   ├── modals/             # Dialogs, overlays, slide-overs
│   ├── notifications/      # Toast configurations, badge components
│   ├── room-components/    # Shared room visualization UI
│   ├── task-components/    # Shared task/ticket visualization UI
│   ├── tables/             # Generic data tables, pagination
│   └── ui/                 # Core UI library (e.g., shadcn/ui base components)
├── constants/              # Global constants (Roles, Status codes, Config)
├── context/                # React Context providers (if needed beyond Zustand)
├── data/                   # Mock data, JSON schemas
├── firebase/               # Firebase initialization and configurations
│   ├── auth/               # Authentication methods & hooks
│   └── firestore/          # Database references & batch operations
├── hooks/                  # Custom global React hooks
├── layouts/                # Structural layout wrappers
│   ├── AdminLayout.jsx
│   ├── AuthLayout.jsx
│   ├── DashboardLayout.jsx
│   └── MobileLayout.jsx
├── modules/                # Domain-specific feature modules
│   ├── admin/
│   │   ├── analytics/
│   │   ├── operational-monitoring/
│   │   ├── reports/
│   │   └── staff-tracking/
│   ├── ai/
│   │   ├── chatbot/
│   │   ├── delay-detection/
│   │   ├── predictive-alerts/
│   │   └── smart-prioritization/
│   ├── front-desk/
│   │   ├── dashboards/
│   │   ├── guest-requests/
│   │   └── room-management/
│   ├── housekeeping/
│   │   ├── cleaning-tasks/
│   │   ├── inventory-updates/
│   │   └── public-area-operations/
│   └── maintenance/
│       ├── predictive-maintenance/
│       ├── repair-tickets/
│       └── technician-workflows/
├── notifications/          # Global notification dispatchers & templates
├── pages/                  # Route-level page components (compose modules here)
├── routes/                 # Routing configuration (Public, Protected, Role-based)
├── services/               # External API services
│   ├── ai/                 # API calls to Gemini/OpenAI
│   └── firebase/           # Abstracted DB calls
├── store/                  # Zustand global state stores
│   ├── ai/                 # AI insights & chat context
│   ├── auth/               # User session & permissions
│   ├── notifications/      # Unread counts, alert history
│   ├── rooms/              # Live room statuses
│   └── tasks/              # Global task queues
├── styles/                 # Global CSS, theme configurations
└── utils/                  # Helper functions (date formatting, calculation)
```

## 📝 Recommended Naming Conventions

- **React Components**: PascalCase (e.g., `RoomCard.jsx`, `MaintenanceTicket.jsx`, `AIAlertPanel.jsx`)
- **Utility Functions**: camelCase (e.g., `formatDate.js`, `calculatePriority.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `USER_ROLES`, `API_ENDPOINTS`)
- **Stores**: use[Name]Store (e.g., `useAuthStore.js`, `useTaskStore.js`)
- **CSS Classes**: Kebab-case (handled natively by Tailwind)

## ⚙️ Environment Variables Structure

Create a `.env` file in the root directory based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd HotelOps
   ```

2. **Install core dependencies:**
   ```bash
   npm install react-router-dom zustand firebase framer-motion recharts lucide-react react-hot-toast
   ```

3. **Install Tailwind CSS & Styling dependencies:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
   *(Note: shadcn/ui components will require `clsx` and `tailwind-merge`. Install them when setting up UI components: `npm install clsx tailwind-merge`)*

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 🌿 Team Collaboration & Git Workflow

### Branch Naming Strategy
To avoid merge conflicts and maintain a clean history for the 5-developer team, use the following prefixes:
- `feature/[module-name]/[short-description]` (e.g., `feature/front-desk/room-status-toggle`)
- `fix/[module-name]/[short-description]` (e.g., `fix/maintenance/ticket-submission-bug`)
- `chore/[short-description]` (e.g., `chore/update-dependencies`)

### Workflow Example
1. Pull the latest `dev` branch: `git checkout dev && git pull origin dev`
2. Create your feature branch: `git checkout -b feature/ai/smart-alerts`
3. Commit small, atomic changes with descriptive messages: `git commit -m "feat(ai): add predictive delay alert component"`
4. Push to origin and open a Pull Request against `dev`.

### Initial Setup Commands (For Repo Admin)
```bash
git init
git branch -M main
git add .
git commit -m "chore: initial production-ready folder structure and setup"
git branch dev
git checkout dev
# Push to remote (if remote is added)
git remote add origin <url>
git push -u origin main
git push -u origin dev
```

---
*Built with modern SaaS architecture principles to ensure hackathon speed and startup-level scalability.*
