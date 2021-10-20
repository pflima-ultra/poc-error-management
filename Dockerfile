FROM node:12.16

ARG NPM_TOKEN

WORKDIR /opt/app/

COPY package.json package-lock.json .env .npmrc ./
RUN mkdir dist doc
COPY dist dist
COPY doc doc

RUN npm install

CMD ["node", "-r", "dotenv/config", "dist/main.js"]
