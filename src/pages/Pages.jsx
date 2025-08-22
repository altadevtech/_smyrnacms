import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, History } from 'lucide-react'

const Pages = () => {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages')
      setPages(response.data)
    } catch (error) {
  toast.error('Erro ao carregar páginas')
      console.error(error)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta pagina?')) {
      try {
        await api.delete(`/pages/${id}`)
        toast.success('Pagina excluida com sucesso!')
        fetchPages()
      } catch (error) {
        toast.error('Erro ao excluir pagina')
        console.error(error)
      }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      await api.patch(`/pages/${id}/status`, { status: newStatus })
      toast.success(`Pagina ${newStatus === 'published' ? 'publicada' : 'despublicada'} com sucesso!`)
      fetchPages()
    } catch (error) {
      toast.error('Erro ao alterar status da pagina')
      console.error(error)
    }
  }

  if (loading) {
  return <div className="loading">Carregando páginas...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="pages-header">
        <h1><FileText size={24} className="pages-header-icon" />Páginas</h1>
        <Link to="/admin/pages/new" className="btn btn-primary">
          <Plus size={18} className="pages-header-icon" /> Nova Pagina
        </Link>
      </div>

      {pages.length > 0 ? (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Autor</th>
                <th className="hide-mobile">Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id}>
                  <td>
                    <div className="pages-title-row">
                      <strong>{page.title}</strong>
                    </div>
                    {page.template_name && (
                      <div className="pages-template-name">
                        Template: {page.template_name}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${page.status}`}>
                      {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                    </span>
                  </td>
                  <td>{page.author_name}</td>
                  <td className="hide-mobile">{new Date(page.updated_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => toggleStatus(page.id, page.status)}
                        className="action-btn view"
                        title={page.status === 'published' ? 'Despublicar' : 'Publicar'}
                      >
                        {page.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link 
                        to={`/admin/pages/${page.id}/versions`} 
                        className="action-btn info"
                        title="Histórico de versões"
                      >
                        <History size={16} />
                      </Link>
                      <Link 
                        to={`/admin/pages/edit/${page.id}`} 
                        className="action-btn edit"
                        title="Editar página"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="action-btn delete"
                        title="Excluir página"
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
          <h2>Nenhuma pagina encontrada</h2>
          <p>Ainda não há páginas cadastradas.</p>
          <Link to="/admin/pages/new" className="btn btn-primary">
            <Plus size={18} style={{ verticalAlign: 'middle' }} /> Criar primeira pagina
          </Link>
        </div>
      )}
    </div>
  )
}

export default Pages