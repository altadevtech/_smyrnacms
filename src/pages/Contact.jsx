import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aqui você pode implementar o envio do email
    console.log('Formulário enviado:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Em caso de dúvidas, sugestão ou reclamação sobre essa Wiki, entre em contato</h1>
          <p className="contact-subtitle">
            Estamos aqui para ajudar! Entre em contato conosco através do formulário abaixo ou use nossas informações de contato.
          </p>
        </div>
        <div className="contact-content">
          {/* Formulário de Contato */}
          <div className="contact-card">
            <h2 className="contact-card-title">Envie sua Mensagem</h2>
            <form onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <label className="contact-label">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="contact-input"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="contact-form-group">
                <label className="contact-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="contact-input"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="contact-form-group">
                <label className="contact-label">Assunto</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="contact-input"
                  placeholder="Assunto da sua mensagem"
                />
              </div>
              <div className="contact-form-group">
                <label className="contact-label">Mensagem</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="contact-textarea"
                  placeholder="Escreva sua mensagem aqui..."
                />
              </div>
              <button type="submit" className="contact-btn">
                <Send size={18} />
                Enviar Mensagem
              </button>
            </form>
          </div>
          {/* Informações de Contato */}
          <div className="contact-card">
            <h2 className="contact-card-title">Informações de Contato</h2>
            {settings.contactEmail && (
              <div className="contact-item">
                <div className="contact-item-icon contact-item-icon-mail">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="contact-item-title">Email</h4>
                  <a href={`mailto:${settings.contactEmail}`} className="contact-item-link">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            )}
            {settings.contactPhone && (
              <div className="contact-item">
                <div className="contact-item-icon contact-item-icon-phone">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="contact-item-title">Telefone</h4>
                  <a href={`tel:${settings.contactPhone}`} className="contact-item-link">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>
            )}
            {settings.contactAddress && (
              <div className="contact-item">
                <div className="contact-item-icon contact-item-icon-address">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="contact-item-title">Endereço</h4>
                  <p className="contact-item-desc">{settings.contactAddress}</p>
                </div>
              </div>
            )}
            {settings.contactHours && (
              <div className="contact-item">
                <div className="contact-item-icon contact-item-icon-hours">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="contact-item-title">Horário de Funcionamento</h4>
                  <p className="contact-item-desc">{settings.contactHours}</p>
                </div>
              </div>
            )}
            <div className="contact-item">
              <div className="contact-item-icon contact-item-icon-hours">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="contact-item-title">Horário de Atendimento</h4>
                <p className="contact-item-desc">
                  Segunda a Sexta: 9h às 18h<br />
                  Sábado: 9h às 12h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact
