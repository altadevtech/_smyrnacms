

import React, { useState, useEffect } from 'react'
import './DynamicHome.css'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import ContentRenderer from '../components/ContentRenderer'
import { BookOpen, FileText, Calendar, ArrowRight, Settings } from 'lucide-react'

function DynamicHome() {
  const { isAuthenticated } = useAuth()

  const [homepageData, setHomepageData] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [recentPages, setRecentPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Buscar páginas e posts recentes
  const fetchRecentContent = async () => {
    try {
      const pagesResponse = await api.get('/pages/recent?limit=4')
      setRecentPages(pagesResponse.data || [])
      const postsResponse = await api.get('/posts/recent?limit=4')
      setRecentPosts(postsResponse.data || [])
    } catch (error) {
      console.error('Erro ao carregar conteúdo recente:', error)
      setError('Erro ao carregar conteúdo recente')
    }
  }

  useEffect(() => {
    fetchHomepageContent()
    fetchRecentContent()
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchHomepageContent = async () => {
    try {
      const response = await api.get('/settings/homepage')
      setHomepageData(response.data)
      setLoading(false)
    } catch (error) {
      setError('Erro ao carregar página inicial')
      setLoading(false)
    }
  }

  // Verificar se há conteúdo personalizado (não padrão)
  const hasCustomContent = homepageData && 
    homepageData.title && 
    homepageData.content && 
    homepageData.title.trim() !== '' && 
    homepageData.content.trim() !== '' &&
    !(homepageData.title === 'Bem-vindo ao Smyrna CMS' && 
      homepageData.content.includes('Sistema de Gerenciamento de Conteúdo'))

  return (
      <div className="dynamic-home-container">
        
        {/* Header minimalista, sem gradiente, só tema */}
        <div className="dynamic-home-header">
          <h1 className="dynamic-home-title">
            <BookOpen className="dynamic-home-title-icon" size={isMobile ? 40 : 56} />
            Wiki Nova Fibra
          </h1>
          <p className="dynamic-home-content">
            {hasCustomContent ? 'Página inicial personalizada' : 'Sistema de gerenciamento de conhecimento colaborativo'}
          </p>
          {isAuthenticated && (
            <a href="/admin/profile" className="btn btn-primary dynamic-home-config-btn">
              <Settings size={18} />
              Configurar Página Inicial
            </a>
          )}
        </div>

        {/* Layout de conteúdo 70/30 */}
        {/* Loading and error handling */}
        {loading ? (
          <div className="dynamic-home-loading">
            <div className="dynamic-home-loading-box">
              <div className="dynamic-home-spinner"></div>
              <p className="dynamic-home-loading-text">Carregando...</p>
            </div>
          </div>
        ) : error ? (
          <div className="dynamic-home-error">
            <p>{error}</p>
          </div>
        ) : (
          <div 
            className={`dynamic-home-layout${isMobile ? ' mobile' : ''}`}
          >
            <div 
              className="dynamic-home-maincard"
            >
                {hasCustomContent ? (
                  <>
                    <div className="homepage-content">
                      <ContentRenderer content={homepageData.content} />
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="homepage-title">Bem-vindo ao Smyrna CMS</h1>
                    <div className="homepage-content">
                      <h2>Sistema de Gerenciamento de Conteúdo</h2>
                      <p>Este é um sistema completo para organização e publicação de conteúdo.</p>
                      <h3>Funcionalidades:</h3>
                      <ul>
                        <li>📄 Páginas organizadas</li>
                        <li>📝 Blog integrado</li>
                        <li>👥 Gerenciamento de usuários</li>
                        <li>🎨 Interface responsiva</li>
                      </ul>
                      {isAuthenticated && (
                        <p className="dynamic-home-admin-tip">
                          💡 <strong>Administrador:</strong> <a href="/admin/profile">Configure o conteúdo da página inicial</a> no seu perfil.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar (30%) */}
              {!isMobile && (
                <div 
                  className="dynamic-home-sidebar"
                >
                  {/* Seção de Páginas Recentes */}
                  <div className="dynamic-home-card">
                    <div className="dynamic-home-card-header">
                      <FileText size={18} />
                      Páginas Recentes
                    </div>
                    <div className="dynamic-home-card-list">
                      {recentPages.length > 0 ? (
                        <>
                          <div className="dynamic-home-list">
                            {recentPages.map((page) => (
                              <div key={page.id} className="dynamic-home-list-item">
                                <h4 className="dynamic-home-list-title">
                                  <a href={`/page/${page.slug}`} className="dynamic-home-list-link">
                                    {page.title}
                                  </a>
                                </h4>
                                <p className="dynamic-home-list-meta">
                                  Atualizada em {formatDate(page.updated_at)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="dynamic-home-list-footer">
                            <a href="/pages" className="btn btn-secondary dynamic-home-list-btn">
                              <ArrowRight size={14} />
                              Ver Todas as Páginas
                            </a>
                          </div>
                        </>
                      ) : (
                        <p className="dynamic-home-list-empty">Nenhuma página encontrada.</p>
                      )}
                    </div>
                  </div>

                {/* Seção de Posts Recentes */}
                <div className="dynamic-home-card">
                  <div className="dynamic-home-card-header">
                    <Calendar size={18} />
                    Posts Recentes
                  </div>
                  <div className="dynamic-home-card-list">
                    {recentPosts.length > 0 ? (
                      <>
                        <div className="dynamic-home-list">
                          {recentPosts.map((post) => (
                            <div key={post.id} className="dynamic-home-list-item">
                              <h4 className="dynamic-home-list-title">
                                <a href={`/post/${post.id}`} className="dynamic-home-list-link">
                                  {post.title}
                                </a>
                              </h4>
                              <p className="dynamic-home-list-meta">
                                Publicado em {formatDate(post.created_at)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="dynamic-home-list-footer">
                          <a href="/blog" className="btn btn-secondary dynamic-home-list-btn">
                            <ArrowRight size={14} />
                            Ver Todos os Posts
                          </a>
                        </div>
                      </>
                    ) : (
                      <p className="dynamic-home-list-empty">Nenhum post encontrado.</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="dynamic-home-error">
                    <p>{error}</p>
                  </div>
                )}
                </div>
              )}
            </div>
        )}
      </div>
  )
}
export default DynamicHome;

