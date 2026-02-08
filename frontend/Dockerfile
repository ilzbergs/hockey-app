# 1. Būvēšanas stadija
FROM node:alpine AS build

WORKDIR /app

# Pieņem argumentu no build komandas
ARG VITE_API_BASE_URL

# Pievieno ENV, lai vērtība tiktu izmantota Vue aplikācijā
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Production stadija
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

