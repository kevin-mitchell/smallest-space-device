# Stage 1: Build
FROM node:23 AS BUILD

WORKDIR /app

COPY ./app .
RUN npm install --only=production


# Stage 2: Run
FROM node:23-alpine as RUN

WORKDIR /app

COPY --from=BUILD /app /app

CMD ["node", "index.js"]
