# Guia de Hospedagem no Render (render.com)
## OdontoMind AI - Plataforma & CRM Odontológico

Este guia detalha o passo a passo completo para hospedar o projeto **OdontoMind AI** no [Render](https://render.com), com suporte completo ao backend Express, frontend React/Vite, endpoints de IA Gemini e Gateway SMS.

---

### Opção 1: Deploy Rápido via Blueprint (`render.yaml`) ⭐ *Recomendado*

O projeto já contém o arquivo `render.yaml` pré-configurado na raiz do repositório.

1. **Suba o projeto para o seu GitHub ou GitLab:**
   - Crie um repositório privado ou público (ex: `odontomind-ai`).
   - Faça commit e push de todos os arquivos.

2. **Acesse o Render:**
   - Entre em [dashboard.render.com](https://dashboard.render.com/) e faça login (pode usar sua conta GitHub).

3. **Crie o serviço pelo Blueprint:**
   - No painel, clique em **New +** no canto superior direito e selecione **Blueprint**.
   - Conecte o repositório que você acabou de subir.
   - O Render lerá automaticamente o arquivo `render.yaml` e exibirá o serviço `odontomind-ai`.

4. **Configure a Chave do Gemini:**
   - No campo `GEMINI_API_KEY`, cole sua chave da API do Google Gemini.
   - Clique em **Apply**. O Render fará o build e colocará o site no ar em minutos com URL `https://odontomind-ai.onrender.com`.

---

### Opção 2: Configuração Manual no Painel do Render

Se preferir criar o serviço manualmente passo a passo:

1. Acesse [dashboard.render.com](https://dashboard.render.com/).
2. Clique em **New +** e escolha **Web Service**.
3. Selecione o repositório GitHub do projeto e clique em **Connect**.
4. Preencha os campos exatamente assim:
   - **Name:** `odontomind-ai` (ou o nome da sua clínica)
   - **Region:** `Oregon (US West)` ou `Frankfurt (EU Central)`
   - **Branch:** `main` (ou `master`)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Plan Type:** `Free` (ou `Starter` para evitar sleep após inatividade)

5. Na seção **Environment Variables**, adicione:
   | Key | Value | Observação |
   |---|---|---|
   | `NODE_ENV` | `production` | Modo de produção |
   | `PORT` | `10000` | Porta padrão do Render |
   | `GEMINI_API_KEY` | *(sua chave Gemini)* | Chave para os agentes de IA |

6. Clique em **Deploy Web Service**.

---

### Como Obter a Chave do Gemini API (`GEMINI_API_KEY`)
1. Acesse [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Clique em **Create API Key**.
3. Copie a chave e adicione no painel do Render em **Environment Variables**.

---

### Domínio Personalizado (Ex: `suaclinica.com.br`)
No Render, você pode usar seu próprio domínio gratuitamente com certificado SSL/HTTPS automático:
1. No painel do seu Web Service no Render, vá em **Settings** > **Custom Domains**.
2. Clique em **Add Custom Domain** e digite seu domínio (ex: `app.minhaclinica.com.br`).
3. O Render fornecerá os registros DNS (CNAME ou A) para você adicionar no seu provedor de domínio (Registro.br, Cloudflare, GoDaddy, Hostinger).
4. O certificado SSL é emitido automaticamente em poucos minutos.

---

### Comandos Úteis
- Testar build local antes de subir:
  ```bash
  npm run build
  npm start
  ```
- O servidor roda em `0.0.0.0` e responderá automaticamente na porta configurada pelo Render.
