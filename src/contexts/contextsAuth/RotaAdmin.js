import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from './AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebase';

function RotaAdmin({ children }) {
  const { user, loading: authLoading } = UserAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aguarda o carregamento inicial da autenticação
    if (authLoading) {
      return;
    }

    const checkAdminRole = async () => {
      // Verifica se user existe e tem uid
      if (!user || !user.uid) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Verifica na coleção 'users' se o usuário tem role === 'admin'
        const userRef = doc(database, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Se não tiver role ou role não for 'admin', não é admin
          const adminStatus = userData.role === 'admin';
          setIsAdmin(adminStatus);
          console.log('Verificação admin:', { uid: user.uid, role: userData.role, isAdmin: adminStatus });
        } else {
          // Se não existe na coleção users, não é admin
          console.log('Usuário não encontrado na coleção users:', user.uid);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erro ao verificar papel do usuário:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, authLoading]);

  // Mostra loading enquanto verifica autenticação ou permissões
  if (authLoading || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Verificando permissões...
      </div>
    );
  }

  // Se não está autenticado, redireciona para home
  if (!user || !user.uid) {
    console.log('Usuário não autenticado, redirecionando...');
    return <Navigate to="/" replace />;
  }

  // Se não é admin, redireciona para home
  if (!isAdmin) {
    console.log('Usuário não é admin, redirecionando...', { uid: user.uid });
    return <Navigate to="/" replace />;
  }

  // Se é admin, renderiza o conteúdo
  return children;
}

export default RotaAdmin;
