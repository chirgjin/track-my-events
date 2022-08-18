FROM node:16.16-bullseye-slim as base
RUN apt-get update && apt-get install -y dumb-init
WORKDIR /
RUN mkdir -p /home/node/app && chown node:node /home/node/app
USER node
WORKDIR /home/node/app

FROM base as dependencies
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./yarn.lock ./
RUN yarn install
COPY --chown=node:node . .

FROM dependencies AS build
RUN yarn build

FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./yarn.lock ./
RUN yarn install --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE 5000
CMD [ "dumb-init", "yarn", "start" ]
