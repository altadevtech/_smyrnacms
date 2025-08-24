import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { BarChart3, FileText, Users, Eye } from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPages: 0,
    totalPosts: 0,
    totalUsers: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Buscando dados do dashboard...')
      const response = await api.get('/dashboard/stats')
      console.log('Dados recebidos:', response.data)
      setStats(response.data)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      console.error('Detalhes do erro:', error.response?.data)
      
      // Tentar buscar dados de teste
      try {
        const testResponse = await api.get('/dashboard/test-db')
        console.log('Teste do banco:', testResponse.data)
      } catch (testError) {
        console.error('Erro no teste do banco:', testError)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="dashboard minimal-dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-welcome">Bem-vindo, <strong>{user?.name || 'Usuário'}</strong>!</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <FileText size={28} className="dashboard-card-icon" />
            <div>
              <div className="dashboard-card-value">{stats.totalPages}</div>
              <div className="dashboard-card-label">Wiki</div>
            </div>
          </div>
          <div className="dashboard-card">
            <FileText size={28} className="dashboard-card-icon" />
            <div>
              <div className="dashboard-card-value">{stats.totalPosts}</div>
              <div className="dashboard-card-label">Posts</div>
            </div>
          </div>
          {user?.role === 'admin' && (
            <div className="dashboard-card">
              <Users size={28} className="dashboard-card-icon" />
              <div>
                <div className="dashboard-card-value">{stats.totalUsers}</div>
                <div className="dashboard-card-label">Usuários</div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Atividade Recente</h2>
          {stats.recentActivity.length > 0 ? (
            <div className="dashboard-activity-list">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="dashboard-activity-item">
                  <Eye size={16} className="dashboard-activity-icon" />
                  <span><strong>{activity.author_name}</strong> {activity.action} "{activity.title}"</span>
                  <small className="dashboard-activity-date">
                    {(() => {
                      const d = new Date(activity.activity_date);
                      if (!activity.activity_date || isNaN(d)) return '-';
                      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    })()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">Nenhuma atividade recente.</div>
          )}
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Ações Rápidas</h2>
          <div className="dashboard-actions">
            <a href="/admin/pages/new" className="dashboard-action-btn">Nova Página</a>
            <a href="/admin/posts/new" className="dashboard-action-btn">Novo Post</a>
            {user?.role === 'admin' && (
              <a href="/admin/users" className="dashboard-action-btn dashboard-action-btn-secondary">Gerenciar Usuários</a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
