
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminNavbar from './AdminNavbar';
import FrontendNavbar from './FrontendNavbar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Renderiza AdminNavbar se rota começar com /admin ou /dashboard
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
    return (
      <AdminNavbar
        user={user}
        onLogout={logout}
        isUserMenuOpen={isUserMenuOpen}
        onToggleUserMenu={() => setIsUserMenuOpen((v) => !v)}
      />
    );
  }
  // Senão, renderiza FrontendNavbar
  return <FrontendNavbar user={user} />;
};

export default Navbar;
