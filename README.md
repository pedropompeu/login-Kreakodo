# 🔐 Sistema de Autenticação - Kreakodo

Sistema completo de autenticação desenvolvido com TypeScript, React, Express e Firebase, preparado para integração futura com o Tasko (sistema de gerenciamento de tarefas tipo Trello).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

## 🚀 Funcionalidades

### Autenticação
- ✅ Login com email e senha
- ✅ Login com username (com ou sem @)
- ✅ Login com Google (OAuth 2.0)
- ✅ Cadastro de novos usuários
- ✅ Recuperação de senha
- ✅ Sincronização Firebase Auth ↔ Firestore

### Sistema de Roles
- ✅ **User** - Usuário comum
- ✅ **Admin** - Administrador com acesso ao painel
- ✅ **SuperAdmin** - Acesso total + escolha de papel

### Painel Administrativo
- ✅ Listagem completa de usuários
- ✅ Busca por nome, username ou email
- ✅ Filtros (status, ordenação)
- ✅ Editar perfil de usuários
- ✅ Ativar/desativar usuários
- ✅ Promover usuários para admin
- ✅ Adicionar novos usuários

### UX/UI
- ✅ Design responsivo (mobile-first)
- ✅ Notificações toast em tempo real
- ✅ Loading states
- ✅ Validações em tempo real
- ✅ Feedback visual completo

### Segurança
- ✅ Verificação de Firebase ID Token
- ✅ Rate limiting (100 req/15min)
- ✅ Input validation (express-validator)
- ✅ Firestore Security Rules
- ✅ CORS configurado
- ✅ Proteção de dados sensíveis

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- TypeScript
- Firebase Admin SDK
- Firestore
- express-validator
- express-rate-limit
- Jest + Supertest

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Firebase Client SDK
- React Router DOM

## 📦 Estrutura do Projeto

```
teste-do-teste/
├── backend/                 # API REST com Express
│   ├── src/
│   │   ├── middleware/     # Middlewares de autenticação
│   │   ├── __tests__/      # Testes
│   │   └── index.ts        # Servidor principal
│   ├── scripts/            # Scripts utilitários
│   └── package.json
│
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # React Contexts
│   │   ├── pages/         # Páginas da aplicação
│   │   └── firebase.ts    # Configuração Firebase
│   └── package.json
│
└── docs/                  # Documentação (não commitada)
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20.16+
- npm ou yarn
- Conta no Firebase
- Git

### 1. Clonar o Repositório

```bash
git clone https://github.com/pedropompeu/login-Kreakodo.git
cd login-Kreakodo
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com suas credenciais
# Adicionar serviceAccountKey.json do Firebase
```

### 3. Configurar Frontend

```bash
cd frontend
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com suas credenciais do Firebase
```

### 4. Criar SuperAdmin

```bash
cd backend
npm run seed:superadmin
```

### 5. Executar

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Acessar

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### 7. Login SuperAdmin

- Email: `pedrolpompeu@gmail.com`
- Username: `@pompeu` ou `pompeu`
- Senha: `pedro123`

## 📚 Documentação

- [Backend README](backend/README.md) - Documentação completa do backend
- [Frontend README](frontend/README.md) - Documentação completa do frontend
- [Quick Start](QUICK_START.md) - Guia rápido de início
- [Security Guide](SECURITY.md) - Guia de segurança
- [Integration Guide](INTEGRATION_GUIDE.md) - Integração com Tasko
- [Roadmap](ROADMAP.md) - Plano de desenvolvimento

## 🔒 Segurança

Este projeto implementa múltiplas camadas de segurança:

- Firebase Auth para gerenciamento de senhas
- Firestore Security Rules
- Verificação de tokens JWT
- Rate limiting
- Input validation
- CORS configurado
- Dados sensíveis protegidos (.gitignore)

**⚠️ IMPORTANTE**: Nunca commite arquivos `.env` ou `serviceAccountKey.json`!

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend (quando implementado)
cd frontend
npm test
```

## 🚀 Deploy

### Firebase Hosting

```bash
# Build
cd frontend
npm run build

# Deploy
firebase deploy --only hosting
```

### Backend (Firebase Functions ou servidor próprio)

```bash
cd backend
npm run build
# Deploy conforme sua infraestrutura
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Pedro Pompeu**
- Email: pedrolpompeu@gmail.com
- GitHub: [@pedropompeu](https://github.com/pedropompeu)

## 🙏 Agradecimentos

- Firebase pela infraestrutura
- React e Vite pela experiência de desenvolvimento
- TailwindCSS pelo design system
- Comunidade open source

## 📊 Status do Projeto

🟢 **Ativo** - Em desenvolvimento ativo

### Próximas Funcionalidades

- [ ] Testes e2e com Cypress
- [ ] Documentação de API com Swagger
- [ ] Sistema de convites por email
- [ ] Foto de perfil
- [ ] 2FA (autenticação de dois fatores)
- [ ] Integração com Tasko

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

---

**Desenvolvido com ❤️ para integração com Tasko**
