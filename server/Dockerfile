FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV="production"
ENV PORT=3001

COPY package*.json .

RUN npm install --production

COPY . .

EXPOSE ${PORT}

CMD [ "node", "index.mjs"]
