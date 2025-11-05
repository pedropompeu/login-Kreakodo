# 🚀 Guia de Inicialização do Git

## ⚠️ IMPORTANTE: Ler ANTES de inicializar o Git!

Este guia garante que você não commitará dados sensíveis acidentalmente.

## 📋 Checklist Pré-Inicialização

### 1. Verificar Arquivos Sensíveis

Certifique-se de que estes arquivos existem e estão protegidos:

```bash
# Verificar se .gitignore existe
ls -la .gitignore
ls -la backend/.gitignore
ls -la frontend/.gitignore

# Verificar se arquivos sensíveis existem
ls -la backend/.env
ls -la backend/serviceAccountKey.json
ls -la frontend/.env
```

### 2. Verificar Conteúdo do .gitignore

```bash
# Ver conteúdo
cat .gitignore
cat backend/.gitignore
cat frontend/.gitignore
```

Deve incluir:
- ✅ `.env`
- ✅ `serviceAccountKey.json`
- ✅ `node_modules/`
- ✅ `dist/`

## 🔧 Inicialização Segura

### Passo 1: Inicializar Git

```bash
# Na raiz do projeto
git init
```

### Passo 2: Verificar Status

```bash
# Ver o que será commitado
git status
```

**⚠️ ATENÇÃO**: Se você ver algum destes arquivos, PARE!
- ❌ `backend/.env`
- ❌ `backend/serviceAccountKey.json`
- ❌ `frontend/.env`

### Passo 3: Adicionar Arquivos

```bash
# Adicionar apenas arquivos seguros
git add .gitignore
git add backend/.gitignore
git add frontend/.gitignore
git add README.md
git add SECURITY.md
git add backend/src/
git add frontend/src/
git add backend/package.json
git add frontend/package.json
git add backend/tsconfig.json
git add frontend/tsconfig.json

# Verificar novamente
git status
```

### Passo 4: Primeiro Commit

```bash
git commit -m "Initial commit: Sistema de autenticação

- Backend com Express + TypeScript + Firebase
- Frontend com React + TypeScript + TailwindCSS
- Sistema de roles (user, admin, superadmin)
- Login com email/username e Google
- Painel administrativo completo
- Documentação completa"
```

### Passo 5: Adicionar Remote (GitHub)

```bash
# Criar repositório no GitHub primeiro
# Depois:
git remote add origin https://github.com/seu-usuario/seu-repo.git
git branch -M main
git push -u origin main
```

## 🔍 Verificação de Segurança

### Antes de Cada Commit

```bash
# 1. Ver o que será commitado
git status

# 2. Ver diferenças
git diff

# 3. Ver arquivos staged
git diff --cached

# 4. Buscar por secrets
grep -r "AIzaSy" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "serviceAccountKey" . --exclude-dir=node_modules --exclude-dir=.git
```

### Comandos Úteis

```bash
# Ver histórico
git log --oneline

# Ver arquivos ignorados
git status --ignored

# Remover arquivo do staging
git reset HEAD arquivo.txt

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1
```

## 🚨 Se Você Commitou Algo Sensível

### Antes de Fazer Push

```bash
# Desfazer último commit
git reset --soft HEAD~1

# Ou desfazer e descartar mudanças
git reset --hard HEAD~1
```

### Depois de Fazer Push

1. **PARE IMEDIATAMENTE**
2. Siga o guia em `SECURITY.md`
3. Revogue as credenciais comprometidas
4. Limpe o histórico do Git
5. Force push (com cuidado!)

## 📝 Estrutura Recomendada de Commits

### Tipos de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

### Exemplos

```bash
git commit -m "feat: adicionar login com Google"
git commit -m "fix: corrigir redirecionamento do superadmin"
git commit -m "docs: atualizar README com instruções de setup"
git commit -m "refactor: melhorar tratamento de erros"
```

## 🔐 Configurar Git Secrets (Opcional mas Recomendado)

### Instalar

```bash
# macOS
brew install git-secrets

# Linux
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
sudo make install
```

### Configurar

```bash
# No seu repositório
git secrets --install
git secrets --register-aws

# Adicionar padrões customizados
git secrets --add 'AIzaSy[0-9A-Za-z_-]{33}'
git secrets --add 'serviceAccountKey'
git secrets --add 'private_key'
```

### Escanear

```bash
# Escanear arquivos staged
git secrets --scan

# Escanear todo o histórico
git secrets --scan-history
```

## 📦 Arquivos que DEVEM ser Commitados

### Raiz
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `SECURITY.md`
- ✅ `ROADMAP.md`
- ✅ `INTEGRATION_GUIDE.md`
- ✅ `GOOGLE_LOGIN_SETUP.md`
- ✅ `GIT_SETUP.md` (este arquivo)

### Backend
- ✅ `backend/.gitignore`
- ✅ `backend/.env.example`
- ✅ `backend/README.md`
- ✅ `backend/package.json`
- ✅ `backend/tsconfig.json`
- ✅ `backend/jest.config.js`
- ✅ `backend/src/**/*.ts`
- ✅ `backend/scripts/**/*.ts`

### Frontend
- ✅ `frontend/.gitignore`
- ✅ `frontend/.env.example`
- ✅ `frontend/README.md`
- ✅ `frontend/package.json`
- ✅ `frontend/tsconfig.json`
- ✅ `frontend/vite.config.ts`
- ✅ `frontend/tailwind.config.js`
- ✅ `frontend/postcss.config.cjs`
- ✅ `frontend/src/**/*`
- ✅ `frontend/index.html`

## 📦 Arquivos que NUNCA devem ser Commitados

### Backend
- ❌ `backend/.env`
- ❌ `backend/serviceAccountKey.json`
- ❌ `backend/node_modules/`
- ❌ `backend/dist/`
- ❌ `backend/*.log`

### Frontend
- ❌ `frontend/.env`
- ❌ `frontend/.env.local`
- ❌ `frontend/node_modules/`
- ❌ `frontend/dist/`
- ❌ `frontend/.vite/`

## 🎯 Workflow Recomendado

### Desenvolvimento Diário

```bash
# 1. Criar branch para feature
git checkout -b feat/nova-funcionalidade

# 2. Fazer mudanças
# ... código ...

# 3. Verificar mudanças
git status
git diff

# 4. Adicionar arquivos
git add .

# 5. Verificar o que será commitado
git status
git diff --cached

# 6. Commit
git commit -m "feat: adicionar nova funcionalidade"

# 7. Push
git push origin feat/nova-funcionalidade

# 8. Criar Pull Request no GitHub
```

### Antes de Merge

```bash
# 1. Atualizar main
git checkout main
git pull origin main

# 2. Voltar para branch
git checkout feat/nova-funcionalidade

# 3. Rebase
git rebase main

# 4. Resolver conflitos (se houver)

# 5. Force push
git push origin feat/nova-funcionalidade --force

# 6. Merge via Pull Request
```

## 📚 Recursos

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Secrets](https://github.com/awslabs/git-secrets)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Lembre-se**: Sempre verifique antes de commitar! 🔍

**Última atualização**: Novembro 2024
