# 📊 Stress Insights Pro

> Plataforma completa para criação, distribuição e análise de pesquisas de indicadores de estresse organizacional

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-orange?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🌟 Sobre o Projeto

**Stress Insights Pro** é uma aplicação web moderna desenvolvida com Next.js que permite empresas criarem, distribuírem e analisarem pesquisas de indicadores de risco psicossociais no ambiente de trabalho. 

A ferramenta é baseada na metodologia **SIT (Stress Indicator Tool)** da HSE (Health and Safety Executive) do Reino Unido, adaptada para o contexto brasileiro.

### ✨ Principais Funcionalidades

- 🏢 **Gestão de Empresas** - Cadastro e gerenciamento de empresas clientes
- 📋 **Criação de Pesquisas** - Interface intuitiva para criar pesquisas customizadas
- 📧 **Distribuição Inteligente** - Envio de pesquisas via email com QR codes
- 📊 **Dashboard Analítico** - Visualização de resultados em tempo real
- 🤖 **Recomendações com IA** - Sugestões automáticas usando Google Gemini
- 📄 **Relatórios Completos** - Geração de relatórios detalhados prontos para impressão
- 🔐 **Autenticação Segura** - Sistema de login com Firebase Auth
- 📱 **Design Responsivo** - Interface otimizada para desktop e mobile

## 🚀 Começando

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 20.x ou superior
- **npm** 10.x ou superior
- **Conta no Firebase** (para backend)
- **Chave API do Google Gemini** (para funcionalidades de IA)

### 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/gilbertjackson-spec/Stress-Insights-Pro.git
   cd Stress-Insights-Pro
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   
   # Google Gemini API
   GEMINI_API_KEY=sua_gemini_api_key
   ```

4. **Configure o Firebase**
   
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative **Firestore Database** e **Authentication** (Email/Password)
   - Copie as credenciais do projeto para o arquivo `.env`
   - Implante as regras de segurança do Firestore:
     ```bash
     firebase deploy --only firestore:rules
     ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   
   Abra [http://localhost:9002](http://localhost:9002) no seu navegador

## 📁 Estrutura do Projeto

```
Stress-Insights-Pro/
├── src/
│   ├── ai/                    # Configuração do Google Genkit
│   ├── app/                   # App Router do Next.js
│   │   ├── admin/            # Páginas administrativas
│   │   └── survey/           # Páginas de pesquisa
│   ├── components/           # Componentes React
│   │   ├── admin/           # Componentes administrativos
│   │   ├── charts/          # Gráficos e visualizações
│   │   ├── dashboard/       # Componentes do dashboard
│   │   └── ui/              # Componentes UI (shadcn/ui)
│   ├── firebase/            # Configuração e utilitários Firebase
│   ├── hooks/               # React Hooks customizados
│   └── lib/                 # Utilitários e tipos
├── docs/                    # Documentação do projeto
├── .github/                 # GitHub Actions (CI/CD)
├── firestore.rules         # Regras de segurança do Firestore
├── package.json
└── README.md
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (porta 9002)

# Build
npm run build           # Cria build de produção
npm start               # Inicia servidor de produção

# Qualidade de Código
npm run lint            # Executa ESLint
npm run typecheck       # Verifica tipos TypeScript

# IA (Google Genkit)
npm run genkit:dev      # Inicia Genkit em modo desenvolvimento
npm run genkit:watch    # Inicia Genkit com watch mode
```

## 🔧 Tecnologias Utilizadas

### Core
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[React 18](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

### Backend & Banco de Dados
- **[Firebase](https://firebase.google.com/)** - Backend as a Service
  - Firestore - Banco de dados NoSQL
  - Authentication - Autenticação de usuários
  - Hosting - Hospedagem (via App Hosting)

### UI & Estilização
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI acessíveis
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos UI sem estilo
- **[Lucide React](https://lucide.dev/)** - Ícones

### Gráficos & Visualização
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos
- **[react-qr-code](https://www.npmjs.com/package/react-qr-code)** - Geração de QR codes

### IA & Automação
- **[Google Genkit](https://firebase.google.com/docs/genkit)** - Framework para IA generativa
- **[Google Gemini](https://ai.google.dev/)** - Modelo de linguagem para recomendações

### Formulários & Validação
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas

### Utilitários
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes CSS

## 📊 Funcionalidades Detalhadas

### Para Administradores

1. **Gestão de Empresas**
   - Cadastro de empresas clientes
   - Gerenciamento de setores e cargos
   - Controle de status (ativa/inativa)

2. **Criação de Pesquisas**
   - Editor de questionários
   - Configuração de domínios de estresse
   - Definição de benchmarks

3. **Distribuição**
   - Envio de convites por email
   - Geração de QR codes para acesso
   - Controle de prazos

4. **Análise de Resultados**
   - Dashboard com métricas em tempo real
   - Gráficos radar, gauge e barras
   - Filtros por setor, cargo, demografia
   - Comparação com benchmarks

5. **Relatórios**
   - Relatório executivo completo
   - Análise detalhada por domínio
   - Recomendações geradas por IA
   - Exportação para impressão

### Para Respondentes

1. **Acesso à Pesquisa**
   - Link direto ou QR code
   - Interface amigável e responsiva

2. **Preenchimento**
   - Formulário demográfico
   - Questionário de indicadores
   - Validação em tempo real
   - Salvamento automático

3. **Privacidade**
   - Respostas anônimas
   - Dados criptografados
   - Conformidade com LGPD

## 🔐 Segurança

- ✅ Autenticação com Firebase Auth
- ✅ Regras de segurança do Firestore
- ✅ Validação de dados com Zod
- ✅ TypeScript em modo strict
- ✅ Sanitização de inputs
- ⚠️ 3 vulnerabilidades de dependências (baixo risco, apenas em dev tools)

## 🧪 Testes

> ⚠️ **Em desenvolvimento** - Sistema de testes será implementado em breve

Planejado:
- Testes unitários com Vitest
- Testes de componentes com React Testing Library
- Testes E2E com Playwright

## 🚀 Deploy

### Firebase App Hosting (Recomendado)

O projeto está configurado para deploy automático no Firebase App Hosting:

```bash
# Deploy via Firebase Studio
# Ou via CLI:
firebase deploy
```

### Vercel

Também é compatível com Vercel:

```bash
vercel deploy
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso fluxo de trabalho.

### Fluxo de Trabalho

1. **Sempre comece com:** `git pull origin main`
2. Faça suas alterações
3. **Sempre termine com:**
   ```bash
   git add .
   git commit -m "feat: descrição da funcionalidade"
   git push origin main
   ```

### Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Tarefas de manutenção

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Gilbert Jackson** - *Desenvolvimento Inicial* - [@gilbertjackson-spec](https://github.com/gilbertjackson-spec)

## 🙏 Agradecimentos

- HSE (Health and Safety Executive) pela metodologia SIT
- Comunidade Firebase e Next.js
- Todos os contribuidores do projeto

## 📞 Suporte

Para suporte, abra uma [issue](https://github.com/gilbertjackson-spec/Stress-Insights-Pro/issues) no GitHub.

---

**Desenvolvido com ❤️ usando Next.js e Firebase**
