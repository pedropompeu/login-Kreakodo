# 🔐 Configuração do Login com Google

## ✅ Implementação Concluída

O login com Google foi implementado com sucesso! Agora os usuários podem:
- ✅ Fazer login com conta do Google
- ✅ Cadastrar-se com conta do Google
- ✅ Sincronização automática com Firestore

## 🚀 Como Habilitar

### Passo 1: Habilitar Google Sign-In no Firebase Console

1. Acesse: https://console.firebase.google.com/project/tasko-login-project/authentication/providers

2. Clique em **"Google"** na lista de provedores

3. Ative o botão **"Ativar"**

4. Configure:
   - **Nome do projeto**: Tasko Login
   - **E-mail de suporte**: pedrolpompeu@gmail.com (ou seu email)

5. Clique em **"Salvar"**

### Passo 2: Testar

1. Reinicie o frontend (se necessário):
   ```bash
   cd frontend
   npm run dev
   ```

2. Acesse http://localhost:5173

3. Você verá o botão **"Entrar com Google"** nos formulários

4. Clique e faça login com sua conta Google

## 🎯 Como Funciona

### Fluxo de Login com Google

```
1. Usuário clica em "Entrar com Google"
   ↓
2. Popup do Google aparece
   ↓
3. Usuário seleciona conta e autoriza
   ↓
4. Firebase Auth autentica o usuário
   ↓
5. Sistema verifica se usuário existe no Firestore
   ↓
6. Se NÃO existe → Cria documento automaticamente
   ↓
7. Se existe → Faz login normalmente
   ↓
8. Redireciona para página apropriada (admin/user)
```

### Dados Criados Automaticamente

Quando um usuário faz login com Google pela primeira vez:

```javascript
{
  uid: "google-uid-123",
  email: "usuario@gmail.com",
  fullName: "Nome do Usuário", // do perfil do Google
  username: "@usuario",         // gerado do email
  role: "user",                 // padrão
  active: true,
  createdAt: timestamp,
  lastLoginAt: timestamp
}
```

## 🔒 Segurança

### O que é Seguro

✅ **Senhas**: Google gerencia as senhas, não armazenamos
✅ **Tokens**: Firebase valida tokens automaticamente
✅ **OAuth 2.0**: Protocolo seguro do Google
✅ **HTTPS**: Todas as comunicações são criptografadas

### Permissões Solicitadas

O app solicita apenas:
- Email do usuário
- Nome do usuário
- Foto de perfil (opcional, não usado ainda)

## 🎨 Interface

### Botão de Login com Google

O botão segue as diretrizes de design do Google:
- Logo oficial do Google
- Cores corretas
- Texto apropriado
- Estados de hover e disabled

### Separador Visual

```
─────────── Ou continue com ───────────
```

Separa visualmente o login tradicional do login social.

## 🐛 Troubleshooting

### Erro: "Popup closed by user"
**Causa**: Usuário fechou o popup antes de completar o login
**Solução**: Tente novamente

### Erro: "This domain is not authorized"
**Causa**: Domínio não está na lista de domínios autorizados
**Solução**: 
1. Vá em Firebase Console → Authentication → Settings
2. Adicione `localhost` e seu domínio de produção

### Erro: "User already exists"
**Causa**: Usuário já tem conta com email/senha
**Solução**: Sistema detecta automaticamente e faz login

### Popup não abre
**Causa**: Bloqueador de popup do navegador
**Solução**: Permitir popups para localhost

## 📊 Estatísticas

Após implementação, você pode ver:
- Número de logins com Google vs email/senha
- Taxa de conversão de cadastro
- Usuários ativos por método de login

Acesse: https://console.firebase.google.com/project/tasko-login-project/authentication/users

## 🔄 Sincronização Firebase ↔ Firestore

### Como Funciona

1. **Firebase Auth** armazena:
   - Email
   - UID
   - Provedor (google.com)
   - Última vez que fez login

2. **Firestore** armazena:
   - Todos os dados do perfil
   - Role (user/admin/superadmin)
   - Status (ativo/inativo)
   - Preferências

3. **Sincronização**:
   - Ao fazer login → Busca dados do Firestore
   - Se não existir → Cria automaticamente
   - Atualiza lastLoginAt

### Verificar Sincronização

```bash
# No backend, execute:
cd backend
npm run seed:superadmin

# Depois verifique:
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \
FIREBASE_PROJECT_ID=tasko-login-project \
./node_modules/.bin/ts-node scripts/checkSuperAdmin.ts
```

## 🚀 Próximos Passos

### Melhorias Futuras

- [ ] Adicionar login com Facebook
- [ ] Adicionar login com GitHub
- [ ] Adicionar login com Microsoft
- [ ] Permitir vincular múltiplos provedores
- [ ] Adicionar foto de perfil do Google
- [ ] Sincronizar foto automaticamente

### Para Produção

- [ ] Configurar domínio autorizado
- [ ] Adicionar política de privacidade
- [ ] Adicionar termos de uso
- [ ] Configurar OAuth consent screen
- [ ] Testar em diferentes navegadores

## 📝 Código de Exemplo

### Usar em Outros Componentes

```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  console.log('Logged in:', user.email);
}
```

### Verificar Provedor

```typescript
const user = auth.currentUser;
const providerData = user?.providerData[0];

if (providerData?.providerId === 'google.com') {
  console.log('User logged in with Google');
}
```

## ✅ Checklist de Configuração

- [ ] Google Sign-In habilitado no Firebase Console
- [ ] Domínio autorizado (localhost)
- [ ] Email de suporte configurado
- [ ] Frontend reiniciado
- [ ] Testado login com Google
- [ ] Testado cadastro com Google
- [ ] Verificado sincronização com Firestore

## 🎉 Pronto!

Agora seu sistema tem login com Google totalmente funcional e sincronizado!

---

**Última atualização**: Novembro 2024
