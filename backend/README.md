# Backend - Login para Kreakodo

Sistema de autenticação backend usando Node.js, Express, TypeScript e Firebase Admin SDK.

## Tecnologias

- Node.js
- Express
- TypeScript
- Firebase Admin SDK
- Firebase Auth
- Cloud Firestore
- express-validator
- express-rate-limit
- cors

## Estrutura do Projeto

```
backend/
├── src/
│   ├── middleware/
│   │   └── authMiddleware.ts    # Middleware de autenticação JWT
│   ├── scripts/
│   │   └── seedSuperAdmin.ts    # Script para criar SuperAdmin
│   ├── __tests__/
│   │   └── app.test.ts          # Testes básicos
│   └── index.ts                 # Servidor principal
├── .env                         # Variáveis de ambiente
├── .env.example                 # Exemplo de variáveis
├── serviceAccountKey.json       # Credenciais Firebase Admin
├── package.json
└── tsconfig.json
```

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIREBASE_PROJECT_ID=tasko-login-project
PORT=4000
```

### 3. Adicionar credenciais do Firebase

Baixe o arquivo `serviceAccountKey.json` do Firebase Console:
1. Acesse https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em Configurações do Projeto → Contas de Serviço
4. Clique em "Gerar nova chave privada"
5. Salve o arquivo como `serviceAccountKey.json` na raiz do backend

### 4. Criar SuperAdmin

Execute o script para criar o usuário SuperAdmin inicial:

```bash
npm run seed:superadmin
```

Credenciais do SuperAdmin:
- Email: pedrolpompeu@gmail.com
- Username: @pompeu
- Senha: pedro123

## Executar

### Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:4000`

### Produção

```bash
npm run build
npm start
```

## Endpoints da API

### Autenticação

#### POST /api/auth/signup
Cria um novo usuário no sistema.

**Body:**
```json
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "fullName": "Nome Completo",
  "username": "@username"
}
```

**Response:** 201 Created

### Usuários

#### GET /api/users/check-username
Verifica se um username está disponível.

**Query Params:**
- `username`: Username a verificar

**Response:**
```json
{
  "available": true
}
```

#### GET /api/users/by-username/:username
Busca usuário por username (para login).

**Response:**
```json
{
  "email": "user@example.com"
}
```

#### GET /api/users
Lista todos os usuários (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Query Params:**
- `q`: Busca por nome/username
- `sort`: Campo para ordenar (name, createdAt, lastLoginAt)
- `order`: Ordem (asc, desc)
- `active`: Filtrar por status (true, false)

**Response:**
```json
[
  {
    "uid": "...",
    "email": "...",
    "fullName": "...",
    "username": "@...",
    "role": "user",
    "active": true,
    "createdAt": "...",
    "lastLoginAt": "..."
  }
]
```

#### GET /api/users/:uid
Busca detalhes de um usuário (Admin ou próprio usuário).

**Headers:**
- `Authorization: Bearer <token>`

#### PUT /api/users/:uid
Atualiza dados de um usuário (Admin ou próprio usuário).

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "fullName": "Novo Nome",
  "username": "novousername"
}
```

#### PATCH /api/users/:uid/deactivate
Desativa um usuário (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

#### POST /api/users/:uid/promote
Promove um usuário para admin (SuperAdmin only).

**Headers:**
- `Authorization: Bearer <token>`

## Segurança

- **Rate Limiting**: 100 requisições por 15 minutos nas rotas de autenticação
- **JWT Verification**: Todas as rotas protegidas verificam o token Firebase
- **Role-based Access**: Controle de acesso baseado em funções (user, admin, superadmin)
- **Input Validation**: Validação de entrada com express-validator
- **CORS**: Configurado para aceitar requisições do frontend

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']
      );
      allow delete: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin'
      );
    }
    
    match /users/{document=**} {
      allow list: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin']
      );
    }
  }
}
```

## Testes

```bash
npm test
```

## Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor em produção
- `npm test` - Executa testes
- `npm run seed:superadmin` - Cria usuário SuperAdmin

## Troubleshooting

### Erro: Invalid Firebase app options

Verifique se o arquivo `serviceAccountKey.json` está no local correto e se a variável `GOOGLE_APPLICATION_CREDENTIALS` está configurada corretamente.

### Erro: Permission denied

Verifique se as Firestore Security Rules estão configuradas corretamente no Firebase Console.

### Erro: API do Firestore não habilitada

Acesse o Firebase Console e habilite a API do Cloud Firestore para o projeto.

## Licença

MIT
