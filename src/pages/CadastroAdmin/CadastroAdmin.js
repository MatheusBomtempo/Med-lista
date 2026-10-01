import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Form, message, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../../firebase';
import Navbar1 from '../../componentes/Navbar/Navbar1';
import './CadastroAdmin.css';

const { Title, Text } = Typography;

const CadastroAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { email, password, confirmPassword, username } = values;

    // Validações
    if (password !== confirmPassword) {
      message.error('As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      message.error('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setLoading(true);

    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Cria o documento no Firestore com role: 'admin'
      const userRef = doc(database, 'users', user.uid);
      await setDoc(userRef, {
        username: username || email.split('@')[0],
        email: email,
        role: 'admin',
        createdAt: new Date(),
      });

      message.success('Admin cadastrado com sucesso!');
      form.resetFields();

      // Opcional: redirecionar após sucesso
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Erro ao cadastrar admin:', error);
      
      let errorMessage = 'Erro ao cadastrar admin. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está cadastrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use uma senha mais forte.';
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar1 />
      <div style={{ 
        minHeight: 'calc(100vh - 75px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px',
        background: '#f0f2f5'
      }}>
        <Card 
          style={{ 
            width: '100%', 
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2}>Cadastrar Novo Admin</Title>
            <Text type="secondary">
              Preencha os dados abaixo para criar uma conta de administrador
            </Text>
          </div>

          <Alert
            message="Atenção"
            description="Esta página permite criar contas de administrador. Use com cuidado!"
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Form
            form={form}
            name="cadastroAdmin"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label="Nome de Usuário"
              rules={[
                { required: true, message: 'Por favor, insira o nome de usuário!' },
                { min: 3, message: 'O nome deve ter pelo menos 3 caracteres!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nome de usuário"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Por favor, insira o email!' },
                { type: 'email', message: 'Email inválido!' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="email@exemplo.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              rules={[
                { required: true, message: 'Por favor, insira a senha!' },
                { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Senha"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirmar Senha"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Por favor, confirme a senha!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('As senhas não coincidem!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirme a senha"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: '45px', fontSize: '16px' }}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Admin'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Text type="secondary">
              Já tem uma conta?{' '}
              <a href="/login">Fazer login</a>
            </Text>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CadastroAdmin;

