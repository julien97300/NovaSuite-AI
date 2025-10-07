# 🚀 Guide de Déploiement Production - NovaSuite AI

## 📋 Vue d'ensemble

Ce guide vous explique comment déployer NovaSuite AI en production complète avec toutes les fonctionnalités backend, base de données, et services réels.

## 🏗️ Architecture Production

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Services      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Docker)      │
│                 │    │                 │    │                 │
│ • Interface UI  │    │ • API REST      │    │ • PostgreSQL    │
│ • Auth          │    │ • WebSocket     │    │ • MinIO         │
│ • Chat IA       │    │ • JWT Auth      │    │ • OnlyOffice    │
│ • File Upload   │    │ • File Mgmt     │    │ • Nginx         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Prérequis

### Serveur de Production
- **OS** : Ubuntu 20.04+ ou CentOS 7+
- **RAM** : Minimum 4GB (8GB recommandé)
- **CPU** : 2 cores minimum (4 cores recommandé)
- **Stockage** : 50GB minimum (SSD recommandé)
- **Réseau** : IP publique avec ports 80/443 ouverts

### Logiciels Requis
```bash
# Docker et Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Git
sudo apt update && sudo apt install -y git

# Node.js (pour le développement)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 📦 Déploiement Étape par Étape

### 1. Cloner le Repository

```bash
# Sur votre serveur de production
git clone https://github.com/julien97300/NovaSuite-AI.git
cd NovaSuite-AI
```

### 2. Configuration de l'Environnement

```bash
# Copier les fichiers d'environnement
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Configurer les Variables d'Environnement

#### Backend (.env)
```bash
# Base de données
DATABASE_URL=postgresql://novasuite:your_secure_password@postgres:5432/novasuite_db
DB_HOST=postgres
DB_PORT=5432
DB_NAME=novasuite_db
DB_USER=novasuite
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# MinIO (Stockage de fichiers)
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=novasuite_access
MINIO_SECRET_KEY=novasuite_secret_key
MINIO_BUCKET=novasuite-files

# OnlyOffice
ONLYOFFICE_URL=http://onlyoffice:80

# OpenAI (pour l'IA)
OPENAI_API_KEY=your_openai_api_key_here

# Serveur
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://votre-domaine.com
```

#### Frontend (.env)
```bash
VITE_API_URL=https://api.votre-domaine.com
VITE_WS_URL=wss://api.votre-domaine.com
VITE_ONLYOFFICE_URL=https://office.votre-domaine.com
```

### 4. Configuration SSL/HTTPS

#### Obtenir un certificat SSL avec Let's Encrypt
```bash
# Installer Certbot
sudo apt install -y certbot

# Obtenir le certificat (remplacez par votre domaine)
sudo certbot certonly --standalone -d votre-domaine.com -d api.votre-domaine.com -d office.votre-domaine.com

# Les certificats seront dans /etc/letsencrypt/live/votre-domaine.com/
```

#### Configurer Nginx pour HTTPS
```bash
# Modifier nginx/nginx.conf
server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl http2;
    server_name api.votre-domaine.com;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    location / {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 5. Déploiement avec Docker

```bash
# Construire et démarrer tous les services
docker-compose -f docker-compose.yml up -d --build

# Vérifier que tous les services sont actifs
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f
```

### 6. Initialisation de la Base de Données

```bash
# Se connecter au conteneur backend
docker-compose exec backend bash

# Exécuter les migrations
npm run migrate

# Créer un utilisateur administrateur
npm run seed:admin
```

### 7. Configuration DNS

Configurez vos enregistrements DNS :
```
A    votre-domaine.com        → IP_DE_VOTRE_SERVEUR
A    api.votre-domaine.com    → IP_DE_VOTRE_SERVEUR
A    office.votre-domaine.com → IP_DE_VOTRE_SERVEUR
```

## 🔐 Sécurité Production

### 1. Firewall
```bash
# Configurer UFW
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
```

### 2. Sauvegarde Automatique
```bash
# Créer un script de sauvegarde
cat > /opt/backup-novasuite.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/novasuite"
mkdir -p $BACKUP_DIR

