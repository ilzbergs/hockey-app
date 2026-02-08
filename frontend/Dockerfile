# # 1. Būvēšanas stadija
# FROM node:alpine AS build

# WORKDIR /app

# # Pieņem argumentu no build komandas
# ARG VITE_API_BASE_URL

# # Pievieno ENV, lai vērtība tiktu izmantota Vue aplikācijā
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# # 2. Production stadija
# FROM nginx:alpine

# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 80


# 1️⃣ Node build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2️⃣ Nginx serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
