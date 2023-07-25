FROM node:20-bullseye-slim

RUN apt-get update

WORKDIR /usr/root/frontend

COPY ./frontend/ /usr/root/frontend/

EXPOSE 80

RUN npm i

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]
