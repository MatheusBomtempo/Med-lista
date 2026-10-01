import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, message, Space, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database } from '../../firebase';

const { Title } = Typography;

const GerenciarEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [novaEspecialidade, setNovaEspecialidade] = useState('');
  const [saving, setSaving] = useState(false);

  const especialidadesDocRef = doc(database, 'listas', 'especialidades');

  useEffect(() => {
    carregarEspecialidades();
  }, []);

  const carregarEspecialidades = async () => {
    try {
      setLoading(true);
      const especialidadesDoc = await getDoc(especialidadesDocRef);

      if (especialidadesDoc.exists()) {
        const data = especialidadesDoc.data();
        setEspecialidades(data.nome || []);
      } else {
        setEspecialidades([]);
      }
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error);
      message.error('Erro ao carregar especialidades');
    } finally {
      setLoading(false);
    }
  };

  const salvarEspecialidades = async (novasEspecialidades) => {
    try {
      setSaving(true);
      await setDoc(especialidadesDocRef, {
        nome: novasEspecialidades
      }, { merge: true });
      
      setEspecialidades(novasEspecialidades);
      message.success('Especialidades salvas com sucesso!');
      setIsModalVisible(false);
      setNovaEspecialidade('');
      setEditingIndex(null);
    } catch (error) {
      console.error('Erro ao salvar especialidades:', error);
      message.error('Erro ao salvar especialidades');
    } finally {
      setSaving(false);
    }
  };

  const handleAdicionar = () => {
    setEditingIndex(null);
    setNovaEspecialidade('');
    setIsModalVisible(true);
  };

  const handleEditar = (index) => {
    setEditingIndex(index);
    setNovaEspecialidade(especialidades[index]);
    setIsModalVisible(true);
  };

  const handleExcluir = (index) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: `Tem certeza que deseja excluir "${especialidades[index]}"?`,
      okText: 'Excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        const novasEspecialidades = especialidades.filter((_, i) => i !== index);
        salvarEspecialidades(novasEspecialidades);
      },
    });
  };

  const handleSalvar = () => {
    if (!novaEspecialidade.trim()) {
      message.warning('Por favor, insira um nome de especialidade');
      return;
    }

    const especialidadeNormalizada = novaEspecialidade.trim();
    
    if (editingIndex !== null) {
      // Editar
      const novasEspecialidades = [...especialidades];
      novasEspecialidades[editingIndex] = especialidadeNormalizada;
      salvarEspecialidades(novasEspecialidades);
    } else {
      // Adicionar
      if (especialidades.includes(especialidadeNormalizada)) {
        message.warning('Esta especialidade já existe');
        return;
      }
      const novasEspecialidades = [...especialidades, especialidadeNormalizada];
      salvarEspecialidades(novasEspecialidades);
    }
  };

  const columns = [
    {
      title: 'Nome da Especialidade',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditar(record.index)}
            size="small"
          >
            Editar
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleExcluir(record.index)}
            size="small"
          >
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = especialidades.map((especialidade, index) => ({
    key: index,
    index,
    nome: especialidade,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Gerenciar Especialidades</Title>

      <Card style={{ marginTop: '20px' }}>
        <Space style={{ marginBottom: '16px', width: '100%', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdicionar}
            size="large"
          >
            Adicionar Especialidade
          </Button>
          <div>
            <strong>Total de especialidades: {especialidades.length}</strong>
          </div>
        </Space>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: 'Nenhuma especialidade cadastrada',
          }}
        />
      </Card>

      <Modal
        title={editingIndex !== null ? 'Editar Especialidade' : 'Adicionar Especialidade'}
        open={isModalVisible}
        onOk={handleSalvar}
        onCancel={() => {
          setIsModalVisible(false);
          setNovaEspecialidade('');
          setEditingIndex(null);
        }}
        confirmLoading={saving}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nome da especialidade"
          value={novaEspecialidade}
          onChange={(e) => setNovaEspecialidade(e.target.value)}
          onPressEnter={handleSalvar}
          autoFocus
          style={{ marginTop: '16px' }}
        />
      </Modal>
    </div>
  );
};

export default GerenciarEspecialidades;

