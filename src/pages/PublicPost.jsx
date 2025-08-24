import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import ContentRenderer from '../components/ContentRenderer'
import { Calendar, User, ArrowLeft, Home, Clock, Tag, FileText } from 'lucide-react'
import './PublicPost.css'

const PublicPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    fetchPost()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/public/slug/${slug}`)
      setPost(response.data)
    } catch (error) {
      setError('Post não encontrado')
      console.error('Erro ao carregar post:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="public-post-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary, #64748b)' }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid rgb(102,234,205)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: 16, fontWeight: 500 }}>Carregando post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="public-post-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'var(--color-bg, #fff)', border: '1px solid #e5e7eb', padding: '3rem 2rem', maxWidth: 500, width: '100%' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📝</div>
          <h1 style={{ margin: '0 0 1rem 0', color: 'var(--color-text, #374151)', fontSize: '2rem', fontWeight: 700 }}>404 - Post não encontrado</h1>
          <p style={{ margin: '0 0 2rem 0', color: 'var(--color-text-secondary, #6b7280)', fontSize: '1.1rem', lineHeight: 1.6 }}>{error}. O post que você está procurando pode ter sido removido ou não existe.</p>
          <Link to="/blog" className="public-post-back-btn">
            <ArrowLeft size={18} /> Voltar ao blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="public-post-container">
      {/* Header com navegação */}
      <header style={{ marginBottom: '2rem' }}>
        <nav className="public-post-nav">
          <Link to="/">
            <Home size={18} /> Início
          </Link>
          <span style={{ color: '#d1d5db' }}>•</span>
          <Link to="/blog">Blog</Link>
          <span style={{ color: '#d1d5db' }}>•</span>
          <span style={{ color: '#9ca3af' }}>{post && post.title ? post.title : '-'}</span>
        </nav>
      </header>

      {/* Artigo principal */}
      <article className="public-post-article">
        {/* Header do artigo */}
        <header className="public-post-header">
          {/* Categoria se existir */}
          {post && post.category_name && (
            <div>
              <span className="public-post-category" style={{ background: post.category_color || undefined }}>
                <Tag size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                {post.category_name}
              </span>
            </div>
          )}
          <h1 className="public-post-title">{post && post.title ? post.title : '-'}</h1>
          <div className="public-post-meta">
            <span>
              <User size={16} /> Por {post && post.author_name ? post.author_name : '-'}
            </span>
            <span>
              <Calendar size={16} />
              {(() => {
                if (!post || !post.created_at) return '-';
                const d = new Date(post.created_at);
                if (isNaN(d)) return '-';
                return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
              })()}
            </span>
            <span>
              <FileText size={16} /> Blog Post
            </span>
          </div>
        </header>

        {/* Imagem destacada */}
        {post && post.featured_image && (
          <img
            className="public-post-featured-image"
            src={post.featured_image}
            alt={post.title}
            onError={e => { e.target.style.display = 'none' }}
          />
        )}

        {/* Conteúdo do artigo */}
        <div className="public-post-content">
          {post && post.content ? <ContentRenderer content={post.content} /> : <span style={{ color: '#aaa' }}>Sem conteúdo.</span>}
        </div>

        {/* Footer do artigo */}
        <footer className="public-post-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
            <Clock size={16} />
            Publicado em: {(() => {
              if (!post || !post.created_at) return '-';
              const d = new Date(post.created_at);
              if (isNaN(d)) return '-';
              return d.toLocaleDateString('pt-BR');
            })()}
          </div>
          <Link to="/blog"> <ArrowLeft size={16} /> Voltar ao blog </Link>
        </footer>
      </article>
    </div>
  )
}

export default PublicPost
