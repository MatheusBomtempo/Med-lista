import React from 'react';
import { Card, Typography, Row, Col, Space } from 'antd';
import { 
  SafetyOutlined, 
  HeartOutlined, 
  TeamOutlined, 
  CheckCircleOutlined,
  GlobalOutlined,
  RocketOutlined
} from '@ant-design/icons';
import Navbar1 from '../../componentes/Navbar/Navbar1';
import Footer from '../../componentes/Footer/Footer';
import miniaureola from '../../imgs/miniAureolaLogo.svg';
import './Sobre.css';

const { Title, Paragraph } = Typography;

const Sobre = () => {

  return (
    <div className="sobre-container">
      <nav>
        <Navbar1 />
      </nav>

      {/* Seção Hero */}
      <section className="sobre-hero">
        <div className="sobre-hero-content">
          <div className="sobre-logo-container">
            <img src={miniaureola} alt="Logo MEDLISTA" className="sobre-logo" />
            <Title level={1} className="sobre-title">
              <span className="med">MED</span>
              <span className="lista">LISTA</span>
            </Title>
          </div>
          <Paragraph className="sobre-subtitle">
            Transparência, segurança e confiança na busca pelo médico ideal
          </Paragraph>
        </div>
      </section>

      {/* Seção Missão e Visão */}
      <section className="sobre-section">
        <div className="container-sobre">
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} md={12}>
              <Card
                className="sobre-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)'
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="sobre-icon-container">
                    <SafetyOutlined className="sobre-icon" />
                  </div>
                  <Title level={2} style={{ color: '#014A49', textAlign: 'center' }}>
                    Nossa Missão
                  </Title>
                  <Paragraph style={{ fontSize: '16px', textAlign: 'center', color: '#333' }}>
                    Oferecer uma plataforma gratuita e confiável que conecta pacientes a médicos 
                    verificados, garantindo transparência total nas informações e facilitando o 
                    acesso à saúde de qualidade.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                className="sobre-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)'
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="sobre-icon-container">
                    <RocketOutlined className="sobre-icon" />
                  </div>
                  <Title level={2} style={{ color: '#014A49', textAlign: 'center' }}>
                    Nossa Visão
                  </Title>
                  <Paragraph style={{ fontSize: '16px', textAlign: 'center', color: '#333' }}>
                    Ser referência em transparência e veracidade de dados médicos, expandindo 
                    nosso alcance para ajudar cada vez mais pessoas a encontrarem profissionais 
                    de saúde confiáveis e compatíveis com seus convênios.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Seção Nossa História */}
      <section className="sobre-section sobre-section-alt">
        <div className="container-sobre">
          <Card
            className="sobre-card"
            bordered={false}
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
              background: 'linear-gradient(135deg, #F1F6F8 0%, #ffffff 100%)'
            }}
          >
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={8} style={{ textAlign: 'center' }}>
                <div className="sobre-icon-container-large">
                  <HeartOutlined className="sobre-icon-large" />
                </div>
              </Col>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Title level={2} style={{ color: '#014A49' }}>
                    Nossa História
                  </Title>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                    O <strong>MEDLISTA</strong> nasceu como um projeto de Trabalho de Conclusão 
                    de Curso (TCC) desenvolvido por <strong>Matheus Bomtempo</strong>, estudante 
                    de Ciência da Computação na <strong>UNIPAC</strong>.
                  </Paragraph>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                    Movido pela necessidade de criar uma solução que priorize a <strong>veracidade 
                    e segurança dos dados médicos</strong>, o projeto foi desenvolvido com o objetivo 
                    de oferecer uma alternativa gratuita e eficiente para pesquisar médicos confiáveis, 
                    onde todos os perfis são <strong>validados manualmente</strong>, sem dados 
                    preenchidos automaticamente.
                  </Paragraph>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                    Acreditamos que a saúde é um direito de todos e que encontrar o médico certo 
                    não deveria ser um desafio. Por isso, criamos um ecossistema que valoriza a 
                    <strong> transparência</strong> e a <strong>confiança</strong> acima de tudo.
                  </Paragraph>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section className="sobre-section">
        <div className="container-sobre">
          <Title level={2} className="sobre-section-title">
            Como Funciona
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="sobre-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
                  textAlign: 'center'
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div className="sobre-icon-container">
                    <CheckCircleOutlined className="sobre-icon" />
                  </div>
                  <Title level={4} style={{ color: '#014A49' }}>
                    Perfis Validados
                  </Title>
                  <Paragraph style={{ fontSize: '14px', color: '#666' }}>
                    Todos os médicos passam por validação manual rigorosa
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="sobre-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
                  textAlign: 'center'
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div className="sobre-icon-container">
                    <TeamOutlined className="sobre-icon" />
                  </div>
                  <Title level={4} style={{ color: '#014A49' }}>
                    Dados Completos
                  </Title>
                  <Paragraph style={{ fontSize: '14px', color: '#666' }}>
                    Informações detalhadas sobre especialidades e convênios
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="sobre-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
                  textAlign: 'center'
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div className="sobre-icon-container">
                    <SafetyOutlined className="sobre-icon" />
                  </div>
                  <Title level={4} style={{ color: '#014A49' }}>
                    100% Gratuito
                  </Title>
                  <Paragraph style={{ fontSize: '14px', color: '#666' }}>
                    Acesso livre a todas as funcionalidades da plataforma
                  </Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="sobre-card"
                hoverable
                bordered={false}
                style={{
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
                  textAlign: 'center'
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div className="sobre-icon-container">
                    <HeartOutlined className="sobre-icon" />
                  </div>
                  <Title level={4} style={{ color: '#014A49' }}>
                    Confiança
                  </Title>
                  <Paragraph style={{ fontSize: '14px', color: '#666' }}>
                    Transparência total nas informações apresentadas
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Seção Onde Atuamos */}
      <section className="sobre-section sobre-section-alt">
        <div className="container-sobre">
          <Card
            className="sobre-card fade-in"
            bordered={false}
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(1, 74, 73, 0.1)',
              background: 'linear-gradient(135deg, #ffffff 0%, #F1F6F8 100%)'
            }}
          >
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Title level={2} style={{ color: '#014A49' }}>
                    Onde Atuamos
                  </Title>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                    Atualmente, o <strong>MEDLISTA</strong> está focado em atender a região de 
                    <strong> Barbacena (MG)</strong>, oferecendo uma base completa de médicos 
                    verificados e confiáveis para a comunidade local.
                  </Paragraph>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                    Nosso objetivo é expandir gradualmente para outras cidades, sempre mantendo 
                    o mesmo padrão de qualidade e validação manual que garante a confiabilidade 
                    dos dados apresentados.
                  </Paragraph>
                </Space>
              </Col>
              <Col xs={24} lg={8} style={{ textAlign: 'center' }}>
                <div className="sobre-icon-container-large">
                  <GlobalOutlined className="sobre-icon-large" />
                </div>
                <Title level={3} style={{ color: '#014A49', marginTop: '16px' }}>
                  Barbacena - MG
                </Title>
              </Col>
            </Row>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;

