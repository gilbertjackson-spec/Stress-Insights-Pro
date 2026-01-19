# Fluxo de Desenvolvimento & Handoff para Agente de IA

Este documento descreve o processo de desenvolvimento padronizado para o projeto Stress Insights Pro. Seguir estas regras é crucial para garantir um fluxo de trabalho suave e consistente, especialmente ao colaborar entre diferentes ambientes de desenvolvimento de IA (Firebase Studio e Antigravity).

## Ciclo de Desenvolvimento Principal

Nosso fluxo de trabalho é baseado no Git, utilizando um único branch `main`. Siga sempre este ciclo para prevenir conflitos e garantir que seu trabalho seja integrado corretamente.

### 1. Início de uma Nova Sessão (Pull)

**Sempre** comece sua sessão de trabalho baixando as últimas alterações do repositório do GitHub. Isso garante que você está trabalhando com a versão mais atualizada do código.

```bash
git pull origin main
```

### 2. Fim da Sua Sessão (Push)

Assim que você concluir sua tarefa ou atingir um ponto estável, você **deve** fazer o commit e o push de suas alterações de volta para o repositório.

```bash
# Adiciona todas as suas alterações
git add .

# Faz o commit das suas alterações com uma mensagem descritiva
git commit -m "feat: [Breve descrição da principal funcionalidade adicionada]"
# (Use 'fix:', 'docs:', 'style:', etc. conforme apropriado)

# Envia suas alterações para o branch main
git push origin main
```

## Publicações no Firebase

**Regra Crítica:** Todas as publicações, configurações e interações com o Firebase Console (como provisionamento de serviços) devem ser tratadas exclusivamente no ambiente do **Firebase Studio**. O agente do Antigravity não deve tentar publicar ou alterar configurações do Firebase diretamente.

## Protocolo de Handoff entre Agentes de IA

Ao transferir o desenvolvimento de um agente de IA para outro (ex: do Gemini no Firebase Studio para o agente Antigravity, ou vice-versa), use o modelo de prompt abaixo. Isso garante uma transição suave e fornece o contexto necessário para que o próximo agente continue o trabalho.

---

### **Modelo de Prompt para Handoff (Copie e Cole)**

**Assunto:** Handoff do Projeto "Stress Insights Pro"

**Repositório:** `https://github.com/gilbertjackson-spec/Stress-Insights-Pro.git`

**Olá!** Estou passando o desenvolvimento do projeto "Stress Insights Pro" para você. Por favor, siga as regras no arquivo `CONTRIBUTING.md` (comece com `git pull` e termine com `git push`).

**Contexto:**
O projeto é uma aplicação Next.js para criar e analisar pesquisas de estresse para empresas. Ele usa o Firebase para o backend (Firestore e Auth) e é integrado ao GitHub para controle de versão e CI/CD.

**Resumo da Última Sessão (Trabalho feito pelo agente anterior):**
*   [**Exemplo:** Acabamos de configurar a integração completa com o GitHub, incluindo um arquivo `.gitignore` e um workflow de CI com GitHub Actions para lint, verificação de tipos e build do projeto a cada push.]
*   [**Exemplo:** Implementei a lógica de backend e a UI para exportar as respostas da pesquisa para um arquivo CSV, respeitando os filtros do dashboard.]
*   [**Exemplo:** Otimizei as consultas ao Firestore no dashboard principal e na página de resposta da pesquisa para carregar os dados em cascata, melhorando significativamente a performance.]

**Próximos Passos (Sua Tarefa):**
*   [**Exemplo:** Agora, preciso que você implemente a página de perfil do usuário, onde os usuários podem alterar seu nome e foto de perfil.]
*   [**Exemplo:** Sua tarefa é construir a aba "Relatórios" dentro da página de detalhes da empresa.]

Por favor, comece baixando as últimas alterações do branch `main`. Boa sorte!

---
