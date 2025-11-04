# Frontend - Login para Kreakodo

Interface web responsiva para sistema de autenticação usando React, TypeScript, TailwindCSS e Firebase.

## Tecnologias

- React 18
- TypeScript
- Vite
- TailwindCSS
- Firebase Client SDK (Auth + Firestore)
- React Router DOM

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx           # Formulário de login
│   │   ├── SignupForm.tsx          # Formulário de cadastro
│   │   ├── UserListItem.tsx        # Item da lista de usuários
│   │   ├── AddUserModal.tsx        # Modal para adicionar usuário
│   │   └── EditUserModal.tsx       # Modal para editar usuário
│   ├── contexts/
│   │   └── AuthContext.tsx         # Context de autenticação
│   ├── pages/
│   │   ├── AuthPage.tsx            # Página de login/cadastro
│   │   ├── AdminPage.tsx           # Painel administrativo
│   │   ├── UserPage.tsx            # Página do usuário
│   │   └── RoleSelectionPage.tsx   # Seleção de papel (SuperAdmin)
│   ├── App.tsx                     # Componente principal
│   ├── main.tsx                    # Entry point
│   ├── firebase.ts                 # Configuração Firebase
│   └── index.css                   # Estilos globais
├── .env                            # Variáveis de ambiente
├── .env.example                    # Exemplo de variáveis
├── package.json
├── tailwind.config.js
├── postcss.config.cjs
└── vite.config.ts
```

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

Para obter essas credenciais:
1. Acesse https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em Configurações do Projeto
4. Role até "Seus aplicativos" e selecione o app Web
5. Copie as credenciais do `firebaseConfig`

### 3. Executar

```bash
npm run dev
```

O aplicativo estará rodando em `http://localhost:5173`

## Funcionalidades

### Página de Autenticação (/auth)

- **Cadastro**: Formulário com validação em tempo real
  - Email (obrigatório, validado)
  - Nome completo (obrigatório)
  - Username (obrigatório, prefixado com @)
  - Senha e confirmação (obrigatórios, mínimo 6 caracteres)
  
- **Login**: Aceita email ou username
  - Email ou Username (com ou sem @)
  - Senha
  - Link "Esqueci a senha" para recuperação

### Página do Usuário (/user)

- Mensagem de boas-vindas personalizada
- Animação de beijo
- Botão de logout

### Painel Admin (/admin)

Disponível para usuários com role `admin` ou `superadmin`:

- **Listagem de usuários** com informações completas
- **Busca** por nome, username ou email
- **Filtros**:
  - Status (Todos, Ativos, Inativos)
  - Ordenação (Nome, Data de cadastro, Último login)
- **Ações**:
  - Editar usuário
  - Desativar usuário
  - Promover para admin (apenas SuperAdmin)
  - Adicionar novo usuário
  - Enviar convite (em desenvolvimento)

### Seleção de Papel (/select-role)

Disponível apenas para SuperAdmin:
- Escolher entre acessar como Admin ou User
- Interface visual com ícones

## Rotas

- `/auth` - Página de login e cadastro
- `/` - Redireciona baseado no papel do usuário
- `/select-role` - Seleção de papel (SuperAdmin only)
- `/admin` - Painel administrativo (Admin/SuperAdmin only)
- `/user` - Página do usuário (Autenticado)

## Fluxo de Autenticação

1. Usuário faz login ou cadastro
2. Firebase Auth autentica o usuário
3. Sistema busca dados do usuário no Firestore
4. Redirecionamento baseado no papel:
   - SuperAdmin → `/select-role`
   - Admin → `/admin`
   - User → `/user`

## Validações

### Cadastro
- Email válido
- Nome completo não vazio
- Username único (verificado via API)
- Senha mínimo 6 caracteres
- Senhas devem coincidir

### Login
- Aceita email ou username (com ou sem @)
- Busca email via API se username for fornecido
- Autentica via Firebase Auth

## Componentes Principais

### AuthContext
Gerencia estado de autenticação:
- `currentUser`: Usuário autenticado do Firebase
- `userProfile`: Dados do usuário do Firestore
- `loading`: Estado de carregamento

### ProtectedRoute
Componente de rota protegida que:
- Verifica autenticação
- Verifica permissões (admin, superadmin)
- Redireciona usuários não autorizados

## Estilos

O projeto usa TailwindCSS para estilização:
- Design responsivo (mobile-first)
- Componentes reutilizáveis
- Animações CSS customizadas
- Tema consistente com cores:
  - Azul: Ações primárias
  - Verde: Sucesso/Confirmação
  - Vermelho: Ações destrutivas
  - Roxo: SuperAdmin

## Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

## Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Troubleshooting

### Erro: Module not found

Execute `npm install` para instalar todas as dependências.

### Erro: Firebase API Key inválida

Verifique se as variáveis de ambiente no `.env` estão corretas e reinicie o servidor de desenvolvimento.

### Erro: Permission denied (Firestore)

Verifique se as Firestore Security Rules estão configuradas corretamente no Firebase Console.

### Página em branco após login

Abra o console do navegador (F12) para ver erros. Geralmente relacionado a:
- Credenciais Firebase incorretas
- Regras do Firestore bloqueando acesso
- Documento do usuário não criado no Firestore

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## Licença

MIT
