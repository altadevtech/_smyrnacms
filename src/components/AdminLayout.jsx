import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  return (
    <>
      <AdminNavbar
        user={user}
        onLogout={logout}
        isUserMenuOpen={isUserMenuOpen}
        onToggleUserMenu={() => setIsUserMenuOpen((v) => !v)}
      />
      <div className="admin-content">
        <Outlet /> {/* Corrigido: renderiza o conteúdo da rota filha */}
      </div>
    </>
  );
}
