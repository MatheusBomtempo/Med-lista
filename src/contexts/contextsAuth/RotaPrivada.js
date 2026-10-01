import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';

function RotaPrivada({ children }) {
  const { user, loading } = UserAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />
  }
  
  return children;
}


export default RotaPrivada;


