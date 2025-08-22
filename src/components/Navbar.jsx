import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { LogOut, User, Settings, ChevronDown, Home, FileText, BookOpen, Phone, LayoutDashboard, Users, PenTool, Tag } from 'lucide-react';
import './Navbar.css';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const publicMenuItems = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/pages', label: 'Páginas', icon: FileText },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/contact', label: 'Contato', icon: Phone }
  ];

  const adminMenuItems = [
    { to: '/admin/categories', label: 'Categorias', icon: Tag },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/pages', label: 'Páginas', icon: FileText },
    { to: '/admin/posts', label: 'Posts', icon: PenTool },
    ...(user?.role === 'admin' ? [
      { to: '/admin/users', label: 'Usuários', icon: Users }
    ] : [])
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const isActiveRoute = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo + ThemeToggle */}
        <div className="brand">
          <Link to="/" className="brand">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.siteName} />
            ) : (
              <>
                <div className="brand-logo">S</div>
                <span>{settings.siteName || 'Smyrna CMS'}</span>
              </>
            )}
          </Link>
          <ThemeToggle variant="button" size="small" />
        </div>
        {/* Menu */}
        <ul>
          {(user ? adminMenuItems : publicMenuItems).map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.to);
            return (
              <li key={item.to}>
                <Link to={item.to} className={isActive ? 'active' : ''}>
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* User Menu */}
        <div className="user-menu-container">
          {user ? (
            <>
              <button className="user-menu-trigger" onClick={() => setIsUserMenuOpen((v) => !v)}>
                <User size={16} />
                <span className="user-name">{user.name}</span>
                <ChevronDown size={14} className={isUserMenuOpen ? 'open' : ''} />
              </button>
              {isUserMenuOpen && (
                <div className="user-menu">
                  <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                    <Settings size={16} /> Perfil
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="login-btn">
              <User size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;