# beleganski-jaas 🥃🛁

> **JaaS** — Jacuzzi as a Service

[![Build & Push to Docker Hub](https://github.com/borntoeatt/beleganski-jaas/actions/workflows/deploy.yml/badge.svg)](https://github.com/borntoeatt/beleganski-jaas/actions/workflows/deploy.yml)
![License](https://img.shields.io/badge/license-RAKIA%20PUBLIC%20LICENSE%20v1.0-amber)
![Status](https://img.shields.io/badge/status-in%20jacuzzi-blue)
![My Commits](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github.com%2Frepos%2Fborntoeatt%2Fbeleganski-jaas%2Fcontributors&query=%24%5B0%5D.contributions&label=commits%20by%20dimitar&color=brightgreen)
![Docker Pulls](https://img.shields.io/docker/pulls/dporkov/beleganski-jaas)
![Docker Image Size](https://img.shields.io/docker/image-size/dporkov/beleganski-jaas/latest)
![Made with](https://img.shields.io/badge/made%20with-🥃%20rakia-orange)
![Reviewed from](https://img.shields.io/badge/reviewed%20from-jacuzzi-blue)

## What is this?

This is a production-grade, cloud-native, kubernetes-deployed web application dedicated to documenting the open source human known as **Alexander Beleganski** — a man whose primary function is drinking rakia in a jacuzzi during work hours.

This is not a joke. This is deployed on a real k3s cluster. With ArgoCD. With a CI/CD pipeline. With a real domain. Because he deserves it.

## Live Demo

🌐 [alex-jaas.dporkov.tech](https://alex-jaas.dporkov.tech)

Click the rakia glass. You know what to do.

## Features

- 🥃 Animated rakia glass on the landing page
- 📋 Fake GitHub profile (gitpub.com) with accurate stats
- 💻 `npm install alexander-beleganski@latest` terminal simulation
- 🚀 Deploy button that reveals Alex in his natural habitat
- 🫧 Jacuzzi bubbles & steam effects
- 🏆 Achievement unlocked banner
- 🇧🇬 Easter egg (click the flag 10 times)
- 🎊 Confetti explosion
- 💦 Rakia splash sound effect
- 🖱️ Custom 🥃 cursor with trail

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | [Astro](https://astro.build) 7, static output (still no framework at runtime, legends only) |
| Database / Auth | Supabase (hosted Postgres + Auth, RLS) |
| Container | node:22-alpine (build) → nginx:1.30-alpine-slim (serve) |
| Registry | Docker Hub (`dporkov/beleganski-jaas`) |
| Orchestration | k3s |
| GitOps | ArgoCD |
| CI/CD | GitHub Actions |
| Ingress | Nginx Proxy Manager + Let's Encrypt |
| DNS | Cloudflare |

## Architecture

```
git push
   │
   ▼
GitHub Actions
   ├── builds linux/amd64 Docker image
   ├── pushes dporkov/beleganski-jaas:<sha>
   └── sets newTag: <sha> in k8s/kustomization.yaml (rebases first, touches nothing else)
         │
         ▼
       ArgoCD detects manifest change
         │
         ▼
       k3s rolls out 3 replicas (readiness probes, PDB keeps ≥1 up)
         │
         ▼
       alex-jaas.dporkov.tech 🥃
```

## Local Development

Requires Node.js 22.12+.

```bash
npm install
npm run dev        # http://localhost:8080 with hot reload
npm run build      # astro check + static build into dist/
npm run preview    # serve the built dist/
```

Or the same way production runs it:

```bash
docker build -t beleganski-jaas:dev .
docker run --rm -p 8080:80 beleganski-jaas:dev
```

### Project structure

```
src/
  pages/index.astro      page: puts the components together
  layouts/Base.astro     <head>, SEO/OG tags, analytics
  components/*.astro     one file per section (Header, League, Guestbook, AuthModal, ...)
  data/site.ts           static content: pinned repos, demo league, incidents
  scripts/*.js           browser code: effects, graphs, scenes, Supabase (auth, league, guestbook)
  styles/global.css      all styles
  config.ts              public Supabase URL + publishable key
public/                  images, copied as-is
supabase/migrations/     database schema (applied by CI)
```

## Deploy Your Own

```bash
# Apply ArgoCD app
kubectl apply -f https://raw.githubusercontent.com/borntoeatt/beleganski-jaas/main/argocd/argocd-app.yaml

# Or manually (Kustomize: applies deployment, service, ingress, PDB with the current image tag)
kubectl apply -k k8s/
```

## Supabase setup (accounts, league, guestbook)

The site stays a static nginx container. The browser talks to hosted Supabase directly using the
**publishable (anon) key**. That key is public by design: access is enforced by the Row Level
Security policies in `supabase/migrations/`. With empty values in `src/config.ts`, the site builds in demo mode
(no sign-in, hardcoded stats).

| File | What it does |
|------|-------------|
| `supabase/migrations/*.sql` | Schema: profiles, team buildings, drink logs, ticket logs, guestbook, RLS policies, stats views |
| `.github/workflows/supabase-migrations.yml` | PRs: `db push --dry-run`. `main`: `supabase db push` when migrations change (or manually) |
| `src/config.ts` | Public Supabase URL + publishable key, bundled into the browser JS |

One-time setup:

1. **Create a project** at supabase.com and note the project ref, the DB password, the project URL and the publishable key (Project Settings → API).
2. **Add repo secrets** (GitHub → Settings → Secrets and variables → Actions):
   - `SUPABASE_ACCESS_TOKEN`: a personal access token from supabase.com → Account → Access Tokens
   - `SUPABASE_DB_PASSWORD`: the database password
   - `SUPABASE_PROJECT_REF`: the project ref (the `<ref>` in `https://<ref>.supabase.co`)
3. **Run the migrations**: Actions → *Supabase migrations* → Run workflow (or merge a migration change to `main`).
4. **Auth settings** (Authentication → URL Configuration):
   - Site URL: `https://alex-jaas.dporkov.tech`
   - Redirect URLs: `https://alex-jaas.dporkov.tech/**` (production only, on purpose)

   Email + password sign-up with email confirmation is the default. Email links (confirmation,
   password reset) always land on the production site, even when triggered from local dev:
   confirm or reset there, then sign in locally with the same account.

   Links are single-use. Some mail providers open links to scan them, which uses them up; the
   site then shows "link expired or already used" with a resend button. Often the account is
   already confirmed and signing in just works.
5. **Fill in `src/config.ts`** with the project URL and publishable key and commit it. Never put the `service_role` / secret key there.

Supabase's built-in email sender is heavily rate-limited and meant for testing. Configure custom SMTP
(Authentication → Emails → SMTP) before opening registration to real users.

## Known Issues

| Issue | Status |
|-------|--------|
| Alex is never at his desk | `wont fix` |
| Rakia dependency cannot be removed | `by design` |
| 0 commits pushed by Alex | `working as intended` |
| Alex found in jacuzzi during standup | `closed (duplicate)` |

## Contributing

PRs are welcome. Alex will review them from the jacuzzi.

Please note that the main branch is protected and requires at least one approval. Alex has not approved anything since Q3 2023.

## License

**RAKIA PUBLIC LICENSE v1.0**

This software is free to use, modify, and distribute, provided that:
1. A glass of rakia is consumed in honor of Alexander Beleganski
2. Said consumption takes place in, or adjacent to, a jacuzzi
3. It occurs during work hours

---

*Built with ❤️ and 🥃 by someone who has clearly run out of things to do at work.*
