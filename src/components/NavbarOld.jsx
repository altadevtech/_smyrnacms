import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { LogOut, User, Settings, Menu, X, ChevronDown, Home, FileText, BookOpen, Phone, LayoutDashboard, Users, PenTool } from 'lucide-react';
import './NavbarOld.css';

const Navbar = () => {
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Menu público
  const publicMenuItems = [
    { to: '/', label: 'Início', icon: Home },
  { to: '/pages', label: 'Páginas', icon: FileText },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/contact', label: 'Contato', icon: Phone }
  ]

  // Menu administrativo
  const adminMenuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pages', label: 'Páginas', icon: FileText },
    { to: '/posts', label: 'Posts', icon: PenTool },
    ...(user?.role === 'admin' ? [{ to: '/users', label: 'Usuários', icon: Users }] : [])
  ]

  // Detectar scroll para efeito no header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  // ...estilos migrados para CSS

  return (
    <>
      <nav className={`navbar${isScrolled ? ' scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand/Logo */}
          <Link to="/" className="navbar-brand">
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.siteName}
                style={{ height: '40px', width: 'auto' }}
              />
            ) : (
              <>
                <div className="navbar-logo">S</div>
                <span>{settings.siteName || 'Smyrna CMS'}</span>
              </>
            )}
          </Link>
          {/* Desktop Menu */}
          <ul className="navbar-menu">
            {(user ? adminMenuItems : publicMenuItems).map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`navbar-menu-link${isActive ? ' active' : ''}`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* User Menu & Mobile Toggle */}
          <div className="user-menu-container">
            {user ? (
              <>
                <button
                  className="user-menu-btn"
                  onClick={toggleUserMenu}
                  type="button"
                >
                  <div className="user-menu-avatar">
                    <User size={12} />
                  </div>
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </span>
                  <ChevronDown 
                    size={14}
                    style={{
                      transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="user-menu-dropdown">
                    <Link
                      to="/profile"
                      className="user-menu-dropdown-link"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Perfil
                    </Link>
                    <button
                      className="user-menu-dropdown-logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="navbar-login-link">
                <User size={16} />
                Login
              </Link>
            )}
            {/* Mobile Menu Toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={toggleMobileMenu}
              type="button"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
      <div className="navbar-spacer"></div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="navbar-mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="navbar-mobile-menu">
            <div className="navbar-mobile-menu-inner">
              <div className="navbar-mobile-menu-list">
                {(user ? adminMenuItems : publicMenuItems).map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`navbar-mobile-menu-link${isActive ? ' active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              {user && (
                <div className="navbar-mobile-user-section">
                  <div className="navbar-mobile-user">
                    <div className="navbar-mobile-user-avatar">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="navbar-mobile-user-name">{user.name}</div>
                      <div className="navbar-mobile-user-role">{user.role === 'admin' ? 'Administrador' : 'Editor'}</div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="navbar-mobile-user-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings size={20} />
                    Perfil
                  </Link>
                  <button
                    className="navbar-mobile-user-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
