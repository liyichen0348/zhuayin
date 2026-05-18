/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Home from './pages/Home.tsx';
import PetDetail from './pages/PetDetail.tsx';
import Profile from './pages/Profile.tsx';
import Notifications from './pages/Notifications.tsx';
import AdoptionForm from './pages/AdoptionForm.tsx';
import Search from './pages/Search.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import AdminLogin from './pages/admin/AdminLogin.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import BottomNav from './components/BottomNav.tsx';

function AnimatedRoutes() {
  const location = useLocation();
  const showNav = !['/adopt', '/admin/login', '/admin/dashboard', '/admin', '/login', '/register'].includes(location.pathname) && !location.pathname.startsWith('/pet/') && !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<PageWrapper key="home"><Home /></PageWrapper>} />
          <Route path="/pet/:id" element={<PageWrapper key="detail"><PetDetail /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper key="profile"><Profile /></PageWrapper>} />
          <Route path="/notifications" element={<PageWrapper key="notif"><Notifications /></PageWrapper>} />
          <Route path="/adopt" element={<PageWrapper key="adopt"><AdoptionForm /></PageWrapper>} />
          <Route path="/search" element={<PageWrapper key="search"><Search /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper key="login"><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper key="register"><Register /></PageWrapper>} />
          <Route path="/admin/login" element={<PageWrapper key="admin-login"><AdminLogin /></PageWrapper>} />
          <Route path="/admin/dashboard" element={<PageWrapper key="admin-dash"><AdminDashboard /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper key="admin-root"><AdminDashboard /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </div>
  );
}

function PageWrapper({ children }: { children: ReactNode; key?: React.Key }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
