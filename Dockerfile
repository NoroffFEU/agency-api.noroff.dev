# Base stage
FROM node:20.11-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3000
ENTRYPOINT ["npm", "run", "start:migrate:prod"]

