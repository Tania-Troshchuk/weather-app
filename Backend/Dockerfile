FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# CMD ["node", "dist/src/main"]
# CMD [ "npm", "run", "start:dev" ]
