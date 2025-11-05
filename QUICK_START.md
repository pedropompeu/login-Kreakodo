# Quick Start - Login para Kreakodo

## 🚀 Início Rápido (5 minutos)

### Pré-requisitos
- Node.js 16+ instalado
- Projeto Firebase criado
- Credenciais do Firebase

### 1. Configurar Backend

```bash
cd backend
npm install
```

Criar arquivo `.env`:
```env
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIREBASE_PROJECT_ID=tasko-login-project
PORT=4000
```

Adicionar `serviceAccountKey.json` (baixar do Firebase Console)

Criar SuperAdmin:
```bash
npm run seed:superadmin
```

Iniciar servidor:
```bash
npm run dev
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
```

Criar arquivo `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSyDI9noxhVshtb8bQ62Vl-fzApqdC7mLPNI
VITE_FIREBASE_AUTH_DOMAIN=tasko-login-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tasko-login-project
VITE_FIREBASE_STORAGE_BUCKET=tasko-login-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=448378917482
VITE_FIREBASE_APP_ID=1:448378917482:web:bbfe6cbc4081b33c143013
```

Iniciar aplicação:
```bash
npm run dev
```

### 3. Acessar

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### 4. Login SuperAdmin

```
Email: pedrolpompeu@gmail.com
Username: @pompeu
Senha: pedro123
```

## 🔧 Configurar Firestore Rules

Acesse: https://console.firebase.google.com/project/tasko-login-project/firestore/rules

Cole as regras:

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

Clique em **Publicar**.

## ✅ Checklist de Setup

- [ ] Node.js instalado
- [ ] Projeto Firebase criado
- [ ] Backend: npm install
- [ ] Backend: .env configurado
- [ ] Backend: serviceAccountKey.json adicionado
- [ ] Backend: SuperAdmin criado
- [ ] Backend: servidor rodando
- [ ] Frontend: npm install
- [ ] Frontend: .env configurado
- [ ] Frontend: servidor rodando
- [ ] Firestore Rules publicadas
- [ ] Login funcionando

## 🐛 Troubleshooting Rápido

### Backend não inicia
```bash
# Verificar se porta 4000 está livre
lsof -i :4000

# Verificar variáveis de ambiente
cat backend/.env

# Verificar se serviceAccountKey.json existe
ls backend/serviceAccountKey.json
```

### Frontend não inicia
```bash
# Verificar se porta 5173 está livre
lsof -i :5173

# Verificar variáveis de ambiente
cat frontend/.env

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de permissão no Firestore
- Verificar se Firestore Rules estão publicadas
- Verificar se usuário está autenticado
- Verificar console do navegador (F12)

### Erro de API Key inválida
- Verificar se .env do frontend está correto
- Reiniciar servidor de desenvolvimento
- Verificar se credenciais são do projeto correto

## 📚 Documentação Completa

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Design: `design-notes.md`
- Resumo: `IMPLEMENTATION_SUMMARY.md`

## 🎯 Fluxo de Teste

1. Acesse http://localhost:5173
2. Faça login com SuperAdmin (@pompeu / pedro123)
3. Escolha "Painel Admin"
4. Veja listagem de usuários
5. Adicione um novo usuário
6. Edite o usuário
7. Promova para admin (se SuperAdmin)
8. Desative o usuário
9. Faça logout
10. Faça login com o novo usuário
11. Veja página de usuário

## 💡 Dicas

- Use `Ctrl+C` para parar os servidores
- Use `npm run dev` para desenvolvimento (hot reload)
- Use `npm run build` para produção
- Verifique logs no terminal para debug
- Use DevTools do navegador (F12) para debug frontend

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no terminal
2. Verifique console do navegador (F12)
3. Consulte README.md de cada projeto
4. Verifique se todas as dependências estão instaladas
5. Verifique se Firebase está configurado corretamente

---

**Pronto!** Seu sistema de autenticação está funcionando! 🎉
