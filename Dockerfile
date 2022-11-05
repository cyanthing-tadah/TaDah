FROM node:16.15.0 as build

WORKDIR /app

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

RUN npm i -g pnpm

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY src ./src

RUN export NODE_ENV=local

RUN pnpm install
RUN pnpm build

EXPOSE 3000

CMD ["node", "/app/dist/main.js"]

