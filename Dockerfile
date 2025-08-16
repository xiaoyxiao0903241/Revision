FROM node:20-slim AS builder
WORKDIR /app
  
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/home/node/.pnpm-store \
    corepack enable \
 && corepack prepare pnpm@10.10.0 --activate \
 && pnpm install --store=/home/node/.pnpm-store --no-frozen-lockfile

COPY . .
RUN pnpm run build

FROM nginx:alpine AS static-server
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]