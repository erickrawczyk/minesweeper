FROM node:10-slim

ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_URL

ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_URL $DB_URL

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY server ./

EXPOSE 8080

CMD [ "node", "index.js" ]

