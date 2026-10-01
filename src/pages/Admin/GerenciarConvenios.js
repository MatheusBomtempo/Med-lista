import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, message, Space, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database } from '../../firebase';

const { Title } = Typography;

const GerenciarConvenios = () => {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [novoConvenio, setNovoConvenio] = useState('');
  const [saving, setSaving] = useState(false);

  const conveniosDocRef = doc(database, 'listas', 'convenios');

  useEffect(() => {
    carregarConvenios();
  }, []);

  const carregarConvenios = async () => {
    try {
      setLoading(true);
      const conveniosDoc = await getDoc(conveniosDocRef);

      if (conveniosDoc.exists()) {
        const data = conveniosDoc.data();
        setConvenios(data.nome || []);
      } else {
        setConvenios([]);
      }
    } catch (error) {
      console.error('Erro ao carregar convênios:', error);
      message.error('Erro ao carregar convênios');
    } finally {
      setLoading(false);
    }
  };

  const salvarConvenios = async (novosConvenios) => {
    try {
      setSaving(true);
      await setDoc(conveniosDocRef, {
        nome: novosConvenios
      }, { merge: true });
      
      setConvenios(novosConvenios);
      message.success('Convênios salvos com sucesso!');
      setIsModalVisible(false);
      setNovoConvenio('');
      setEditingIndex(null);
    } catch (error) {
      console.error('Erro ao salvar convênios:', error);
      message.error('Erro ao salvar convênios');
    } finally {
      setSaving(false);
    }
  };

  const handleAdicionar = () => {
    setEditingIndex(null);
    setNovoConvenio('');
    setIsModalVisible(true);
  };

  const handleEditar = (index) => {
    setEditingIndex(index);
    setNovoConvenio(convenios[index]);
    setIsModalVisible(true);
  };

  const handleExcluir = (index) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: `Tem certeza que deseja excluir "${convenios[index]}"?`,
      okText: 'Excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        const novosConvenios = convenios.filter((_, i) => i !== index);
        salvarConvenios(novosConvenios);
      },
    });
  };

  const handleSalvar = () => {
    if (!novoConvenio.trim()) {
      message.warning('Por favor, insira um nome de convênio');
      return;
    }

    const convenioNormalizado = novoConvenio.trim();
    
    if (editingIndex !== null) {
      // Editar
      const novosConvenios = [...convenios];
      novosConvenios[editingIndex] = convenioNormalizado;
      salvarConvenios(novosConvenios);
    } else {
      // Adicionar
      if (convenios.includes(convenioNormalizado)) {
        message.warning('Este convênio já existe');
        return;
      }
      const novosConvenios = [...convenios, convenioNormalizado];
      salvarConvenios(novosConvenios);
    }
  };

  const columns = [
    {
      title: 'Nome do Convênio',
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

  const dataSource = convenios.map((convenio, index) => ({
    key: index,
    index,
    nome: convenio,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Gerenciar Convênios</Title>

      <Card style={{ marginTop: '20px' }}>
        <Space style={{ marginBottom: '16px', width: '100%', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdicionar}
            size="large"
          >
            Adicionar Convênio
          </Button>
          <div>
            <strong>Total de convênios: {convenios.length}</strong>
          </div>
        </Space>

        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: 'Nenhum convênio cadastrado',
          }}
        />
      </Card>

      <Modal
        title={editingIndex !== null ? 'Editar Convênio' : 'Adicionar Convênio'}
        open={isModalVisible}
        onOk={handleSalvar}
        onCancel={() => {
          setIsModalVisible(false);
          setNovoConvenio('');
          setEditingIndex(null);
        }}
        confirmLoading={saving}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nome do convênio"
          value={novoConvenio}
          onChange={(e) => setNovoConvenio(e.target.value)}
          onPressEnter={handleSalvar}
          autoFocus
          style={{ marginTop: '16px' }}
        />
      </Modal>
    </div>
  );
};

export default GerenciarConvenios;

