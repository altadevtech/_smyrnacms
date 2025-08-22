import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'

const ThemeToggle = ({ variant = 'button', size = 'default' }) => {
  const { settings, applyTheme } = useSettings()

  const themes = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Escuro', icon: Moon },
    { id: 'bw', label: 'Preto e Branco', icon: Monitor }
  ]

  if (variant === 'select') {
    return (
      <div className="theme-selector">
        <label htmlFor="theme-select">Tema:</label>
        <select 
          id="theme-select"
          className="form-control"
          value={settings.theme}
          onChange={(e) => applyTheme(e.target.value)}
        >
          {themes.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className="theme-cards">
        <h4>Escolha o Tema</h4>
        <div className="theme-grid">
          {themes.map(theme => {
            const Icon = theme.icon
            return (
              <div
                key={theme.id}
                className={`theme-card ${theme.id} ${settings.theme === theme.id ? 'active' : ''}`}
                onClick={() => applyTheme(theme.id)}
              >
                <div className="theme-preview">
                  <Icon size={24} />
                </div>
                <span className="theme-label">{theme.label}</span>
                {settings.theme === theme.id && (
                  <div className="theme-active-indicator">✓</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Default: toggle button (circular)
  const currentThemeIndex = themes.findIndex(t => t.id === settings.theme)
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length]
  const Icon = nextTheme.icon

  return (
    <button
      className={`theme-toggle-btn ${size}`}
      onClick={() => applyTheme(nextTheme.id)}
      title={`Mudar para tema ${nextTheme.label}`}
      aria-label={`Tema atual: ${settings.theme}. Clique para alternar para ${nextTheme.label}`}
    >
      <Icon size={size === 'small' ? 16 : 20} />
      {variant === 'button-text' && <span>{nextTheme.label}</span>}
    </button>
  )
}

export default ThemeToggle
