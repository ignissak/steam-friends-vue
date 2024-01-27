FROM node:lts-alpine as build-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN ls -la

COPY package.json /app/package.json
WORKDIR /app

RUN pnpm install

COPY . /app
RUN ls -la
RUN ls -la node_modules/

RUN pnpm build-only

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]