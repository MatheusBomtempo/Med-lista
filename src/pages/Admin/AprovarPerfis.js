import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, message, Space, Input, Modal } from 'antd';
import { CheckOutlined, CloseOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { database } from '../../firebase';

const { Search } = Input;

const AprovarPerfis = () => {
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredPerfis, setFilteredPerfis] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // 'asc' ou 'desc'

  useEffect(() => {
    carregarPerfis();
  }, []);

  useEffect(() => {
    // Filtra perfis baseado no texto de busca
    let filtered = perfis;
    
    if (searchText.trim() !== '') {
      filtered = perfis.filter(perfil => {
        const searchLower = searchText.toLowerCase();
        return (
          perfil.nome?.toLowerCase().includes(searchLower) ||
          perfil.nomeCompleto?.toLowerCase().includes(searchLower) ||
          perfil.CRM?.toLowerCase().includes(searchLower) ||
          perfil.especialidade?.toLowerCase().includes(searchLower) ||
          perfil.email?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Aplica ordenação se houver
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === 'nome') {
          aValue = (a.nome || a.nomeCompleto || '').toLowerCase();
          bValue = (b.nome || b.nomeCompleto || '').toLowerCase();
        } else if (sortConfig.key === 'acoes') {
          // Ordena por status: Pendente (false) vem antes de Aprovado (true)
          aValue = a.exibirPerfil ? 'aprovado' : 'pendente';
          bValue = b.exibirPerfil ? 'aprovado' : 'pendente';
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredPerfis(filtered);
  }, [searchText, perfis, sortConfig]);

  const carregarPerfis = async () => {
    setLoading(true);
    try {
      const medicosSnapshot = await getDocs(collection(database, 'medicos2'));
      const perfisData = [];

      for (const medicoDoc of medicosSnapshot.docs) {
        const medicoData = medicoDoc.data();
        perfisData.push({
          id: medicoDoc.id,
          ...medicoData,
        });
      }

      // Ordena por data de criação (mais recentes primeiro)
      perfisData.sort((a, b) => {
        if (a.dataCriacao && b.dataCriacao) {
          return b.dataCriacao.toMillis() - a.dataCriacao.toMillis();
        }
        return 0;
      });

      setPerfis(perfisData);
      setFilteredPerfis(perfisData);
    } catch (error) {
      message.error('Erro ao carregar perfis: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const aprovarPerfil = async (perfilId) => {
    try {
      const perfilRef = doc(database, 'medicos2', perfilId);
      await updateDoc(perfilRef, {
        exibirPerfil: true,
      });
      message.success('Perfil aprovado com sucesso!');
      carregarPerfis(); // Recarrega a lista
    } catch (error) {
      message.error('Erro ao aprovar perfil: ' + error.message);
    }
  };

  const reprovarPerfil = async (perfilId) => {
    Modal.confirm({
      title: 'Reprovar Perfil',
      content: 'Tem certeza que deseja reprovar este perfil? Ele não será exibido na pesquisa.',
      okText: 'Sim, reprovar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const perfilRef = doc(database, 'medicos2', perfilId);
          await updateDoc(perfilRef, {
            exibirPerfil: false,
          });
          message.success('Perfil reprovado com sucesso!');
          carregarPerfis(); // Recarrega a lista
        } catch (error) {
          message.error('Erro ao reprovar perfil: ' + error.message);
        }
      },
    });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => {
      // Se clicar na mesma coluna, alterna a direção
      if (prevConfig.key === key) {
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null }; // Remove ordenação
        }
      }
      // Se clicar em coluna diferente, começa com asc
      return { key, direction: 'asc' };
    });
  };

  const SortButton = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    const isAsc = sortConfig.direction === 'asc';
    const isDesc = sortConfig.direction === 'desc';

    return (
      <Button
        type="text"
        size="small"
        icon={
          isActive && isAsc ? (
            <ArrowUpOutlined style={{ color: '#1890ff' }} />
          ) : isActive && isDesc ? (
            <ArrowDownOutlined style={{ color: '#1890ff' }} />
          ) : (
            <Space direction="vertical" size={0} style={{ fontSize: '10px' }}>
              <ArrowUpOutlined style={{ color: '#d9d9d9' }} />
              <ArrowDownOutlined style={{ color: '#d9d9d9' }} />
            </Space>
          )
        }
        onClick={() => handleSort(columnKey)}
        style={{ 
          padding: '0 4px',
          height: 'auto',
          lineHeight: 1
        }}
      />
    );
  };

  const aprovarTodosPendentes = async () => {
    Modal.confirm({
      title: 'Aprovar Todos os Perfis Pendentes',
      content: `Tem certeza que deseja aprovar todos os ${perfis.filter(p => !p.exibirPerfil).length} perfis pendentes?`,
      okText: 'Sim, aprovar todos',
      cancelText: 'Cancelar',
      onOk: async () => {
        setLoading(true);
        try {
          const perfisPendentes = perfis.filter(p => !p.exibirPerfil);
          const promises = perfisPendentes.map(perfil => {
            const perfilRef = doc(database, 'medicos2', perfil.id);
            return updateDoc(perfilRef, { exibirPerfil: true });
          });
          
          await Promise.all(promises);
          message.success(`${perfisPendentes.length} perfis aprovados com sucesso!`);
          carregarPerfis();
        } catch (error) {
          message.error('Erro ao aprovar perfis: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: (
        <Space>
          Nome
          <SortButton columnKey="nome" />
        </Space>
      ),
      dataIndex: 'nome',
      key: 'nome',
      width: 200,
      render: (text, record) => (
        <div>
          <strong>{text || record.nomeCompleto || 'Sem nome'}</strong>
          {record.nomeCompleto && record.nomeCompleto !== text && (
            <div style={{ fontSize: '12px', color: '#666' }}>{record.nomeCompleto}</div>
          )}
        </div>
      ),
    },
    {
      title: 'CRM',
      dataIndex: 'CRM',
      key: 'CRM',
      width: 120,
      render: (crm, record) => (
        <span>
          {crm || 'N/A'} {record.UfCRM && `- ${record.UfCRM}`}
        </span>
      ),
    },
    {
      title: 'Especialidade',
      dataIndex: 'especialidade',
      key: 'especialidade',
      width: 200,
    },
    {
      title: (
        <Space>
          Ações
          <SortButton columnKey="acoes" />
        </Space>
      ),
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          {!record.exibirPerfil ? (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => aprovarPerfil(record.id)}
              size="small"
            >
              Aprovar
            </Button>
          ) : (
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => reprovarPerfil(record.id)}
              size="small"
            >
              Reprovar
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag color={record.exibirPerfil ? 'green' : 'orange'}>
          {record.exibirPerfil ? 'Aprovado' : 'Pendente'}
        </Tag>
      ),
    },
    {
      title: 'Data de Criação',
      key: 'dataCriacao',
      width: 150,
      render: (_, record) => {
        if (record.dataCriacao) {
          const date = record.dataCriacao.toDate();
          return date.toLocaleDateString('pt-BR');
        }
        return 'N/A';
      },
    },
    {
      title: 'Local',
      dataIndex: 'local',
      key: 'local',
      width: 150,
    },
  ];

  const perfisPendentes = filteredPerfis.filter(p => !p.exibirPerfil).length;
  const perfisAprovados = filteredPerfis.filter(p => p.exibirPerfil).length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Aprovar Perfis de Médicos</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Total: {filteredPerfis.length} | 
            <Tag color="orange" style={{ marginLeft: '8px' }}>Pendentes: {perfisPendentes}</Tag>
            <Tag color="green" style={{ marginLeft: '8px' }}>Aprovados: {perfisAprovados}</Tag>
          </p>
        </div>
        {perfisPendentes > 0 && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={aprovarTodosPendentes}
            loading={loading}
          >
            Aprovar Todos Pendentes
          </Button>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Search
          placeholder="Buscar por nome, CRM, especialidade..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          style={{ maxWidth: '500px' }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredPerfis}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total de ${total} perfis`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default AprovarPerfis;

