import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { Mail, Heart, ArrowUp } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { settings } = useSettings()
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer minimal-footer">
      <div className="footer-container minimal-footer-container">
        <div className="minimal-footer-main">
          <div className="minimal-footer-brand">{settings.siteName || 'Smyrna CMS'}</div>
          <div className="minimal-footer-links">
            <Link to="/" className="footer-link">Início</Link>
            <Link to="/pages" className="footer-link">Páginas</Link>
            <Link to="/blog" className="footer-link">Blog</Link>
            <Link to="/contact" className="footer-link">Contato</Link>
          </div>
          {settings.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`} className="footer-link minimal-footer-contact">
              <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {settings.contactEmail}
            </a>
          )}
        </div>
        <div className="minimal-footer-bottom">
          <span>© {currentYear} {settings.siteName || 'Smyrna CMS'}</span>
          <span className="minimal-footer-powered">
            <Heart size={12} style={{ verticalAlign: 'middle', marginRight: 2 }} /> por Flávio Rodrigues
          </span>
          <button onClick={scrollToTop} className="footer-scrolltop-btn" title="Voltar ao topo">
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer
