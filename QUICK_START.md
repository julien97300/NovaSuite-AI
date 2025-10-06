# 🚀 Guide de Démarrage Rapide - NovaSuite AI

Ce guide vous permettra de lancer **NovaSuite AI** en moins de 5 minutes !

## ⚡ Installation Express

### 1. Prérequis
Assurez-vous d'avoir **Docker** et **Docker Compose** installés sur votre système :
- [Installer Docker](https://docs.docker.com/get-docker/)
- [Installer Docker Compose](https://docs.docker.com/compose/install/)

### 2. Téléchargement et Extraction
```bash
# Extraire l'archive du projet
tar -xzf novasuite-ai-complete.tar.gz
cd novasuite-ai
```

### 3. Configuration (Optionnelle)
```bash
# Créer le fichier de configuration
cp .env.example .env

# Éditer le fichier .env pour ajouter votre clé OpenAI (optionnel)
nano .env
```

### 4. Lancement
```bash
# Rendre le script exécutable
chmod +x start.sh

# Démarrer NovaSuite AI
./start.sh start
```

### 5. Accès à l'Application
Une fois le démarrage terminé (2-3 minutes), ouvrez votre navigateur et accédez à :
**[http://localhost](http://localhost)**

## 🎯 Première Utilisation

1. **Créez votre compte** : Cliquez sur "S'inscrire" et créez votre premier compte administrateur
2. **Explorez le tableau de bord** : Familiarisez-vous avec l'interface
3. **Créez votre premier document** : Cliquez sur "Nouveau document" pour commencer
4. **Testez NovaCopilot** : Utilisez l'assistant IA pour générer du contenu

## 🛠️ Commandes Utiles

```bash
# Voir les logs en temps réel
./start.sh logs

# Arrêter l'application
./start.sh stop

# Redémarrer l'application
./start.sh restart

# Voir le statut des services
./start.sh status

# Aide complète
./start.sh help
```

## 🔧 Résolution de Problèmes

### L'application ne démarre pas
```bash
# Vérifier que Docker fonctionne
docker --version
docker-compose --version

# Vérifier les logs
./start.sh logs
```

### Port déjà utilisé
Si le port 80 est déjà utilisé, modifiez le fichier `docker-compose.yml` :
```yaml
# Changer la ligne dans le service nginx
ports:
  - "8080:80"  # Au lieu de "80:80"
```

### Problème de permissions
```bash
# Donner les bonnes permissions
sudo chown -R $USER:$USER .
chmod +x start.sh
```

## 📞 Support

- **Documentation complète** : Consultez le fichier `README.md`
- **Issues** : Signalez les problèmes sur le dépôt GitHub
- **Communauté** : Rejoignez notre Discord pour obtenir de l'aide

---

**Félicitations ! Vous avez maintenant votre propre suite bureautique intelligente ! 🎉**
