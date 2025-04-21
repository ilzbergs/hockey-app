# Izmanto oficiālo Node.js attēlu, lai veiktu build procesu
FROM node:23-alpine AS build

# Iestata darba direktoriju
WORKDIR /app/frontend

# Kopē package.json un package-lock.json
COPY package*.json ./

# Instalē atkarības
RUN npm install

# Kopē visus frontend failus
COPY . .

# Veic build komandu, lai izveidotu produkcijas versiju
RUN npm run build

# Izmanto Nginx, lai serverētu produkcijas failus
FROM nginx:alpine

# Kopē būvētos failus uz Nginx direktoriju
COPY --from=build /app/dist /usr/share/nginx/html

# Ekspozē portu 80, lai Nginx būtu pieejams
EXPOSE 80

# Startē Nginx serveri
CMD ["nginx", "-g", "daemon off;"]
