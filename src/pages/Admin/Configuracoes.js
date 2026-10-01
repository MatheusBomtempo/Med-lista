import React, { useState, useEffect } from 'react';
import { Switch, Card, message, Typography, Space, Alert } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database } from '../../firebase';

const { Title, Text } = Typography;

const Configuracoes = () => {
  const [validacaoCRMAtiva, setValidacaoCRMAtiva] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Referência ao documento de configurações no Firestore
  const configDocRef = doc(database, 'configuracoes', 'sistema');

  // Carregar configuração atual
  useEffect(() => {
    const carregarConfiguracao = async () => {
      try {
        const configDoc = await getDoc(configDocRef);
        
        if (configDoc.exists()) {
          const data = configDoc.data();
          setValidacaoCRMAtiva(data.validacaoCRMAtiva !== false); // Default true se não existir
        } else {
          // Se não existir, criar com valor padrão (true)
          await setDoc(configDocRef, {
            validacaoCRMAtiva: true,
            atualizadoEm: new Date(),
          });
          setValidacaoCRMAtiva(true);
        }
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
        message.error('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    carregarConfiguracao();
  }, []);

  // Função para alterar o estado da validação de CRM
  const handleToggleValidacaoCRM = async (checked) => {
    // Agora a lógica é direta: checked=true = validação ativa, checked=false = validação desativada
    setSaving(true);
    try {
      await setDoc(
        configDocRef,
        {
          validacaoCRMAtiva: checked,
          atualizadoEm: new Date(),
        },
        { merge: true }
      );

      setValidacaoCRMAtiva(checked);
      message.success(
        checked
          ? 'Validação de CRM ativada com sucesso!'
          : 'Validação de CRM desativada com sucesso!'
      );
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      message.error('Erro ao salvar configuração. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>
        <SettingOutlined /> Configurações do Sistema
      </Title>

      <Card
        title="Validação de CRM"
        style={{ marginTop: '20px', maxWidth: '800px' }}
        loading={loading}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>
              Desligar validação de CRM de usuários
            </Text>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Quando desativado, os usuários poderão cadastrar perfis médicos sem
              validar o CRM através da API Infosimples.
            </Text>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            border: '2px solid #d9d9d9',
            gap: '20px'
          }}>
            <Switch
              checked={validacaoCRMAtiva}
              onChange={handleToggleValidacaoCRM}
              loading={saving}
              size="large"
              style={{ 
                minWidth: '60px',
                height: '32px'
              }}
            />
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: '16px', display: 'block' }}>
                {validacaoCRMAtiva
                  ? 'Validação de CRM: ATIVADA'
                  : 'Validação de CRM: DESATIVADA'}
              </Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                {validacaoCRMAtiva
                  ? 'Os usuários precisam validar o CRM antes de cadastrar'
                  : 'Os usuários podem cadastrar sem validar o CRM'}
              </Text>
            </div>
          </div>

          {!validacaoCRMAtiva && (
            <Alert
              message="Validação de CRM Desativada"
              description="Os usuários podem cadastrar perfis médicos sem validar o CRM. Esta configuração afeta todos os novos cadastros."
              type="warning"
              showIcon
            />
          )}

          {validacaoCRMAtiva && (
            <Alert
              message="Validação de CRM Ativada"
              description="Todos os usuários precisarão validar o CRM através da API Infosimples antes de criar um perfil médico."
              type="info"
              showIcon
            />
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Configuracoes;


