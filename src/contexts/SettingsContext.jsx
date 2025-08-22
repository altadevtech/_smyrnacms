import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
  siteName: 'Smyrna CMS',
  siteDescription: 'Sistema de Gerenciamento de Conteúdo (CMS) flexível e moderno',
    logo: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    website: '',
    theme: 'light'
  })
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    try {
      // Usar endpoint público para configurações
      const response = await api.get('/settings/public')
      setSettings({ ...settings, ...response.data })
    } catch (error) {
      console.log('Configurações não encontradas, usando padrões')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      await api.put('/settings', newSettings)
      setSettings({ ...settings, ...newSettings })
      return true
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      return false
    }
  }

  const refreshSettings = () => {
    loadSettings()
  }

  useEffect(() => {
    loadSettings()
    
    // Inicializar tema do localStorage ou usar padrão
    const savedTheme = localStorage.getItem('theme') || settings.theme || 'light'
    applyTheme(savedTheme)
  }, [])

  useEffect(() => {
    // Aplicar tema quando settings mudarem
    if (settings.theme) {
      applyTheme(settings.theme)
    }
  }, [settings.theme])

  const applyTheme = (theme) => {
    // Remove classes antigas
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-bw')
    // Adiciona a classe do tema atual
    if (theme === 'light') document.body.classList.add('theme-light')
    if (theme === 'dark') document.body.classList.add('theme-dark')
    if (theme === 'bw') document.body.classList.add('theme-bw')
    localStorage.setItem('theme', theme)
    setSettings(prev => ({ ...prev, theme }))
  }

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
  }

  const value = {
    settings,
    loading,
    updateSettings,
    refreshSettings,
    applyTheme,
    toggleTheme
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContext
