FROM node:20-alpine AS builder

WORKDIR /app

COPY ./src ./src

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

RUN npm ci --omit=dev \
  && npx tsc

FROM node:20-alpine

ARG BACKEND_ENV=production
ENV NODE_ENV=${BACKEND_ENV}

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY ./package.json .
COPY ./package-lock.json .
COPY ./.env.production .

EXPOSE 3000
CMD node ./dist/Main.js
