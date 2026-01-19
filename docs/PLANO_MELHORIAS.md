# Plano de Melhorias - Stress Insights Pro

**Data:** 19/01/2026  
**Agente:** Antigravity  
**Status:** Em Análise

---

## 📋 Resumo Executivo

Este documento apresenta um plano abrangente de melhorias para o projeto **Stress Insights Pro**, focando em 5 áreas críticas:

1. ✅ **Correção de Bugs e Otimização de Performance**
2. 🎨 **Novos Componentes de UI**
3. 🚀 **Melhoria de Funcionalidades Existentes**
4. 🧪 **Configuração de Testes e CI/CD**
5. 🔍 **Revisão e Refatoração de Código**

---

## 🔍 Análise Inicial do Projeto

### Tecnologias Identificadas
- **Framework:** Next.js 15.3.8 (App Router)
- **Backend:** Firebase (Firestore + Auth)
- **UI:** Radix UI + Tailwind CSS + shadcn/ui
- **IA:** Google Genkit para recomendações
- **Linguagem:** TypeScript (strict mode)
- **Gráficos:** Recharts

### Estado Atual
- ✅ TypeScript configurado corretamente (sem erros)
- ⚠️ ESLint com problema de configuração circular
- ⚠️ 13 vulnerabilidades de segurança (3 low, 2 moderate, 8 high)
- ✅ CI/CD básico configurado (GitHub Actions)
- ⚠️ Sem testes automatizados
- ⚠️ README muito básico

---

## 🐛 1. CORREÇÃO DE BUGS E OTIMIZAÇÃO DE PERFORMANCE

### 1.1 Bugs Identificados

#### 🔴 CRÍTICO: ESLint com erro de referência circular
**Problema:** `.eslintrc.json` causando erro de estrutura circular
```
Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'configs' -> object with constructor 'Object'
```

**Solução:** Migrar para configuração flat do ESLint 9
**Prioridade:** ALTA
**Estimativa:** 30 minutos

#### 🟡 MÉDIO: Vulnerabilidades de Segurança
**Problema:** 13 vulnerabilidades detectadas pelo npm audit
- Next.js: 3 vulnerabilidades moderadas (SSRF, Cache Key Confusion, Content Injection)
- @modelcontextprotocol/sdk: 2 vulnerabilidades high (DNS rebinding, ReDoS)
- Outras dependências desatualizadas

**Solução:** 
1. Executar `npm audit fix` para correções automáticas
2. Avaliar `npm audit fix --force` para Next.js (pode quebrar compatibilidade)
3. Revisar dependências críticas

**Prioridade:** ALTA
**Estimativa:** 1 hora

### 1.2 Otimizações de Performance

#### Performance do Frontend
- [ ] Implementar lazy loading para componentes pesados (charts, dashboards)
- [ ] Adicionar React.memo em componentes que renderizam listas
- [ ] Otimizar imagens com next/image
- [ ] Implementar skeleton loaders para melhor UX

#### Performance do Backend (Firestore)
- [ ] Revisar queries do Firestore para usar índices compostos
- [ ] Implementar paginação em listagens grandes
- [ ] Adicionar cache de dados com React Query ou SWR
- [ ] Implementar debounce em buscas e filtros

**Prioridade:** MÉDIA
**Estimativa:** 4-6 horas

---

## 🎨 2. NOVOS COMPONENTES DE UI

### 2.1 Componentes Faltantes (shadcn/ui)

Componentes shadcn/ui que podem ser úteis mas ainda não estão no projeto:
- [ ] **Breadcrumb** - Navegação hierárquica
- [ ] **Command** - Paleta de comandos (Cmd+K)
- [ ] **Context Menu** - Menu de contexto (botão direito)
- [ ] **Data Table** - Tabela avançada com sorting/filtering
- [ ] **Drawer** - Painel lateral deslizante
- [ ] **Pagination** - Paginação de dados
- [ ] **Resizable** - Painéis redimensionáveis
- [ ] **Sonner** - Toast notifications modernas
- [ ] **Toggle Group** - Grupo de toggles

**Prioridade:** BAIXA-MÉDIA
**Estimativa:** 2-3 horas

### 2.2 Componentes Customizados Necessários

#### 📊 Dashboard Analytics
- [ ] **StatsCard** - Card de estatísticas com ícone e tendência
- [ ] **TrendIndicator** - Indicador de tendência (↑↓)
- [ ] **ProgressRing** - Anel de progresso circular
- [ ] **ComparisonChart** - Gráfico de comparação período a período

#### 🔔 Notificações e Feedback
- [ ] **NotificationCenter** - Centro de notificações
- [ ] **ActivityFeed** - Feed de atividades recentes
- [ ] **StatusBadge** - Badge de status customizado

