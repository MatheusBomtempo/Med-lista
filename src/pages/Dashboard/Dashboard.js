import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';
import { Layout, Menu, Breadcrumb, theme, Alert, Modal } from 'antd';
import { AlertFilled, UserOutlined, BarChartOutlined } from '@ant-design/icons';
import Navbar1 from '../../componentes/Navbar/Navbar1';
import './Dashboard.css';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import {
  getStorage,
  ref,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { auth, database } from '../../firebase.js';

import EditarFoto from '../CadastroMed/EditarFoto.js';
import EdicaoMed from '../CadastroMed/EdicaoMed.js';
import CadastroMed from '../CadastroMed/CadastroMed.js';
import Comments from '../../componentes/comments/Comments.js';
import PerfilMed from '../PerfilMed/PerfilMed.js';
import EstatisticasMedico from './EstatisticasMedico.js';
import Loader from '../../componentes/Loader/Loader.js';

const { Content, Sider } = Layout;
const DashboardMedico = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [userHasProfile, setUserHasProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeComponent, setActiveComponent] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 990);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 990);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && user.uid) {
        try {
          const docSnap = await getDoc(doc(database, 'medicos2', user.uid));
          setUserHasProfile(docSnap.exists());
        } catch (error) {
          console.error('Erro ao verificar perfil:', error);
          setUserHasProfile(false);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false);
      }
    };
    checkUserProfile();
  }, [user]);

  // Verifica o perfil novamente quando o activeComponent muda (ex: após criar perfil)
  useEffect(() => {
    if (!activeComponent && user && user.uid) {
      const checkUserProfile = async () => {
        try {
          const docSnap = await getDoc(doc(database, 'medicos2', user.uid));
          setUserHasProfile(docSnap.exists());
        } catch (error) {
          console.error('Erro ao verificar perfil:', error);
        }
      };
      checkUserProfile();
    }
  }, [activeComponent, user]);

  const storage = getStorage();
  const removeUserProfile = async () => {
    if (!user || !user.uid) {
      return;
    }
    try {
      const imageRef = ref(storage, `images/${user.uid}`);
      let imageExists = false;

      try {
        await getDownloadURL(imageRef);
        imageExists = true;
      } catch (e) {
        if (e.code !== 'storage/object-not-found') {
          throw e;
        }
      }

      if (imageExists) {
        await deleteObject(imageRef);
      }

      await deleteDoc(doc(database, 'medicos2', user.uid));
      <Alert message="Perfil removido com sucesso." type="success" />;
    } catch (e) {
      <Alert message="Erro ao remover perfil." type="error" />;
    }
  };

  const sidebarOptions = [
    {
      key: 'Perfil',
      icon: <UserOutlined />,
      label: 'Perfil',
      children: [
        {
          key: 10,
          label: (
            <button
              style={{ width: '100%', display: 'flex' }}
              onClick={() =>
                setActiveComponent(
                  userHasProfile ? 'EditProfile' : 'CreateProfile'
                )
              }
            >
              {userHasProfile ? 'Editar Perfil' : 'Criar Perfil'}
            </button>
          ),
        },
        {
          key: 11,
          label: (
            <button
              style={{ width: '100%', display: 'flex' }}
              onClick={() => setActiveComponent('EditPhoto')}
            >
              Editar Foto
            </button>
          ),
        },
        {
          key: 12,
          label: (
            <button
              style={{ width: '100%', display: 'flex' }}
              onClick={() => setActiveComponent('Comments')}
            >
              Avaliações
            </button>
          ),
        },
      ],
    },
    {
      key: 'Estatisticas',
      icon: <BarChartOutlined />,
      label: 'Estatísticas',
      children: [
        {
          key: 20,
          label: (
            <button
              style={{ width: '100%', display: 'flex' }}
              onClick={() => setActiveComponent('Estatisticas')}
            >
              Ver Estatísticas
            </button>
          ),
        },
      ],
    },
    {
      key: 'configuracoes',
      icon: <AlertFilled />,
      label: 'Configurações',
      children: [
        {
          key: 30,
          label: (
            <button
              onClick={(e) => {
                e.preventDefault();
                Modal.confirm({
                  title: 'Tem certeza que deseja remover seu perfil?',
                  content: 'Esta ação é permanente e não poderá ser desfeita.',
                  okText: 'Sim',
                  cancelText: 'Não',
                  onOk: removeUserProfile,
                });
              }}
              style={{
                width: '100%',
                display: 'flex',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              Remover perfil
            </button>
          ),
        },
      ],
    },
  ];

  return (
    <Layout style={{ marginTop: '75px' }}>
      <Navbar1 />
      <Layout>
        <Sider
          width={200}
          style={{ background: theme.colorBgContainer }}
          collapsible
          collapsed={isMobile}
          onCollapse={(collapsed) => setIsMobile(collapsed)}
          breakpoint="lg"
          onBreakpoint={(broken) => setIsMobile(broken)}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            // Modifique esta linha para controlar a abertura dos menus com base no estado isMobile
            defaultOpenKeys={
              isMobile ? [] : sidebarOptions.map((option) => option.key)
            }
            style={{ height: '100vh', borderRight: 0 }}
          >
            {sidebarOptions.map((item) => (
              <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>{child.label}</Menu.Item>
                ))}
              </Menu.SubMenu>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Início</Breadcrumb.Item>
            <Breadcrumb.Item>Área do Médico</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 0,
              margin: 0,
              minHeight: 280,
              background: theme.colorBgContainer,
            }}
          >
            <div className="container">
              {user && user.uid && (
                <>
                  {loadingProfile ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                      <Loader />
                    </div>
                  ) : (
                    <>
                      {!activeComponent && !userHasProfile && (
                        <div className="no-profile-card">
                          <div className="no-profile-content">
                            <div className="no-profile-icon">
                              <UserOutlined style={{ fontSize: '64px', color: '#014A49' }} />
                            </div>
                            <h2 className="no-profile-title">Perfil não encontrado</h2>
                            <p className="no-profile-message">
                              Você ainda não possui um perfil criado. Para prosseguir, selecione uma das opções no menu ao lado.
                            </p>
                            <p className="no-profile-hint">
                              Recomendamos começar criando seu perfil através da opção <strong>"Criar Perfil"</strong> no menu.
                            </p>
                          </div>
                        </div>
                      )}
                      {!activeComponent && userHasProfile && <PerfilMed userId={user.uid} />}
                      {activeComponent === 'Comments' && <Comments />}
                      {activeComponent === 'EditProfile' && (
                        <EdicaoMed userId={user.uid} />
                      )}
                      {activeComponent === 'CreateProfile' && (
                        <CadastroMed userId={user.uid} />
                      )}
                      {activeComponent === 'EditPhoto' && (
                        <EditarFoto userId={user.uid} />
                      )}
                      {activeComponent === 'Estatisticas' && (
                        <EstatisticasMedico />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardMedico;
