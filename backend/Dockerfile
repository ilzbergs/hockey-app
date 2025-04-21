# Izmanto oficiālo Node.js attēlu
FROM node:23-alpine


# Iestata darba direktoriju
WORKDIR /app

# Kopē package.json un package-lock.json
COPY package*.json ./

# Instalē atkarības (ieskaitot TypeScript)
RUN npm install

# Kopē visus failus
COPY . .

# Kompilē TypeScript kodu uz JavaScript
RUN npm run build 

# Ekspozē portu
EXPOSE 3000

# Startē serveri, izmantojot kompilētos JS failus no dist mapes
CMD ["npm", "run", "start"]

