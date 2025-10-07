#!/bin/bash

# 🚀 Script de Déploiement Production - NovaSuite AI
# Ce script automatise le déploiement complet en production

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Fonction pour demander confirmation
confirm() {
    read -p "$1 (y/N): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                    🚀 NovaSuite AI                           ║
║              Déploiement Production Automatisé               ║
║                                                               ║
║  Suite bureautique intelligente avec IA intégrée            ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Vérification des prérequis
log_info "Vérification des prérequis..."

# Vérifier si on est root ou sudo
if [[ $EUID -eq 0 ]]; then
    log_warning "Ce script est exécuté en tant que root. Recommandé d'utiliser sudo si nécessaire."
fi

# Vérifier Docker
if ! command_exists docker; then
    log_error "Docker n'est pas installé. Installation en cours..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    log_success "Docker installé avec succès"
else
    log_success "Docker est déjà installé"
fi

# Vérifier Docker Compose
if ! command_exists docker-compose; then
    log_error "Docker Compose n'est pas installé. Installation en cours..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose installé avec succès"
else
    log_success "Docker Compose est déjà installé"
fi

# Vérifier Git
if ! command_exists git; then
    log_error "Git n'est pas installé. Installation en cours..."
    sudo apt update && sudo apt install -y git
    log_success "Git installé avec succès"
else
    log_success "Git est déjà installé"
fi

# Configuration interactive
echo
log_info "Configuration du déploiement..."

# Demander le nom de domaine
read -p "Entrez votre nom de domaine (ex: monsite.com): " DOMAIN
if [[ -z "$DOMAIN" ]]; then
    log_error "Le nom de domaine est requis"
    exit 1
fi

# Demander l'email pour Let's Encrypt
read -p "Entrez votre email pour Let's Encrypt: " EMAIL
if [[ -z "$EMAIL" ]]; then
    log_error "L'email est requis pour Let's Encrypt"
    exit 1
fi

# Demander la clé OpenAI
read -p "Entrez votre clé API OpenAI (optionnel): " OPENAI_KEY

# Générer des mots de passe sécurisés
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
MINIO_ACCESS_KEY=$(openssl rand -base64 16)
MINIO_SECRET_KEY=$(openssl rand -base64 32)

log_info "Configuration générée:"
echo "  - Domaine: $DOMAIN"
echo "  - Email: $EMAIL"
echo "  - Mot de passe DB: [GÉNÉRÉ]"
echo "  - JWT Secret: [GÉNÉRÉ]"
echo "  - MinIO Keys: [GÉNÉRÉES]"

if ! confirm "Continuer avec cette configuration?"; then
    log_error "Déploiement annulé"
    exit 1
fi

# Créer les fichiers de configuration
log_info "Création des fichiers de configuration..."

# Configuration backend
cat > backend/.env << EOF
# Base de données
DATABASE_URL=postgresql://novasuite:${DB_PASSWORD}@postgres:5432/novasuite_db
DB_HOST=postgres
DB_PORT=5432
DB_NAME=novasuite_db
DB_USER=novasuite
DB_PASSWORD=${DB_PASSWORD}

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# MinIO (Stockage de fichiers)
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
MINIO_BUCKET=novasuite-files

# OnlyOffice
ONLYOFFICE_URL=http://onlyoffice:80

# OpenAI (pour l'IA)
OPENAI_API_KEY=${OPENAI_KEY}

# Serveur
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://${DOMAIN}
EOF

# Configuration frontend
cat > frontend/.env << EOF
VITE_API_URL=https://api.${DOMAIN}
VITE_WS_URL=wss://api.${DOMAIN}
VITE_ONLYOFFICE_URL=https://office.${DOMAIN}
EOF

# Configuration Docker Compose pour production
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  # Base de données PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: novasuite_postgres
    environment:
      POSTGRES_DB: novasuite_db
      POSTGRES_USER: novasuite
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - novasuite_network
    restart: unless-stopped

  # Stockage de fichiers MinIO
  minio:
    image: minio/minio:latest
    container_name: novasuite_minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    networks:
      - novasuite_network
    restart: unless-stopped

  # OnlyOffice Document Server
  onlyoffice:
    image: onlyoffice/documentserver:latest
    container_name: novasuite_onlyoffice
    environment:
      - JWT_ENABLED=false
    volumes:
      - onlyoffice_data:/var/www/onlyoffice/Data
      - onlyoffice_logs:/var/log/onlyoffice
    networks:
      - novasuite_network
    restart: unless-stopped

  # Backend Node.js
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: novasuite_backend
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - minio
      - onlyoffice
    networks:
      - novasuite_network
    restart: unless-stopped

  # Frontend React
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: novasuite_frontend
    env_file:
      - ./frontend/.env
    networks:
      - novasuite_network
    restart: unless-stopped

  # Proxy Nginx avec SSL
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: novasuite_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
      - onlyoffice
    networks:
      - novasuite_network
    restart: unless-stopped

volumes:
  postgres_data:
  minio_data:
  onlyoffice_data:
  onlyoffice_logs:

networks:
  novasuite_network:
    driver: bridge
EOF

# Configuration Nginx pour production
mkdir -p nginx
cat > nginx/nginx.prod.conf << EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name ${DOMAIN} api.${DOMAIN} office.${DOMAIN};
        return 301 https://\$server_name\$request_uri;
    }

    # Frontend
    server {
        listen 443 ssl http2;
        server_name ${DOMAIN};

        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
        
        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }

    # Backend API
    server {
        listen 443 ssl http2;
        server_name api.${DOMAIN};

        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
        
        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        # Rate limiting
        location /api/auth {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend:3001;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location / {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend:3001;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    # OnlyOffice
    server {
        listen 443 ssl http2;
        server_name office.${DOMAIN};

        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
        
        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        location / {
            proxy_pass http://onlyoffice:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # OnlyOffice specific headers
            proxy_set_header X-Forwarded-Host \$the_host/office;
            proxy_set_header X-Forwarded-Server \$host;
        }
    }
}
EOF

log_success "Fichiers de configuration créés"

# Installation de Certbot et obtention des certificats SSL
log_info "Installation de Certbot et obtention des certificats SSL..."

if ! command_exists certbot; then
    sudo apt update
    sudo apt install -y certbot
fi

# Arrêter les services qui pourraient utiliser les ports 80/443
sudo systemctl stop apache2 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true

# Obtenir les certificats SSL
log_info "Obtention des certificats SSL pour $DOMAIN..."
sudo certbot certonly --standalone \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "api.$DOMAIN" \
    -d "office.$DOMAIN"

if [[ $? -eq 0 ]]; then
    log_success "Certificats SSL obtenus avec succès"
else
    log_error "Échec de l'obtention des certificats SSL"
    exit 1
fi

# Configuration du renouvellement automatique
echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f docker-compose.prod.yml restart nginx" | sudo crontab -

# Construction et démarrage des services
log_info "Construction et démarrage des services Docker..."

# Arrêter les services existants
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Construire et démarrer
docker-compose -f docker-compose.prod.yml up -d --build

# Attendre que les services démarrent
log_info "Attente du démarrage des services..."
sleep 30

# Vérifier l'état des services
log_info "Vérification de l'état des services..."
docker-compose -f docker-compose.prod.yml ps

# Initialiser la base de données
log_info "Initialisation de la base de données..."
docker-compose -f docker-compose.prod.yml exec -T backend npm run migrate 2>/dev/null || log_warning "Migration échouée - la base pourrait déjà être initialisée"

# Tests de fonctionnement
log_info "Tests de fonctionnement..."

# Test HTTPS
if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200\|301\|302"; then
    log_success "Frontend accessible sur https://$DOMAIN"
else
    log_warning "Frontend pourrait ne pas être accessible immédiatement"
fi

# Test API
if curl -s -o /dev/null -w "%{http_code}" "https://api.$DOMAIN/health" | grep -q "200"; then
    log_success "API accessible sur https://api.$DOMAIN"
else
    log_warning "API pourrait ne pas être accessible immédiatement"
fi

# Créer le script de sauvegarde
log_info "Création du script de sauvegarde..."
sudo mkdir -p /opt/backups/novasuite

cat > /tmp/backup-novasuite.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/novasuite"
PROJECT_DIR="\$(pwd)"

cd "\$PROJECT_DIR"

# Sauvegarde base de données
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U novasuite novasuite_db > \$BACKUP_DIR/db_\$DATE.sql

# Sauvegarde des volumes Docker
docker run --rm -v novasuite-ai_minio_data:/data -v \$BACKUP_DIR:/backup alpine tar czf /backup/minio_\$DATE.tar.gz -C /data .

# Nettoyer les anciennes sauvegardes (garder 7 jours)
find \$BACKUP_DIR -type f -mtime +7 -delete

echo "Sauvegarde terminée: \$DATE"
EOF

sudo mv /tmp/backup-novasuite.sh /opt/backup-novasuite.sh
sudo chmod +x /opt/backup-novasuite.sh

# Ajouter au crontab pour sauvegarde quotidienne
(sudo crontab -l 2>/dev/null; echo "0 2 * * * /opt/backup-novasuite.sh") | sudo crontab -

# Affichage des informations finales
echo
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                 🎉 DÉPLOIEMENT TERMINÉ !                     ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo
log_success "NovaSuite AI est maintenant déployé en production !"
echo
echo -e "${BLUE}📋 Informations de déploiement:${NC}"
echo "  🌐 Frontend:     https://$DOMAIN"
echo "  🔧 API:          https://api.$DOMAIN"
echo "  📄 OnlyOffice:   https://office.$DOMAIN"
echo "  📊 Monitoring:   Logs via 'docker-compose -f docker-compose.prod.yml logs'"
echo
echo -e "${BLUE}🔐 Informations de sécurité:${NC}"
echo "  🔑 Mot de passe DB: $DB_PASSWORD"
echo "  🎫 JWT Secret: [Généré automatiquement]"
echo "  📦 MinIO Access: $MINIO_ACCESS_KEY"
echo "  📦 MinIO Secret: $MINIO_SECRET_KEY"
echo
echo -e "${YELLOW}⚠️  Sauvegardez ces informations dans un endroit sûr !${NC}"
echo
echo -e "${BLUE}📚 Commandes utiles:${NC}"
echo "  • Voir les logs:        docker-compose -f docker-compose.prod.yml logs -f"
echo "  • Redémarrer:          docker-compose -f docker-compose.prod.yml restart"
echo "  • Arrêter:             docker-compose -f docker-compose.prod.yml down"
echo "  • Sauvegarde manuelle: /opt/backup-novasuite.sh"
echo
echo -e "${GREEN}✅ Votre suite bureautique intelligente est prête !${NC}"

# Sauvegarder les informations de configuration
cat > deployment-info.txt << EOF
# NovaSuite AI - Informations de Déploiement
Date: $(date)
Domaine: $DOMAIN
Email: $EMAIL

# Accès
Frontend: https://$DOMAIN
API: https://api.$DOMAIN
OnlyOffice: https://office.$DOMAIN

# Base de données
DB_PASSWORD: $DB_PASSWORD
JWT_SECRET: $JWT_SECRET

# MinIO
MINIO_ACCESS_KEY: $MINIO_ACCESS_KEY
MINIO_SECRET_KEY: $MINIO_SECRET_KEY

# OpenAI
OPENAI_API_KEY: $OPENAI_KEY

# Commandes utiles
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml restart
/opt/backup-novasuite.sh
EOF

log_success "Informations sauvegardées dans deployment-info.txt"
echo
log_info "🚀 NovaSuite AI est maintenant en production ! Profitez de votre suite bureautique intelligente !"
