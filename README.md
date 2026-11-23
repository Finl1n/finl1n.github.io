# Gustavo Martins — Portfólio

Portfólio de desenvolvedor Full Stack: <https://finl1n.github.io/>

**Stack:** React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Vite

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicação

Cada push na `main` dispara o workflow em `.github/workflows/deploy.yml`, que compila o projeto e publica no GitHub Pages.

A versão anterior do portfólio está guardada na branch `portfolio-antigo`.

## Folen, a IA do portfólio

Chat no canto da tela que responde sobre os projetos e a experiência do Gustavo e convida para contato. Custo zero: usa o plano gratuito da API do Google Gemini e uma função do Netlify no plano gratuito.

- `src/data.ts`: conteúdo do site (projetos, sobre, experiência, contatos). O site e a Folen leem daqui.
- `src/knowledge.ts`: monta a base de conhecimento e as instruções da Folen a partir de `data.ts`.
- `src/chat.tsx`: o widget. Só aparece quando o build tem `VITE_CHAT_API_URL`.
- `netlify/functions/chat.mts`: função serverless que chama a IA. A chave fica só no Netlify. Se a cota gratuita acabar, responde com o WhatsApp e o e-mail.

Configuração no Netlify (Site configuration > Environment variables):

- `LLM_API_KEY` (obrigatória): chave gratuita do Google AI Studio (aistudio.google.com > Get API key). Não ative faturamento no projeto do Google, assim nunca há cobrança.
- `LLM_MODEL` (opcional): lista de modelos separados por vírgula, tentados em ordem. Padrão `gemini-3.5-flash,gemini-3.5-flash-lite,gemini-flash-lite-latest`
- `LLM_BASE_URL` (opcional): qualquer API compatível com OpenAI, ex.: `https://api.groq.com/openai/v1`
- `ALLOWED_ORIGINS` (opcional, padrão `https://finl1n.github.io` e localhost; `*.netlify.app` é sempre aceito)

Para ligar o chat no GitHub Pages, defina `VITE_CHAT_API_URL` com o endereço da função (hoje `https://folen-portfolio.netlify.app/api/chat`, em `.github/workflows/deploy.yml`).
