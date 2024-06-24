FROM node:20-alpine

WORKDIR /app
ARG PORT=3000
ENV PORT ${PORT}

COPY . .

RUN apk --no-cache --virtual build-dependencies add \
  python3 \
  make \
  g++
RUN npm install
RUN apk del build-dependencies

EXPOSE ${PORT}
CMD [ "npm", "run", "dev" ]
