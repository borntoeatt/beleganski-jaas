# beleganski-jaas 🥃🛁

> **JaaS** — Jacuzzi as a Service

[![Build & Push to Docker Hub](https://github.com/borntoeatt/beleganski-jaas/actions/workflows/deploy.yml/badge.svg)](https://github.com/borntoeatt/beleganski-jaas/actions/workflows/deploy.yml)
![License](https://img.shields.io/badge/license-RAKIA%20PUBLIC%20LICENSE%20v1.0-amber)
![Status](https://img.shields.io/badge/status-in%20jacuzzi-blue)
![Commits by Alex](https://img.shields.io/badge/commits%20by%20alex-0-critical)
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
