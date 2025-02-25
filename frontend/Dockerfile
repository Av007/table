FROM node:23 as builder

WORKDIR /app

COPY package*.json /app/

COPY .env-dist /app/.env

RUN npm install

COPY . /app

ARG STAGE
ENV VITE_ENV=${STAGE}


RUN npm run build

EXPOSE 80

CMD ["npx", "serve", "-s", "dist", "-l", "80"]
