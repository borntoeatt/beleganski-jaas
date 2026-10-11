# ---- build: Astro -> static files in /app/dist ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- serve: nginx 1.30 running as non-root (uid 101), listens on 8080 ----
FROM nginxinc/nginx-unprivileged:1.30-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
