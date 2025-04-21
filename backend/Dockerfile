# Izmanto oficiālo Node.js attēlu
FROM node:23-alpine

# Iestata darba direktoriju uz backend
WORKDIR /app/backend

# Kopē package.json un package-lock.json
COPY backend/package*.json ./

# Instalē atkarības (ieskaitot TypeScript)
RUN npm install

# Kopē visus backend failus
COPY backend/ .

# Kompilē TypeScript kodu uz JavaScript (dist mape)
RUN npm run build

# Ekspozē portu
EXPOSE 3000

# Startē serveri, izmantojot kompilētos JS failus no dist mapes
CMD ["npm", "run", "start"]
