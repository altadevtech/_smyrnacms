import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import ThemeToggle from './ThemeToggle';
import './NavbarNew.css';

const FrontendNavbar = ({ user }) => {
  const { settings } = useSettings();
  return (
    <nav className="navbar remodeled-navbar">
      <div className="navbar-container remodeled-navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.siteName} className="navbar-logo-img" />
            ) : (
              <>
                <div className="navbar-logo">S</div>
                <span>{settings.siteName || 'Smyrna CMS'}</span>
              </>
            )}
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="navbar-menu remodeled-navbar-menu">
            <li><Link to="/" className="navbar-menu-link">Início</Link></li>
            <li><Link to="/pages" className="navbar-menu-link">Páginas</Link></li>
            <li><Link to="/blog" className="navbar-menu-link">Blog</Link></li>
            <li><Link to="/contact" className="navbar-menu-link">Contato</Link></li>
          </ul>
        </div>
        <div className="navbar-right">
          <div className="navbar-theme-toggle remodeled-navbar-theme-toggle">
            <ThemeToggle />
          </div>
          <Link to="/login" className="navbar-login-link">
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default FrontendNavbar;
