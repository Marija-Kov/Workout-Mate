FROM node:18-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

COPY ./src ./src

RUN npm install

RUN apk add --no-cache curl

EXPOSE 6060

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:6060/api/users/health || exit 1

CMD ["npm", "run", "dev"]