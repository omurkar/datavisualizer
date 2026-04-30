import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import LoginPage from './pages/LoginPage';
import MainDashboard from './pages/MainDashboard';
import ConnectionPage from './pages/ConnectionPage';
import EdaPage from './pages/EdaPage';
import CustomizePage from './pages/CustomizePage';
import DashboardView from './pages/DashboardView';
import HistoryPage from './pages/HistoryPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
      <Route path="/connect" element={<ProtectedRoute><ConnectionPage /></ProtectedRoute>} />
      <Route path="/eda" element={<ProtectedRoute><EdaPage /></ProtectedRoute>} />
      <Route path="/customize" element={<ProtectedRoute><CustomizePage /></ProtectedRoute>} />
      <Route path="/dashboard-view" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="animated-bg"></div>
          <AppRoutes />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
