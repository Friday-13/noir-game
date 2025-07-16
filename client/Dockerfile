FROM node:22.16-alpine

WORKDIR /usr/app/client

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD npm run dev
