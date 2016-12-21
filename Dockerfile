FROM mhart/alpine-node:7.3

EXPOSE 3000

RUN apk add --no-cache docker

WORKDIR /app

COPY package.json /app
RUN npm install

COPY index.js /app

CMD ["npm", "start"]
