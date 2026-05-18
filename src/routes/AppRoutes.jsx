import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import RoomStatus from '../pages/RoomStatus';
import Housekeeping from '../pages/Housekeeping';
import Maintenance from '../pages/Maintenance';
import PublicAreas from '../pages/PublicAreas';
import GuestRequests from '../pages/GuestRequests';
import Inventory from '../pages/Inventory';
import Analytics from '../pages/Analytics';
import Staff from '../pages/Staff';
import Notifications from '../pages/Notifications';
import AIAssistant from '../pages/AIAssistant';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected (using layout) */}
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/rooms" element={<RoomStatus />} />
                <Route path="/housekeeping" element={<Housekeeping />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/public-areas" element={<PublicAreas />} />
                <Route path="/guest-requests" element={<GuestRequests />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
