import React from 'react';
import './DebugComponent.css';

const DebugComponent = () => {
  const token = localStorage.getItem('token')
  
  return (
    <div className="debug-component-container">
      <h1>Debug Autenticação</h1>
      <div className="debug-component-status">
        <h2>Status atual:</h2>
        <p><strong>Token no localStorage:</strong> {token ? 'Existe' : 'Não existe'}</p>
        <p><strong>Tamanho do token:</strong> {token ? token.length : 'N/A'}</p>
        <p><strong>URL atual:</strong> {window.location.href}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
      </div>
      <div className="debug-component-actions">
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>
          Limpar localStorage e recarregar
        </button>
        <button onClick={() => {
          window.location.href = 'http://localhost:3000';
        }}>
          Ir para home
        </button>
      </div>
    </div>
  );
}

export default DebugComponent
