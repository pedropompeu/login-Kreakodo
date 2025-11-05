# 🔒 Guia de Segurança

## ⚠️ ARQUIVOS SENSÍVEIS - NUNCA COMMITAR!

### 🔴 Crítico (Nunca deve estar no Git)

#### Backend
- ✅ `backend/.env` - Variáveis de ambiente
- ✅ `backend/serviceAccountKey.json` - Credenciais do Firebase Admin
- ✅ `backend/firebase-adminsdk-*.json` - Qualquer arquivo de credenciais

#### Frontend
- ✅ `frontend/.env` - Variáveis de ambiente com API keys
- ✅ `frontend/.env.local` - Variáveis locais

### ✅ O que DEVE estar no Git

#### Backend
- ✅ `backend/.env.example` - Exemplo de variáveis (sem valores reais)
- ✅ `backend/README.md` - Documentação
- ✅ `backend/package.json` - Dependências
- ✅ `backend/src/**/*.ts` - Código fonte

#### Frontend
- ✅ `frontend/.env.example` - Exemplo de variáveis (sem valores reais)
- ✅ `frontend/README.md` - Documentação
- ✅ `frontend/package.json` - Dependências
- ✅ `frontend/src/**/*` - Código fonte

## 🛡️ Checklist de Segurança

### Antes de Commitar

- [ ] Verificar se `.env` está no `.gitignore`
- [ ] Verificar se `serviceAccountKey.json` está no `.gitignore`
- [ ] Verificar se não há API keys no código
- [ ] Verificar se não há senhas hardcoded
- [ ] Verificar se não há tokens no código

### Comando para Verificar

```bash
# Verificar se há arquivos sensíveis staged
git status

# Verificar conteúdo antes de commitar
git diff --cached

# Buscar por possíveis secrets
grep -r "AIzaSy" . --exclude-dir=node_modules
grep -r "serviceAccountKey" . --exclude-dir=node_modules
grep -r "password.*:" . --exclude-dir=node_modules
```

## 🔐 Variáveis de Ambiente

### Backend (.env)

```env
# ❌ NUNCA commitar este arquivo!
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIREBASE_PROJECT_ID=seu-projeto-id
PORT=4000
```

### Frontend (.env)

```env
# ❌ NUNCA commitar este arquivo!
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

## 🚨 Se Você Commitou Dados Sensíveis

### 1. Remover do Histórico

```bash
# Remover arquivo do histórico do Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/serviceAccountKey.json" \
  --prune-empty --tag-name-filter cat -- --all

# Forçar push (CUIDADO!)
git push origin --force --all
```

### 2. Revogar Credenciais

1. Acesse o Firebase Console
2. Vá em Configurações do Projeto → Contas de Serviço
3. Delete a chave comprometida
4. Gere uma nova chave
5. Atualize localmente

### 3. Rotacionar API Keys

1. Acesse o Firebase Console
2. Vá em Configurações do Projeto
3. Restrinja a API Key
4. Ou gere uma nova

## 📋 Boas Práticas

### ✅ Fazer

- ✅ Usar variáveis de ambiente para dados sensíveis
- ✅ Adicionar `.env.example` com valores de exemplo
- ✅ Documentar quais variáveis são necessárias
- ✅ Usar `.gitignore` corretamente
- ✅ Revisar código antes de commitar
- ✅ Usar secrets do GitHub Actions para CI/CD
- ✅ Rotacionar credenciais regularmente

### ❌ Não Fazer

- ❌ Commitar arquivos `.env`
- ❌ Commitar `serviceAccountKey.json`
- ❌ Hardcodar senhas no código
- ❌ Hardcodar API keys no código
- ❌ Compartilhar credenciais por email/chat
- ❌ Usar mesmas credenciais em dev e prod
- ❌ Deixar credenciais em logs

## 🔍 Ferramentas de Verificação

### Git Secrets

```bash
# Instalar
brew install git-secrets  # macOS
apt-get install git-secrets  # Linux

# Configurar
git secrets --install
git secrets --register-aws
```

### TruffleHog

```bash
# Instalar
pip install truffleHog

# Escanear repositório
trufflehog --regex --entropy=False .
```

### GitGuardian

- Instalar extensão no GitHub
- Monitora commits automaticamente
- Alerta sobre secrets expostos

## 📞 Reportar Vulnerabilidade

Se você encontrar uma vulnerabilidade de segurança:

1. **NÃO** abra uma issue pública
2. Envie email para: pedrolpompeu@gmail.com
3. Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se tiver)

## 🔄 Rotação de Credenciais

### Frequência Recomendada

- **Desenvolvimento**: A cada 3 meses
- **Produção**: A cada 1 mês
- **Após vazamento**: Imediatamente

### Processo

1. Gerar novas credenciais
2. Atualizar em ambiente de staging
3. Testar completamente
4. Atualizar em produção
5. Revogar credenciais antigas
6. Documentar mudança

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Git Secrets](https://github.com/awslabs/git-secrets)

---

**Última atualização**: Novembro 2024

**Lembre-se**: Segurança é responsabilidade de todos! 🔒
