import React, { useState } from 'react';
import { Input, Button, Table, message, Space, Tag } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { adicionarAdmin, removerAdmin, verificarAdmin } from '../../utils/adicionarAdmin';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { database } from '../../firebase';

const GerenciarAdmins = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const handleAdicionarAdmin = async () => {
    if (!userId.trim()) {
      message.error('Por favor, insira o UID do usuário');
      return;
    }

    setLoading(true);
    try {
      // Verifica se o usuário existe na autenticação
      const userRef = doc(database, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        message.warning('Usuário não encontrado. Verifique o UID.');
        setLoading(false);
        return;
      }

      const sucesso = await adicionarAdmin(userId);
      if (sucesso) {
        message.success('Usuário promovido a admin com sucesso!');
        setUserId('');
        carregarAdmins(); // Recarrega a lista
      } else {
        message.error('Erro ao promover usuário a admin');
      }
    } catch (error) {
      message.error('Erro ao adicionar admin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverAdmin = async (uid) => {
    setLoading(true);
    try {
      const sucesso = await removerAdmin(uid);
      if (sucesso) {
        message.success('Papel de admin removido com sucesso!');
        carregarAdmins(); // Recarrega a lista
      } else {
        message.error('Erro ao remover papel de admin');
      }
    } catch (error) {
      message.error('Erro ao remover admin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const usersRef = collection(database, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const adminsList = [];
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          adminsList.push({
            uid: userDoc.id,
            username: userData.username || 'Sem nome',
            email: userData.email || 'Sem email',
            role: userData.role,
          });
        }
      }
      
      setAdmins(adminsList);
    } catch (error) {
      message.error('Erro ao carregar lista de admins: ' + error.message);
    } finally {
      setLoadingAdmins(false);
    }
  };

  React.useEffect(() => {
    carregarAdmins();
  }, []);

  const columns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      ellipsis: true,
    },
    {
      title: 'Nome de Usuário',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Papel',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color="red">{role}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleRemoverAdmin(record.uid)}
            loading={loading}
          >
            Remover Admin
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>Gerenciar Administradores</h2>
      
      <div style={{ marginBottom: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Adicionar Novo Admin</h3>
        <Space.Compact style={{ width: '100%', maxWidth: '600px' }}>
          <Input
            placeholder="Digite o UID do usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            prefix={<UserOutlined />}
            onPressEnter={handleAdicionarAdmin}
          />
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleAdicionarAdmin}
            loading={loading}
          >
            Adicionar Admin
          </Button>
        </Space.Compact>
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          💡 Dica: O UID do usuário pode ser encontrado no Firebase Authentication ou no Firestore
        </p>
      </div>

      <div>
        <h3>Lista de Administradores</h3>
        <Button
          onClick={carregarAdmins}
          loading={loadingAdmins}
          style={{ marginBottom: '16px' }}
        >
          Atualizar Lista
        </Button>
        <Table
          columns={columns}
          dataSource={admins}
          rowKey="uid"
          loading={loadingAdmins}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default GerenciarAdmins;

