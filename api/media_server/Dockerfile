# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production


WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN apk update && \
    apk add --no-cache ffmpeg

RUN mkdir /usr/src/app/media && chown -R node:node /usr/src/app/media

COPY . .

RUN sed -i '45 d' /usr/src/app/node_modules/node-media-server/src/node_trans_server.js

EXPOSE 8001
EXPOSE 1935

CMD node server.js
