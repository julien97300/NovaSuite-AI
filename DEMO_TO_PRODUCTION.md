# 🔄 Migration Démo → Production - NovaSuite AI

## 📋 Différences Démo vs Production

| Fonctionnalité | Mode Démo | Mode Production |
|---|---|---|
| **Authentification** | Simulée (tout email/mot de passe) | JWT réel avec base de données |
| **Base de données** | Données en mémoire | PostgreSQL persistante |
| **Stockage fichiers** | Simulation locale | MinIO S3-compatible |
| **Assistant IA** | Réponses simulées | OpenAI GPT réel |
| **Collaboration** | Simulation WebSocket | Socket.IO temps réel |
| **Éditeur documents** | Interface simulée | OnlyOffice Document Server |
| **Sécurité** | Aucune | HTTPS, JWT, validation |
| **Performance** | Limitée | Optimisée pour production |

## 🚀 Options de Déploiement Production

### Option 1: Déploiement Automatisé (Recommandé)

```bash
# 1. Cloner le projet sur votre serveur
git clone https://github.com/julien97300/NovaSuite-AI.git
cd NovaSuite-AI

# 2. Exécuter le script de déploiement automatisé
./deploy-production.sh
```

**Avantages:**
- ✅ Configuration automatique complète
- ✅ SSL/HTTPS automatique avec Let's Encrypt
- ✅ Sauvegardes automatiques configurées
- ✅ Monitoring et logs intégrés
- ✅ Sécurité optimisée

### Option 2: Déploiement Cloud (Facile)

#### A. Déploiement sur DigitalOcean

```bash
# 1. Créer un Droplet Ubuntu 22.04 (4GB RAM minimum)
# 2. Se connecter en SSH
ssh root@votre-ip-serveur

# 3. Cloner et déployer
git clone https://github.com/julien97300/NovaSuite-AI.git
cd NovaSuite-AI
./deploy-production.sh
```

#### B. Déploiement sur AWS EC2

```bash
# 1. Lancer une instance EC2 Ubuntu 22.04 (t3.medium minimum)
# 2. Configurer les Security Groups (ports 80, 443, 22)
# 3. Se connecter et déployer
ssh -i votre-cle.pem ubuntu@votre-ip-aws
git clone https://github.com/julien97300/NovaSuite-AI.git
cd NovaSuite-AI
./deploy-production.sh
```

#### C. Déploiement sur Google Cloud

```bash
# 1. Créer une VM Compute Engine Ubuntu 22.04
# 2. Configurer le firewall (HTTP/HTTPS)
# 3. Se connecter et déployer
gcloud compute ssh votre-instance
git clone https://github.com/julien97300/NovaSuite-AI.git
cd NovaSuite-AI
./deploy-production.sh
```

### Option 3: Déploiement Local/VPS

```bash
# Sur votre serveur local ou VPS
git clone https://github.com/julien97300/NovaSuite-AI.git
cd NovaSuite-AI

# Configuration manuelle (voir PRODUCTION_DEPLOYMENT.md)
cp .env.example .env
# Éditer les fichiers de configuration
nano backend/.env
nano frontend/.env

# Démarrer avec Docker Compose
docker-compose up -d --build
```

## 🔧 Configuration Requise

### Serveur Minimum
- **CPU:** 2 cores
- **RAM:** 4GB
- **Stockage:** 50GB SSD
- **OS:** Ubuntu 20.04+ / CentOS 7+
- **Réseau:** IP publique, ports 80/443 ouverts

### Serveur Recommandé
- **CPU:** 4 cores
- **RAM:** 8GB
- **Stockage:** 100GB SSD
- **OS:** Ubuntu 22.04 LTS
- **Réseau:** CDN (Cloudflare recommandé)

## 🔑 Services Externes Requis

### 1. Nom de Domaine
```bash
# Acheter un domaine et configurer les DNS
A    votre-domaine.com        → IP_SERVEUR
A    api.votre-domaine.com    → IP_SERVEUR
A    office.votre-domaine.com → IP_SERVEUR
```

### 2. Clé API OpenAI (pour l'IA)
```bash
# 1. Créer un compte sur https://platform.openai.com/
# 2. Générer une clé API
# 3. L'ajouter dans la configuration backend/.env
OPENAI_API_KEY=sk-votre-cle-openai-ici
```

### 3. Email pour SSL (Let's Encrypt)
```bash
# Email valide pour les notifications de renouvellement SSL
EMAIL=votre@email.com
```

## ⚡ Déploiement Express (5 minutes)

Pour un déploiement ultra-rapide sur un serveur vierge :

