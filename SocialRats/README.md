# SocialRats

Plataforma social de constância, comunidades e acompanhamento de desafios — conectando pessoas com objetivos em comum através de treinos, estudos, hábitos e evolução diária.

## Estrutura do Projeto

```text
SocialRats/
├── index.html                      # Landing Page principal
├── README.md                       # Documentação geral e arquitetura do projeto
├── docs/
│   └── DESIGN_SYSTEM.md            # Especificação oficial de Design System (tokens, cores, componentes)
├── assets/
│   ├── css/
│   │   └── styles.css              # Folha de estilos global da Landing Page
│   ├── js/
│   │   └── script.js               # Scripts de interação e navegação da Landing Page
│   └── images/                     # Ícones, avatares, mockups e mídias da plataforma
└── src/
    └── pages/
        ├── app/                    # Aplicação Web Principal (Dark Mode — Design System)
        │   ├── feed.html           # Home / Feed principal, Stories e Composer de Publicação
        │   ├── search.html         # Explorar, Busca e Descoberta
        │   ├── communities.html    # Descubra, Crie e Participe de Comunidades
        │   ├── metrics.html        # Painel de Métricas, Evolução e Hustle Points
        │   ├── direct.html         # Mensagens Diretas (Inbox)
        │   ├── chat.html           # Conversa individual aberta
        │   ├── notifications.html  # Central de Atividades e Notificações
        │   └── profile.html        # Perfil do Usuário, Conquistas e Publicações
        ├── auth/                   # Fluxos de Autenticação
        │   ├── login.html          # Tela de Login
        │   └── register.html       # Tela de Criação de Conta
        └── marketing/              # Páginas Institucionais
            ├── features.html       # Detalhamento de Funcionalidades
            └── pricing.html        # Planos e Preços (Gratuito & PRO)
```

## Como Executar Localmente

Basta abrir o arquivo [`index.html`](./index.html) no navegador ou iniciar um servidor estático na raiz do projeto:

```bash
npx serve .
```
