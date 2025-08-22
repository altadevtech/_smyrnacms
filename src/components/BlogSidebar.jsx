import React, { useState, useEffect } from 'react'
import './BlogSidebar.css'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Tag, Hash } from 'lucide-react'

const BlogSidebar = ({ onCategorySelect, selectedCategorySlug }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 980)

  useEffect(() => {
    fetchCategoriesWithPosts()
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 980)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchCategoriesWithPosts = async () => {
    try {
      const response = await api.get('/categories/stats/with-posts?type=blog')
      setCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
    setLoading(false)
  }

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category.slug, category.name)
    }
  }

  const handleShowAll = () => {
    if (onCategorySelect) {
      onCategorySelect(null)
    }
  }

  if (loading) {
    return (
      <aside className={`blog-sidebar${isMobile ? ' mobile' : ''}`}>
        <div className="sidebar-section">
          <h3 className="sidebar-title"><Tag size={18} /> Categorias</h3>
          <div className="loading">
            <div className="loading-spinner"></div>
            Carregando...
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`blog-sidebar${isMobile ? ' mobile' : ''}`}>
      <div className="sidebar-section">
        <h3 className="sidebar-title"><Tag size={18} /> Categorias</h3>
        {categories.length > 0 ? (
          <ul className="categories-list">
            <li className="category-item">
              <button 
                onClick={handleShowAll}
                className={`category-link ${selectedCategorySlug === null ? 'active' : ''}`}
              >
                <div 
                  className="category-color"
                  style={{ backgroundColor: '#64748b' }}
                />
                <span className="category-name">Todas as categorias</span>
                <span className="post-count">
                  <Hash size={14} />
                  {categories.reduce((total, cat) => total + cat.post_count, 0)}
                </span>
              </button>
            </li>
            {categories.map(category => (
              <li key={category.id} className="category-item">
                <button 
                  onClick={() => handleCategoryClick(category)}
                  className={`category-link ${selectedCategorySlug === category.slug ? 'active' : ''}`}
                >
                  <div 
                    className="category-color"
                    style={category.color ? { backgroundColor: category.color } : {}}
                  />
                  <span className="category-name">{category.name}</span>
                  <span className="post-count">
                    <Hash size={14} />
                    {category.post_count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-categories">Nenhuma categoria com posts publicados.</p>
        )}
      </div>
    </aside>
  );
}

export default BlogSidebar
