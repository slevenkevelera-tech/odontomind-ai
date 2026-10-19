# Guia Completo: Subir o Projeto para o GitHub 🐙
## OdontoMind AI - Plataforma & CRM Odontológico Inteligente

Este repositório já está **100% inicializado**, com branch `main` configurada e com todos os 33 arquivos versionados no primeiro commit.

---

### Opção 1: Subir Diretamente pela Interface da Aplicação (Recomendado)
Você pode subir o projeto sem precisar abrir o terminal, diretamente pela interface do OdontoMind AI:

1. No cabeçalho da aplicação, clique no botão **"GitHub"** (ao lado de *Hospedar no Render*).
2. Crie um repositório vazio no GitHub: [github.com/new](https://github.com/new)
   - Nome sugerido: `odontomind-ai` ou `crm-odontologia`
   - Deixe desmarcado "Add a README file", ".gitignore" e "license" (o repositório precisa estar vazio).
3. No modal do OdontoMind AI:
   - Cole a **URL do seu repositório** (ex: `https://github.com/seu-usuario/odontomind-ai.git`).
   - Cole seu **Personal Access Token (PAT)** do GitHub (com permissão `repo`).
   - Clique em **"Sincronizar e Subir para o GitHub Agora"**.
4. Pronto! O projeto será enviado para a branch `main` do seu repositório e ficará imediatamente disponível.

---

### Como gerar um Token no GitHub (Personal Access Token):
1. Acesse: [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em **Generate new token (classic)**.
3. Dê uma descrição (ex: `OdontoMind Deploy`).
4. Marque a caixa de seleção de escopo: **`repo`** (acesso completo a repositórios).
5. Clique em **Generate token** no final da página.
6. Copie o token gerado (começa com `ghp_...`).

---

### Opção 2: Subir via Terminal (Git CLI)

Caso você prefira executar os comandos via terminal no seu computador:

```bash
# 1. Vincule seu repositório remoto do GitHub
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 2. Defina a branch principal como main
git branch -M main

# 3. Envie o código para o GitHub
git push -u origin main
```

*(Se o repositório remoto já contiver arquivos anteriores e você desejar sobrescrever com a versão mais recente, utilize `git push -u origin main --force`)*.

---

### Opção 3: Conexão Automática com o Render
Após subir este código para o seu GitHub, você poderá conectá-lo ao **Render (render.com)** com deploy contínuo automático:

1. Acesse o painel do [Render Dashboard](https://dashboard.render.com).
2. Clique em **New +** e selecione **Blueprint**.
3. Conecte com a sua conta GitHub e selecione o repositório `odontomind-ai`.
4. O Render lerá automaticamente o arquivo `render.yaml` já configurado na raiz deste projeto e fará o build e deploy instantaneamente!

---

### Estrutura dos Arquivos Versionados
- `src/` — Aplicação React SPA completa (CRM, Agentes IA, Gráficos Recharts, Central de SMS e Lembretes).
- `server.ts` — Backend Express com APIs de IA Gemini, Gateway SMS, e deploy estático em produção.
- `render.yaml` — Blueprint do Render para provisionamento em 1 clique.
- `package.json` — Dependências otimizadas para produção com TypeScript e runtime `tsx`.
