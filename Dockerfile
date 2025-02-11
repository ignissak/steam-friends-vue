FROM node:lts-slim as build-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN echo "Before: corepack version => $(corepack --version || echo 'not installed')"
RUN npm install -g corepack@latest
RUN echo "After : corepack version => $(corepack --version)"
RUN corepack enable

RUN ls -la

COPY package.json /app/package.json
WORKDIR /app

RUN pnpm install

COPY . /app
RUN ls -la
RUN ls -la node_modules/

RUN pnpm build

CMD ["pnpm", "preview", "--host"]