# NovaSuite AI - Votre Suite Bureautique Intelligente Open-Source

<div align="center">
  <img src="https://raw.githubusercontent.com/manus-team/assets/main/novasuite-logo.png" alt="NovaSuite AI Logo" width="150"/>
  <h1>NovaSuite AI</h1>
  <p><strong>Une suite bureautique complète, open-source et intelligente, conçue pour rivaliser avec les géants du marché.</strong></p>
  <p>
    <a href="#-fonctionnalités-clés">Fonctionnalités</a> •
    <a href="#-architecture-technique">Architecture</a> •
    <a href="#--installation-rapide">Installation</a> •
    <a href="#--utilisation">Utilisation</a> •
    <a href="#--technologies">Technologies</a> •
    <a href="#-licence">Licence</a>
  </p>
</div>

---

## 🎯 Mission du Projet

**NovaSuite AI** est une solution bureautique ambitieuse qui vise à offrir une alternative open-source, auto-hébergeable et puissante aux suites bureautiques propriétaires comme **Microsoft 365 + Copilot** et **Google Workspace + Gemini**. Le projet intègre des outils d'édition de documents, de tableurs et de présentations, enrichis par un assistant IA intégré, **NovaCopilot**, pour une productivité décuplée.

L'objectif est de fournir une solution **clé en main**, facile à déployer et à maintenir, que ce soit sur un serveur personnel ou dans le cloud.

## ✨ Fonctionnalités Clés

| Catégorie | Fonctionnalité | Description |
| :--- | :--- | :--- |
| **Suite Bureautique** | Édition de documents (DOCX) | Créez et modifiez des documents texte avec une interface riche. |
| | Édition de tableurs (XLSX) | Gérez vos données, effectuez des calculs et créez des graphiques. |
| | Édition de présentations (PPTX) | Concevez des diaporamas percutants avec des outils de mise en forme avancés. |
| | Lecteur PDF intégré | Visualisez et annotez vos documents PDF directement dans l'application. |
| **Collaboration** | Co-édition en temps réel | Travaillez à plusieurs sur le même document simultanément. |
| | Partage de documents | Partagez vos fichiers avec des permissions granulaires (lecture, écriture). |
| | Cursuers en temps réel | Suivez les curseurs de vos collaborateurs pour une meilleure coordination. |
| **Assistant IA** | **NovaCopilot** | Un assistant intelligent pour vous aider dans toutes vos tâches. |
| | Génération de contenu | Créez des articles, des rapports ou des emails à partir d'un simple prompt. |
| | Correction et reformulation | Améliorez la qualité de vos écrits avec des suggestions intelligentes. |
| | Résumé de texte | Obtenez des synthèses concises de documents longs. |
| | Génération de présentations | Créez automatiquement des diaporamas complets sur n'importe quel sujet. |
| | Aide aux formules de tableur | Décrivez ce que vous voulez faire, l'IA génère la formule pour vous. |
| **Gestion de Fichiers** | Tableau de bord centralisé | Une vue d'ensemble de tous vos documents récents et importants. |
| | Organisation par dossiers | Structurez vos fichiers dans des dossiers personnalisables. |
| | Recherche puissante | Retrouvez facilement n'importe quel document grâce à la recherche et aux filtres. |
| | Importation facile | Uploadez vos fichiers existants (DOCX, XLSX, PPTX, PDF, etc.). |
| **Déploiement** | Déploiement en un clic | Installez et lancez toute la suite avec une seule commande grâce à Docker. |
| | Auto-hébergement | Gardez le contrôle total de vos données en hébergeant NovaSuite AI sur votre propre infrastructure. |
| | Mode hors-connexion | L'architecture est conçue pour fonctionner sur un réseau local sans accès à Internet. |

## 🧱 Architecture Technique

NovaSuite AI est construite sur une architecture microservices moderne, conteneurisée avec Docker pour une portabilité et une scalabilité maximales.

<div align="center">
  <img src="https://raw.githubusercontent.com/manus-team/assets/main/novasuite-architecture.png" alt="Diagramme d'architecture de NovaSuite AI" width="800"/>
</div>

