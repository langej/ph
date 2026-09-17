FROM mcr.microsoft.com/playwright:v1.57.0-noble

COPY --from=oven/bun:1.4.0 /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]