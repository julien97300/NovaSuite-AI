# 📁 Structure du Projet NovaSuite AI

Ce document décrit l'organisation complète du projet NovaSuite AI.

## 🏗️ Architecture Générale

```
novasuite-ai/
├── 📁 backend/                 # API Node.js + Express
├── 📁 frontend/                # Interface React + Vite
├── 📁 nginx/                   # Configuration proxy Nginx
├── 📁 docker/                  # Scripts et configurations Docker
├── 📁 docs/                    # Documentation supplémentaire
├── 🐳 docker-compose.yml       # Configuration production
├── 🐳 docker-compose.dev.yml   # Configuration développement
├── 🚀 start.sh                 # Script de démarrage
├── 📖 README.md                # Documentation principale
├── ⚡ QUICK_START.md           # Guide de démarrage rapide
└── 📄 LICENSE                  # Licence MIT
```

## 🔧 Backend (Node.js + Express)

```
backend/
├── 📁 config/                  # Configuration de l'application
│   └── database.js             # Configuration Sequelize/PostgreSQL
├── 📁 controllers/             # Logique métier des routes
│   ├── authController.js       # Authentification et autorisation
│   ├── documentController.js   # Gestion des documents
│   ├── aiController.js         # Endpoints NovaCopilot IA
│   ├── collaborationController.js # Collaboration en temps réel
│   └── onlyofficeController.js # Intégration OnlyOffice
├── 📁 middleware/              # Middlewares Express
│   ├── auth.js                 # Middleware d'authentification JWT
│   └── errorHandler.js         # Gestion centralisée des erreurs
├── 📁 models/                  # Modèles de données Sequelize
│   ├── User.js                 # Modèle utilisateur
│   ├── Document.js             # Modèle document
│   ├── Folder.js               # Modèle dossier
│   ├── Collaboration.js        # Modèle collaboration
│   └── index.js                # Associations et exports
├── 📁 routes/                  # Définition des routes API
│   ├── auth.js                 # Routes d'authentification
│   ├── documents.js            # Routes de gestion des documents
│   ├── ai.js                   # Routes de l'assistant IA
│   ├── collaboration.js        # Routes de collaboration
│   └── onlyoffice.js           # Routes OnlyOffice
├── 📁 services/                # Services métier
│   └── aiService.js            # Service d'intégration IA
├── 📁 uploads/                 # Stockage temporaire des fichiers
├── 🐳 Dockerfile               # Image Docker production
├── 🐳 Dockerfile.dev           # Image Docker développement
├── 📦 package.json             # Dépendances et scripts npm
├── 🔧 .env                     # Variables d'environnement
└── 🚀 server.js                # Point d'entrée de l'application
```

## 🎨 Frontend (React + Vite)

```
frontend/
├── 📁 public/                  # Fichiers statiques publics
│   ├── favicon.ico             # Icône de l'application
│   └── manifest.json           # Manifest PWA
├── 📁 src/                     # Code source React
│   ├── 📁 components/          # Composants React réutilisables
│   │   ├── Login.jsx           # Composant de connexion
│   │   ├── Register.jsx        # Composant d'inscription
│   │   ├── Dashboard.jsx       # Tableau de bord principal
│   │   ├── Sidebar.jsx         # Barre latérale de navigation
│   │   ├── ChatPanel.jsx       # Panel de chat IA
│   │   ├── AIAssistant.jsx     # Interface NovaCopilot
│   │   └── DocumentEditor.jsx  # Éditeur de documents OnlyOffice
│   ├── 📁 lib/                 # Utilitaires et services
│   │   ├── store.js            # Store Zustand (état global)
│   │   ├── api.js              # Client API et requêtes
│   │   └── socket.js           # Client Socket.IO
│   ├── App.jsx                 # Composant racine de l'application
│   ├── main.jsx                # Point d'entrée React
│   └── App.css                 # Styles globaux
├── 🐳 Dockerfile               # Image Docker production
├── 🐳 nginx.conf               # Configuration Nginx pour SPA
├── 📦 package.json             # Dépendances et scripts npm
├── ⚙️ vite.config.js           # Configuration Vite
├── 🎨 tailwind.config.js       # Configuration TailwindCSS
└── 🔧 .env                     # Variables d'environnement frontend
```

## 🌐 Nginx (Proxy Inverse)

```
nginx/
├── 🐳 Dockerfile               # Image Nginx personnalisée
├── ⚙️ nginx.conf               # Configuration du proxy principal
└── 📁 ssl/                     # Certificats SSL (optionnel)
    ├── cert.pem                # Certificat SSL
    └── key.pem                 # Clé privée SSL
```

## 🐳 Docker (Conteneurisation)

```
docker/
└── 📁 postgres/                # Configuration PostgreSQL
    └── init.sql                # Script d'initialisation de la DB
```

## 📚 Documentation

```
docs/
├── API.md                      # Documentation de l'API REST
├── DEPLOYMENT.md               # Guide de déploiement avancé
├── DEVELOPMENT.md              # Guide de développement
├── SECURITY.md                 # Bonnes pratiques de sécurité
└── TROUBLESHOOTING.md          # Guide de résolution de problèmes
```

## 🔑 Fichiers de Configuration Clés

| Fichier | Description |
| :--- | :--- |
| `docker-compose.yml` | Configuration Docker Compose pour la production |
| `docker-compose.dev.yml` | Configuration Docker Compose pour le développement |
| `.env.example` | Modèle de fichier de configuration |
| `start.sh` | Script de démarrage et de gestion de l'application |
| `package.json` | Métadonnées et dépendances du projet |

## 🚀 Points d'Entrée

| Service | Point d'Entrée | Description |
| :--- | :--- | :--- |
| **Application** | `http://localhost` | Interface utilisateur principale |
| **API Backend** | `http://localhost/api` | API REST pour les opérations |
| **OnlyOffice** | `http://localhost/onlyoffice` | Serveur de documents OnlyOffice |
| **MinIO Console** | `http://localhost:9001` | Interface d'administration du stockage |
| **Base de Données** | `localhost:5432` | Accès direct PostgreSQL |

## 📦 Technologies par Composant

### Backend
- **Runtime** : Node.js 18
- **Framework** : Express.js
- **ORM** : Sequelize
- **Base de données** : PostgreSQL
- **Authentification** : JWT
- **Temps réel** : Socket.IO
- **IA** : Intégration OpenAI API

### Frontend
- **Framework** : React 18
- **Build Tool** : Vite
- **Styling** : TailwindCSS + shadcn/ui
- **État** : Zustand
- **Requêtes** : TanStack Query
- **Animations** : Framer Motion

### Infrastructure
- **Conteneurisation** : Docker + Docker Compose
- **Proxy** : Nginx
- **Stockage** : MinIO (compatible S3)
- **Éditeur** : OnlyOffice Document Server

Cette structure modulaire permet une maintenance facile, une scalabilité optimale et une séparation claire des responsabilités entre les différents composants de NovaSuite AI.
