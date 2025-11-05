# Guia de Integração com Tasko

## 📋 Visão Geral

Este documento descreve como integrar o sistema de autenticação com o Tasko (sistema de gerenciamento de tarefas).

## 🔗 Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE AUTENTICAÇÃO                   │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  Firebase    │         │   Backend    │                 │
│  │    Auth      │◄────────┤   Express    │                 │
│  └──────────────┘         └──────────────┘                 │
│         │                         │                         │
│         │                         │                         │
│         ▼                         ▼                         │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  Firestore   │         │   REST API   │                 │
│  │   (Users)    │         │  Endpoints   │                 │
│  └──────────────┘         └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ JWT Token
                              │ User Info
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         TASKO                                │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Boards     │         │    Tasks     │                 │
│  │  (Quadros)   │◄────────┤  (Tarefas)   │                 │
│  └──────────────┘         └──────────────┘                 │
│         │                         │                         │
│         │                         │                         │
│         ▼                         ▼                         │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Members    │         │  Activities  │                 │
│  │  (Membros)   │         │ (Atividades) │                 │
│  └──────────────┘         └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Fluxo de Autenticação

### 1. Login no Sistema de Autenticação
```javascript
// Usuário faz login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "fullName": "João Silva",
    "username": "@joao",
    "role": "user"
  }
}
```

### 2. Tasko Valida o Token
```javascript
// Tasko faz requisição para validar token
GET /api/auth/verify
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Resposta
{
  "valid": true,
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### 3. Tasko Usa as Informações do Usuário
```javascript
// Tasko cria/atualiza perfil local
// Associa tarefas ao uid do usuário
// Verifica permissões baseado no role
```

## 📡 Endpoints para Integração

### Verificar Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <token>

Response:
{
  "valid": boolean,
  "user": {
    "uid": string,
    "email": string,
    "fullName": string,
    "username": string,
    "role": "user" | "admin" | "superadmin"
  }
}
```

### Obter Informações do Usuário
```
GET /api/users/:uid
Headers: Authorization: Bearer <token>

Response:
{
  "uid": string,
  "email": string,
  "fullName": string,
  "username": string,
  "role": string,
  "active": boolean,
  "createdAt": timestamp,
  "lastLoginAt": timestamp
}
```

### Listar Usuários (para adicionar membros)
```
GET /api/users?q=search&active=true
Headers: Authorization: Bearer <token>

Response:
[
  {
    "uid": string,
    "email": string,
    "fullName": string,
    "username": string,
    "role": string,
    "active": boolean
  }
]
```

### Webhook de Eventos
```
POST /api/webhooks/user-events
{
  "event": "user.created" | "user.updated" | "user.deleted",
  "user": {
    "uid": string,
    "email": string,
    "fullName": string,
    "username": string
  },
  "timestamp": timestamp
}
```

## 🔄 Sincronização de Dados

### Estrutura de Dados Compartilhados

#### Firestore Collection: `users`
```javascript
{
  uid: "abc123",
  email: "user@example.com",
  fullName: "João Silva",
  username: "@joao",
  role: "user",
  active: true,
  createdAt: timestamp,
  lastLoginAt: timestamp,
  
  // Campos para integração com Tasko
  taskoProfile: {
    boardsCount: 5,
    tasksCount: 23,
    lastActivity: timestamp,
    preferences: {
      theme: "light",
      notifications: true
    }
  }
}
```

