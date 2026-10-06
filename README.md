# kblankk/links

Portal de links de **Kawã Crispim de Oliveira** — GitHub, LinkedIn, Instagram, portfólio e contato numa página só.

**Ao vivo:** https://kblankk.github.io/links/

React 19 · TypeScript · Tailwind CSS 4 · Motion · Vite

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173/links/
```

## Editar links

Tudo fica em [`src/data/profile.ts`](src/data/profile.ts): nome, cargos do typewriter, links, cores de cada marca e a stack do marquee.

## Publicar

Cada push na `main` faz build e publica no GitHub Pages (`.github/workflows/deploy.yml`).
No repositório: **Settings → Pages → Source: GitHub Actions**.

O site é servido em `/links/`. Se o repositório tiver outro nome, troque `base` em `vite.config.ts` e as URLs absolutas em `index.html`.
