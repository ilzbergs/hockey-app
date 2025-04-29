FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Pieņem VITE_API_BASE_URL kā būves argumentu
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
