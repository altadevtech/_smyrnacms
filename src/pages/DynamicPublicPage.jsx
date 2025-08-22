import api from '../services/api';

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Home, Clock, Tag, BookOpen } from 'lucide-react';
import './DynamicPublicPage.css';

const DynamicPublicPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { slug } = useParams()
  const location = useLocation()
  const [page, setPage] = useState(null)
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Verificar se é rota de página
  // const isPageRoute = location.pathname.startsWith('/pages/') || 
  //                    (page && !location.pathname.startsWith('/page/'))

  useEffect(() => {
    fetchPage()
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [slug])

  const fetchPage = async () => {
    try {
      // Buscar página por slug
      const pageResponse = await api.get(`/pages/public/${slug}`)
      setPage(pageResponse.data)
      // Buscar categoria se a página tiver uma
      if (pageResponse.data.category_id) {
        try {
          const categoryResponse = await api.get(`/categories/${pageResponse.data.category_id}`)
          setCategory(categoryResponse.data)
        } catch (categoryError) {
          console.error('Erro ao carregar categoria:', categoryError)
        }
      }
    } catch (error) {
      setError('Erro ao carregar página')
      console.error('Erro ao carregar página:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dynamic-public-page-loading">
        <div className="dynamic-public-page-loading-box">
          <div className="dynamic-public-page-spinner"></div>
          <p className="dynamic-public-page-loading-text">Carregando página...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dynamic-public-page-error">
        <div className="dynamic-public-page-error-box">
          <div className="dynamic-public-page-error-icon">📄</div>
          <h1 className="dynamic-public-page-error-title">404 - Página não encontrada</h1>
          <p className="dynamic-public-page-error-text">{error}. A página que você está procurando pode ter sido removida ou não existe.</p>
          <Link to="/" className="dynamic-public-page-error-btn">
            <Home size={18} />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  // Renderização simples da página com suporte a shortcodes
  const renderContent = () => (
    <article className="dynamic-public-page-article">
      <header className="dynamic-public-page-article-header">
        <div className="dynamic-public-page-category-badge">
          <Tag size={14} className="dynamic-public-page-category-icon" />
          {category ? category.name : 'Página'}
        </div>
        <h1 className="dynamic-public-page-title">{page.title}</h1>
        <div className="dynamic-public-page-meta">
          <span className="dynamic-public-page-meta-item">
            <User size={16} /> Por {page.author_name}
          </span>
          <span className="dynamic-public-page-meta-item">
            <Calendar size={16} /> {new Date(page.updated_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </header>
      <div className="dynamic-public-page-content">
        <ContentRenderer content={page.content} />
      </div>
      <footer className="dynamic-public-page-footer">
        <div className="dynamic-public-page-footer-meta">
          <Clock size={16} /> Última atualização: {new Date(page.updated_at).toLocaleDateString('pt-BR')}
        </div>
        <Link to="/pages" className="dynamic-public-page-footer-btn">
          <BookOpen size={16} />
          Ver todas as páginas
        </Link>
      </footer>
    </article>
  );

  // Layout único CMS

  // Renderização tradicional CMS
  return (
    <div className="dynamic-public-page-wrapper">
      <header className="dynamic-public-page-header">
        <nav className="dynamic-public-page-breadcrumbs">
          <Link to="/" className="dynamic-public-page-breadcrumb-link">
            <Home size={18} />
            Início
          </Link>
          <span className="dynamic-public-page-breadcrumb-sep">•</span>
          <Link to="/pages" className="dynamic-public-page-breadcrumb-link">
            Páginas
          </Link>
          <span className="dynamic-public-page-breadcrumb-sep">•</span>
          <span className="dynamic-public-page-breadcrumb-current">{page?.title}</span>
        </nav>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

// Fim do componente
export default DynamicPublicPage;
