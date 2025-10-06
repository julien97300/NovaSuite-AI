# Dockerfile pour le frontend NovaSuite AI
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Arguments de build pour les variables d'environnement
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_SOCKET_URL=http://localhost:5000
ARG VITE_ONLYOFFICE_URL=http://localhost:8080
ARG VITE_NODE_ENV=production
ARG VITE_APP_NAME=NovaSuite AI
ARG VITE_APP_VERSION=1.0.0

# Définir les variables d'environnement pour le build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_ONLYOFFICE_URL=$VITE_ONLYOFFICE_URL
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Construire l'application
RUN pnpm run build

# Stage de production avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers construits
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande de santé
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost || exit 1

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
