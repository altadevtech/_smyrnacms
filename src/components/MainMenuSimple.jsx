import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, BookOpen, Phone } from 'lucide-react';
import './MainMenuSimple.css';

const MainMenuSimple = ({ className = '', orientation = 'horizontal', onLinkClick }) => {
  const menuItems = [
    { to: '/', label: 'Início', icon: Home },
  { to: '/pages', label: 'Páginas', icon: FileText },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/contact', label: 'Contato', icon: Phone }
  ]

  const isHorizontal = orientation === 'horizontal';

  return (
    <nav className={`main-menu ${className}`.trim()}>
      <ul className={`main-menu-list${isHorizontal ? '' : ' vertical'}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className="main-menu-link"
                onClick={onLinkClick}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MainMenuSimple
