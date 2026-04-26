# Changelog

All notable changes to alexander-beleganski will be documented here.

## [Unreleased]
- Alex is still in the jacuzzi

---

## [4.2.0-jacuzzi] - 2026-04-25

### Added
- Deployed Alex to production (jacuzzi environment)
- GoatCounter analytics — confirmed 3 real humans have seen this
- Report to HR button — HR auto-closed the ticket (wont-fix)
- Secret rakia mode — type `rakia` anywhere
- Animated 🥃 favicon
- Live status cycling — Alex is always in the jacuzzi
- Mobile support — Alex can now be viewed from a phone, in a jacuzzi
- Bubble sounds, splash sounds, typing sounds

### Fixed
- GitHub Actions infinite loop (bot was deploying Alex 440 times)
- Terminal scroll issue (overflow:hidden was hiding the truth)
- Easter egg z-index (buried under other elements, like Alex under bubbles)

### Security
- Fork button now correctly returns 403 (Alex cannot be forked)

---

## [4.1.0] - 2026-04-25

### Added
- ArgoCD GitOps deployment
- GitHub Actions CI/CD pipeline
- Docker Hub image (linux/amd64, for k3s)
- SSL via Nginx Proxy Manager
- Real domain: alex-jaas.dporkov.tech

### Changed
- Service type: LoadBalancer → NodePort (NPM handles ingress now)

---

## [4.0.0] - 2026-04-25 — Initial Release

### Added
- Alexander Beleganski (open source human)
- Rakia glass animation (Scene 1)
- Jacuzzi reveal (Scene 2)
- gitpub.com profile page
- npm install terminal simulation
- FOUND! JACUZZI UNIT stamp
- Confetti explosion
- 🇧🇬 Easter egg (10 clicks)
- RAKIA PUBLIC LICENSE v1.0

### Known Issues
- Alex is always in the jacuzzi (wont-fix, by design)
- 0 commits from Alex (wont-fix)
- Rakia dependency cannot be removed (wont-fix)
