import React, { useState, useEffect } from "react";

import {
  getDocs,
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { database } from "../../firebase";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { useParams, useNavigate } from "react-router-dom";
import { Input, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faArrowRight,
  faArrowLeft,
  faHouse
} from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import Navbar1 from "../../componentes/Navbar/Navbar1";
import "./Avalia.css";
import DefaultUser from "../../imgs/defaulUser.jpg";
import Rating from "../../componentes/rating/Rating";

const ScreenOne = ({ onNext, setRating, rating }) => {
  const { userId } = useParams();
  const [medico, setMedico] = useState(null);
  // const [size, setSize] = useState("large");
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);

  const todosMedicos = collection(database, "medicos2");

  useEffect(() => {
    const getTodosMedicos = async () => {
      try {
        const data = await getDocs(todosMedicos);
        const medicos = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMedico(medicos.find((medico) => medico.id === userId));
      } catch (err) {
        console.error(err);
      }
    };
    getTodosMedicos();
  }, [userId]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === userId) {
      Modal.error({
        title: "Ação não permitida",
        content: "Você não pode avaliar a si mesmo.",
        onOk: () => navigate(-1),
      });
    }
  }, [userId]);

  return (
    <div>
      <div className="containerAvalia">
        <div className="tam">
          <h1>Como foi sua Experiência?</h1>
          <hr className="separadorr"></hr>
          {medico && (
            <div className="resultados1" id="resultados2">
              <div className="flexfoto">
                <div className="foto">
                  {medico && medico.image_url ? (
                    <img src={medico.image_url} alt="User" />
                  ) : (
                    <img src={DefaultUser} alt="User" />
                  )}
                </div>
                <div className="header">
                  <div className="headerinner">
                    <h4 className="especiali">{medico.especialidade}</h4>
                    <h4 className="crm">
                      CRM:{medico.CRM}-{medico.UfCRM}
                    </h4>
                  </div>
                  <h2>
                    {medico.sexo}
                    <span className="maxLetras"> {medico.nome}</span>
                  </h2>
                  <div className="estrelinhas">
                    <Rating />
                  </div>
                </div>
              </div>
              <hr className="separadorr"></hr>
            </div>
          )}
          <div className="reviewStar">
            <h1 className="tituloAtributos">Avaliação geral:</h1>
            <div className="avaliaStar">
              <div className="estrelinho">
                {[...Array(5)].map((_, index) => {
                  const ratingEstrela = index + 1;

                  return (
                    <label key={index}>
                      <input
                        name="rating"
                        type="radio"
                        value={ratingEstrela}
                        onClick={() => setRating(ratingEstrela)}
                      />

                      <FontAwesomeIcon
                        className="estrelaicon"
                        id="estrelas1"
                        icon={faStar}
                        color={
                          ratingEstrela <= (hover || rating)
                            ? "#FBC436"
                            : "#eee"
                        }
                        onMouseEnter={() => setHover(ratingEstrela)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="botaoalig">
            <button
              className="botaozinhu"
              onClick={() => {
                if (rating) {
                  onNext();
                } else {
                  Modal.error({
                    title: "Avaliação não preenchida",
                    content:
                      "Selecione uma nota (entre 1 a 5 estrelas) para prosseguir.",
                    onOk: () => {},
                  });
                }
              }}
            >
              Continuar <FontAwesomeIcon id="" icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenTwo = ({ onNext, onBack, onSaveData, rating, setRating }) => {
  const { userId } = useParams();
  const [opinion, setOpinion] = useState("");
  const [name, setName] = useState("");
  const [consultationReason, setConsultationReason] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [medico, setMedico] = useState(null);
  // const [rating, setRating] = useState(null);

  const todosMedicos = collection(database, "medicos2");

  useEffect(() => {
    const getTodosMedicos = async () => {
      try {
        const data = await getDocs(todosMedicos);
        const medicos = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMedico(medicos.find((medico) => medico.id === userId));
      } catch (err) {
        console.error(err);
      }
    };
    getTodosMedicos();
  }, [userId]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="containerAvalia" id="ScreenTwo">
      <section>
        <div className="tam ">
          <div className="tit">
            <button onClick={onBack}>
              <FontAwesomeIcon id="arrowleft" icon={faArrowLeft} />
            </button>
            <h1>Compartilhe sua experiência</h1>
          </div>
          <hr className="separadorr"></hr>
          {medico && (
            <div className="resultados1" id="resultados2">
              <div className="flexfoto">
                <div className="foto">
                  {medico && medico.image_url ? (
                    <img src={medico.image_url} alt="User" />
                  ) : (
                    <img src={DefaultUser} alt="User" />
                  )}
                </div>
                <div className="header">
                  <div className="headerinner">
                    <h4 className="especiali">{medico.especialidade}</h4>
                    <h4 className="crm">
                      CRM:{medico.CRM}-{medico.UfCRM}
                    </h4>
                  </div>
                  <h2>
                    {medico.sexo}
                    <span className="maxLetras"> {medico.nome}</span>
                  </h2>
                  <div className="estrelinhas">
                    <Rating />
                  </div>
                </div>
              </div>
              <hr className="separadorr"></hr>
            </div>
          )}
          <div className="reviewStar">
            <div className="perguntas">
              <h1 className="tituloAtributos">Escreva sua opinião:</h1>
              <TextArea
                placeholder="Expresse sua opinião sobre o médico aqui"
                size="large"
                required
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
              />
            </div>
            <div className="perguntas">
              <h1 className="tituloAtributos">Escreva seu nome:</h1>
              <Input
                placeholder="Seu nome completo"
                size="large"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="perguntas">
              <h1 className="tituloAtributos">Escreva o motivo da consulta:</h1>
              <TextArea
                placeholder="O motivo da consulta não será exibido publicamente."
                size="large"
                required
                value={consultationReason}
                onChange={(e) => setConsultationReason(e.target.value)}
              />
            </div>
            <div className="termo">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
              />
              <div>
                <p>
                  Eu aceito o tratamento de dados pessoais <br />
                  com o propósito de deixar esta opinião. <br />
                  <a className="SaibaMais" onClick={showModal}>
                    Saiba mais
                  </a>
                </p>
                <Modal
                  title={
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
                      Política de Privacidade
                    </h1>
                  }
                  visible={isModalVisible}
                  onOk={handleOk}
                  cancelButtonProps={{ style: { display: "none" } }}
                >
                  <p>
                    Na MedLista, reconhecemos a importância da privacidade e
                    segurança das informações dos nossos usuários. Esta política
                    descreve como coletamos, usamos e protegemos seus dados
                    pessoais ao utilizar nosso site.
                  </p>
                  <h5>Informações Coletadas</h5>
                  <p>
                    Coletamos informações pessoais fornecidas por você ao
                    utilizar nossos serviços, como nome, endereço de e-mail, e
                    outras informações relevantes para personalizar sua
                    experiência e fornecer melhores serviços.
                  </p>
                  <h5>Uso de Informações</h5>
                  <p>
                    Utilizamos suas informações pessoais para melhorar nossos
                    serviços, fornecer conteúdo relevante, processar transações
                    e oferecer suporte ao cliente. Não compartilhamos suas
                    informações com terceiros sem seu consentimento, exceto
                    quando necessário para cumprir obrigações legais.
                  </p>
                  <h5>Segurança dos Dados</h5>
                  <p>
                    Empregamos medidas de segurança físicas, técnicas e
                    administrativas para proteger suas informações contra acesso
                    não autorizado, uso indevido ou divulgação.
                  </p>
                  <h5>Cookies</h5>
                  <p>
                    Utilizamos cookies e tecnologias semelhantes para melhorar
                    sua experiência de navegação, personalizar conteúdo e
                    anúncios, e analisar o tráfego do site. Você pode gerenciar
                    suas preferências de cookies nas configurações do seu
                    navegador.
                  </p>
                  <h5>Alterações na Política de Privacidade</h5>
                  <p>
                    Reservamo-nos o direito de atualizar esta política
                    periodicamente para refletir mudanças em nossas práticas de
                    privacidade. Recomendamos revisar esta política regularmente
                    para estar ciente de quaisquer atualizações.
                  </p>
                  <p>
                    Ao utilizar nosso site, você concorda com os termos desta
                    política de privacidade. Se tiver alguma dúvida ou
                    preocupação sobre nossa política ou práticas de privacidade,
                    entre em contato conosco através dos canais disponibilizados
                    em nosso site.
                  </p>
                  <h5>Data da última atualização: 28/02/2024.</h5>
                </Modal>
              </div>
            </div>
          </div>
          <div className="botaoalig">
            <button
              className="botaozinhu"
              onClick={() => {
                if (opinion && name && consultationReason) {
                  onSaveData(opinion, name, consultationReason, rating);
                } else {
                  Modal.error({
                    title: "Campos não preenchidos",
                    content:
                      "Você deve preencher todos os campos para prosseguir.",
                    onOk: () => {},
                    cancelButtonProps: { style: { display: "none" } },
                  });
                }
              }}
              disabled={!acceptTerms}
            >
              Continuar <FontAwesomeIcon id="" icon={faArrowRight} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ScreenThree = ({ onNext, onBack, onSavePhoneNumber, rating }) => {
  const { userId } = useParams();
  const [medico, setMedico] = useState(null);
  const [phone, setPhone] = useState("+55");
  const [hasFilled, setHasFilled] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const todosMedicos = collection(database, "medicos2");

  useEffect(() => {
    const getTodosMedicos = async () => {
      try {
        const data = await getDocs(todosMedicos);
        const medicos = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMedico(medicos.find((medico) => medico.id === userId));
      } catch (err) {
        console.error(err);
      }
    };
    getTodosMedicos();
  }, [userId]);

  const startTimer = () => {
    if (window.timer) {
      clearInterval(window.timer);
    }

    setTimeLeft(120);
    window.timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(window.timer);
          setTimeout(
            () =>
              Modal.error({
                title: "Tente novamente",
                content:
                  "O SMS chegou em seu tempo limite, para garantir sua identidade reescreva sua opnião e tente novamente.",
                okText: "OK",
                onOk: onBack(),
              }),
            0
          );

          return 0;
        }
        return prevTime - 1;
      });
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (window.timer) {
        clearInterval(window.timer);
      }
    };
  }, []);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha",
      {
        size: "invisible",
        callback: (response) => {},
      },
      auth
    );
  };

  const handleSend = (event) => {
    event.preventDefault();
    startTimer();
    setHasFilled(true);
    generateRecaptcha();

    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const verifyOtp = () => {
    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          setTimeLeft(0); // Para o contador imediatamente
          onSavePhoneNumber(phone, rating);
        })
        .catch((error) => {
          Modal.error({
            title: "Tente novamente",
            content: "Código não validado, tente novamente",
            okText: "OK",
            onOk: () => {},
          });
        });
    } else {
      Modal.error({
        title: "Tente novamente",
        content: "Insira um SMS válido.",
        okText: "OK",
        onOk: () => {},
      });
    }
  };

  return (
    <div className="containerAvalia">
      <div className="tam">
        <div className="tit">
          <button onClick={onBack}>
            <FontAwesomeIcon id="arrowleft" icon={faArrowLeft} />
          </button>
          <h1>Confirmação por mensagem</h1>
        </div>
        <hr className="separadorr"></hr>

        <div className="reviewStar">
          <div className="explicacao">
            <p>
              Como paciente, nada é mais importante que poder confiar na opinião
              de outras pessoas. Por favor, digite o número de seu telefone para
              confirmar sua opinião através de uma mensagem. É muito fácil!
            </p>
          </div>
          <form className="perguntas" onSubmit={handleSend}>
            <label className="tituloAtributos">
              <p>Seu número de telefone:</p>
            </label>
            <Input
              placeholder="Digite seu número com DDD."
              type="text"
              size="large"
              maxLength={14}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <div className="botaoalig">
              <div id="recaptcha"></div>
              <div className="mini">
                <button
                  className="botaozinhu"
                  onClick={(event) => {
                    event.preventDefault();
                    if (phone.length === 14) {
                      startTimer();
                      setHasFilled(true);
                      generateRecaptcha();

                      let appVerifier = window.recaptchaVerifier;
                      signInWithPhoneNumber(auth, phone, appVerifier)
                        .then((confirmationResult) => {
                          window.confirmationResult = confirmationResult;
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    } else {
                      Modal.error({
                        title: "Telefone inválido.",
                        content:
                          "Você deve preencher um número de telefone válido (14 dígitos) para prosseguir.",
                        onOk: () => {},
                      });
                    }
                  }}
                >
                  Enviar SMS
                </button>
                {timeLeft > 0 && (
                  <p className="mt-6">
                    Tempo restante para o SMS: {timeLeft} segundos
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className="perguntas">
            <label className="tituloAtributos">
              <p>Insira o código SMS:</p>
            </label>
            <Input
              placeholder="Digite o código SMS"
              type="text"
              size="large"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </div>
        <div className="botaoalig">
          <button
            className="botaozinhu"
            onClick={() => {
              verifyOtp();
            }}
          >
            Validar SMS <FontAwesomeIcon id="" icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ScreenFour = ({ onBack }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [medico, setMedico] = useState(null);

  const todosMedicos = collection(database, "medicos2");

  useEffect(() => {
    const getTodosMedicos = async () => {
      try {
        const data = await getDocs(todosMedicos);
        const medicos = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMedico(medicos.find((medico) => medico.id === userId));
      } catch (err) {
        console.error(err);
      }
    };
    getTodosMedicos();
  }, [userId]);

  return (
    <div className="containerAvalia">
      <div className="tam">
        <div className="tit">
          <h1>Comentário publicado!</h1>
        </div>
        <hr className="separadorr"></hr>
        <div className="reviewStar">
          <h2 className="mb-3">Comentário postado com sucesso!</h2>
          <p>
            Muito obrigado pelo seu comentário, a comunidade agradece seu
            trabalho!
          </p>
          <div className="botaoHome">
            <button
              className="botaozinhu"
              onClick={() => navigate(`/PerfilMed/${medico.currentId}`)}
            >
              <p>Voltar para o início</p>
              <FontAwesomeIcon id="arrowleft" icon={faHouse} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Avalia = () => {
  const { userId } = useParams();
  const [medico, setMedico] = useState(null);
  const [step, setStep] = useState(1);
  const [opinion, setOpinion] = useState("");
  const [name, setName] = useState("");
  const [consultationReason, setConsultationReason] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [rating, setRating] = useState();

  const todosMedicos = collection(database, "medicos2");

  useEffect(() => {
    const getTodosMedicos = async () => {
      try {
        const data = await getDocs(todosMedicos);
        const medicos = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMedico(medicos.find((medico) => medico.id === userId));
      } catch (err) {
        console.error(err);
      }
    };
    getTodosMedicos();
  }, [userId]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const saveData = async (opinion, name, consultationReason) => {
    setOpinion(opinion);
    setName(name);
    setConsultationReason(consultationReason);
    nextStep();
  };

  const savePhoneNumber = async (phone, rating) => {
    const commentsRef = collection(
      database,
      `medicos2/${medico.currentId}/comments`
    );
    const q = query(commentsRef, where("phone", "==", phone));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      Modal.error({
        title: "Erro",
        content:
          "Você já comentou usando este número de telefone. Só é permitido um comentário por telefone.",
      });
    } else {
      try {
        const timestamp = serverTimestamp();
        const docRef = await addDoc(commentsRef, {
          name: name,
          opinion: opinion,
          consultationReason: consultationReason,
          phone: phone,
          rating: parseInt(rating) || 0,
          timestamp: timestamp,
          mostrarComentario: true,
        });
        console.log("Opinion document written with ID: ", docRef.id);
        nextStep();
      } catch (e) {
        console.error("Error adding opinion document: ", e);
        Modal.error({
          title: "Erro ao salvar",
          content:
            "Houve um erro ao tentar salvar seu comentário. Por favor, tente novamente mais tarde.",
        });
      }
    }
  };

  const navigate = useNavigate();
  const home = () => {
    navigate("/");
  };

  return (
    <div>
      <nav>
        <Navbar1></Navbar1>
      </nav>
      {step === 1 && (
        <ScreenOne onNext={nextStep} setRating={setRating} rating={rating} />
      )}{" "}
      {step === 2 && (
        <ScreenTwo
          onNext={nextStep}
          onBack={prevStep}
          onSaveData={saveData}
          rating={rating}
          setRating={setRating}
        />
      )}
      {step === 3 && (
        <ScreenThree
          onNext={nextStep}
          onBack={prevStep}
          onSavePhoneNumber={savePhoneNumber}
          rating={rating}
        />
      )}
      {step === 4 && <ScreenFour onBack={home} />}
    </div>
  );
};

export default Avalia;
// do vs