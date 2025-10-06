# Dockerfile pour le backend NovaSuite AI
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

# Copier le code source
COPY . .

# Créer le répertoire uploads
RUN mkdir -p uploads

# Exposer le port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Commande de santé
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Commande de démarrage
CMD ["node", "server.js"]
