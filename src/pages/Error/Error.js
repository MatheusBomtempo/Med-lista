import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar1 from '../../componentes/Navbar/Navbar1';
import './Error.css';

const Error = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="error-container">
      <nav>
        <Navbar1 />
      </nav>
      <div className="error-content">
        <div className="error-box">
          <div className="error-icon">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#ff4d4f" strokeWidth="2" />
              <path
                d="M12 8v4M12 16h.01"
                stroke="#ff4d4f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="error-title">Ops! Algo deu errado</h1>
          <p className="error-message">
            Ocorreu um erro inesperado. Por favor, tente novamente.
          </p>
          {error && (
            <details className="error-details">
              <summary>Detalhes do erro</summary>
              <pre className="error-stack">{error.toString()}</pre>
            </details>
          )}
          <div className="error-actions">
            <button className="error-btn error-btn-primary" onClick={handleReload}>
              Recarregar Página
            </button>
            <button className="error-btn error-btn-secondary" onClick={handleGoHome}>
              Voltar para Início
            </button>
            {resetError && (
              <button className="error-btn error-btn-secondary" onClick={resetError}>
                Tentar Novamente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;

