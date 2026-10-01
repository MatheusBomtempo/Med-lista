import './CadastroMed.css';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Alert,
  Modal,
  Flex,
} from 'antd';

import { useEffect, useState } from 'react';
import Navbar from '../../componentes/Navbar/Navbar1';
import { database, storage } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, collection, setDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';
import { especialidades } from '../../utils/especialidades';
import useValidacaoCRM from '../../utils/useValidacaoCRM';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CadastroMed = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();

  const [novoNome, setNovoNome] = useState([]);
  const [novoNomeCompleto, setNovoNomeCompleto] = useState([]);
  const [novoCpf, setNovoCpf] = useState('');
  const [novoSexo, setNovoSexo] = useState([]);
  const [novoCRM, setNovoCRM] = useState([]);
  const [novoUfCRM, setNovoUfCRM] = useState([]);
  const [novaEspecialidade, setNovaEspecialidade] = useState([]);
  const [novoLocal, setNovoLocal] = useState([]);
  const [novoAtende, setNovoAtende] = useState([]);
  const [novoConvenio, setNovoConvenio] = useState([]);
  const [novoClinicaEndereco, setNovoClinicaEndereco] = useState([]);
  const [novoClinica, setNovoClinica] = useState([]);
  const [novoTelefone1, setNovoTelefone1] = useState([]);
  const [novoTelefone2, setNovoTelefone2] = useState([]);
  const [novoEstudou, setNovoEstudou] = useState([]);
  const [certificacoes, setCertificacoes] = useState([]);
  const [novoCertificacao, setNovoCertificacao] = useState([]);
  const [userImageUrl, setUserImageUrl] = useState(null);
  const [novoCurriculo, setNovoCurriculo] = useState('');
  const [novoInstagram, setNovoInstagram] = useState('');
  const [exibirPerfil, setExibirPerfil] = useState(false);

  const [alert, setAlert] = useState(false);
  // const [medico, setMedico] = useState([]);
  const [isClinicaEnabled, setIsClinicaEnabled] = useState(false);
  const [isTelefoneEnabled, setIsTelefoneEnabled] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [cpfValido, setCpfValido] = useState(true);
  const [convenios, setConvenios] = useState([]);
  const [image, setImage] = useState([]);
  const [url, setUrl] = useState(null);
  const currentDateTime = new Date();
  const [dataCriacao, setDataCriacao] = useState(currentDateTime);
  
  // Hook para validação do CRM
  const {
    crmValido,
    validandoCRM,
    tentativasCRM,
    mensagemCRM,
    crmBloqueado,
    validacaoAtiva,
    validarCRM,
    resetarValidacao,
  } = useValidacaoCRM(user);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      Modal.error({
        content: 'O tamanho do arquivo deve ser de no máximo 5MB.',
      });
      return;
    }
    setImage(file);
  };

  const handleImageSubmit = () => {
    if (image instanceof File) {
      const fileName = `${user.uid}`;
      const imageRef = ref(storage, `images/${fileName}`);
      uploadBytes(imageRef, image)
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              setUrl(url);
              if (user) {
                const userDocRef = doc(collectionRef, user.uid);
                updateDoc(userDocRef, {
                  image_url: url,
                }).then(() => {
                  console.log(
                    'URL da imagem associado ao usuário com sucesso.'
                  );
                  setUserImageUrl(url);
                });
              }
            })
            .catch((error) => {
              console.log(error.message, 'Erro ao obter o URL da imagem.');
            });
          setImage(null);
        })
        .catch((error) => {
          console.log(error.message, 'Erro ao fazer upload da imagem.');
        });
    } else {
      if (user) {
        const userDocRef = doc(collectionRef, user.uid);
        updateDoc(userDocRef, {
          image_url: null,
        }).then(() => {
          console.log(
            'Nenhuma imagem válida selecionada. image_url definido como null.'
          );
        });
      }
    }
    // modal.success({
    //   title: "Perfil criado com sucesso!",
    //   content:
    //     "Seu perfil foi criado com sucesso e foi enviado para aprovação. Em até 24  horas seu perfil será aprovado e exibido no MedLista.",
    // });
  };

  useEffect(() => {
    const fetchConvenios = async () => {
      const conveniosDocRef = doc(database, 'listas', 'convenios');
      const conveniosDoc = await getDoc(conveniosDocRef);

      if (conveniosDoc.exists()) {
        const conveniosData = conveniosDoc.data();
        setConvenios(conveniosData.nome || []);
      }
    };

    fetchConvenios();
  }, []);

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
      return false;
    }
    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    digito1 = digito1 > 9 ? 0 : digito1;

    if (parseInt(cpf.charAt(9)) !== digito1) {
      return false;
    }
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    digito2 = digito2 > 9 ? 0 : digito2;

    if (parseInt(cpf.charAt(10)) !== digito2) {
      return false;
    }
    return true;
  }

  const handleClinicaChange = (checked) => {
    setIsClinicaEnabled(checked);
  };

  const handleTelefoneChange = (checked) => {
    setIsTelefoneEnabled(checked);
  };

  function handleCpfChange(e) {
    const inputCpf = e.target.value;
    setNovoCpf(inputCpf);
    const valido = validarCPF(inputCpf);
    setCpfValido(valido);
  }

  const collectionRef = collection(database, 'medicos2');

  const onSubimitMedicos = async (e) => {
    if (user) {
      // Validar CRM antes de criar o perfil (apenas se validação estiver ativa)
      if (validacaoAtiva) {
        if (!crmValido) {
          const crmValidado = await validarCRM(novoCRM, novoUfCRM, user.uid);
          if (!crmValidado) {
            modal.error({
              title: 'CRM inválido',
              content: mensagemCRM || 'Por favor, verifique o CRM e a UF informados.',
            });
            return;
          }
        }

        // Verificar se o usuário está bloqueado (apenas se validação estiver ativa)
        if (crmBloqueado || tentativasCRM >= 5) {
          modal.error({
            title: 'Limite de tentativas excedido',
            content: 'Você excedeu o limite de 5 tentativas de validação do CRM. Entre em contato com o suporte.',
          });
          return;
        }
      }
      // Se validação estiver desativada, permite cadastro sem validar

      try {
        const userDocRef = doc(collectionRef, user.uid);
        await setDoc(userDocRef, {
          nome: novoNome,
          nomeCompleto: novoNomeCompleto,
          cpf: novoCpf,
          sexo: novoSexo,
          CRM: novoCRM,
          UfCRM: novoUfCRM,
          especialidade: novaEspecialidade,
          local: novoLocal,
          atende: novoAtende,
          convenio: novoConvenio,
          clinica: novoClinica,
          clinicaEndereco: novoClinicaEndereco,
          telefone1: novoTelefone1,
          telefone2: novoTelefone2,
          estudou: novoEstudou,
          certificacoes: certificacoes,
          dataCriacao: dataCriacao,
          curriculo: novoCurriculo,
          instagram: novoInstagram,
          exibirPerfil: exibirPerfil,
          currentId: user.uid,
        });

        let secondsToGo = 10;
        const instance = modal.success({
          title: 'Enviado com sucesso',
          content: `Seu perfil foi criado com sucesso e foi enviado para aprovação. Em até 24  horas seu perfil será aprovado e exibido no MedLista. Você será redirecionado em ${secondsToGo} segundos.`,
        });
        const timer = setInterval(() => {
          secondsToGo -= 1;
          instance.update({
            title: 'Enviado com sucesso',
            content: `Seu perfil foi criado com sucesso e foi enviado para aprovação. Em até 24  horas seu perfil será aprovado e exibido no MedLista. Você será redirecionado em ${secondsToGo} segundos.`,
          });
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          instance.destroy();
          navigate(`/Dashboard/${user.uid}`);
        }, secondsToGo * 1000);

        console.log('Document added successfully with ID: ', user.uid);
      } catch (error) {
        let secondsToGo = 5;
        const instance = modal.error({
          title: 'Ocorreu algum erro ao enviar',
          content: `Você será redirecionado em ${secondsToGo} segundos.`,
        });
        const timer = setInterval(() => {
          secondsToGo -= 1;
          instance.update({
            content: `Você será redirecionado em ${secondsToGo} segundos.`,
          });
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          instance.destroy();
          navigate(`/Dashboard/${user.uid}`);
        }, secondsToGo * 1000);
        modal.error({
          title: 'erro na criação!',
          content:
            'Verifique todos os campos com * para ter certeza de que preencheu todos campos necessários.',
        });
        console.error('Error adding document: ', error);
      }
    }
  };

  const handleChange = (value) => {
    setNovaEspecialidade(value);
  };

  const handleAddCertificacao = () => {
    if (!novoCertificacao.trim()) {
      alert('Por favor, insira uma certificação antes de adicionar.');
      return;
    }

    setCertificacoes([...certificacoes, novoCertificacao]);
    setNovoCertificacao('');
  };

  const handleRemoveCertificacao = (indexToRemove) => {
    setCertificacoes(
      certificacoes.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      <Navbar></Navbar>

      <div className="container cadastroMed">
        {alert && (
          <Alert message="Cadastro enviado com sucesso" type="success" />
        )}

        <div className="formInside">
          <h1 className="text-center mb-12">Cadastro Médico</h1>
          <Form
            onFinish={onSubimitMedicos}
            labelCol={{
              span: 19,
            }}
            wrapperCol={{
              span: 34,
            }}
            layout="vertical"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: 1200,
              textAlign: 'start',
              margin: 0,
            }}
          >
            {/* <Form.Item  label="Tipo">
                              <Radio.Group>
                                  <Radio value="medico"> Medico </Radio>
                                  <Radio value="clinica"> Clinica </Radio>
                              </Radio.Group>
                              </Form.Item> */}
            <Form.Item label="Nome completo:" required>
              <Input
                required
                size="large"
                placeholder="Insira seu nome completo"
                type="text"
                onChange={(e) => setNovoNomeCompleto(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Nome de exibição:" required>
              <Input
                required
                size="large"
                placeholder="Insira o nome de exibição que aparecerá no MedLista"
                type="text"
                onChange={(e) => setNovoNome(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="CPF:" required>
              <Input
                required
                size="large"
                placeholder="Insira seu CPF"
                type="text"
                value={novoCpf}
                onBlur={handleCpfChange}
                onChange={(e) => setNovoCpf(e.target.value)}
              />
            </Form.Item>
            {!cpfValido && (
              <p>CPF inválido. Por favor, insira um CPF válido.</p>
            )}

            <Form.Item label="Sexo:" required>
              <Radio.Group
                onChange={(e) => setNovoSexo(e.target.value)}
                value={novoSexo}
              >
                <Radio value="Dr."> Masculino </Radio>
                <Radio value="Dra."> Feminino </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Número CRM:" required>
              <Input
                size="large"
                placeholder="Insira seu CRM (apenas números)"
                type="text"
                value={novoCRM}
                onChange={(e) => {
                  // Permitir apenas números
                  const valor = e.target.value.replace(/\D/g, '');
                  setNovoCRM(valor);
                  resetarValidacao();
                }}
                onKeyPress={(e) => {
                  // Bloquear caracteres não numéricos
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  // Filtrar apenas números ao colar
                  const textoColado = e.clipboardData.getData('text');
                  const textoFiltrado = textoColado.replace(/\D/g, '');
                  if (textoColado !== textoFiltrado) {
                    e.preventDefault();
                    setNovoCRM(textoFiltrado);
                    resetarValidacao();
                  }
                }}
                disabled={crmBloqueado}
                status={crmValido ? 'success' : mensagemCRM && !validandoCRM ? 'error' : ''}
                maxLength={10}
              />
            </Form.Item>

            <Form.Item label="UF CRM:" required>
              <Select
                value={novoUfCRM}
                onChange={(value) => {
                  setNovoUfCRM(value);
                  resetarValidacao();
                }}
                size="large"
                placeholder="Insira o UF do seu CRM"
                disabled={crmBloqueado}
              >
                <Select.Option value="AC">Acre</Select.Option>
                <Select.Option value="AL">Alagoas</Select.Option>
                <Select.Option value="AP">Amapá</Select.Option>
                <Select.Option value="AM">Amazonas</Select.Option>
                <Select.Option value="BA">Bahia</Select.Option>
                <Select.Option value="CE">Ceará</Select.Option>
                <Select.Option value="DF">Distrito Federal</Select.Option>
                <Select.Option value="ES">Espírito Santo</Select.Option>
                <Select.Option value="GO">Goiás</Select.Option>
                <Select.Option value="MA">Maranhão</Select.Option>
                <Select.Option value="MT">Mato Grosso</Select.Option>
                <Select.Option value="MS">Mato Grosso do Sul</Select.Option>
                <Select.Option value="MG">Minas Gerais</Select.Option>
                <Select.Option value="PA">Pará</Select.Option>
                <Select.Option value="PB">Paraíba</Select.Option>
                <Select.Option value="PR">Paraná</Select.Option>
                <Select.Option value="PE">Pernambuco</Select.Option>
                <Select.Option value="PI">Piauí</Select.Option>
                <Select.Option value="RJ">Rio de Janeiro</Select.Option>
                <Select.Option value="RN">Rio Grande do Norte</Select.Option>
                <Select.Option value="RS">Rio Grande do Sul</Select.Option>
                <Select.Option value="RO">Rondônia</Select.Option>
                <Select.Option value="RR">Roraima</Select.Option>
                <Select.Option value="SC">Santa Catarina</Select.Option>
                <Select.Option value="SP">São Paulo</Select.Option>
                <Select.Option value="SE">Sergipe</Select.Option>
                <Select.Option value="TO">Tocantins</Select.Option>
              </Select>
            </Form.Item>

            {validacaoAtiva && (
              <Form.Item>
                <Button
                  type="default"
                  onClick={async () => {
                    await validarCRM(novoCRM, novoUfCRM, user?.uid);
                  }}
                  disabled={!novoCRM || !novoUfCRM || validandoCRM || crmBloqueado}
                  loading={validandoCRM}
                >
                  {validandoCRM ? 'Validando...' : 'Validar CRM'}
                </Button>
                {mensagemCRM && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <Alert
                      message={mensagemCRM}
                      type={crmValido ? 'success' : 'error'}
                      showIcon
                      style={{ marginTop: 8, flex: 1, minWidth: '200px' }}
                    />
                    <Link 
                      to="/suporte" 
                      style={{ 
                        color: '#014A49', 
                        textDecoration: 'underline',
                        fontWeight: 500,
                        fontSize: '14px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Suporte
                    </Link>
                  </div>
                )}
                {tentativasCRM > 0 && tentativasCRM < 5 && (
                  <div style={{ marginTop: 8 }}>
                    <Alert
                      message={`Tentativas de validação: ${tentativasCRM}/5`}
                      type="warning"
                      showIcon
                    />
                  </div>
                )}
              </Form.Item>
            )}

            <Form.Item
              label="Especialidade:"
              name="especialidade"
              rules={[
                {
                  required: true,
                  message: 'Selecione uma especialidade médica',
                },
              ]}
            >
              <Select
                placeholder="Selecione uma especialidade"
                onChange={handleChange}
                value={novaEspecialidade}
                size="large"
              >
                {especialidades.map((especialidade) => (
                  <Option key={especialidade} value={especialidade}>
                    {especialidade}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Cidade:" required>
              <Select
                size="large"
                placeholder="Insira sua cidade"
                value={novoLocal}
                onChange={(value) => setNovoLocal(value)}
              >
                <Select.Option value="Barbacena">Barbacena</Select.Option>
                {/* <Select.Option value="Vasconcelos">Vasconcelos</Select.Option>
                <Select.Option value="Carandaí">Carandaí</Select.Option>
                <Select.Option value="Barroso">Barroso</Select.Option> */}
              </Select>
            </Form.Item>

            <Form.Item label="Onde atende:" required>
              <Select
                mode="multiple"
                size="large"
                placeholder="Insira onde você realiza atendimentos"
                value={novoAtende}
                onChange={(value) => setNovoAtende(value)}
              >
                <Select.Option value="Santa casa">Santa casa</Select.Option>
                <Select.Option value="Regional">Regional</Select.Option>
                <Select.Option value="Ibiapaba">Ibiapaba</Select.Option>
                <Select.Option value="Policlinica">
                  Policlinica E Maternidade
                </Select.Option>
                <Select.Option value="Hospital Psiquiatrico E Judiciario Jorge Vaz">
                  Hospital Psiquiatrico E Judiciario Jorge Vaz
                </Select.Option>
                {/* fazer postinhos de saude */}
                <Select.Option value="Particular">Particular</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Convênio:" required>
              <Select
                mode="multiple"
                size="large"
                placeholder="Insira seu convênio"
                value={novoConvenio}
                onChange={(value) => setNovoConvenio(value)}
              >
                {convenios.map((convenio) => (
                  <Select.Option key={convenio} value={convenio}>
                    {convenio}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <p style={{ marginTop: '-16px', marginBottom: '16px', fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)' }}>
              Faltou algum convênio?{' '}
              <Link to="/suporte" style={{ color: '#014A49', textDecoration: 'underline' }}>
                Fale com o suporte
              </Link>
            </p>

            <hr></hr>

            <Form.Item label="Atende em alguma clínica?" className="">
              <Switch
                className="drop-shadow-lg"
                checked={isClinicaEnabled}
                onChange={handleClinicaChange}
              />
            </Form.Item>

            <Form.Item label="Se sim, qual o nome da clínica?">
              <Input
                size="large"
                disabled={!isClinicaEnabled}
                placeholder="Nome completo da clínica"
                onChange={(e) => setNovoClinica(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Qual o endereço da clínica?">
              <Input
                size="large"
                disabled={!isClinicaEnabled}
                placeholder="Rua, Bairro, Número"
                onChange={(e) => setNovoClinicaEndereco(e.target.value)}
              />
            </Form.Item>

            <hr></hr>

            <Form.Item
              label="Telefone profissional para contato (com DDD):"
              required
            >
              <Input
                size="large"
                maxLength={11}
                placeholder="Apenas números"
                type="text"
                value={novoTelefone1}
                onChange={(e) => {
                  const valorFiltrado = e.target.value.replace(/\D/g, '');
                  setNovoTelefone1(valorFiltrado);
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const textoColado = e.clipboardData.getData('text');
                  const textoFiltrado = textoColado.replace(/\D/g, '');
                  if (textoColado !== textoFiltrado) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>

            <hr></hr>

            <Form.Item label="Deseja inserir mais um telefone?">
              <Switch
                className="drop-shadow-lg"
                checked={isTelefoneEnabled}
                onChange={handleTelefoneChange}
              />
            </Form.Item>

            <Form.Item label="Telefone secundário:">
              <Input
                size="large"
                maxLength={11}
                placeholder="Apenas números"
                type="text"
                disabled={!isTelefoneEnabled}
                value={novoTelefone2}
                onChange={(e) => {
                  const valorFiltrado = e.target.value.replace(/\D/g, '');
                  setNovoTelefone2(valorFiltrado);
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const textoColado = e.clipboardData.getData('text');
                  const textoFiltrado = textoColado.replace(/\D/g, '');
                  if (textoColado !== textoFiltrado) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>

            <hr></hr>

            <Form.Item label="Onde formou?">
              <Input
                size="large"
                placeholder="Exemplo: Universidade Estadual de Campinas (UNICAMP)"
                type="text"
                onChange={(e) => setNovoEstudou(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Certificações">
              <Input
                value={novoCertificacao}
                size="large"
                placeholder="Digite uma especialização ou certificação."
                onChange={(e) => setNovoCertificacao(e.target.value)}
              />
              <Button size='large' onClick={handleAddCertificacao} className="butAd">
                +
              </Button>

              {certificacoes.map((certificacao, index) => (
                <div key={index} className="certificaMinor ">
                  <p className="certiMinor">{certificacao}</p>
                  <Button onClick={() => handleRemoveCertificacao(index)}>
                    X
                  </Button>
                </div>
              ))}
            </Form.Item>

            <Form.Item 
              label="Link para curriculo: Curriculo Lattes/ Escavador (com https://)"
              name="curriculo"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }
                    const urlRegex = /^https?:\/\/.+/;
                    if (urlRegex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Por favor, insira um link válido (ex: https://lattes.cnpq.br/...)'));
                  }
                }
              ]}
            >
              <Input
                size="large"
                placeholder="Insira aqui o link para seu currículo lattes, escavador ou outro."
                type="text"
                value={novoCurriculo}
                onChange={(e) => setNovoCurriculo(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Instagram">
              <Input
                size="large"
                placeholder="Insira seu usuário do Instagram, sem @. Ex: drlopes101"
                type="text"
                onChange={(e) => {
                  if (!e.target.value.includes('@')) {
                    setNovoInstagram(e.target.value);
                  }
                }}
              />
            </Form.Item>

            <Form.Item label="Inserir Foto">
              <Input size="large" type="file" onChange={handleImageChange} />
            </Form.Item>

            <Form.Item className="enviar">
              <Button
                type="secondary"
                htmlType="submit"
                className="btn33"
                onClick={handleImageSubmit}
                disabled={
                  !cpfValido || 
                  (validacaoAtiva && (!crmValido || crmBloqueado))
                }
              >
                Confirmar
              </Button>
              {contextHolder}
            </Form.Item>
          </Form>
          
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            textAlign: 'center',
            color: 'rgba(0, 0, 0, 0.45)',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: 0 }}>
              Encontrou algum problema no cadastro? Envie um email para{' '}
              <a 
                href="mailto:mfbomt@gmail.com" 
                style={{ color: 'rgba(0, 0, 0, 0.65)', textDecoration: 'underline' }}
              >
                mfbomt@gmail.com
              </a>
              {' '}e será respondido em poucas horas.
            </p>
            <p style={{ margin: '8px 0 0 0', fontWeight: 500 }}>
              ⚠️ O aplicativo está em beta. É muito importante que você nos envie um email caso encontre qualquer intercorrência.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default () => <CadastroMed />;