#### Firestore Collection: `tasko_boards` (no Tasko)
```javascript
{
  id: "board123",
  name: "Projeto X",
  description: "Descrição do projeto",
  owner: "abc123", // uid do usuário
  members: [
    {
      uid: "abc123",
      role: "owner",
      addedAt: timestamp
    },
    {
      uid: "def456",
      role: "member",
      addedAt: timestamp
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🛡️ Permissões e Roles

### Mapeamento de Roles

| Role Sistema Auth | Permissões no Tasko |
|-------------------|---------------------|
| `user` | - Criar boards pessoais<br>- Criar tarefas<br>- Participar de boards compartilhados |
| `admin` | - Todas as permissões de user<br>- Ver todos os boards<br>- Gerenciar usuários em boards<br>- Ver estatísticas |
| `superadmin` | - Todas as permissões de admin<br>- Deletar qualquer board<br>- Acessar logs do sistema<br>- Gerenciar configurações globais |

### Verificação de Permissões no Tasko

```javascript
// Exemplo de verificação no Tasko
async function canEditBoard(userId, boardId) {
  // 1. Buscar informações do usuário do sistema de auth
  const user = await fetch(`http://localhost:4000/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // 2. Verificar role
  if (user.role === 'superadmin' || user.role === 'admin') {
    return true;
  }
  
  // 3. Verificar se é owner ou member do board
  const board = await getBoard(boardId);
  return board.owner === userId || 
         board.members.some(m => m.uid === userId);
}
```

## 🔔 Sistema de Notificações

### Eventos que o Tasko deve escutar

1. **user.created** - Novo usuário criado
2. **user.updated** - Perfil atualizado
3. **user.deactivated** - Usuário desativado
4. **user.activated** - Usuário reativado
5. **user.promoted** - Usuário promovido para admin
6. **user.deleted** - Usuário deletado

### Implementação de Webhook

```javascript
// No sistema de autenticação (backend)
async function notifyTasko(event, userData) {
  try {
    await fetch('http://tasko-api/webhooks/user-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.TASKO_WEBHOOK_SECRET
      },
      body: JSON.stringify({
        event,
        user: userData,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Error notifying Tasko:', error);
  }
}

// Exemplo de uso
await db.collection('users').doc(uid).update({ active: false });
await notifyTasko('user.deactivated', { uid, email, fullName });
```

## 🚀 Implementação Passo a Passo

### Fase 1: Setup Básico (Semana 1)

1. **Criar endpoints de integração no sistema de auth**
   - [ ] GET /api/auth/verify
   - [ ] GET /api/users/:uid
   - [ ] GET /api/users (com filtros)

2. **Implementar validação de token no Tasko**
   - [ ] Middleware de autenticação
   - [ ] Cache de tokens válidos
   - [ ] Refresh automático

3. **Sincronizar estrutura de dados**
   - [ ] Adicionar campos taskoProfile em users
   - [ ] Criar índices no Firestore
   - [ ] Documentar schema

### Fase 2: Webhooks (Semana 2)

1. **Implementar webhooks no sistema de auth**
   - [ ] Endpoint POST /api/webhooks/register
   - [ ] Sistema de retry em falhas
   - [ ] Logs de webhooks

2. **Implementar receptor no Tasko**
   - [ ] Endpoint POST /webhooks/user-events
   - [ ] Validação de assinatura
   - [ ] Processamento assíncrono

### Fase 3: Permissões (Semana 3)

1. **Implementar verificação de permissões**
   - [ ] Middleware de autorização
   - [ ] Cache de permissões
   - [ ] Logs de acesso

2. **Testes de integração**
   - [ ] Testes de autenticação
   - [ ] Testes de permissões
   - [ ] Testes de webhooks

### Fase 4: Otimização (Semana 4)

1. **Performance**
   - [ ] Implementar cache Redis
   - [ ] Otimizar queries
   - [ ] Monitoramento

2. **Documentação**
   - [ ] Atualizar documentação de API
   - [ ] Criar exemplos de código
   - [ ] Vídeos tutoriais

## 📊 Monitoramento

### Métricas Importantes

1. **Autenticação**
   - Taxa de sucesso de login
   - Tempo de resposta de validação de token
   - Número de tokens ativos

2. **Sincronização**
   - Taxa de sucesso de webhooks
   - Latência de sincronização
   - Erros de integração

3. **Performance**
   - Tempo de resposta de endpoints
   - Uso de cache
   - Queries por segundo

### Ferramentas Recomendadas

- **Sentry**: Monitoramento de erros
- **DataDog**: Métricas e logs
- **Firebase Performance**: Performance do Firestore
- **Grafana**: Dashboards customizados

## 🔒 Segurança

### Checklist de Segurança

- [ ] Usar HTTPS em todas as comunicações
- [ ] Validar assinatura de webhooks
- [ ] Implementar rate limiting
- [ ] Rotacionar secrets regularmente
- [ ] Auditar logs de acesso
- [ ] Implementar CORS corretamente
- [ ] Validar todos os inputs
- [ ] Usar tokens com expiração curta

## 📝 Exemplo de Código Completo

### Frontend do Tasko

```typescript
// tasko/src/services/auth.ts
import { auth } from './firebase';

export async function getUserInfo(uid: string) {
  const token = await auth.currentUser?.getIdToken();
  
  const response = await fetch(`http://localhost:4000/api/users/${uid}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user info');
  }
  
  return response.json();
}

export async function searchUsers(query: string) {
  const token = await auth.currentUser?.getIdToken();
  
  const response = await fetch(
    `http://localhost:4000/api/users?q=${query}&active=true`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to search users');
  }
  
  return response.json();
}
```

### Backend do Tasko

```typescript
// tasko-backend/src/middleware/auth.ts
import admin from 'firebase-admin';

export async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## 🎯 Próximos Passos

1. Revisar este guia com a equipe do Tasko
2. Definir cronograma de implementação
3. Criar ambiente de staging para testes
4. Implementar fase 1
5. Testar integração
6. Deploy em produção

## 📞 Contato

Para dúvidas sobre a integração, entre em contato com a equipe de desenvolvimento.

---

**Última atualização**: Novembro 2024
