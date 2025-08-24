import React, { useState, useEffect } from 'react'
import './Categories.css'
import './CategoriesModern.css'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Save, X, Tag, ChevronRight } from 'lucide-react'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [parentCategories, setParentCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [activeTab, setActiveTab] = useState('pages') // 'pages' ou 'blog'

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#6366f1',
  type: 'pages',
      parent_id: ''
    }
  })

  const watchName = watch('name')

  useEffect(() => {
    fetchCategories()
    fetchParentCategories()
  }, [activeTab])

  useEffect(() => {
    if (watchName && !editingCategory) {
      setValue('slug', generateSlug(watchName))
    }
  }, [watchName, setValue, editingCategory])

  const fetchCategories = async () => {
    try {
      const response = await api.get(`/categories?type=${activeTab}`)
      setCategories(response.data)
    } catch (error) {
      toast.error('Erro ao carregar categorias')
      console.error(error)
    }
    setLoading(false)
  }

  const fetchParentCategories = async () => {
    try {
      const response = await api.get(`/categories/main/${activeTab}`)
      setParentCategories(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias principais:', error)
    }
  }

  const generateSlug = (name) => {
    return name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  const onSubmit = async (data) => {
    try {
  // Garantir que o tipo seja o mesmo da aba ativa
  const categoryData = { ...data, type: activeTab }
      
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, categoryData)
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await api.post('/categories', categoryData)
        toast.success('Categoria criada com sucesso!')
      }
      
      fetchCategories()
      handleCancel()
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao salvar categoria'
      toast.error(message)
      console.error(error)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setValue('name', category.name)
    setValue('slug', category.slug)
    setValue('description', category.description)
    setValue('color', category.color)
    setValue('parent_id', category.parent_id || '')
    setIsCreating(true)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingCategory(null)
    reset({
      name: '',
      slug: '',
      description: '',
      color: '#6366f1',
  type: activeTab,
      parent_id: ''
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`/categories/${id}`)
        toast.success('Categoria excluída com sucesso!')
        fetchCategories()
      } catch (error) {
        const message = error.response?.data?.error || 'Erro ao excluir categoria'
        toast.error(message)
        console.error(error)
      }
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    if (!editingCategory) {
      setValue('slug', generateSlug(name))
    }
  }

  // Organizar categorias em estrutura hierárquica
  const organizeCategories = () => {
    const rootCategories = categories.filter(cat => !cat.parent_id)
    const subcategories = categories.filter(cat => cat.parent_id)

    return rootCategories.map(rootCat => ({
      ...rootCat,
      subcategories: subcategories.filter(subCat => subCat.parent_id === rootCat.id)
    }))
  }

  const getCategoryDisplay = (category) => {
    if (category.parent_name) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{category.parent_name}</span>
          <ChevronRight size={16} className="text-gray-400" />
          <span>{category.name}</span>
        </div>
      )
    }
    return category.name
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Carregando categorias...</div>
      </div>
    )
  }

  return (
  <div className="container admin-content-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="admin-header">
        <h1><Tag size={24} /> Categorias</h1>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)} 
            className="btn btn-primary"
             style={{ float: 'right', marginBottom: '1rem', paddingTop:'15px', paddingBottom:'15px' }}
          >
            <Plus size={18} /> Nova Categoria
          </button>
        )}
      </div>

  {/* Abas para alternar entre Páginas e Blog */}
  <div className="categories-tabs-bar">
        <button
          onClick={() => setActiveTab('pages')}
          className={`tab-btn ${activeTab === 'pages' ? 'active' : ''}`}
        >
          � Categorias Páginas
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
        >
          📝 Categorias Blog
        </button>
      </div>


      {isCreating && (
  <div className="card">
          <div className="card-header">
            <h3>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nome *</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  {...register('name', { 
                    required: 'Nome é obrigatório',
                    onChange: handleNameChange
                  })}
                />
                {errors.name && (
                  <div className="error">{errors.name.message}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="slug">Slug *</label>
                <input
                  type="text"
                  id="slug"
                  className="form-control"
                  {...register('slug', { required: 'Slug é obrigatório' })}
                />
                {errors.slug && (
                  <div className="error">{errors.slug.message}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="3"
                  {...register('description')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="parent_id">Categoria Pai (opcional)</label>
                <select
                  id="parent_id"
                  className="form-control"
                  {...register('parent_id')}
                >
                  <option value="">Categoria Principal</option>
                  {parentCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Deixe vazio para criar uma categoria principal ou selecione uma categoria pai para criar uma subcategoria
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="type">Tipo *</label>
                <select
                  id="type"
                  className="form-control"
                  {...register('type', { required: 'Tipo é obrigatório' })}
                >
                  <option value="pages">📄 Páginas</option>
                  <option value="blog">📝 Blog</option>
                </select>
                <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Escolha o tipo de categoria
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Cor</label>
                <input
                  type="color"
                  id="color"
                  className="form-control"
                  style={{ height: '45px' }}
                  {...register('color')}
                />
              </div>
            </div>

            <div className="actions">
              <button type="submit" className="btn btn-primary">
                <Save size={18} /> Salvar
              </button>
              <button type="button" onClick={handleCancel} className="btn">
                <X size={18} /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length > 0 ? (
        <div className="card">
          <div className="table-responsive">
            <table className="table categories-table">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Nome</th>
                <th>Slug</th>
                <th className="hide-mobile">Descrição</th>
                <th>Badge</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td style={{ width: 70 }}>
                    <input
                      type="number"
                      min={0}
                      value={category.sort_order || 0}
                      style={{ width: 50, textAlign: 'center' }}
                      onChange={e => {
                        const newOrder = parseInt(e.target.value, 10) || 0;
                        setCategories(prev => prev.map(cat => cat.id === category.id ? { ...cat, sort_order: newOrder } : cat));
                      }}
                      onBlur={async e => {
                        const newOrder = parseInt(e.target.value, 10) || 0;
                        try {
                          // Enviar todos os campos obrigatórios para evitar erro 400
                          await api.put(`/categories/${category.id}`, {
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            color: category.color,
                            type: category.type,
                            parent_id: category.parent_id,
                            sort_order: newOrder
                          });
                          fetchCategories();
                          toast.success('Ordem atualizada!');
                        } catch (err) {
                          toast.error('Erro ao atualizar ordem');
                        }
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {category.parent_id && <span style={{ marginLeft: '1.5rem', color: '#9ca3af' }}>↳</span>}
                      <span style={{ fontSize: '1.2rem' }}>
                        {category.type === 'pages' ? '📄' : '📝'}
                      </span>
                      <div>
                        {getCategoryDisplay(category)}
                        <span style={{
                          display: 'inline-block',
                          marginLeft: 8,
                          fontSize: '0.92em',
                          fontWeight: 600,
                          color: category.type === 'pages' ? 'var(--color-primary, #6366f1)' : 'var(--color-primary-light, #60a5fa)',
                          background: category.type === 'pages' ? 'rgba(99,102,241,0.08)' : 'rgba(96,165,250,0.10)',
                          borderRadius: 6,
                          padding: '2px 8px',
                        }}>
                          {category.type === 'pages' ? 'Páginas' : 'Blog'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className="category-slug">
                      {category.slug}
                    </code>
                  </td>
                  <td className="hide-mobile">
                    {category.description || (
                      <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>Sem descrição</span>
                    )}
                  </td>
                  <td>
                    <span className="category-badge" style={{backgroundColor: category.color}}>
                      {category.name}
                    </span>
                  </td>
                  <td>
                    <div className="category-actions">
                      <button onClick={() => handleEdit(category)} className="btn btn-edit" title="Editar categoria">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="btn btn-delete" title="Excluir categoria">
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
        <div className="category-empty-card">
          <div className="category-empty-icon">{activeTab === 'pages' ? '�' : '📝'}</div>
          <h3 className="category-empty-title">Nenhuma categoria de {activeTab === 'pages' ? 'Páginas' : 'Blog'} encontrada</h3>
          <p className="category-empty-text">Crie sua primeira categoria {activeTab === 'pages' ? 'de Páginas' : 'de Blog'} para organizar melhor seu conteúdo!</p>
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            <Plus size={18} />
            Criar Primeira Categoria
          </button>
        </div>
      )}
    </div>
  )
}

export default Categories
