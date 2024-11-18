FROM node:20-alpine AS build_image

WORKDIR /app

ARG VITE_API_URL
ARG PORT
ENV VITE_API_URL=${VITE_API_URL}
ENV PORT=${PORT}

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