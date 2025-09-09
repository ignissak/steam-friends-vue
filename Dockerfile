FROM node:lts-slim AS build-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN echo "Before: corepack version => $(corepack --version || echo 'not installed')"
RUN npm install -g corepack@latest
RUN echo "After : corepack version => $(corepack --version)"
RUN corepack enable

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

RUN pnpm build-only

CMD ["pnpm", "preview", "--host"]