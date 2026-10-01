import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { 
  MailOutlined, 
  GlobalOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import miniaureola from '../../imgs/miniAureolaLogo.svg';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AntFooter className="footer-custom">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          {/* Logo e Descrição */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-brand">
              <div className="footer-logo-container">
                <img src={miniaureola} alt="Logo MEDLISTA" className="footer-logo" />
                <Title level={4} className="footer-title">
                  <span className="med">MED</span>
                  <span className="lista">LISTA</span>
                </Title>
              </div>
              <Text className="footer-description">
                Plataforma gratuita para encontrar médicos confiáveis e verificados.
                Transparência e segurança na busca pela saúde ideal.
              </Text>
            </div>
          </Col>

          {/* Links Rápidos */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-section">
              <Title level={5} className="footer-section-title">Links Rápidos</Title>
              <Space direction="vertical" size="small" className="footer-links">
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/')}
                >
                  Início
                </Link>
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/sobre')}
                >
                  Sobre
                </Link>
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/pesquisa')}
                >
                  Pesquisar Médicos
                </Link>
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/cadastro')}
                >
                  Cadastrar-se
                </Link>
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/login')}
                >
                  Entrar
                </Link>
              </Space>
            </div>
          </Col>

          {/* Especialidades */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-section">
              <Title level={5} className="footer-section-title">Especialidades</Title>
              <Space direction="vertical" size="small" className="footer-links">
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/pesquisa?q=Oftalmologia')}
                >
                  Oftalmologia
                </Link>
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/pesquisa?q=Cardiologia')}
                >
                  Cardiologia
                </Link>
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/pesquisa?q=Otorrinolaringologia')}
                >
                  Otorrinolaringologia
                </Link>
                <Link 
                  className="footer-link" 
                  onClick={() => handleNavigation('/pesquisa')}
                >
                  Ver Todas
                </Link>
              </Space>
            </div>
          </Col>

          {/* Contato */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-section">
              <Title level={5} className="footer-section-title">Contato</Title>
              <Space direction="vertical" size="middle" className="footer-contact">
                <div className="footer-contact-item">
                  <MailOutlined className="footer-icon" />
                  <Text className="footer-contact-text">
                    mfbomt@gmail.com
                  </Text>
                </div>
                <div className="footer-contact-item">
                  <GlobalOutlined className="footer-icon" />
                  <Text className="footer-contact-text">
                    Barbacena - MG
                  </Text>
                </div>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Divisor */}
        <div className="footer-divider"></div>

        {/* Copyright e Informações */}
        <Row justify="space-between" align="middle" className="footer-bottom">
          <Col xs={24} sm={12}>
            <Text className="footer-copyright">
              © {new Date().getFullYear()} MEDLISTA. Todos os direitos reservados.
            </Text>
          </Col>
          <Col xs={24} sm={12} className="footer-credits">
            <Text className="footer-credit-text">
              Desenvolvido  por{' '}
              <strong>Matheus Bomtempo</strong>
            </Text>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;

