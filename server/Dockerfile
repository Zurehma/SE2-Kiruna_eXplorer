FROM node:20-alpine

WORKDIR /app

ARG NODE_ENV
ARG PORT
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

COPY package*.json .

RUN npm install --production

COPY . .

EXPOSE ${PORT}

CMD [ "node", "index.mjs"]