```bash
# 1. Connexion au serveur
ssh root@votre-serveur

# 2. Installation express
curl -fsSL https://raw.githubusercontent.com/julien97300/NovaSuite-AI/main/deploy-production.sh | bash

# 3. Suivre les instructions interactives
# - Entrer votre domaine
# - Entrer votre email
# - Entrer votre clé OpenAI (optionnel)

# 4. Attendre la fin du déploiement (5-10 minutes)
# 5. Accéder à https://votre-domaine.com
```

## 🔒 Sécurité Production

### Automatiquement Configuré
- ✅ **HTTPS/SSL** avec Let's Encrypt
- ✅ **Firewall** UFW configuré
- ✅ **Rate Limiting** Nginx
- ✅ **JWT Authentication** sécurisé
- ✅ **Mots de passe** générés aléatoirement
- ✅ **CORS** configuré correctement

### À Configurer Manuellement
- 🔧 **Backup externe** (AWS S3, Google Drive)
- 🔧 **Monitoring** (Prometheus/Grafana)
- 🔧 **Alertes** (email/SMS)
- 🔧 **CDN** (Cloudflare)

## 📊 Monitoring Production

### Logs en Temps Réel
```bash
# Tous les services
docker-compose -f docker-compose.prod.yml logs -f

# Service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Métriques Système
```bash
# Utilisation des ressources
docker stats

# Espace disque
df -h

# Processus
htop
```

### Health Checks
```bash
# API Health
curl https://api.votre-domaine.com/health

# Frontend
curl https://votre-domaine.com

# OnlyOffice
curl https://office.votre-domaine.com
```

## 🔄 Mise à Jour Production

```bash
# 1. Sauvegarde automatique
/opt/backup-novasuite.sh

# 2. Récupérer les mises à jour
git pull origin main

# 3. Redéployer
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Vérifier le fonctionnement
docker-compose -f docker-compose.prod.yml ps
```

## 🆘 Support et Dépannage

### Problèmes Courants

#### 1. "Site not found" après déploiement
```bash
# Vérifier les DNS
nslookup votre-domaine.com

# Vérifier Nginx
docker-compose -f docker-compose.prod.yml logs nginx

# Redémarrer Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

#### 2. Certificats SSL non valides
```bash
# Renouveler les certificats
sudo certbot renew

# Redémarrer Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

#### 3. Base de données inaccessible
```bash
# Vérifier PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres

# Recréer la base si nécessaire
docker-compose -f docker-compose.prod.yml down postgres
docker volume rm novasuite-ai_postgres_data
docker-compose -f docker-compose.prod.yml up -d postgres
```

### Obtenir de l'Aide

1. **Documentation:** Consultez `PRODUCTION_DEPLOYMENT.md`
2. **Logs:** Analysez les logs avec `docker-compose logs`
3. **GitHub Issues:** [Ouvrir une issue](https://github.com/julien97300/NovaSuite-AI/issues)
4. **Community:** Rejoignez les discussions GitHub

## 🎯 Checklist de Migration

### Avant le Déploiement
- [ ] Serveur configuré (Ubuntu 22.04+, 4GB RAM, 50GB SSD)
- [ ] Nom de domaine acheté et DNS configurés
- [ ] Clé API OpenAI obtenue (optionnel)
- [ ] Email valide pour Let's Encrypt
- [ ] Accès SSH au serveur

### Pendant le Déploiement
- [ ] Script `deploy-production.sh` exécuté
- [ ] Configuration interactive complétée
- [ ] Certificats SSL obtenus avec succès
- [ ] Services Docker démarrés
- [ ] Tests de fonctionnement passés

### Après le Déploiement
- [ ] Site accessible sur https://votre-domaine.com
- [ ] API fonctionnelle sur https://api.votre-domaine.com
- [ ] OnlyOffice accessible sur https://office.votre-domaine.com
- [ ] Compte utilisateur créé et testé
- [ ] Upload de fichiers testé
- [ ] Assistant IA testé (si clé OpenAI configurée)
- [ ] Sauvegarde automatique configurée

## 🎉 Félicitations !

Une fois ces étapes terminées, vous disposez d'une **suite bureautique intelligente complète en production** avec :

- 🏢 **Interface professionnelle** accessible 24/7
- 🤖 **Assistant IA** intégré et fonctionnel
- 📄 **Éditeur de documents** OnlyOffice complet
- 👥 **Collaboration temps réel** multi-utilisateurs
- 🔒 **Sécurité enterprise** avec HTTPS et authentification
- 📊 **Performance optimisée** pour de nombreux utilisateurs
- 💾 **Sauvegardes automatiques** quotidiennes
- 🔄 **Mises à jour** faciles et sécurisées

**Votre NovaSuite AI est maintenant prête pour un usage professionnel !** 🚀
