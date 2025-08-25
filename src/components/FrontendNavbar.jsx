
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import './NavbarNew.css';

const FrontendNavbar = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [pageCategories, setPageCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);



  useEffect(() => {
    fetchPageCategories();
    // Polling para atualizar categorias a cada 10 segundos
    const interval = setInterval(fetchPageCategories, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPageCategories = async () => {
    try {
      const res = await fetch('/api/categories?type=pages&hierarchical=true');
      if (res.ok) {
        const data = await res.json();
        setPageCategories(data);
      }
    } catch (e) {
      setPageCategories([]);
    }
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    if (openDropdownId === null) return;
    const handleClick = (e) => {
      if (!e.target.closest('.navbar-pages-dropdown')) setOpenDropdownId(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdownId]);

  // Ordena categorias e subcategorias por sort_order (e nome como fallback)
  const orderedCategories = [...pageCategories]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name))
    .map(cat => ({
      ...cat,
      subcategories: cat.subcategories
        ? [...cat.subcategories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name))
        : []
    }));

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
            {/* Categorias de páginas: se tiver subcategorias, exibe como dropdown, senão como item simples */}
            {orderedCategories.length === 0 && (
              <li><span className="navbar-menu-link" style={{ color: '#888' }}>Páginas</span></li>
            )}
            {orderedCategories.map((cat) =>
              cat.subcategories && cat.subcategories.length > 0 ? (
                <li
                  key={cat.id}
                  className="navbar-pages-dropdown"
                  style={{ position: 'relative' }}
                >
                  <button
                    className="navbar-menu-link"
                    style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                    onClick={() => setOpenDropdownId(openDropdownId === cat.id ? null : cat.id)}
                    aria-haspopup="true"
                    aria-expanded={openDropdownId === cat.id}
                  >
                    {cat.name}
                    <span style={{ fontSize: '0.8em', marginLeft: 4 }}>▼</span>
                  </button>
                  {openDropdownId === cat.id && (
                    <ul
                      className="navbar-pages-dropdown-list"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        minWidth: 180,
                        background: '#fff',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        borderRadius: 8,
                        zIndex: 1001,
                        padding: '0.5rem 0',
                        margin: 0,
                        listStyle: 'none',
                      }}
                    >
                      {cat.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/${sub.slug}`}
                            className="navbar-menu-link"
                            style={{ display: 'block', padding: '0.5rem 1.2rem', color: '#222', background: 'none' }}
                            onClick={() => setOpenDropdownId(null)}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={cat.id}>
                  <Link
                    to={`/${cat.slug}`}
                    className="navbar-menu-link"
                  >
                    {cat.name}
                  </Link>
                </li>
              )
            )}
            <li><Link to="/blog" className="navbar-menu-link">Blog</Link></li>
            <li><Link to="/contact" className="navbar-menu-link">Contato</Link></li>
          </ul>
        </div>
        <div className="navbar-right">
          <div className="navbar-theme-toggle remodeled-navbar-theme-toggle">
            <ThemeToggle />
          </div>
          {user ? (
            <Link to="/admin" className="navbar-login-link">
              Painel
            </Link>
          ) : (
            <Link to="/login" className="navbar-login-link">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default FrontendNavbar;
