import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { database } from '../firebase';
import axios from 'axios';

// URL da função serverless do Netlify
// Em desenvolvimento: http://localhost:8888/.netlify/functions/validarCRM
// Em produção: usar URL absoluta para evitar interceptação pelo redirecionamento SPA
const getFunctionURL = () => {
  // Se estiver em desenvolvimento, usar localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8888/.netlify/functions/validarCRM';
  }
  // Em produção, usar a URL absoluta para evitar que o redirecionamento SPA intercepte
  // window.location.origin retorna o protocolo + domínio (ex: https://med-lista.com)
  return `${window.location.origin}/.netlify/functions/validarCRM`;
};

/**
 * Hook customizado para validação de CRM
 * @param {Object} user - Objeto do usuário autenticado (do Firebase Auth)
 * @returns {Object} Objeto com estados e funções de validação
 */
const useValidacaoCRM = (user) => {
  const [crmValido, setCrmValido] = useState(false);
  const [validandoCRM, setValidandoCRM] = useState(false);
  const [tentativasCRM, setTentativasCRM] = useState(0);
  const [mensagemCRM, setMensagemCRM] = useState('');
  const [crmBloqueado, setCrmBloqueado] = useState(false);
  const [validacaoAtiva, setValidacaoAtiva] = useState(true); // Estado para saber se validação está ativa

  /**
   * Função para verificar se a validação de CRM está ativa no sistema
   * @returns {Promise<boolean>} Retorna true se a validação estiver ativa, false caso contrário
   */
  const verificarValidacaoAtiva = async () => {
    try {
      const configDocRef = doc(database, 'configuracoes', 'sistema');
      const configDoc = await getDoc(configDocRef);
      
      if (configDoc.exists()) {
        const data = configDoc.data();
        // Se validacaoCRMAtiva for false ou não existir, retorna false (validação desativada)
        return data.validacaoCRMAtiva !== false; // Default true se não existir
      }
      // Se não existir o documento, assume que validação está ativa (comportamento padrão)
      return true;
    } catch (error) {
      console.error('Erro ao verificar configuração de validação:', error);
      // Em caso de erro, assume que validação está ativa (comportamento seguro)
      return true;
    }
  };

  // Carregar tentativas de CRM do Firestore e verificar se validação está ativa
  useEffect(() => {
    const carregarDados = async () => {
      if (user) {
        try {
          // Carregar tentativas
          const tentativasDocRef = doc(database, 'tentativasCRM', user.uid);
          const tentativasDoc = await getDoc(tentativasDocRef);
          
          if (tentativasDoc.exists()) {
            const data = tentativasDoc.data();
            const tentativas = data.tentativas || 0;
            setTentativasCRM(tentativas);
            
            if (tentativas >= 5) {
              setCrmBloqueado(true);
              setMensagemCRM('Você excedeu o limite de 5 tentativas de validação do CRM. Entre em contato com o suporte.');
            }
          }

          // Verificar se validação está ativa
          const validacaoAtiva = await verificarValidacaoAtiva();
          setValidacaoAtiva(validacaoAtiva);
          
          // Se validação estiver desativada, marcar CRM como válido automaticamente (silenciosamente)
          if (!validacaoAtiva) {
            setCrmValido(true);
            // Não exibir mensagem para o usuário comum
          }
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        }
      }
    };

    carregarDados();
  }, [user]);

  /**
   * Função para verificar se o CRM já está cadastrado no banco de dados
   * @param {string} inscricao - Número do CRM
   * @param {string} uf - UF do CRM
   * @param {string} userIdExcluir - ID do usuário atual (para permitir edição do próprio CRM)
   * @returns {Promise<boolean>} Retorna true se o CRM já existe, false caso contrário
   */
  const verificarCRMExistente = async (inscricao, uf, userIdExcluir = null) => {
    try {
      const medicosRef = collection(database, 'medicos2');
      const q = query(
        medicosRef,
        where('CRM', '==', inscricao),
        where('UfCRM', '==', uf)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Se não há documentos, o CRM não existe
      if (querySnapshot.empty) {
        return false;
      }
      
      // Se há documentos, verificar se algum não é do usuário atual (para permitir edição)
      if (userIdExcluir) {
        const existeOutroUsuario = querySnapshot.docs.some(
          (doc) => doc.id !== userIdExcluir
        );
        return existeOutroUsuario;
      }
      
      // Se não há userIdExcluir, qualquer documento encontrado significa que o CRM já existe
      return true;
    } catch (error) {
      console.error('Erro ao verificar CRM existente:', error);
      // Em caso de erro, não bloquear o cadastro (fail open)
      return false;
    }
  };

  /**
   * Função para validar CRM usando a API Infosimples
   * @param {string} inscricao - Número do CRM
   * @param {string} uf - UF do CRM
   * @param {string} userIdExcluir - ID do usuário atual (opcional, para permitir edição do próprio CRM)
   * @returns {Promise<boolean>} Retorna true se o CRM for válido, false caso contrário
   */
  const validarCRM = async (inscricao, uf, userIdExcluir = null) => {
    if (!inscricao || !uf) {
      setMensagemCRM('Por favor, preencha o CRM e a UF.');
      setCrmValido(false);
      return false;
    }

    // Verificar se a validação de CRM está ativa no sistema
    const validacaoAtiva = await verificarValidacaoAtiva();
    
    if (!validacaoAtiva) {
      // Se a validação estiver desativada, permite o cadastro sem validar (silenciosamente)
      setCrmValido(true);
      // Não exibir mensagem para o usuário comum
      return true;
    }

    if (crmBloqueado) {
      setMensagemCRM('Você excedeu o limite de tentativas. Entre em contato com o suporte.');
      return false;
    }

    if (tentativasCRM >= 5) {
      setCrmBloqueado(true);
      setMensagemCRM('Você excedeu o limite de 5 tentativas de validação do CRM. Entre em contato com o suporte.');
      return false;
    }

    // Verificar se o CRM já está cadastrado no banco de dados
    setValidandoCRM(true);
    setMensagemCRM('Verificando se o CRM já está cadastrado...');
    
    const crmJaExiste = await verificarCRMExistente(inscricao, uf, userIdExcluir);
    
    if (crmJaExiste) {
      setMensagemCRM('Este CRM já está cadastrado no sistema. Por favor, verifique se você já possui um perfil ou entre em contato com o suporte.');
      setCrmValido(false);
      setValidandoCRM(false);
      return false;
    }

    setMensagemCRM('Validando CRM...');

    try {
      // Chamar a função serverless do Netlify
      const functionURL = getFunctionURL();
      const response = await axios.post(
        functionURL,
        {
          inscricao,
          uf,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      // Verificar se a função retornou sucesso
      if (!response.data.success) {
        setMensagemCRM(response.data.error || 'Erro ao validar CRM. Tente novamente mais tarde.');
        setCrmValido(false);
        setValidandoCRM(false);
        return false;
      }

      const data = response.data.data;

      if (data.code === 200) {
        setCrmValido(true);
        setMensagemCRM('CRM válido!');
        setValidandoCRM(false);
        return true;
      } else if (data.code >= 600 && data.code <= 799) {
        // Incrementar tentativas
        const novasTentativas = tentativasCRM + 1;
        setTentativasCRM(novasTentativas);

        // Salvar tentativas no Firestore
        if (user) {
          try {
            const tentativasDocRef = doc(database, 'tentativasCRM', user.uid);
            await setDoc(tentativasDocRef, {
              tentativas: novasTentativas,
              ultimaTentativa: new Date(),
            }, { merge: true });
          } catch (error) {
            console.error('Erro ao salvar tentativas:', error);
          }
        }

        if (novasTentativas >= 5) {
          setCrmBloqueado(true);
          setMensagemCRM(`CRM inválido. Você excedeu o limite de 5 tentativas. Entre em contato com o suporte.`);
        } else {
          const tentativasRestantes = 5 - novasTentativas;
          let mensagemErro = `CRM inválido. Tentativas restantes: ${tentativasRestantes}.`;
          if (data.errors && data.errors.length > 0) {
            mensagemErro += ` ${data.errors.join('; ')}`;
          }
          setMensagemCRM(mensagemErro);
        }

        setCrmValido(false);
        setValidandoCRM(false);
        return false;
      } else {
        setMensagemCRM('Erro ao validar CRM. Tente novamente mais tarde.');
        setCrmValido(false);
        setValidandoCRM(false);
        return false;
      }
    } catch (error) {
      console.error('Erro ao validar CRM:', error);
      
      // Tratar diferentes tipos de erro
      let mensagemErro = 'Erro ao conectar com o serviço de validação. Tente novamente mais tarde.';
      
      if (error.response) {
        // Erro da função serverless
        if (error.response.data && error.response.data.error) {
          mensagemErro = error.response.data.error;
        } else if (error.response.status === 500) {
          mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (error.response.status === 404) {
          mensagemErro = 'Serviço de validação não encontrado. Verifique a configuração.';
        }
      } else if (error.request) {
        // Erro de rede
        mensagemErro = 'Erro ao conectar com o servidor. Verifique sua conexão com a internet.';
      }
      
      setMensagemCRM(mensagemErro);
      setCrmValido(false);
      setValidandoCRM(false);
      return false;
    }
  };

  /**
   * Função para resetar a validação do CRM
   * Útil quando o usuário altera o CRM ou UF
   */
  const resetarValidacao = () => {
    if (crmValido) {
      setCrmValido(false);
      setMensagemCRM('');
    }
  };

  return {
    crmValido,
    validandoCRM,
    tentativasCRM,
    mensagemCRM,
    crmBloqueado,
    validacaoAtiva,
    validarCRM,
    resetarValidacao,
  };
};

export default useValidacaoCRM;

