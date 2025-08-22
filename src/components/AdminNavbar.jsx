import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import ThemeToggle from './ThemeToggle';
import { User, ChevronDown, Settings, LogOut } from 'lucide-react';
import './NavbarNew.css';

const AdminNavbar = ({ user, onLogout, onToggleUserMenu, isUserMenuOpen }) => {
  const { settings } = useSettings();
  return (
    <nav className="navbar remodeled-navbar admin-navbar">
      <div className="navbar-container remodeled-navbar-container admin-navbar-container">
        <div className="navbar-left">
          <Link to="/admin" className="navbar-brand admin-navbar-brand">
            <span>Administração</span>
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="navbar-menu remodeled-navbar-menu admin-navbar-menu">
            <li><Link to="/admin/pages" className="navbar-menu-link">Páginas</Link></li>
            <li><Link to="/admin/posts" className="navbar-menu-link">Posts</Link></li>
            {user?.role === 'admin' && <li><Link to="/admin/categories" className="navbar-menu-link">Categorias</Link></li>}
            {user?.role === 'admin' && <li><Link to="/admin/users" className="navbar-menu-link">Usuários</Link></li>}
          </ul>
        </div>
        <div className="navbar-right">
          <div className="navbar-theme-toggle remodeled-navbar-theme-toggle">
            <ThemeToggle />
          </div>
          <div className="user-menu-container remodeled-user-menu-container">
            <button
              className="user-menu-btn"
              onClick={onToggleUserMenu}
              type="button"
            >
              <div className="user-menu-avatar">
                <User size={12} />
              </div>
              <span className="navbar-user-name">
                {user?.name}
              </span>
              <ChevronDown 
                size={14}
                className={`navbar-chevron${isUserMenuOpen ? ' open' : ''}`}
              />
            </button>
            {isUserMenuOpen && (
              <div className="user-menu-dropdown">
                <Link
                  to="/admin/profile"
                  className="user-menu-dropdown-link"
                  onClick={onToggleUserMenu}
                >
                  <Settings size={16} />
                  Perfil
                </Link>
                <button
                  className="user-menu-dropdown-logout"
                  onClick={onLogout}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
