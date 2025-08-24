import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import AdminLayout from './components/AdminLayout'
import FrontendLayout from './components/FrontendLayout'
import Footer from './components/Footer'
import DynamicHome from './pages/DynamicHome'
import PublicPages from './pages/PublicPages'
import DynamicPublicPage from './pages/DynamicPublicPage'
import PublicBlog from './pages/PublicBlog'
import PublicPost from './pages/PublicPost'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pages from './pages/Pages'
import Posts from './pages/Posts'
import Categories from './pages/Categories'
import Menus from './pages/Menus'
import Users from './pages/Users'
import Profile from './pages/Profile'
import DynamicPageEditor from './pages/DynamicPageEditor'
import PostEditor from './pages/PostEditor'
import Templates from './pages/TemplatesSimple'
import ProtectedRoute from './components/ProtectedRoute'
import DebugComponent from './components/DebugComponent'
import QuillTest from './components/QuillTest'
import WikiLayout from './components/WikiLayout'
import PageVersionHistory from './pages/PageVersionHistory'
import VersionCompare from './pages/VersionCompare'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rotas administrativas, 100% separadas do Frontend */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pages" element={<Pages />} />
                <Route path="pages/new" element={<DynamicPageEditor />} />
                <Route path="pages/edit/:id" element={<DynamicPageEditor />} />
                <Route path="posts" element={<Posts />} />
                <Route path="posts/new" element={<PostEditor />} />
                <Route path="categories" element={<Categories />} />
                <Route path="users" element={<Users />} />
                <Route path="menus" element={<Menus />} />
                <Route path="profile" element={<Profile />} />
                <Route path="templates" element={<Templates />} />
                <Route path="page-editor/:id" element={<DynamicPageEditor />} />
                <Route path="post-editor/:id" element={<PostEditor />} />
                <Route path="page-versions/:id" element={<PageVersionHistory />} />
                <Route path="version-compare/:id/:otherId" element={<VersionCompare />} />
                <Route path="debug" element={<DebugComponent />} />
                <Route path="quill-test" element={<QuillTest />} />
              </Route>
              {/* Rotas públicas, 100% separadas do Admin */}
              <Route path="/" element={<FrontendLayout />}>
                <Route index element={<DynamicHome />} />
                <Route path="pages" element={<PublicPages />} />
                {/* Cada página pública será uma rota isolada pelo slug */}
                <Route path=":slug" element={<DynamicPublicPage />} />
                <Route path="blog" element={<PublicBlog />} />
                <Route path="blog/:slug" element={<PublicPost />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="profile" element={<Profile />} />
                {/* Adicione outras rotas públicas aqui */}
              </Route>
            </Routes>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
