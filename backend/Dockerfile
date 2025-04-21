# Izmanto oficiālo Node.js attēlu
# Izmanto oficiālo Node.js attēlu
FROM alpine:latest

# Iestata darba direktoriju
WORKDIR /app

# Kopē package.json un package-lock.json
COPY package*.json ./

# Instalē atkarības (ieskaitot TypeScript)
RUN npm install

# Kopē visus failus
COPY . .

# Kompilē TypeScript kodu uz JavaScript
RUN npm run build  # Nodrošina, ka tiek izpildīts build process (tsc)

# Ekspozē portu
EXPOSE 3000

# Startē serveri, izmantojot kompilētos JS failus no dist mapes
CMD ["node", "dist/index.js"]
