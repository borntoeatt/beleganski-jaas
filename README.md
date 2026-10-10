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
| Frontend | Pure HTML/CSS/JS (no framework needed for legends) |
| Database / Auth | Supabase (hosted Postgres + Auth, RLS) |
| Container | nginx:alpine |
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
   └── updates k8s/deployment.yaml with new SHA
         │
         ▼
       ArgoCD detects manifest change
         │
         ▼
       k3s pulls new image & restarts pod
         │
         ▼
       alex-jaas.dporkov.tech 🥃
```

## Local Development

```bash
# No build step needed. Just open it.
open index.html
```

## Deploy Your Own

```bash
# Apply ArgoCD app
kubectl apply -f https://raw.githubusercontent.com/borntoeatt/beleganski-jaas/main/k8s/argocd-app.yaml

# Or manually
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

## Supabase setup (accounts, league, guestbook)

The site stays a static nginx container. The browser talks to hosted Supabase directly using the
**publishable (anon) key**. That key is public by design: access is enforced by the Row Level
Security policies in `supabase/migrations/`. With an empty `config.js`, the site runs in demo mode
(no sign-in, hardcoded stats).

| File | What it does |
|------|-------------|
| `supabase/migrations/*.sql` | Schema: profiles, team buildings, drink logs, ticket logs, guestbook, RLS policies, stats views |
| `.github/workflows/supabase-migrations.yml` | Runs `supabase db push` on pushes to `main` that change migrations (or manually) |
| `config.js` | Public Supabase URL + publishable key used by the browser |

One-time setup:

1. **Create a project** at supabase.com and note the project ref, the DB password, the project URL and the publishable key (Project Settings → API).
2. **Add repo secrets** (GitHub → Settings → Secrets and variables → Actions):
   - `SUPABASE_ACCESS_TOKEN`: a personal access token from supabase.com → Account → Access Tokens
   - `SUPABASE_DB_PASSWORD`: the database password
   - `SUPABASE_PROJECT_REF`: the project ref (the `<ref>` in `https://<ref>.supabase.co`)
3. **Run the migrations**: Actions → *Supabase migrations* → Run workflow (or merge a migration change to `main`).
4. **Auth settings** (Authentication → URL Configuration): Site URL `https://alex-jaas.dporkov.tech`, and add `http://localhost:8080` to the redirect URLs for local dev. Email + password sign-up with email confirmation is the default.
5. **Fill in `config.js`** with the project URL and publishable key and commit it. Never put the `service_role` / secret key there.

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
