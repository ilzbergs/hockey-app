# Izmanto oficiālo Node.js attēlu
FROM node:23-alpine

# Iestata darba direktoriju
WORKDIR /app

# Kopē package.json un installē atkarības
COPY package*.json ./
RUN npm install

# Kopē visu pārējo failus
COPY . .

# Uzbūvē aplikāciju
RUN npm run build

# Izmanto nginx, lai kalpotu build failiem
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Ekspozē portu
EXPOSE 80

# Startē nginx serveri
CMD ["nginx", "-g", "daemon off;"]