#### 📝 Formulários
- [ ] **MultiStepForm** - Formulário multi-etapas
- [ ] **FileUpload** - Upload de arquivos com preview
- [ ] **DateRangePicker** - Seletor de intervalo de datas

**Prioridade:** MÉDIA-ALTA
**Estimativa:** 6-8 horas

---

## 🚀 3. MELHORIA DE FUNCIONALIDADES EXISTENTES

### 3.1 Melhorias no Dashboard

#### Filtros Avançados
- [ ] Adicionar filtros por múltiplos critérios
- [ ] Salvar filtros favoritos do usuário
- [ ] Exportar dados filtrados (CSV, PDF)
- [ ] Comparação entre períodos

#### Visualizações
- [ ] Adicionar mais tipos de gráficos (heatmap, treemap)
- [ ] Modo de visualização compacta/expandida
- [ ] Personalização de dashboard (drag & drop de widgets)
- [ ] Dark mode completo

**Prioridade:** ALTA
**Estimativa:** 8-10 horas

### 3.2 Melhorias na Gestão de Pesquisas

- [ ] Duplicar pesquisas existentes
- [ ] Templates de pesquisas pré-configuradas
- [ ] Agendamento de envio de pesquisas
- [ ] Lembretes automáticos para não respondentes
- [ ] Preview da pesquisa antes de enviar

**Prioridade:** MÉDIA
**Estimativa:** 6-8 horas

### 3.3 Melhorias em Relatórios

- [ ] Geração de relatórios em PDF
- [ ] Relatórios agendados (envio automático por email)
- [ ] Relatórios customizáveis (escolher seções)
- [ ] Compartilhamento de relatórios com link público
- [ ] Anotações e comentários em relatórios

**Prioridade:** ALTA
**Estimativa:** 10-12 horas

### 3.4 Melhorias de Acessibilidade

- [ ] Adicionar aria-labels em todos os componentes interativos
- [ ] Navegação completa por teclado
- [ ] Suporte a screen readers
- [ ] Contraste de cores WCAG AA
- [ ] Textos alternativos em gráficos

**Prioridade:** MÉDIA
**Estimativa:** 4-6 horas

---

## 🧪 4. CONFIGURAÇÃO DE TESTES E CI/CD

### 4.1 Testes Unitários e de Integração

#### Setup Inicial
- [ ] Instalar e configurar **Vitest** (mais rápido que Jest)
- [ ] Configurar **React Testing Library**
- [ ] Configurar **MSW** (Mock Service Worker) para mocks de API
- [ ] Criar estrutura de pastas para testes

#### Testes Prioritários
- [ ] Testes de componentes UI críticos
- [ ] Testes de hooks customizados
- [ ] Testes de utilidades e helpers
- [ ] Testes de integração com Firebase (usando emulators)

**Prioridade:** ALTA
**Estimativa:** 8-10 horas

### 4.2 Testes E2E

- [ ] Configurar **Playwright** para testes E2E
- [ ] Criar testes para fluxos críticos:
  - Login/Logout
  - Criação de empresa
  - Criação de pesquisa
  - Resposta de pesquisa
  - Visualização de dashboard

**Prioridade:** MÉDIA
**Estimativa:** 6-8 horas

### 4.3 Melhorias no CI/CD

#### GitHub Actions - Workflow Atual
```yaml
✅ Checkout
✅ Setup Node.js
✅ Install dependencies
✅ Run linter (QUEBRADO)
✅ Run type check
✅ Run build
```

#### Melhorias Propostas
- [ ] **Corrigir lint** (migrar para ESLint flat config)
- [ ] **Adicionar testes** ao pipeline
- [ ] **Adicionar coverage report** (Codecov)
- [ ] **Adicionar análise de bundle size** (bundlesize)
- [ ] **Adicionar Lighthouse CI** (performance, a11y, SEO)
- [ ] **Deploy preview** para PRs (Vercel/Firebase Hosting)
- [ ] **Dependabot** para atualizações automáticas
- [ ] **Semantic Release** para versionamento automático

**Prioridade:** ALTA
**Estimativa:** 4-6 horas

### 4.4 Qualidade de Código

- [ ] Configurar **Prettier** para formatação consistente
- [ ] Configurar **Husky** + **lint-staged** (pre-commit hooks)
- [ ] Configurar **commitlint** (conventional commits)
- [ ] Adicionar **SonarCloud** para análise de código

**Prioridade:** MÉDIA
**Estimativa:** 2-3 horas

---

## 🔍 5. REVISÃO E REFATORAÇÃO DE CÓDIGO

