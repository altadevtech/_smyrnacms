import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { LogIn, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import '../App.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  

  const { login, user, loading } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Aguarda o contexto carregar antes de qualquer return condicional
  if (loading) {
    return null; // ou um spinner minimalista
  }

  // Se já estiver logado, redireciona
  if (user) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      toast.success('Login realizado com sucesso!')
      navigate('/admin')
    } else {
      toast.error(result.error)
    }
    
    setFormLoading(false)
  }

  return (
    <div className="container frontend-content minimal-centered">
      <div className="login-grid">
        <div className="login-welcome">
          <h1><LogIn size={isMobile ? 40 : 56} style={{ marginRight: '1rem', verticalAlign: 'middle' }} />Bem-vindo</h1>
          <p>Acesse seu painel administrativo do Smyrna Wiki</p>
          <ul className="login-features">
            <li><Shield size={20} /> Seguro e Confiável</li>
            <li><Zap size={20} /> Rápido e Eficiente</li>
            <li><Globe size={20} /> Wiki e Blog Integrados</li>
          </ul>
          <Link to="/" className="login-back-link"><ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Voltar ao site</Link>
        </div>
        <div className="login-form-wrapper">
          <div className="login-form-card">
            <div className="login-form-header">
              <div className="login-avatar"><User size={36} color="white" /></div>
              <h2>Fazer Login</h2>
              <p>Entre com suas credenciais para acessar o painel</p>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <label>Email</label>
                <div className="login-input-icon"><Mail size={20} /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu email" required />
              </div>
              <div className="login-form-group">
                <label>Senha</label>
                <div className="login-input-icon"><Lock size={20} /></div>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" required />
                <button type="button" className="login-show-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
              <button type="submit" className="login-submit-btn" disabled={formLoading}>
                {formLoading ? (<><span className="login-spinner"></span>Entrando...</>) : (<><LogIn size={20} /> Fazer Login</>)}
              </button>
            </form>
            <div className="login-test-users">
              <h4><User size={16} /> Usuários de Teste</h4>
              <div>
                <div><strong>Administrador:</strong> <code>admin@smyrna.com / admin123</code></div>
                <div><strong>Editor:</strong> <code>editor@smyrna.com / editor123</code></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
