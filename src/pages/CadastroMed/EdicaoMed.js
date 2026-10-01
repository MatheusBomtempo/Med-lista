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
} from 'antd';

import { useEffect, useState } from 'react';
import Navbar from '../../componentes/Navbar/Navbar1';
import { database } from '../../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, setDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../../contexts/contextsAuth/AuthContext';
import { especialidades } from '../../utils/especialidades';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EdicaoMed = () => {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const { userId } = useParams();

  const [novoNome, setNovoNome] = useState([]);
  const [novoNomeCompleto, setNovoNomeCompleto] = useState([]);
  const [novoCpf, setNovoCpf] = useState('');
  const [novoSexo, setNovoSexo] = useState([]);
  const [novoCRM, setNovoCRM] = useState('');
  const [novoUfCRM, setNovoUfCRM] = useState([]);
  const [novaEspecialidade, setNovaEspecialidade] = useState('');
  const [novoLocal, setNovoLocal] = useState([]);
  const [novoAtende, setNovoAtende] = useState([]);
  const [novoConvenio, setNovoConvenio] = useState([]);
  const [novoClinicaEndereco, setNovoClinicaEndereco] = useState('');
  const [novoClinica, setNovoClinica] = useState('');
  const [novoTelefone1, setNovoTelefone1] = useState('');
  const [novoTelefone2, setNovoTelefone2] = useState('');
  const [novoEstudou, setNovoEstudou] = useState('');
  const [novoCurriculo, setNovoCurriculo] = useState('');
  const [novoInstagram, setNovoInstagram] = useState('');
  const [novoCertificacao, setNovoCertificacao] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [image_url, setImageUrl] = useState();
  const [alert, setAlert] = useState(false);
  // const [medico, setMedico] = useState([]);
  const [isClinicaEnabled, setIsClinicaEnabled] = useState(false);
  const [isTelefoneEnabled, setIsTelefoneEnabled] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [cpfValido, setCpfValido] = useState(true);
  const [convenios, setConvenios] = useState([]);
  const [dataCriacao, setDataCriacao] = useState();

  const loadMedicoData = async () => {
    if (user && userId) {
      try {
        const userDocRef = doc(collectionRef, userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists() || userId !== user.uid) {
          navigate(`/dashboard/${user.uid}`);
          return;
        }

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNovoNome(userData.nome || '');
          setNovoNomeCompleto(userData.nomeCompleto || '');
          setNovoCpf(userData.cpf || '');
          setNovoSexo(userData.sexo || '');
          setNovoCRM(userData.CRM || '');
          setNovoUfCRM(userData.UfCRM || '');
          setNovaEspecialidade(userData.especialidade || '');
          setNovoLocal(userData.local || '');
          setNovoAtende(userData.atende || '');
          setNovoConvenio(userData.convenio || '');
          setNovoClinicaEndereco(userData.clinicaEndereco || '');
          setNovoClinica(userData.clinica || '');
          setNovoTelefone1(userData.telefone1 || '');
          setNovoTelefone2(userData.telefone2 || '');
          setNovoEstudou(userData.estudou || '');
          setNovoCertificacao(userData.certificacoes || '');
          setNovoInstagram(userData.instagram || '');
          setNovoCurriculo(userData.curriculo || '');
          setDataCriacao(userData.dataCriacao || '');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do médico para edição:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user && userId) {
      try {
        const userDocRef = doc(collectionRef, userId);
        await updateDoc(userDocRef, {
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
          clinicaEndereco: novoClinicaEndereco,
          clinica: novoClinica,
          telefone1: novoTelefone1,
          telefone2: novoTelefone2,
          estudou: novoEstudou,
          certificacoes: novoCertificacao,
          instagram: novoInstagram,
          curriculo: novoCurriculo,
        });
        console.log('Dados do médico atualizados com sucesso.');
        modal.success({
          title: 'Perfil atualizado com sucesso!',
          content:
            'Seu perfil foi atualizado com sucesso, seus dados estão disponiveis no menu de pesquisa do MedLista.',
        });
      } catch (error) {
        modal.error({
          title: 'Erro na criação!',
          content:
            'Verifique todos os campos com * para ter certeza de que preencheu todos campos necessários.',
        });
        console.error('Erro ao atualizar dados do médico:', error);
      }
    }
  };

  useEffect(() => {
    loadMedicoData();

    const fetchConvenios = async () => {
      const conveniosDocRef = doc(database, 'listas', 'convenios');
      const conveniosDoc = await getDoc(conveniosDocRef);

      if (conveniosDoc.exists()) {
        const conveniosData = conveniosDoc.data();
        setConvenios(conveniosData.nome || []);
      }
    };

    fetchConvenios();
  }, [userId]);

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

  const onSubimitMedicos = async (values) => {
    if (user && userId) {
      try {
        const userDocRef = doc(collectionRef, userId);
        await updateDoc(userDocRef, {
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
          clinicaEndereco: novoClinicaEndereco,
          clinica: novoClinica,
          telefone1: novoTelefone1,
          telefone2: novoTelefone2,
          estudou: novoEstudou,
          certificacoes: novoCertificacao,
          instagram: novoInstagram,
          curriculo: novoCurriculo,
        });
        console.log('Dados do médico atualizados com sucesso.');
        modal.success({
          title: 'Perfil atualizado com sucesso!',
          content:
            'Seu perfil foi atualizado com sucesso, seus dados estão disponiveis no menu de pesquisa do MedLista.',
        });
      } catch (error) {
        modal.error({
          title: 'Erro na atualização!',
          content:
            'Verifique todos os campos com * para ter certeza de que preencheu todos campos necessários.',
        });
        console.error('Erro ao atualizar dados do médico:', error);
      }
    }
  };

  const handleChange = (value) => {
    setNovaEspecialidade(value);
  };

  const handleAddCertificacao = () => {
    if (!inputValue.trim()) {
      Modal.error({
        title: 'Erro',
        content: 'Digite uma certificação válida',
        onOk: () => {
          return;
        },
      });
    } else {
      setNovoCertificacao([...novoCertificacao, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveCertificacao = (index) => {
    setNovoCertificacao(novoCertificacao.filter((_, i) => i !== index));
  };

  return (
    <>
      <Navbar></Navbar>

      <div className="container EdicaoMed">
        {alert && (
          <Alert message="Cadastro editado com sucesso" type="success" />
        )}

        <div className="formInside">
          <h1 className="text-center mb-12">Edição Médico</h1>
          <p>
            Data de criação do perfil:{' '}
            {dataCriacao
              ? new Date(dataCriacao.seconds * 1000).toLocaleString('pt-BR')
              : ''}
          </p>

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
            <Form.Item 
              label="Nome completo:" 
              name="nomeCompleto"
              rules={[{ required: true, message: 'Por favor, insira seu nome completo!' }]}
            >
              <Input
                size="large"
                placeholder="Insira seu nome completo"
                type="text"
                value={novoNomeCompleto}
                onChange={(e) => setNovoNomeCompleto(e.target.value)}
              />
            </Form.Item>

            <Form.Item 
              label="Nome de exibição:" 
              name="nome"
              rules={[{ required: true, message: 'Por favor, insira o nome de exibição!' }]}
            >
              <Input
                size="large"
                placeholder="Insira o nome de exibição que aparecerá no MedLista"
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
            </Form.Item>

            <Form.Item 
              label="CPF:" 
              name="cpf"
              rules={[
                { required: true, message: 'Por favor, insira seu CPF!' },
                { 
                  validator: (_, value) => {
                    if (!value || validarCPF(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('CPF inválido!'));
                  }
                }
              ]}
            >
              <Input
                size="large"
                placeholder="Insira seu CPF"
                type="text"
                value={novoCpf}
                onBlur={handleCpfChange}
                onChange={(e) => setNovoCpf(e.target.value)}
              />
            </Form.Item>

            <Form.Item 
              label="Sexo:" 
              name="sexo"
              rules={[{ required: true, message: 'Por favor, selecione o sexo!' }]}
            >
              <Radio.Group
                onChange={(e) => setNovoSexo(e.target.value)}
                value={novoSexo}
              >
                <Radio value="Dr."> Masculino </Radio>
                <Radio value="Dra."> Feminino </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item 
              label="Número CRM:" 
              name="crm"
              rules={[{ required: true, message: 'Por favor, insira seu número CRM!' }]}
            >
              <Input
                size="large"
                placeholder="Insira seu CRM"
                type="number"
                value={novoCRM}
                onChange={(e) => setNovoCRM(e.target.value)}
              />
            </Form.Item>

            <Form.Item 
              label="UF CRM:" 
              name="ufCRM"
              rules={[{ required: true, message: 'Por favor, selecione o UF do CRM!' }]}
            >
              <Select
                value={novoUfCRM}
                onChange={(value) => setNovoUfCRM(value)}
                size="large"
                placeholder="Insira o UF do seu CRM"
                showSearch={true}
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

            <Form.Item 
              label="Especialidade:" 
              name="especialidade"
              rules={[{ required: true, message: 'Por favor, selecione uma especialidade!' }]}
            >
              <p hidden>{novaEspecialidade}</p>
              <Select
                placeholder="Selecione uma especialidade"
                onChange={handleChange}
                value={novaEspecialidade}
                size="large"
                showSearch={true}
              >
                {especialidades.map((especialidade) => (
                  <Option key={especialidade} value={especialidade}>
                    {especialidade}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              label="Cidade:" 
              name="local"
              rules={[{ required: true, message: 'Por favor, selecione sua cidade!' }]}
            >
              <Select
                size="large"
                placeholder="Insira sua cidade"
                value={novoLocal}
                onChange={(value) => setNovoLocal(value)}
                showSearch={true}
              >
                <Select.Option value="Barbacena">Barbacena</Select.Option>
                {/* <Select.Option value="Vasconcelos">Vasconcelos</Select.Option>
                <Select.Option value="Carandaí">Carandaí</Select.Option>
                <Select.Option value="Barroso">Barroso</Select.Option> */}
              </Select>
            </Form.Item>

            <Form.Item 
              label="Onde atende:" 
              name="atende"
              rules={[
                { required: true, message: 'Por favor, selecione onde atende!' },
                {
                  validator: (_, value) => {
                    if (!value || (Array.isArray(value) && value.length > 0)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Selecione pelo menos uma opção!'));
                  }
                }
              ]}
            >
              <Select
                mode="multiple"
                size="large"
                placeholder="Insira onde atende"
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

            <Form.Item 
              label="Convênio:" 
              name="convenio"
              rules={[
                { required: true, message: 'Por favor, selecione pelo menos um convênio!' },
                {
                  validator: (_, value) => {
                    if (!value || (Array.isArray(value) && value.length > 0)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Selecione pelo menos um convênio!'));
                  }
                }
              ]}
            >
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
                value={novoClinica}
                onChange={(e) => setNovoClinica(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Qual o endereço da clínica?">
              <Input
                size="large"
                disabled={!isClinicaEnabled}
                value={novoClinicaEndereco}
                placeholder="Rua, Bairro, Número"
                onChange={(e) => setNovoClinicaEndereco(e.target.value)}
              />
            </Form.Item>

            <hr></hr>

            <Form.Item
              label="Telefone profissional para contato (com DDD):"
              name="telefone1"
              rules={[
                { required: true, message: 'Por favor, insira o telefone profissional!' },
                { 
                  validator: (_, value) => {
                    if (!value || value.replace(/\D/g, '').length >= 10) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Telefone deve ter pelo menos 10 dígitos!'));
                  }
                }
              ]}
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
                  // Não permite a entrada de caracteres que não sejam numéricos
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  // Opcional: Prevenir colar texto que não seja exclusivamente numérico
                  const textoColado = e.clipboardData.getData('text');
                  const textoFiltrado = textoColado.replace(/\D/g, '');
                  if (textoColado !== textoFiltrado) {
                    e.preventDefault();
                    // Opcional: Atualizar o estado com o valor filtrado se necessário
                    // setNovoTelefone1(textoFiltrado);
                  }
                }}
              />
            </Form.Item>

            <Form.Item label="Telefone secundário:">
              <Input
                size="large"
                maxLength={11}
                placeholder="Apenas números"
                type="text" // Mudado para 'text' para controle manual da entrada
                value={novoTelefone2}
                onChange={(e) => {
                  // Atualiza o valor apenas com dígitos numéricos
                  const valorFiltrado = e.target.value.replace(/\D/g, '');
                  setNovoTelefone2(valorFiltrado);
                }}
                onKeyPress={(e) => {
                  // Não permite a entrada de caracteres que não sejam numéricos
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  // Opcional: Prevenir colar texto que não seja exclusivamente numérico
                  const textoColado = e.clipboardData.getData('text');
                  const textoFiltrado = textoColado.replace(/\D/g, '');
                  if (textoColado !== textoFiltrado) {
                    e.preventDefault();
                    // Opcional: Atualizar o estado com o valor filtrado se necessário
                    // setNovoTelefone2(textoFiltrado);
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
                value={novoEstudou}
                onChange={(e) => setNovoEstudou(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Certificações">
              <Input
                size="large"
                value={inputValue}
                placeholder="Exemplo: Certificação em Cardiologia, 2018"
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button className="mt-2" onClick={handleAddCertificacao}>
                +
              </Button>

              {novoCertificacao.map((certificacao, index) => (
                <div key={index} className="certificaMinor ">
                  <p className="certiMinor">{certificacao}</p>
                  <Button onClick={() => handleRemoveCertificacao(index)}>
                    X
                  </Button>
                </div>
              ))}
            </Form.Item>

             <Form.Item 
               label="Link para curriculo: Curriculo Lattes/ Escavador"
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
                value={novoInstagram}
                onChange={(e) => {
                  if (!e.target.value.includes('@')) {
                    setNovoInstagram(e.target.value);
                  }
                }}
              />
            </Form.Item>

            <Form.Item className="enviar">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="btn33"
                disabled={!cpfValido}
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
export default () => <EdicaoMed />;