# Sauvegarde base de données
docker-compose exec -T postgres pg_dump -U novasuite novasuite_db > $BACKUP_DIR/db_$DATE.sql

# Sauvegarde fichiers MinIO
docker-compose exec -T minio mc mirror /data/novasuite-files $BACKUP_DIR/files_$DATE/

# Nettoyer les anciennes sauvegardes (garder 7 jours)
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /opt/backup-novasuite.sh

# Ajouter au crontab (sauvegarde quotidienne à 2h)
echo "0 2 * * * /opt/backup-novasuite.sh" | sudo crontab -
```

### 3. Monitoring
```bash
# Installer Prometheus et Grafana (optionnel)
docker-compose -f docker-compose.monitoring.yml up -d
```

## 🚀 Mise en Production

### 1. Test de Fonctionnement
```bash
# Vérifier l'API
curl https://api.votre-domaine.com/health

# Vérifier le frontend
curl https://votre-domaine.com

# Vérifier OnlyOffice
curl https://office.votre-domaine.com
```

### 2. Configuration de l'IA (OpenAI)
1. Créez un compte sur [OpenAI](https://platform.openai.com/)
2. Générez une clé API
3. Ajoutez-la dans le fichier `.env` backend
4. Redémarrez le service : `docker-compose restart backend`

### 3. Test Complet
1. **Inscription** : Créez un compte utilisateur
2. **Connexion** : Testez l'authentification
3. **Documents** : Créez un document avec OnlyOffice
4. **IA** : Testez NovaCopilot
5. **Fichiers** : Uploadez des pièces jointes
6. **Collaboration** : Testez le partage en temps réel

## 🔄 Mise à Jour

```bash
# Sauvegarder avant mise à jour
/opt/backup-novasuite.sh

# Récupérer les dernières modifications
git pull origin main

# Reconstruire et redémarrer
docker-compose down
docker-compose up -d --build

# Vérifier le fonctionnement
docker-compose logs -f
```

## 📊 Monitoring et Maintenance

### Logs Importants
```bash
# Logs de l'application
docker-compose logs backend
docker-compose logs frontend

# Logs de la base de données
docker-compose logs postgres

# Logs du proxy
docker-compose logs nginx
```

### Métriques à Surveiller
- **CPU/RAM** : Utilisation des ressources
- **Espace disque** : Stockage des fichiers
- **Connexions** : Nombre d'utilisateurs actifs
- **Erreurs** : Logs d'erreurs backend/frontend

## 🆘 Dépannage

### Problèmes Courants

#### 1. Service ne démarre pas
```bash
# Vérifier les logs
docker-compose logs [service_name]

# Redémarrer un service spécifique
docker-compose restart [service_name]
```

#### 2. Base de données inaccessible
```bash
# Vérifier la connexion
docker-compose exec postgres psql -U novasuite -d novasuite_db

# Recréer la base si nécessaire
docker-compose down postgres
docker volume rm novasuite-ai_postgres_data
docker-compose up -d postgres
```

#### 3. Certificats SSL expirés
```bash
# Renouveler automatiquement
sudo certbot renew

# Redémarrer Nginx
docker-compose restart nginx
```

## 📞 Support

Pour toute question ou problème :
1. Consultez les logs : `docker-compose logs`
2. Vérifiez la documentation : `README.md`
3. Ouvrez une issue sur GitHub : [NovaSuite-AI Issues](https://github.com/julien97300/NovaSuite-AI/issues)

---

**🎉 Félicitations ! NovaSuite AI est maintenant déployé en production !**

Votre suite bureautique intelligente est prête à servir vos utilisateurs avec toutes les fonctionnalités professionnelles activées.
