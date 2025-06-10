FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY ./src ./src
COPY ./public ./public

RUN npm install

RUN apk add --no-cache curl

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5173/health || exit 1

CMD ["npm", "start"]