### 5.1 Estrutura de Pastas

#### Estrutura Atual
```
src/
├── ai/
├── app/
├── components/
├── firebase/
├── hooks/
└── lib/
```

#### Melhorias Propostas
- [ ] Criar pasta `src/types/` para tipos TypeScript compartilhados
- [ ] Criar pasta `src/utils/` para funções utilitárias
- [ ] Criar pasta `src/constants/` para constantes
- [ ] Criar pasta `src/contexts/` para React Contexts
- [ ] Organizar componentes por feature (co-location)

**Prioridade:** MÉDIA
**Estimativa:** 3-4 horas

### 5.2 Refatorações Prioritárias

#### Componentes
- [ ] Extrair lógica de negócio para hooks customizados
- [ ] Separar componentes grandes em componentes menores
- [ ] Padronizar props de componentes (usar interfaces)
- [ ] Adicionar PropTypes/TypeScript para todos os componentes

#### Firebase
- [ ] Criar camada de abstração para Firestore (repository pattern)
- [ ] Centralizar queries em um único lugar
- [ ] Implementar error handling consistente
- [ ] Adicionar retry logic para operações críticas

#### Estado Global
- [ ] Avaliar necessidade de gerenciador de estado (Zustand/Jotai)
- [ ] Implementar Context API para dados globais
- [ ] Otimizar re-renders desnecessários

**Prioridade:** MÉDIA-ALTA
**Estimativa:** 10-12 horas

### 5.3 Documentação

- [ ] **README.md completo** com:
  - Descrição do projeto
  - Screenshots
  - Requisitos e instalação
  - Configuração do Firebase
  - Scripts disponíveis
  - Estrutura do projeto
  - Como contribuir

- [ ] **ARCHITECTURE.md** - Documentação da arquitetura
- [ ] **API.md** - Documentação das funções Firebase
- [ ] **COMPONENTS.md** - Catálogo de componentes
- [ ] **JSDoc** em funções e componentes complexos
- [ ] **Storybook** para documentação visual de componentes

**Prioridade:** MÉDIA
**Estimativa:** 6-8 horas

### 5.4 TypeScript

- [ ] Remover todos os `any` types
- [ ] Adicionar tipos para todas as props de componentes
- [ ] Criar tipos para dados do Firestore
- [ ] Usar `unknown` ao invés de `any` quando apropriado
- [ ] Adicionar strict null checks

**Prioridade:** ALTA
**Estimativa:** 4-6 horas

---

## 📊 PRIORIZAÇÃO GERAL

### 🔴 PRIORIDADE CRÍTICA (Fazer Primeiro)
1. Corrigir ESLint (30 min)
2. Corrigir vulnerabilidades de segurança (1h)
3. Adicionar testes básicos (8-10h)
4. Melhorar CI/CD (4-6h)

**Total:** ~14-18 horas

### 🟡 PRIORIDADE ALTA (Fazer em Seguida)
1. Melhorias no Dashboard (8-10h)
2. Melhorias em Relatórios (10-12h)
3. Componentes customizados (6-8h)
4. Refatoração de código (10-12h)
5. Documentação completa (6-8h)

**Total:** ~40-50 horas

### 🟢 PRIORIDADE MÉDIA (Fazer Depois)
1. Otimizações de performance (4-6h)
2. Testes E2E (6-8h)
3. Melhorias em pesquisas (6-8h)
4. Acessibilidade (4-6h)
5. Componentes shadcn/ui adicionais (2-3h)

**Total:** ~22-31 horas

---

## 🎯 ROADMAP SUGERIDO

### Sprint 1 (1 semana) - Fundação
- ✅ Corrigir ESLint
- ✅ Corrigir vulnerabilidades
- ✅ Setup de testes
- ✅ Melhorar CI/CD

### Sprint 2 (2 semanas) - Features
- 🎨 Componentes customizados
- 📊 Melhorias no Dashboard
- 📄 Melhorias em Relatórios

### Sprint 3 (1 semana) - Qualidade
- 🔍 Refatoração de código
- 📚 Documentação completa
- ♿ Acessibilidade

### Sprint 4 (1 semana) - Polimento
- ⚡ Otimizações de performance
- 🧪 Testes E2E
- 🎨 Componentes adicionais

---

## 📝 PRÓXIMOS PASSOS IMEDIATOS

Vou começar com as tarefas críticas:

1. **Corrigir ESLint** - Migrar para flat config
2. **Corrigir vulnerabilidades** - npm audit fix
3. **Melhorar README** - Documentação básica
4. **Setup de testes** - Vitest + RTL

**Deseja que eu comece agora? Por qual tarefa você gostaria que eu começasse?**
