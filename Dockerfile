# using two containers means we don't have to upload a docker layer containing pnpm, so it should be smaller.

# using node 18 here for arm/v7 compat (https://github.com/nodejs/docker-node/issues/1798)
FROM node:18-alpine AS pnpm-container

RUN npm i -g pnpm

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm i --frozen-lockfile --prod

FROM node:current-alpine

RUN npm i -g backloop.dev

COPY src src
COPY branches branches
COPY package.json package.json
COPY CHANGELOG.md CHANGELOG.md

COPY --from=pnpm-container node_modules node_modules

EXPOSE 8080/tcp
RUN backloop.dev localhost:9998 9999
ENTRYPOINT ["node", "src/index.js"]
STOPSIGNAL SIGKILL
