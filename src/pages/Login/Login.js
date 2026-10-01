import "./Login.css";

import Navbar from "../../componentes/Navbar/Navbar1";

import { Container } from "react-bootstrap";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";


// import { PlusOutlined } from "@ant-design/icons";
// import { Button, Form, Input } from "antd";
// import { Container, Row, Col } from "react-bootstrap";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { UserAuth } from "../../contexts/contextsAuth/AuthContext";

function Login(props) {
  const navigate = useNavigate();
  // const { signIn, googleSignIn, facebookSignIn, user } = UserAuth();
  const { signIn, user } = UserAuth();

  const key = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6Lfo6okpAAAAAEe3FiJzfEPpmmJOQULB0r82ftfk";
  

  function onChange() {
    console.log("captcha validado");
    setCaptchaIsDone(true);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaIsDone, setCaptchaIsDone] = useState("");
  const [error, setError] = useState("");

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!captchaIsDone) {
      Modal.error({
        title: "Erro ao validar o captcha",
        content: "Verifique o captcha.",
        onOk: () => {},
      });
    } else {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      // navigate(`/dashboard/${user.uid}`);
    } catch (e) {
      console.log(e);
      Modal.error({
        title: "Erro!",
        content: (
          <div
            dangerouslySetInnerHTML={{
              __html: `Ocorreu um erro crítico. você poderá continuar a usar o sistema, mas algumas funcionalidades podem não estar disponíveis. Entre em contato com o Desenvolvedor <a target='_blank' href='https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || '5532985076447'}'>clicando aqui</a>.`,
            }}
          />
        ),
        onOk: () => {},
      });
    }
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await googleSignIn();
  //   } catch (error) {
  //     Modal.error({
  //       title: "Erro!",
  //       content: error,
  //       onOk: () => {},
  //     });
  //   }
  // };

  // const handleFacebookSignIn = async () => {
  //   try {
  //     await facebookSignIn();
  //   } catch (error) {
  //     Modal.error({
  //       title: "Erro!",
  //       content: error,
  //       onOk: () => {},
  //     });
  //   }
  // };
  // console.log(user);

  useEffect(() => {
    if (user != null) {
      // Verifica se o usuário é admin
      const checkAdminAndRedirect = async () => {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { database } = await import('../../firebase');
          const userRef = doc(database, "users", user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Se tiver role === 'admin', redireciona para /admin
            if (userData.role === 'admin') {
              navigate(`/admin/${user.uid}`);
            } else {
              // Caso contrário, redireciona para dashboard normal
              navigate(`/dashboard/${user.uid}`);
            }
          } else {
            // Se não existe documento, é usuário padrão
            navigate(`/dashboard/${user.uid}`);
          }
        } catch (error) {
          console.error('Erro ao verificar role:', error);
          // Em caso de erro, redireciona para dashboard padrão
          navigate(`/dashboard/${user.uid}`);
        }
      };
      
      checkAdminAndRedirect();
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar></Navbar>

      <div className="container  ">
        <div className="containe flex items-center justify-center ">
          <div className="innerCont bg-fundo1	p-20 rounded-2xl shadow-lg">
            <h1 className="titulo text-center pb-2 text-verde">Entrar</h1>
            {/* <h2>{user.email}</h2>
                  <h2>{localStorage.getItem("nome")}</h2>
                  <img src={localStorage.getItem("fotoPerfil")}></img>*/}
            <div className="separador">
              <div className="left">
                <form className="caixa" onSubmit={handleSubmit}>
                  <Input
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={props.placeholderemail}
                    className="inputt"
                    prefix={
                      <FontAwesomeIcon
                        id="icons"
                        className="site-form-item-icon"
                        icon={faEnvelope}
                      />
                    }
                    suffix={
                      <Tooltip title="Insira seu email">
                        <InfoCircleOutlined
                          style={{
                            color: "rgba(0,0,0,.45)",
                          }}
                        />
                      </Tooltip>
                    }
                  />

                  <Input.Password
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={props.placeholderpass}
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
                    className="inputt"
                    prefix={
                      <FontAwesomeIcon
                        id="icons"
                        className="site-form-item-icon"
                        icon={faLock}
                      />
                    }
                    suffix={
                      <Tooltip title="Insira sua senha">
                        <InfoCircleOutlined
                          style={{
                            color: "rgba(0,0,0,.45)",
                          }}
                        />
                      </Tooltip>
                    }
                  />

                  <Link to="/redefinirSenha">
                    <p className="redsenha">Esqueceu a senha?</p>
                  </Link>

                  <div className="captcha">
                    <ReCAPTCHA
                      sitekey={key}
                      onChange={(value) => {
                        setCaptchaIsDone(value);
                      }}
                    />
                  </div>

                  <div
                    className="divbtn"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    <button type="submit">
                      {isLoading ? (
                        <div className="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        "Logar"
                      )}
                    </button>
                  </div>

                  <div className="pergunta">
                    <Link to="/cadastro">
                      <p className="p-0 ">
                        Não possui <span>login?</span>
                      </p>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="right">
                {/* <button
                  type="button"
                  className="login-with-google-btn"
                  onClick={handleGoogleSignIn}
                >
                  Entrar com Google
                </button> */}

                {/* <button
                  type="button"
                  className="login-with-google-btn"
                  id="face"
                  onClick={handleFacebookSignIn}
                >
                  Entrar com Facebook
                </button> */}

                {/* <button type="button" className="login-with-google-btn" disabled>
                              Sign in with Google
                              </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container fluid>
        <Navbar></Navbar>
      </Container>
    </>
  );
}

export default Login;
