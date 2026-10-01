# Configuração do Netlify Functions para Validação de CRM

Este projeto usa Netlify Serverless Functions para validar o CRM através da API Infosimples, seguindo as melhores práticas de segurança e evitando problemas de CORS.

## 📋 Pré-requisitos

1. Conta no Netlify
2. Token da API Infosimples
3. Node.js instalado

## 🔧 Configuração

### 1. Instalar dependências

As funções serverless do Netlify usam `axios` que já está nas dependências do projeto. Para desenvolvimento local, você pode instalar o Netlify CLI:

```bash
npm install -g netlify-cli
```

### 2. Configurar variável de ambiente no Netlify

1. Acesse o painel do Netlify: https://app.netlify.com
2. Selecione seu site
3. Vá em **Site settings** > **Build & deploy** > **Environment** > **Environment variables**
4. Adicione uma nova variável:
   - **Key**: `INFOSIMPLES_TOKEN`
   - **Value**: Seu token da API Infosimples
5. Clique em **Save**

### 3. Estrutura de arquivos

```
projeto/
├── netlify/
│   └── functions/
│       └── validarCRM.js    # Função serverless
├── netlify.toml              # Configuração do Netlify
└── src/
    └── utils/
        └── useValidacaoCRM.js  # Hook que chama a função
```

## 🚀 Desenvolvimento Local

Para testar as funções localmente:

### 1. Configurar variável de ambiente local

Crie um arquivo `.env` na **raiz do projeto** (mesmo nível do `package.json`):

```bash
# Na raiz do projeto
touch .env
```

Adicione o token no arquivo `.env`:
```
INFOSIMPLES_TOKEN=seu_token_da_api_infosimples_aqui
```

**⚠️ IMPORTANTE**: 
- O arquivo `.env` já está no `.gitignore` e **não será commitado**
- Use o token real da API Infosimples
- Existe um arquivo `.env.example` como template

### 2. Iniciar o servidor de desenvolvimento

Inicie o servidor de desenvolvimento do Netlify:
```bash
netlify dev
```

Isso iniciará:
- O servidor React na porta 3000 (ou outra configurada)
- O servidor de funções na porta 8888
- As variáveis do arquivo `.env` serão carregadas automaticamente

### 3. Testar a função

A função estará disponível em:
```
http://localhost:8888/.netlify/functions/validarCRM
```

**Nota**: Se você receber erro 500, verifique se:
- O arquivo `.env` existe na raiz do projeto
- O token está correto no arquivo `.env`
- Você reiniciou o `netlify dev` após criar/editar o `.env`

## 📦 Deploy

Ao fazer deploy no Netlify:

1. O Netlify detecta automaticamente a pasta `netlify/functions/`
2. As funções são compiladas e disponibilizadas em `/.netlify/functions/`
3. A variável de ambiente `INFOSIMPLES_TOKEN` é automaticamente injetada

## 🔒 Segurança

- ✅ Token da API **não** fica exposto no frontend
- ✅ Token armazenado como variável de ambiente no Netlify
- ✅ Requisições passam pelo backend (função serverless)
- ✅ CORS configurado corretamente

## 🧪 Testando a função

Você pode testar a função usando curl:

```bash
curl -X POST http://localhost:8888/.netlify/functions/validarCRM \
  -H "Content-Type: application/json" \
  -d '{"inscricao": "123456", "uf": "SP"}'
```

## ⚠️ Importante

- **Nunca** commite o token no código
- Use sempre variáveis de ambiente
- Em produção, certifique-se de que a variável `INFOSIMPLES_TOKEN` está configurada no Netlify

## 📝 Notas

- A função serverless está em `netlify/functions/validarCRM.js`
- O hook React está em `src/utils/useValidacaoCRM.js`
- A configuração do Netlify está em `netlify.toml`

