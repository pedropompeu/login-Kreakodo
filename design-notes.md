# Design Notes - Login para Kreakodo

## Decisões Arquiteturais

### 1. Separação Frontend/Backend

**Decisão**: Manter frontend e backend em repositórios/pastas separadas.

**Justificativa**:
- Permite deploy independente
- Facilita escalabilidade
- Separação clara de responsabilidades
- Permite diferentes equipes trabalharem simultaneamente

### 2. Firebase como Backend-as-a-Service

**Decisão**: Usar Firebase Auth para autenticação e Firestore para banco de dados.

**Justificativa**:
- Reduz complexidade de implementação de autenticação
- Segurança robusta out-of-the-box
- Escalabilidade automática
- Sincronização em tempo real
- SDKs bem documentados

### 3. Backend Express como Camada de Validação

**Decisão**: Manter um backend Express mesmo usando Firebase.

**Justificativa**:
- Revalidação de dados no servidor
- Lógica de negócios centralizada
- Controle adicional de autorização
- Facilita auditoria e logging
- Permite operações complexas que não podem ser feitas apenas com Security Rules

### 4. TypeScript em Todo o Stack

**Decisão**: Usar TypeScript tanto no frontend quanto no backend.

**Justificativa**:
- Type safety reduz bugs
- Melhor experiência de desenvolvimento (autocomplete, refactoring)
- Documentação implícita através de tipos
- Facilita manutenção a longo prazo

### 5. React Context para Estado de Autenticação

**Decisão**: Usar React Context API ao invés de Redux ou outras bibliotecas.

**Justificativa**:
- Aplicação pequena/média não justifica Redux
- Context API é suficiente para gerenciar estado de auth
- Menos dependências
- Mais simples de entender e manter

### 6. TailwindCSS para Estilização

**Decisão**: Usar TailwindCSS ao invés de CSS-in-JS ou CSS modules.

**Justificativa**:
- Desenvolvimento rápido com utility classes
- Consistência de design
- Bundle size otimizado (purge CSS)
- Responsividade fácil
- Customização via config

## Decisões de Segurança

### 1. Nunca Armazenar Senhas no Backend

**Implementação**: Firebase Auth gerencia todas as senhas.

**Justificativa**:
- Firebase usa bcrypt com salt automático
- Reduz superfície de ataque
- Conformidade com melhores práticas
- Menos responsabilidade de segurança

### 2. Verificação de Token em Todas as Rotas Protegidas

**Implementação**: Middleware `authMiddleware` verifica Firebase ID Token.

**Justificativa**:
- Garante que apenas usuários autenticados acessem recursos
- Token não pode ser forjado (assinado pelo Firebase)
- Expira automaticamente (1 hora)
- Contém claims do usuário (uid, email)

### 3. Revalidação no Backend

**Implementação**: Backend valida todos os inputs mesmo que frontend já valide.

**Justificativa**:
- Frontend pode ser manipulado
- Proteção contra ataques diretos à API
- Defense in depth
- Conformidade com OWASP Top 10

### 4. Role-Based Access Control (RBAC)

**Implementação**: Três níveis de acesso (user, admin, superadmin).

**Justificativa**:
- Princípio do menor privilégio
- Separação de responsabilidades
- Facilita auditoria
- Escalável para adicionar mais roles

### 5. Firestore Security Rules

**Implementação**: Rules que espelham lógica do backend.

**Justificativa**:
- Proteção em múltiplas camadas
- Previne acesso direto ao Firestore
- Funciona mesmo se backend estiver comprometido
- Validação no lado do servidor (Firestore)

### 6. Rate Limiting

**Implementação**: 100 requisições por 15 minutos nas rotas de auth.

**Justificativa**:
- Previne brute force attacks
- Protege contra DDoS
- Reduz custos de infraestrutura
- Melhora experiência para usuários legítimos

### 7. CORS Configurado

**Implementação**: CORS habilitado apenas para domínios conhecidos.

**Justificativa**:
- Previne requisições de origens não autorizadas
- Proteção contra CSRF
- Controle de quem pode acessar a API

### 8. Input Validation com express-validator

**Implementação**: Validação de todos os inputs nas rotas.

**Justificativa**:
- Previne SQL injection (mesmo sem SQL)
- Previne XSS
- Garante integridade dos dados
- Mensagens de erro claras

## Decisões de UX

### 1. Login com Email ou Username

**Implementação**: Aceitar ambos no mesmo campo.

**Justificativa**:
- Mais conveniente para usuários
- Reduz fricção no login
- Comum em redes sociais
- Detecta automaticamente o tipo de input

### 2. Username com @ Automático

**Implementação**: Adicionar @ automaticamente ao salvar.

