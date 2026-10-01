import "./ResetSenha.css";
import Navbar from "../../componentes/Navbar/Navbar1";
import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Input, Tooltip} from "antd";
import { UserAuth } from "../../contexts/contextsAuth/AuthContext";

function ResetSenha(props) {
  const navigate = useNavigate();
  const { user, sendResetPasswordEmail } = UserAuth();

  const [emailAddress, setEmailAddress] = useState("");
  const [error, setError] = useState("");


  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendResetPasswordEmail(emailAddress);
      setError(`Email de redefinição de senha enviado com sucesso!`);
      setIsLoading(false);
    } catch (error) {
      setError(`Erro ao enviar email de redefinição de senha.`);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate(`/dashboard/${user.uid}`);
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />

      <div className="container h-screen ">
        <div className="containe h-screen flex items-center justify-center ">
          <div className="innerCont bg-fundo1	p-20 rounded-2xl shadow-lg">
            <h1 className="titulo text-center pb-2 text-verde">
              Redefinir Senha
            </h1>

            <div className="separador">
              <div className="left">
                <form className="caixa" onSubmit={handleSubmit}>
                  <Input
                    required
                    onChange={(e) => setEmailAddress(e.target.value)}
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
                      <Tooltip title="Insira seu email para redefinição">
                        <InfoCircleOutlined
                          style={{
                            color: "rgba(0,0,0,.45)",
                          }}
                        />
                      </Tooltip>
                    }
                  />

                  <div>
                    <p className={error ? "emailEnv" : "emailEnv hidden"}>
                      {error}
                    </p>
                    {error && error.includes("sucesso") && (
                      <p style={{ 
                        marginTop: "8px", 
                        fontSize: "14px", 
                        color: "rgba(0, 0, 0, 0.65)",
                        textAlign: "center"
                      }}>
                        Verifique seu spam, alguns emails de configuração podem ir para a caixa de spam.
                      </p>
                    )}
                  </div>

                  <div className="divbtn" disabled={isLoading}>
                    <button
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        "Enviar email"
                      )}
                    </button>
                  </div>

                  <div className="pergunta">
                    <Link to="/cadastro">
                      <p>
                        Não possui <span>login?</span>
                      </p>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container fluid>
        <Navbar />
      </Container>
    </>
  );
}

export default ResetSenha;
