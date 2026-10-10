# ---- build: Astro -> static files in /app/dist ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- serve: same nginx as before, just the built files ----
FROM nginx:1.30-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