- **Frontend** : Une interface web fluide et réactive développée avec **React (Vite)**, **TailwindCSS** et **shadcn/ui** pour les composants. La gestion de l'état est assurée par **Zustand**.
- **Backend** : Une API RESTful robuste construite avec **Node.js** et **Express**. Elle gère l'authentification (JWT), la logique métier, et la communication avec les autres services.
- **Base de Données** : **PostgreSQL** est utilisé pour stocker les informations sur les utilisateurs, les métadonnées des fichiers, les permissions et l'historique des versions.
- **Éditeur de Documents** : Le cœur de la suite bureautique est propulsé par **OnlyOffice Document Server**, qui permet l'édition et la co-édition performantes des formats de fichiers Microsoft Office.
- **Stockage de Fichiers** : **MinIO** est utilisé comme solution de stockage objet compatible S3 pour stocker de manière sécurisée tous les fichiers des utilisateurs.
- **Collaboration en Temps Réel** : La communication en temps réel (curseurs, notifications) est gérée par **Socket.io**.
- **Assistant IA (NovaCopilot)** : Le module IA communique avec des API de modèles de langage (LLM) comme celles d'OpenAI pour fournir ses fonctionnalités intelligentes.
- **Proxy Inverse** : **Nginx** sert de proxy inverse pour router les requêtes vers les services appropriés (frontend, backend, OnlyOffice) et gérer le SSL.

## 🚀 Installation Rapide

L'installation de NovaSuite AI est simplifiée grâce à Docker et au script de démarrage fourni.

### Prérequis

- **Docker** : [Instructions d'installation](https://docs.docker.com/get-docker/)
- **Docker Compose** : [Instructions d'installation](https://docs.docker.com/compose/install/)
- **Git** (pour cloner le projet)

### Étapes d'Installation

1.  **Clonez le projet** (ou assurez-vous d'avoir tous les fichiers dans un répertoire) :
    ```bash
    git clone https://github.com/votre-utilisateur/novasuite-ai.git
    cd novasuite-ai
    ```

2.  **Configurez les variables d'environnement** :
    Le projet utilise un fichier `.env` pour gérer les clés d'API et autres configurations. Un script de démarrage le créera pour vous si il n'existe pas.
    ```bash
    # Le script va créer un .env par défaut si il n'existe pas
    ./start.sh
    ```
    Ouvrez le fichier `.env` et ajoutez votre clé API OpenAI pour activer les fonctionnalités de NovaCopilot :
    ```ini
    OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

3.  **Lancez l'application** :
    Utilisez le script `start.sh` pour démarrer tous les services en mode production.
    ```bash
    ./start.sh start
    ```
    Le premier démarrage peut prendre quelques minutes, le temps de télécharger les images Docker et de construire les conteneurs.

4.  **Accédez à NovaSuite AI** :
    Une fois le démarrage terminé, l'application est accessible à l'adresse suivante : **[http://localhost](http://localhost)**

## 🛠️ Utilisation

Le script `start.sh` est votre principal outil pour gérer l'application.

| Commande | Description |
| :--- | :--- |
| `./start.sh start` | Démarre l'application en mode production. |
| `./start.sh dev` | Démarre les services de base (DB, MinIO, etc.) pour le développement local. |
| `./start.sh stop` | Arrête tous les conteneurs en cours d'exécution. |
| `./start.sh restart` | Redémarre l'application. |
| `./start.sh logs [service]` | Affiche les logs de tous les services ou d'un service spécifique (ex: `backend`). |
| `./start.sh status` | Affiche le statut des conteneurs. |
| `./start.sh clean` | **Attention :** Arrête et supprime tous les conteneurs, volumes et données. |
| `./start.sh update` | Met à jour les images Docker et redémarre l'application. |
| `./start.sh help` | Affiche toutes les commandes disponibles. |

### Mode Développement

Pour développer sur le frontend ou le backend :

1.  Lancez les services de base :
    ```bash
    ./start.sh dev
    ```
2.  Dans des terminaux séparés, lancez les serveurs de développement :
    ```bash
    # Pour le backend (avec rechargement à chaud)
    cd backend
    npm run dev

    # Pour le frontend (avec rechargement à chaud)
    cd frontend
    pnpm run dev
    ```

## 💻 Technologies

- **Frontend** : React, Vite, TailwindCSS, shadcn/ui, Framer Motion, Zustand, TanStack Query
- **Backend** : Node.js, Express, Sequelize, Socket.io
- **Base de données** : PostgreSQL
- **Éditeur** : OnlyOffice Document Server
- **Stockage** : MinIO
- **Conteneurisation** : Docker, Docker Compose
- **Proxy** : Nginx
- **IA** : Intégration avec les API compatibles OpenAI

## 📄 Licence

Ce projet est distribué sous la **Licence MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

<div align="center">
  <p>Développé avec ❤️ par <strong>Manus IA</strong></p>
</div>

