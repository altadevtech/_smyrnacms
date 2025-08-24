import React, { useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import './users.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor'
  })
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Erro ao carregar usuários')
      console.error(error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData)
        toast.success('Usuário atualizado com sucesso!')
      } else {
        await api.post('/users', formData)
        toast.success('Usuário criado com sucesso!')
      }
      setShowForm(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'editor' })
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar usuário')
      console.error(error)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`)
        toast.success('Usuário excluído com sucesso!')
        fetchUsers()
      } catch (error) {
        toast.error('Erro ao excluir usuário')
        console.error(error)
      }
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await api.patch(`/users/${id}/status`, { status: newStatus })
      toast.success(`Usuário ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`)
      fetchUsers()
    } catch (error) {
      toast.error('Erro ao alterar status do usuário')
      console.error(error)
    }
  }

  if (loading) {
    return <div className="loading">Carregando usuários...</div>
  }

  return (
  <div className="container admin-content-container">
      <div className="users-header">
        <h1>Usuários</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          <Plus size={18} /> Novo Usuário
        </button>
      </div>

      {showForm && (
        <div className="card user-form-card">
          <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha{editingUser ? ' (deixe em branco para manter a atual)' : ''}:</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
            </div>
            <div className="form-group">
              <label>Papel:</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="actions">
              <button type="submit" className="btn btn-primary">
                {editingUser ? 'Atualizar' : 'Criar'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                  setFormData({ name: '', email: '', password: '', role: 'editor' })
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length > 0 ? (
        <div className="card user-table-card">
          <div className="table-responsive">
            <table className="table user-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Papel</th>
                  <th>Status</th>
                  <th className="hide-mobile">Data de Criação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>{user.role === 'admin' ? 'Admin' : 'Editor'}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>{user.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    </td>
                    <td className="hide-mobile">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => toggleStatus(user.id, user.status)}
                          className="action-btn reset"
                          title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                        >
                          {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="action-btn edit"
                          title="Editar usuário"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="action-btn delete"
                          title="Excluir usuário"
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
        <div className="card user-table-card">
          <p>Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  )
}

export default Users
