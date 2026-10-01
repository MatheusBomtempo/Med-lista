import React from 'react';
import { Card, Typography, Row, Col, Space, Button } from 'antd';
import { 
  MailOutlined, 
  ClockCircleOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Navbar1 from '../../componentes/Navbar/Navbar1';
import Footer from '../../componentes/Footer/Footer';
import { Link } from 'react-router-dom';
import './Suporte.css';

const { Title, Paragraph } = Typography;

const Suporte = () => {

  return (
    <div className="suporte-container">
      <nav>
        <Navbar1 />
      </nav>

      {/* Seção Hero */}
      <section className="suporte-hero">
        <div className="suporte-hero-content">
          <div className="suporte-icon-container-large">
            <QuestionCircleOutlined className="suporte-icon-large" />
          </div>
          <Title level={1} className="suporte-title">
            Central de Suporte
          </Title>
          <Paragraph className="suporte-subtitle">
            Estamos aqui para ajudar você com qualquer intercorrência no cadastro
          </Paragraph>
        </div>
      </section>

      {/* Seção Principal */}
      <section className="suporte-section">
        <div className="container-suporte">
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} md={16}>
              <Card
                className="suporte-card"
                bordered={false}
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
                  background: 'linear-gradient(135deg, #F1F6F8 0%, #ffffff 100%)'
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="suporte-icon-container">
                    <MailOutlined className="suporte-icon" />
                  </div>
                  <Title level={2} style={{ color: '#014A49', textAlign: 'center' }}>
                    Entre em Contato
                  </Title>
                  <Paragraph style={{ fontSize: '18px', textAlign: 'center', color: '#333', lineHeight: '1.8' }}>
                    Para qualquer intercorrência no cadastro, envie um email para:
                  </Paragraph>
                  <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <a 
                      href="mailto:mfbomt@gmail.com" 
                      style={{ 
                        fontSize: '20px', 
                        color: '#014A49', 
                        fontWeight: 'bold',
                        textDecoration: 'none'
                      }}
                    >
                      mfbomt@gmail.com
                    </a>
                  </div>
                  <Paragraph style={{ fontSize: '16px', textAlign: 'center', color: '#333', lineHeight: '1.8' }}>
                    Nossa equipe responderá em poucas horas.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Seção Informações Importantes */}
      <section className="suporte-section suporte-section-alt">
        <div className="container-suporte">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                className="suporte-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)'
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="suporte-icon-container">
                    <ClockCircleOutlined className="suporte-icon" />
                  </div>
                  <Title level={3} style={{ color: '#014A49', textAlign: 'center' }}>
                    Tempo de Resposta
                  </Title>
                  <Paragraph style={{ fontSize: '16px', textAlign: 'center', color: '#333' }}>
                    Respondemos todos os emails em poucas horas. Seu problema será resolvido rapidamente!
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                className="suporte-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)'
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="suporte-icon-container">
                    <ExclamationCircleOutlined className="suporte-icon" />
                  </div>
                  <Title level={3} style={{ color: '#014A49', textAlign: 'center' }}>
                    Problemas no Cadastro?
                  </Title>
                  <Paragraph style={{ fontSize: '16px', textAlign: 'center', color: '#333' }}>
                    Envie um email detalhando sua situação e nossa equipe irá ajudá-lo imediatamente.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Seção Aviso Beta */}
      <section className="suporte-section">
        <div className="container-suporte">
          <Card
            className="suporte-card"
            bordered={false}
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
              background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
              border: '2px solid #ffc107'
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
              <Title level={3} style={{ color: '#856404', marginBottom: '10px' }}>
                ⚠️ Aplicativo em Beta
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#856404', lineHeight: '1.8', margin: 0 }}>
                O MedLista está em fase beta. Por isso, é <strong>muito importante</strong> que você nos envie um email 
                caso encontre qualquer problema ou intercorrência durante o cadastro. Sua ajuda é essencial para 
                melhorarmos a plataforma!
              </Paragraph>
            </Space>
          </Card>
        </div>
      </section>

      {/* Botão de Voltar */}
      <section className="suporte-section">
        <div className="container-suporte" style={{ textAlign: 'center' }}>
          <Link to="/">
            <Button 
              type="primary" 
              size="large"
              className='btn33'
            >
              Voltar para Home
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Suporte;

