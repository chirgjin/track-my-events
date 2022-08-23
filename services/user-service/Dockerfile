FROM node:16.16-bullseye-slim as base
RUN apt-get update && apt-get install -y dumb-init
WORKDIR /
RUN mkdir -p /app && chown node:node /app
USER node
WORKDIR /app

FROM base as dependencies
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./yarn.lock ./
RUN yarn install
COPY --chown=node:node . .

FROM dependencies AS build
RUN tsc --build . && tsc-alias

FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./yarn.lock ./
RUN yarn install --production
COPY --chown=node:node --from=build /app/build .
EXPOSE 5000
CMD [ "dumb-init", "yarn", "start" ]
