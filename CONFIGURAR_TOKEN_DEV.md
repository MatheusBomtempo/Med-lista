# 🔧 Como Configurar o Token para Desenvolvimento Local

## Problema
Você está recebendo erro **500 Internal Server Error** ao tentar validar o CRM localmente.

## Solução Rápida

### Passo 1: Criar arquivo `.env`

Na **raiz do projeto** (mesmo nível do `package.json`), crie um arquivo chamado `.env`:

**Windows (PowerShell):**
```powershell
New-Item .env
```

**Windows (CMD):**
```cmd
type nul > .env
```

**Linux/Mac:**
```bash
touch .env
```

### Passo 2: Adicionar o token

Abra o arquivo `.env` e adicione:
```
INFOSIMPLES_TOKEN=GB-token
```

**Substitua** `GB-token` pelo seu token real da API Infosimples.

### Passo 3: Reiniciar o servidor

**IMPORTANTE**: Você precisa **parar e reiniciar** o `netlify dev` para que as variáveis de ambiente sejam carregadas:

1. Pare o servidor (Ctrl+C)
2. Inicie novamente:
```bash
netlify dev
```

### Passo 4: Testar

Agora a função deve funcionar corretamente em:
```
http://localhost:8888/.netlify/functions/validarCRM
```

## ✅ Verificação

Se ainda estiver com erro, verifique:

1. ✅ O arquivo `.env` está na **raiz do projeto** (mesmo nível do `package.json`)?
2. ✅ O token está correto no arquivo `.env`?
3. ✅ Você **reiniciou** o `netlify dev` após criar/editar o `.env`?
4. ✅ O arquivo `.env` tem exatamente este formato (sem espaços extras):
   ```
   INFOSIMPLES_TOKEN=seu_token_aqui
   ```

## 📝 Estrutura do Projeto

```
medlista/
├── .env                    ← CRIE ESTE ARQUIVO AQUI
├── package.json
├── netlify.toml
├── netlify/
│   └── functions/
│       └── validarCRM.js
└── src/
    └── utils/
        └── useValidacaoCRM.js
```

## 🔒 Segurança

- O arquivo `.env` está no `.gitignore` e **não será commitado**
- Nunca compartilhe seu token
- Use tokens diferentes para desenvolvimento e produção

