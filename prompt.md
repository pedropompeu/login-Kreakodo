#Lembrando que uso vscode e debian 12.

#Criar um sistema do zero, um sistema simples, com backend e frontend e banco de dados.

#As ferramentas que eu quero que sejam utilizadas são typescrit, nodejs, react e TailwindCSS, para o banco de dados vamo uitlizar o firebase pois possuo o google one (mas vou também precisar aprender a utilizar o firebese para configurar).

#A ideia do sistema é criar sistema de login. 
Precisa ser um sistema que seja seguro. E válido.
    • Criar cadastro de usuario
        ◦ Com e-mail válido e obrigatório;
        ◦ Com Nome completo e obrigatório;
        ◦ Username para login (Utilizar ‘@UserName’ é uma boa prática?) e obrigatório;
        ◦ Senha e obrigatório ;
        ◦ Confirmação de senha e obrigatório;
        ◦ Senha e Confirmação de senha precisam ser iguais.
    • Tela de cadastro e Login podem ficar na mesma tela.
        ◦ Parte de cadastro ficando à esquerda da pagina com os campos alinhados e do mesmo tamanho.
        ◦ Parte de Login ficará na direita da tela. Tambem alinhados os campos de mesmo tamanho.
            ▪ Esqueci a senha deverá ter também.
    • Criar meu SuperAdmin
        ◦ Criar um usuário Admin-master (que serei eu @pompeu)
            ▪ Com e-mail válido: pedrolpompeu@gmail.com
            ▪ Com Nome completo: Pedro Pompeu
            ▪ Username para login: @pompeu
            ▪ Senha: pedro123
            ▪ Confirmação de senha; pedro123
    • Salvar o usuário no banco de dados(FireBase);
    • Criar uma intarface de admin
        ◦ Entro com meu login (@pedro) e senha;
        ◦ Vai aparecer 2 botoes para escolher entre (Admin) e (User);
        ◦ Admin → 
            ▪ contem a listagem completa dos usuários cadastrados na plataforma;
            ▪ Barra de busca para procurar usuário específico;
            ▪ Possibilidaed de filtrar por categorias;
                • Ordem alfabética nome;
                • Ordem de data de cadastro;
                • Ultimo login ativo;
            ▪ Criar botões de editar e remover usuário
                • Não remover usuário, só deixar inativo não permitindo que ele acesse o sistema;
                    ◦ Mostrar uma mensagem para o usuário que precisa entrar em contato com suporte [Clique aqui! (Por hora deixar um link inoperante # )]
            ▪ Criar Botão de Adicionar novo usuário.
                • Nesse botão abre um popup perguntando se eu quero adicionar um novo → Ai ir para um cadastro de novo usuário dentro do mesmo popup.
                • Ou, Outro botão enviar convite, via link do da pagina da rota de criar novo usuário;
    • Criar interface de User;
        ◦ Só mente deixar uma mensagem → “Olá, @UserName! Bem-Vindo(a) ao nosso sistema. Em breve terá nova atualização. Obrigado pela paciência! Um grande Beijo da equipe KreaKodo! (emoji de beijo ou gif em loop de uma boca mandando beijo)”


#### PERGUNTE CASO TENHA ALGUMA PERGUNTA PARA FACILITAR O PROCESSO ####


Questões Técnicas
    1. Arquitetura: quer que o backend e o frontend fiquem no mesmo repositório (monorepo) ou separados (ex: frontend/ e backend/)?
Dois repositorios distintos. Mas no mesmo root de teste 
- teste-do-teste/backend
- teste-do-teste/frontend
    2. Node.js + Firebase:
Deseja que o backend seja uma API REST em Node/Express apenas para validações e intermediação com o Firebase Auth e Firestore,
ou quer usar apenas o Firebase diretamente no frontend (sem backend)?
       - API REST em Node/Express
    3. Autenticação:
Deseja usar o Firebase Authentication com e-mail/senha, ou quer que o sistema armazene os usuários manualmente em uma coleção users?
       - Os dois? O user pode escolher como cadastrar.  E no Firebase Authentication  e a parte do UserName que utilizaremos o @ fazer automático como dado que firebase fornece.
    4. Banco de dados:
Pretende usar Cloud Firestore (banco NoSQL moderno do Firebase) ou Realtime Database (mais antigo e menos estruturado)?
       -  Cloud Firestore
    5. Hospedagem:
Vai querer implantar o sistema no Firebase Hosting (gratuito com integração direta) ou apenas rodar localmente no VSCode?
       - Primeiro momento só localmente, mas futuramente será escalável e devo decidir se será o Firebase Hosting (Muito provavelmente que sim);
    6. Interface Admin:
        ◦ Quer que apenas o SuperAdmin (@pompeu) tenha acesso ao painel de administração? 
          - SIM, só o SuperAdmin terá acesso
        ◦ Quer que outros usuários possam ser promovidos a admin?
          - Podemos criar um botão para promover para que a pessoa possa acessar a Interface Admin.
    7. Design:
Deseja um layout mais clean corporativo (estilo dashboard) ou algo mais criativo/futurista com cores e animações Tailwind?
Quero algo clean corporativo porem que tenham animações. Precisa ser responsivo.
    8. Segurança:
Deseja que o sistema tenha validação em tempo real (frontend) e também revalidação no backend/Firebase?
Sim
    9. Internacionalização:
Deseja manter o sistema em português apenas ou quer suporte a inglês futuramente?
No momento, apenas português, não será necessário outras linguagens.
    10. Prompt Final:
O objetivo é gerar um prompt completo para o ChatGPT (para que ele crie todo o sistema), certo?
Ou você quer que eu já monte o projeto base passo a passo aqui (com comandos, estrutura e código)?
O Prompt será utilizado para ser enviado para 2 inteligencias artificiais diferentes, para que eu possa verificar qual delas entrega o melhor potencial. Porem não será utilizdo no ChatGPT. 
A ideia é escrever um prompt que seja capaz de criar do zero. 
Caso ache mais prudente, podemos também criar prompts sequenciais para que a ia entenda os passoas que ela deve seguir.

###CASO HAJA MAIS DÚVIDAS, ME PERGUNTAR.

       Prompt principal 
Objetivo:
Criar um sistema de autenticação completo, seguro e válido usando TypeScript, Node.js (Express), React, TailwindCSS e Firebase (Auth + Cloud Firestore). Projeto em dois repositórios separados dentro do mesmo root de teste: teste-do-teste/backend e teste-do-teste/frontend. Deve rodar localmente no VSCode/Debian 12 e ser escalável para deploy no Firebase Hosting no futuro.

Entregáveis obrigatórios
    1. Dois repositórios (ou pastas) com histórico inicial (código mínimo):
        ◦ teste-do-teste/backend — Node.js + Express + TypeScript + Firebase Admin SDK
        ◦ teste-do-teste/frontend — React + TypeScript + TailwindCSS + Firebase Client SDK
    2. Documentação README.md em cada repo com comandos de setup, variáveis de ambiente e como rodar localmente.
    3. Script/rota para criar um SuperAdmin inicial com dados fornecidos (seed).
    4. CRUD de usuários via REST no backend com autenticação/autorizações corretas.
    5. Interface web responsiva (login + cadastro na mesma página) e painel Admin/Usuário.
    6. Regras de segurança do Firestore e exemplos de validação tanto no frontend quanto no backend.
    7. Exemplos de testes básicos (unitários ou e2e mínimos — ex: jest + supertest ou Cypress).

Requisitos funcionais e UX
    • Página única (rota /auth) com lado esquerdo formulário de Cadastro e lado direito formulário de Login. Campos alinhados e do mesmo tamanho. Responsivo: em telas pequenas, empilhar verticalmente.
    • Cadastro (validações):
        ◦ email (obrigatório, válido)
        ◦ fullName (Nome completo, obrigatório)
        ◦ username (obrigatório) — salvar sempre com prefixo @ automaticamente (ex.: user → @user)
        ◦ password e passwordConfirmation (obrigatórios e iguais)
    • Login via username (com @ opcional na entrada — aceitar com ou sem @) e password. Também permitir login por email (via Firebase Auth).
    • Link Esqueci a senha que envia e-mail de recuperação (Firebase Auth).
    • Após login:
        ◦ Se SuperAdmin (@pompeu, email pedrolpompeu@gmail.com) → mostrar tela de escolha entre Admin e User.
        ◦ Admin → painel com listagem completa de usuários, busca, filtros (alfabética por nome, data de cadastro, último login ativo), botões Editar / Desativar (não deletar), botão Adicionar novo usuário (abre popup com formulário de cadastro) e botão Enviar convite (gera link inativo por ora).
        ◦ User → apenas mensagem: Olá, @UserName! Bem-Vindo(a) ao nosso sistema. Em breve terá nova atualização. Obrigado pela paciência! Um grande Beijos da equipe KreaKodo! com emoji/gif de beijo em loop (usar gif público ou animação CSS).
    • Só o SuperAdmin tem acesso ao painel admin inicialmente. Incluir botão para promover outros usuários a admin (persistir flag no Firestore).

Arquitetura e fluxos
    • Frontend:
        ◦ Usa Firebase Client SDK para autenticação e Firestore leitura/escrita, MAS também chama a API backend para operações que exigem validação/autorizações adicionais.
        ◦ Validação em tempo real nos formulários (ex.: validação de email, força da senha, checagem de username disponível via API).
        ◦ Estado com React Context (simples) para auth.
    • Backend (API REST):
        ◦ Endpoints protegidos que validam o token do Firebase (verificar ID token via Firebase Admin SDK).
        ◦ Serve como camada de revalidação e lógica de negócios (ex.: determinar role, promoção a admin, desativação de usuários).
        ◦ Não armazena senhas (Firebase Auth cuida das senhas). O backend usa Firebase Admin para criar usuários no Auth quando solicitado.
    • Firestore schema (sugestão):
        ◦ Collection users:
          {
            "uid": "string",                  // uid do Firebase Auth
            "email": "string",
            "fullName": "string",
            "username": "@username",          // com @
            "role": "user" | "admin" | "superadmin",
            "active": true | false,
            "createdAt": timestamp,
            "lastLoginAt": timestamp
          }
    • Fluxo de criação de usuário (duas opções):
        ◦ Via Firebase Auth + Firestore: criar com Firebase Auth (email+senha), em seguida criar documento em users com uid.
        ◦ Via cadastro manual no Firestore (opcional): permitir criar documento em users com password inventado? Não — se escolher esse caminho, o backend deve criar também o user no Firebase Auth para gerar credenciais reais. (Implementar ambos os caminhos: frontend oferece opção, backend centraliza a criação no Auth + users doc.)

Endpoints mínimos (backend)
    • POST /api/auth/signup — payload: { email, fullName, username, password, passwordConfirmation }
        ◦ Validar, criar usuário no Firebase Auth, criar doc em users, retornar sucesso.
    • POST /api/auth/login — opcional: delegar ao Firebase Client SDK no frontend; backend pode expor rota para autenticar via token exchange se necessário.
    • POST /api/auth/forgot-password — dispara email de reset (através do Firebase Client/REST).
    • GET /api/users — listar usuários (admin only). Suporta query params: q, sort=name|createdAt|lastLogin, order=asc|desc, active=true|false.
    • GET /api/users/:uid — detalhes (admin/self).
    • PUT /api/users/:uid — editar (admin/self).
    • PATCH /api/users/:uid/deactivate — marca active=false.
    • POST /api/users/:uid/promote — promove para admin (somente superadmin pode).
    • POST /api/seed/superadmin — script/endpoint protegido para criar @pompeu com as credenciais dadas (ou instruções para executar seed localmente via Firebase Admin SDK).
Autorização: verificar ID token e role. SuperAdmin é quem tem role === 'superadmin' e uid/email conhecido.

Segurança (exigido)
    • Verificação do Firebase ID Token em todas as rotas protegidas (middleware).
    • Revalidação de todas as entradas no backend (nunca confiar no frontend).
    • Firestore Security Rules para garantir:
        ◦ Usuários só podem ler/escrever seu próprio documento, exceto admins (que leem tudo).
        ◦ role só pode ser alterado por uid superadmin.
        ◦ active só pode ser alterado por admin/superadmin.
    • Não guardar senhas no backend. Usar Firebase Auth.
    • Usar HTTPS no deploy (Firebase Hosting + Functions ou reverse proxy).
    • Rate limiting básico nas rotas de auth/no backend (ex: express-rate-limit).
    • Evitar exposição de chaves no frontend — usar variáveis de ambiente do Firebase client (API Key ok no client; credenciais Admin NÃO no frontend).
Forneça também snippet de Firestore Rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin','superadmin'];
      allow update: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin','superadmin'];
      allow delete: if false;
    }
  }
}
(Ajustar para checar role corretamente; o backend também deve impor regras de promoção e desativação.)

