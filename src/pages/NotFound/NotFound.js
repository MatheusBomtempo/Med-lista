import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar1 from '../../componentes/Navbar/Navbar1';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notfound-container">
      <nav>
        <Navbar1 />
      </nav>
      <div className="notfound-content">
        <div className="notfound-box">
          <div className="notfound-number">404</div>
          <div className="notfound-icon">
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="#014A49"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#014A49"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#014A49"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="notfound-title">Página não encontrada</h1>
          <p className="notfound-message">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="notfound-actions">
            <button className="notfound-btn notfound-btn-primary" onClick={handleGoHome}>
              Voltar para Início
            </button>
            <button className="notfound-btn notfound-btn-secondary" onClick={handleGoBack}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

