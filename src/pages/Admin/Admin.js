import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/contextsAuth/AuthContext";
import { Layout, Menu, Breadcrumb, theme, Alert } from "antd";
import {UserOutlined, CheckCircleOutlined, SettingOutlined, AppstoreOutlined} from "@ant-design/icons";
import Navbar1 from "../../componentes/Navbar/Navbar1";
import AprovarPerfis from "./AprovarPerfis";
import Configuracoes from "./Configuracoes";
import GerenciarConvenios from "./GerenciarConvenios";
import GerenciarEspecialidades from "./GerenciarEspecialidades";

import {
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { signOut } from "firebase/auth";
import { auth, database } from "../../firebase.js";
// import devenceLogo from "../../imgs/devence.png";

import Comentarios from "./Comentarios.js";

const { Content, Sider } = Layout;
const Admin = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [userHasProfile, setUserHasProfile] = useState(false);

  const [activeComponent, setActiveComponent] = useState("");
  const [medicosCount, setMedicosCount] = useState(0);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && user.uid) {
        const docSnap = await getDoc(doc(database, "medicos2", user.uid));
        setUserHasProfile(docSnap.exists());
      }
    };
    checkUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchMedicos = async () => {
      const medicosSnapshot = await getDocs(collection(database, "medicos2"));
      setMedicosCount(medicosSnapshot.size);
    };

    fetchMedicos();
  }, []);

  const storage = getStorage();
  const removeUserProfile = async () => {
    try {
      const imageRef = ref(storage, `images/${user.uid}`);
      await deleteObject(imageRef);
      await deleteDoc(doc(database, "medicos2", user.uid));
      <Alert message="Perfil removido com sucesso." type="success" />;
    } catch (e) {
      <Alert message="Erro ao remover perfil." type="error" />;
    }
  };

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const medicosSnapshot = await getDocs(collection(database, "medicos2"));
      const commentsData = [];

      for (let doc of medicosSnapshot.docs) {
        const commentsSnapshot = await getDocs(
          collection(doc.ref, "comments"),
          where("mostrarComentario", "==", false)
        );

        commentsSnapshot.forEach((commentDoc) => {
          commentsData.push(commentDoc.data());
        });
      }

      setComments(commentsData);
    };

    fetchComments();
  }, []);

  const sidebarOptions = [
    {
      key: "AprovarPerfis",
      icon: <CheckCircleOutlined />,
      label: "Aprovar Perfis",
      children: [
        {
          key: 1,
          label: (
            <button
              style={{ width: '100%', display: 'flex', textAlign: 'left' }}
              onClick={() => setActiveComponent("AprovarPerfis")}
            >
              Gerenciar Aprovações
            </button>
          ),
        },
      ],
    },
    {
      key: "Comments",
      icon: <UserOutlined />,
      label: "Revisar Comentários",
      children: [
        {
          key: 12,
          label: (
            <button 
              style={{ width: '100%', display: 'flex', textAlign: 'left' }}
              onClick={() => setActiveComponent("Comments")}
            >
              Todos os Comentários
            </button>
          ),
        },
      ],
    },
    {
      key: "Listas",
      icon: <AppstoreOutlined />,
      label: "Gerenciar Listas",
      children: [
        {
          key: 14,
          label: (
            <button 
              style={{ width: '100%', display: 'flex', textAlign: 'left' }}
              onClick={() => setActiveComponent("GerenciarConvenios")}
            >
              Convênios
            </button>
          ),
        },
        {
          key: 15,
          label: (
            <button 
              style={{ width: '100%', display: 'flex', textAlign: 'left' }}
              onClick={() => setActiveComponent("GerenciarEspecialidades")}
            >
              Especialidades
            </button>
          ),
        },
      ],
    },
    {
      key: "Configuracoes",
      icon: <SettingOutlined />,
      label: "Configurações",
      children: [
        {
          key: 13,
          label: (
            <button 
              style={{ width: '100%', display: 'flex', textAlign: 'left' }}
              onClick={() => setActiveComponent("Configuracoes")}
            >
              Configurações do Sistema
            </button>
          ),
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      console.log("Você não está conectado.");
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <Layout style={{ marginTop: "75px" }}>
      <Navbar1 />
      <Layout>
        <Sider width={200} style={{ background: theme.colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={sidebarOptions.map((option) => option.key)}
            style={{ height: "100vh", borderRight: 0 }}
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
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Painel do Administrador</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: theme.colorBgContainer,
            }}
          >
            <div className="container">
              {!activeComponent && <h2>Médicos Cadastrados: {medicosCount}</h2>}

              {activeComponent === "AprovarPerfis" && (
                <AprovarPerfis />
              )}
              {activeComponent === "Comments" && (
                <Comentarios />
              )}
              {activeComponent === "GerenciarConvenios" && (
                <GerenciarConvenios />
              )}
              {activeComponent === "GerenciarEspecialidades" && (
                <GerenciarEspecialidades />
              )}
              {activeComponent === "Configuracoes" && (
                <Configuracoes />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Admin;
