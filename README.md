# Caonysh Site

B2B product showcase and inquiry site for overseas buyers. Fully static:
[Astro](https://astro.build) injects product content from JSON files in this
repository at build time, and inquiries are forwarded to the company inbox
via [Web3Forms](https://web3forms.com). No backend, no database.

Deployed to GitHub Pages at <https://gxubaohua.github.io/caonysh/> — a push to
`main` builds and deploys the site automatically via GitHub Actions
(`.github/workflows/deploy.yml`).

## Commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | Local dev server with hot reload at `http://localhost:4321/`        |
| `npm test`        | Builds the site, then runs the full test suite against `dist/` HTML |
| `npm run build`   | Production build into `dist/`                                        |

`npm run typecheck` (`astro check`) and `npm run preview` (serve the built
`dist/` locally) are also available. CI runs install → typecheck → test on
every push and pull request; deploys run on `main` pushes only.

## Updating products

All product content lives in **`src/content/products.json`** (one entry per
product: name, category, images, description, price, MOQ, specs) and
**`src/content/categories.json`**. Edit the JSON, commit, and push to
`main` — the site rebuilds and goes live. The order of entries in the file
is the order products appear on the site.

A few rules the build enforces:

- A product **must** have at least one image and a category — otherwise the
  build fails and names the offending product.
- Images live in `src/assets/` and are compressed to WebP automatically at
  build time.
- Leave `price` as `null` (or remove the key) to show "Contact for price"
  instead of a number.
- A category with no products is hidden from the site automatically.
- Category slugs must not be `p` — that segment is reserved for product
  detail pages (`/products/p/<slug>/`).

## Configuration

- `src/config/site.json` — company name and contact email.
- `.env` (local) / `WEB3FORMS_ACCESS_KEY` (GitHub Actions secret) — the
  Web3Forms access key for the Contact form. Optional locally; required for
  the live site's inquiry form to deliver mail. See `.env.example`.
- `astro.config.mjs` — `site` and `base` point at the GitHub Pages project
  URL. If the site ever moves to its own domain, change both there.
