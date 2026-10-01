// Netlify Serverless Function para validar CRM
// Esta função faz a chamada à API Infosimples no backend, evitando problemas de CORS
// e mantendo o token seguro

const axios = require('axios');

// Token da API Infosimples - Configure como variável de ambiente no Netlify
// Vá em: Site settings > Build & deploy > Environment > Environment variables
// Adicione: INFOSIMPLES_TOKEN = seu_token_aqui
const INFOSIMPLES_TOKEN = process.env.INFOSIMPLES_TOKEN;
const INFOSIMPLES_API_URL = process.env.INFOSIMPLES_API_URL || 'https://api.infosimples.com/api/v2/consultas/cfm/cadastro';

if (!INFOSIMPLES_TOKEN) {
  console.error('AVISO: INFOSIMPLES_TOKEN não configurado. Configure a variável de ambiente no Netlify.');
}

exports.handler = async (event, context) => {
  // Permitir apenas requisições POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Tratar requisições OPTIONS (preflight do CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Verificar se o token está configurado
    if (!INFOSIMPLES_TOKEN) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'Token da API não configurado. Entre em contato com o suporte.',
        }),
      };
    }

    // Parse do body da requisição
    const { inscricao, uf } = JSON.parse(event.body);

    // Validação dos parâmetros
    if (!inscricao || !uf) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'Parâmetros inválidos. É necessário informar inscricao e uf.',
        }),
      };
    }

    // Preparar dados para a API Infosimples
    const formData = new URLSearchParams();
    formData.append('inscricao', inscricao);
    formData.append('uf', uf);
    formData.append('token', INFOSIMPLES_TOKEN);
    formData.append('timeout', '300');

    // Fazer requisição à API Infosimples
    const response = await axios.post(
      INFOSIMPLES_API_URL,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000,
      }
    );

    const data = response.data;

    // Retornar resposta para o frontend
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: data,
      }),
    };
  } catch (error) {
    console.error('Erro ao validar CRM:', error);

    // Tratar diferentes tipos de erro
    let errorMessage = 'Erro ao validar CRM. Tente novamente mais tarde.';
    let statusCode = 500;

    if (error.response) {
      // Erro da API Infosimples
      statusCode = 200; // Retornar 200 para que o frontend possa processar o erro da API
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: error.response.data || { code: 500, message: 'Erro na API' },
        }),
      };
    } else if (error.request) {
      // Erro de rede
      errorMessage = 'Erro ao conectar com o serviço de validação. Verifique sua conexão.';
    }

    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: errorMessage,
      }),
    };
  }
};

