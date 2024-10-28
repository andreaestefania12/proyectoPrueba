FROM node:alpine

WORKDIR /portal-web

COPY ./portal-web/package*.json ./

RUN npm install

COPY ./portal-web .

RUN npm install -g @angular/cli@16

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]