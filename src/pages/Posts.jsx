import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

import { Plus, Edit, Trash2, Eye, EyeOff, FileText } from 'lucide-react'
import './PostsTable.css';

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch (error) {
      toast.error('Erro ao carregar posts')
      console.error(error)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await api.delete(`/posts/${id}`)
        toast.success('Post excluído com sucesso!')
        fetchPosts()
      } catch (error) {
        toast.error('Erro ao excluir post')
        console.error(error)
      }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      await api.patch(`/posts/${id}/status`, { status: newStatus })
      toast.success(`Post ${newStatus === 'published' ? 'publicado' : 'despublicado'} com sucesso!`)
      fetchPosts()
    } catch (error) {
      toast.error('Erro ao alterar status do post')
      console.error(error)
    }
  }

  if (loading) {
    return <div className="loading">Carregando posts...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Posts</h1>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <Plus size={18} style={{ verticalAlign: 'middle' }} /> Novo Post
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="card" style={{ marginBottom: '2rem', border: 'none', boxShadow: 'none', background: 'none' }}>
          <div className="table-responsive">
            <table className="table posts-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Autor</th>
                  <th className="hide-mobile">Data de Criação</th>
                  <th className="hide-mobile">Última Atualização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td><strong>{post.title}</strong></td>
                    <td>
                      {post.category_name ? (
                        <span className="category-badge">
                          {post.category_name}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Sem categoria</span>
                      )}
                    </td>
                    <td>
                      <span className={`posts-status ${post.status}`}>
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td>{post.author_name}</td>
                    <td className="hide-mobile">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="hide-mobile">{new Date(post.updated_at).toLocaleDateString()}</td>
                    <td>
                      <div className="posts-actions">
                        <button
                          onClick={() => toggleStatus(post.id, post.status)}
                          className="posts-action-btn view"
                          title={post.status === 'published' ? 'Despublicar' : 'Publicar'}
                        >
                          {post.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <Link 
                          to={`/admin/posts/edit/${post.id}`} 
                          className="posts-action-btn edit"
                          title="Editar post"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="posts-action-btn delete"
                          title="Excluir post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={64} style={{ color: 'rgb(102, 234, 205)', marginBottom: '1rem' }} />
          <h2>Nenhum post encontrado</h2>
          <p>Ainda não há posts no blog.</p>
          <Link to="/admin/posts/new" className="btn btn-primary">
            <Plus size={18} style={{ verticalAlign: 'middle' }} /> Criar primeiro post
          </Link>
        </div>
      )}
    </div>
  )
}

export default Posts
