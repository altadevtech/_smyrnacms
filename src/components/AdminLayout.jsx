import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <AdminNavbar
        user={user}
        onLogout={handleLogout}
        isUserMenuOpen={isUserMenuOpen}
        onToggleUserMenu={() => setIsUserMenuOpen((v) => !v)}
      />
      <div className="admin-content">
        <Outlet />
      </div>
    </>
  );
}