Seed — SuperAdmin (dados)
    • Email: pedrolpompeu@gmail.com
    • Nome completo: Pedro Pompeu
    • Username: @pompeu
    • Senha: pedro123
    • Confirmar senha: pedro123
Instruir a IA a implementar script scripts/seedSuperAdmin.ts no backend usando Firebase Admin SDK que:
    1. Cheque se já existe usuário com esse email/username; se não, cria no Auth com a senha e cria doc users/{uid} com role: 'superadmin' e active: true.

Setup e variáveis de ambiente (mínimo)
Backend .env
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
FIREBASE_PROJECT_ID=tasko-login-project
PORT=4000
Frontend .env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

Scripts / comandos essenciais (exemplos)
    • Backend:
        ◦ npm run dev — roda ts-node-dev
        ◦ npm run build && npm start
        ◦ npm run seed:superadmin
    • Frontend:
        ◦ npm run dev — Vite
        ◦ npm run build
        ◦ npm run test (se houver)

UI & Tailwind — instruções rápidas para layout (para o dev UI)
    • Estrutura: components/AuthForm.tsx, components/AdminPanel/*, pages/AuthPage.tsx, pages/AdminPage.tsx, routes/*.
    • AuthPage: container grid grid-cols-2 gap-8 md:grid-cols-1 com min-h-screen.
    • Cada form com max-w-md w-full p-6 bg-white shadow-md rounded-xl animate-fadeIn (implement animation via Tailwind + @keyframes).
    • Botões e inputs com classes utilitárias (focus, transition).
    • Responsividade: nos breakpoints md empilhar verticalmente.

Entregáveis extras opcionais (altamente recomendados)
    • Implementar checagem de username disponível via endpoint GET /api/users/check-username?username=@x.
    • Implementar logs simples (winston ou pino).
    • Testes e2e mínimos com Cypress para fluxo de signup/login e admin-desativar.
    • Documentação API via OpenAPI/Swagger (mínimo descrevendo endpoints).

Critérios de aceitação (QA)
    1. Usuário consegue se cadastrar pelos dois caminhos (Auth + backend) e login funciona.
    2. SuperAdmin criado e consegue acessar painel Admin.
    3. Admin vê listagem completa, busca, filtros e consegue desativar e promover usuários.
    4. Firestore Rules impedem leitura indevida (testar com contas não autorizadas).
    5. Senha nunca salva no backend; autenticação feita por Firebase Auth.
    6. UI responsiva e formulário com validação em tempo real.

Entrega final
    • Dois repositórios com código, README, .env.example, script de seed, e instruções para executar localmente.
    • Arquivo design-notes.md com decisões arquiteturais e justificativas de segurança.
    • Comandos para gerar o SuperAdmin localmente: npm run seed:superadmin.

Prompts sequenciais 
    1. Fase 1 — Inicialização: criar estruturas frontend e backend, instalar deps, configurar TS, Vite, Express, Firebase Admin.
    2. Fase 2 — Auth básico: implementar signup/login via Firebase Auth e criação de users no Firestore.
    3. Fase 3 — Backend APIs & middleware: rotas CRUD, verificação de token, pesquisa/filtragem.
    4. Fase 4 — UI: página Auth (cadastro + login), página Admin e User.
    5. Fase 5 — Segurança & Rules: Firestore rules, rate limiting, validações backend.
    6. Fase 6 — Seed & documentação: script superadmin, README, testes básicos.
Para cada fase, peça à IA que retorne lista de arquivos criados, comando para rodar, e exemplo de request/response para endpoints.

Observações finais (diretas)
    • Prefixar username com @ automaticamente é aceitável e será salvo no Firestore como @username. Aceitar entrada do usuário com ou sem @ no login.
    • O backend deve sempre confiar no Firebase Admin SDK para operações de criação de usuários no Auth.
    • Segurança é prioridade: revalidação no backend e regras do Firestore obrigatórias.
    • Nome do projeto, vamos fixar em Login para Kreakodo