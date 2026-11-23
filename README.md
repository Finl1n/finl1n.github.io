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

## Assistente de IA

Chat no canto da tela que responde sobre os projetos e a experiência do Gustavo e convida para contato.

- `src/data.ts`: conteúdo do site (projetos, sobre, experiência, contatos). O site e o assistente leem daqui.
- `src/knowledge.ts`: monta a base de conhecimento e as instruções do assistente a partir de `data.ts`.
- `src/chat.tsx`: o widget. Só aparece quando o build tem `VITE_CHAT_API_URL`.
- `netlify/functions/chat.mts`: função serverless que chama a API da Claude. A chave fica só no Netlify.

Configuração no Netlify (Site configuration > Environment variables):

- `ANTHROPIC_API_KEY` (obrigatória)
- `CHAT_MODEL` (opcional, padrão `claude-opus-5-5`)
- `ALLOWED_ORIGINS` (opcional, padrão `https://finl1n.github.io` e localhost; `*.netlify.app` é sempre aceito)

Para ligar o chat no GitHub Pages, defina `VITE_CHAT_API_URL` com o endereço da função (ex.: `https://SEU-SITE.netlify.app/api/chat`) no build.
