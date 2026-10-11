# ---- build: Astro -> static files in /app/dist ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- serve: same nginx as before, just the built files ----
FROM nginx:1.30-alpine-slim
# Also listen on 8080: lets the Service move to 8080 (next step: non-root nginx-unprivileged) without downtime
RUN sed -i 's|^\(\s*\)listen       80;|&\n\1listen       8080;|' /etc/nginx/conf.d/default.conf \
 && grep -q 'listen       8080;' /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 8080
