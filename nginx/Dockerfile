# Dockerfile pour le proxy Nginx NovaSuite AI
FROM nginx:alpine

# Installer curl pour les health checks
RUN apk add --no-cache curl

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Créer les répertoires nécessaires
RUN mkdir -p /etc/nginx/ssl /var/log/nginx

# Exposer les ports
EXPOSE 80 443

# Commande de santé
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