**Justificativa**:
- Consistência visual
- Identifica claramente como username
- Facilita busca e menções futuras
- Aceita entrada com ou sem @

### 3. SuperAdmin Escolhe Papel

**Implementação**: Tela de seleção após login.

**Justificativa**:
- Flexibilidade para testar ambas as visões
- Não força SuperAdmin a sempre ver painel admin
- Melhor experiência de usuário
- Separação clara de contextos

### 4. Formulários Lado a Lado

**Implementação**: Login e Cadastro na mesma página.

**Justificativa**:
- Reduz cliques
- Usuário vê ambas as opções imediatamente
- Comum em aplicações modernas
- Responsivo (empilha em mobile)

### 5. Validação em Tempo Real

**Implementação**: Feedback imediato nos formulários.

**Justificativa**:
- Melhor experiência de usuário
- Reduz erros de submissão
- Usuário corrige antes de enviar
- Menos frustração

### 6. Mensagem Amigável para Usuários Comuns

**Implementação**: Página User com mensagem calorosa e animação.

**Justificativa**:
- Humaniza a aplicação
- Mantém usuários engajados
- Comunica que há desenvolvimento ativo
- Branding (KreaKodo)

## Decisões de Performance

### 1. Vite como Build Tool

**Decisão**: Usar Vite ao invés de Create React App.

**Justificativa**:
- Hot Module Replacement (HMR) extremamente rápido
- Build otimizado com Rollup
- Suporte nativo a TypeScript
- Menor bundle size

### 2. Code Splitting por Rota

**Implementação**: React Router com lazy loading (futuro).

**Justificativa**:
- Carrega apenas código necessário
- Melhora tempo de carregamento inicial
- Melhor para SEO
- Escalável

### 3. Firestore Queries Otimizadas

**Implementação**: Índices e queries limitadas.

**Justificativa**:
- Reduz custos do Firestore
- Melhora performance
- Evita timeouts
- Escalável para milhares de usuários

## Decisões de Manutenibilidade

### 1. Componentes Reutilizáveis

**Implementação**: Componentes pequenos e focados.

**Justificativa**:
- Facilita testes
- Reduz duplicação
- Melhora legibilidade
- Facilita refatoração

### 2. Separação de Concerns

**Implementação**: Contexts, Components, Pages separados.

**Justificativa**:
- Código organizado
- Fácil de encontrar arquivos
- Escalável
- Padrão da comunidade

### 3. Documentação Inline

**Implementação**: Comentários em código complexo.

**Justificativa**:
- Facilita onboarding
- Explica decisões não óbvias
- Reduz tempo de debug
- Conhecimento compartilhado

### 4. README Detalhado

**Implementação**: README com setup, endpoints, troubleshooting.

**Justificativa**:
- Onboarding rápido
- Reduz perguntas repetitivas
- Documentação sempre atualizada
- Referência rápida

## Melhorias Futuras

### Curto Prazo
- [ ] Implementar testes e2e com Cypress
- [ ] Adicionar logging com Winston
- [ ] Implementar envio de convites por email
- [ ] Adicionar paginação na listagem de usuários
- [ ] Implementar recuperação de senha

### Médio Prazo
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Implementar sistema de notificações
- [ ] Adicionar dashboard com métricas
- [ ] Implementar audit log
- [ ] Adicionar suporte a múltiplos idiomas (i18n)

### Longo Prazo
- [ ] Migrar para microserviços
- [ ] Implementar GraphQL
- [ ] Adicionar cache com Redis
- [ ] Implementar CI/CD completo
- [ ] Adicionar monitoramento com Sentry/DataDog

## Conformidade e Padrões

### OWASP Top 10
- ✅ A01: Broken Access Control - RBAC implementado
- ✅ A02: Cryptographic Failures - Firebase gerencia criptografia
- ✅ A03: Injection - Input validation implementada
- ✅ A04: Insecure Design - Security by design
- ✅ A05: Security Misconfiguration - Configurações revisadas
- ✅ A07: Identification and Authentication Failures - Firebase Auth
- ✅ A08: Software and Data Integrity Failures - Validação em múltiplas camadas

### GDPR (Preparação)
- Dados mínimos coletados
- Possibilidade de deletar usuários (implementar)
- Logs de acesso (implementar)
- Consentimento explícito (implementar)

## Conclusão

Este projeto foi desenhado com foco em:
- **Segurança**: Múltiplas camadas de proteção
- **Escalabilidade**: Arquitetura que suporta crescimento
- **Manutenibilidade**: Código limpo e bem documentado
- **Performance**: Otimizações desde o início
- **UX**: Experiência de usuário fluida e intuitiva

Todas as decisões foram tomadas considerando trade-offs entre complexidade, segurança, performance e experiência do desenvolvedor.
