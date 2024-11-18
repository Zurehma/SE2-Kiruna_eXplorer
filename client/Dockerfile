FROM node:20-alpine AS build_image

WORKDIR /app

ENV VITE_API_URL="http://localhost:3001"
ENV PORT=3000

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production_image

WORKDIR /app

COPY package*.json .

RUN npm install

COPY --from=build_image /app/dist /app/dist

RUN npm install -g serve

EXPOSE ${PORT}

CMD ["serve", "-s", "dist"]