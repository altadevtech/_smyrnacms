import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Calendar, User, Tag, BookOpen, ArrowRight, FileText } from 'lucide-react'
import BlogSidebar from '../components/BlogSidebar'
import { getDisplaySummary, formatDate, formatRelativeDate } from '../utils/textUtils'
import './BlogPublic.css'

const PublicBlog = () => {
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 980)
  
  const { categorySlug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 980)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (allPosts.length > 0 && categories.length > 0) {
      handleCategoryFromUrl()
    }
  }, [allPosts, categories, categorySlug])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/public')
      setAllPosts(response.data)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/stats/with-posts?type=blog')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleCategoryFromUrl = () => {
    if (categorySlug) {
      // Encontrar a categoria pelo slug na URL
      const category = categories.find(cat => cat.slug === categorySlug)
      if (category) {
        filterByCategory(category.slug, category.name, false) // false = não navegar
      } else {
        // Se categoria não encontrada, redirecionar para todas
        navigate('/blog')
      }
    } else {
      // Se não há slug, mostrar todos os posts
      setPosts(allPosts)
      setSelectedCategory(null)
    }
  }

  const filterByCategory = (categorySlug, categoryName, shouldNavigate = true) => {
    if (categorySlug === null) {
      // Mostrar todos os posts
      setPosts(allPosts)
      setSelectedCategory(null)
      if (shouldNavigate) {
        navigate('/blog')
      }
    } else {
      // Filtrar posts pela categoria usando category_slug
      const filteredPosts = allPosts.filter(post => post.category_slug === categorySlug)
      setPosts(filteredPosts)
      setSelectedCategory({ slug: categorySlug, name: categoryName })
      
      if (shouldNavigate) {
        navigate(`/blog/categoria/${categorySlug}`)
      }
    }
  }

  const generateSlug = (title, id) => {
    return title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + id
  }

  if (loading) {
    return (
      <div className="public-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div className="loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
          <div className="spinner" />
          <p className="loading-text">Carregando posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="public-container">
      <header className="public-header">
        <Link to="/" className="back-button">
          <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Voltar ao início
        </Link>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <FileText size={28} style={{ color: 'var(--color-primary, #66eacd)' }} /> Blog
        </h1>
      </header>

      {selectedCategory && (
        <div className={`filter-header${isMobile ? ' mobile' : ''}`}>
          <div className="filter-info">
            <Tag size={18} style={{ color: 'var(--color-primary, #66eacd)' }} />
            <span>
              Postagens em: <strong style={{ color: 'var(--color-secondary, #4b81a2)' }}>{selectedCategory.name}</strong>
            </span>
          </div>
          <button onClick={() => filterByCategory(null)} className="clear-filter-btn">
            Ver todas as postagens
          </button>
        </div>
      )}

  <div className="blog-layout" style={isMobile ? { flexDirection: 'column', gap: '2rem', padding: '1rem 0' } : {}}>
        {isMobile && (
          <div style={{ order: 1, width: '100%', marginBottom: '2rem' }}>
            <BlogSidebar 
              onCategorySelect={filterByCategory}
              selectedCategorySlug={selectedCategory?.slug}
            />
          </div>
        )}
        
  <main className="public-content" style={isMobile ? { order: 2 } : {}}>
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  {/* Imagem destacada - Exibida apenas se existir */}
                  {post.featured_image && (
                    <div className="post-featured-image">
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
                  
                  <div className="post-content" style={post.featured_image ? { padding: '2rem 2rem' } : { padding: '2rem' }}>
                    {post.category_name && (
                      <div className="post-category">
                        <span className="category-tag" style={post.category_color ? { background: `linear-gradient(135deg, ${post.category_color}, ${post.category_color}dd)` } : {}}>
                          {post.category_name}
                        </span>
                      </div>
                    )}
                    <h2 className="post-title">
                      <Link to={`/blog/${post.slug || generateSlug(post.title, post.id)}`}>{post.title}</Link>
                    </h2>
                    <p className="post-excerpt">{getDisplaySummary(post.summary, post.content, 250)}</p>
                    
                    <Link to={`/blog/${post.slug || generateSlug(post.title, post.id)}`} className="read-more-btn">
                      <BookOpen size={16} />
                      Ler artigo completo
                    </Link>
                    <div className="post-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: '500' }}>
                        <User size={14} style={{ color: 'var(--color-primary, #66eacd)' }} /> 
                        {post.author_name}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: '500' }}>
                        <Calendar size={14} style={{ color: 'var(--color-secondary, #4b81a2)' }} /> 
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-content">
              <FileText size={64} style={{ color: 'var(--color-primary, #66eacd)', marginBottom: '1rem' }} />
              <h2 style={{ color: 'var(--color-text, #1e293b)', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
                Nenhum post encontrado
              </h2>
              <p style={{ color: 'var(--color-muted, #64748b)', fontSize: '1rem', margin: 0 }}>
                Ainda não há posts publicados no blog.
              </p>
            </div>
          )}
        </main>

        {!isMobile && (
          <BlogSidebar 
            onCategorySelect={filterByCategory}
            selectedCategorySlug={selectedCategory?.slug}
          />
        )}
      </div>
    </div>
  )
}

export default PublicBlog
