# 🤖 Configuration OpenRouter pour NovaSuite AI

## 📋 Qu'est-ce qu'OpenRouter ?

**OpenRouter** est une plateforme qui donne accès à plusieurs modèles d'IA (Claude, GPT, Llama, etc.) via une seule API. C'est une excellente alternative à OpenAI qui offre :

- 🎯 **Accès à plusieurs modèles** : Claude 3, GPT-4, Llama 2, Mistral, etc.
- 💰 **Prix compétitifs** : Souvent moins cher qu'OpenAI direct
- 🔄 **Flexibilité** : Changement de modèle sans changer de code
- 🚀 **Performance** : API rapide et fiable
- 📊 **Transparence** : Prix et usage clairement affichés

## 🔑 Obtenir une Clé API OpenRouter

### 1. Créer un Compte
1. Allez sur [openrouter.ai](https://openrouter.ai)
2. Cliquez sur **"Sign Up"**
3. Créez votre compte avec email/mot de passe ou GitHub

### 2. Obtenir la Clé API
1. Connectez-vous à votre compte
2. Allez dans **"API Keys"** dans le menu
3. Cliquez sur **"Create Key"**
4. Donnez un nom à votre clé (ex: "NovaSuite AI")
5. Copiez la clé générée (format: `sk-or-v1-...`)

### 3. Ajouter des Crédits
1. Allez dans **"Credits"**
2. Ajoutez des crédits (minimum $5)
3. Les prix sont très compétitifs (ex: Claude 3 Haiku ~$0.25/1M tokens)

## ⚙️ Configuration dans NovaSuite AI

### 1. Backend Configuration

Éditez le fichier `backend/.env` :

```bash
# OpenRouter API (pour l'IA) - Accès à Claude, GPT, Llama, etc.
OPENROUTER_API_KEY=sk-or-v1-votre-cle-ici
OPENROUTER_MODEL=anthropic/claude-3-haiku

# Optionnel : modèles alternatifs
# OPENROUTER_MODEL=openai/gpt-4-turbo
# OPENROUTER_MODEL=meta-llama/llama-2-70b-chat
# OPENROUTER_MODEL=mistralai/mistral-7b-instruct
```

### 2. Modèles Recommandés

| Modèle | Prix | Vitesse | Qualité | Usage Recommandé |
|--------|------|---------|---------|------------------|
| `anthropic/claude-3-haiku` | 💰 Très bon marché | ⚡ Très rapide | ⭐⭐⭐ | Chat quotidien, corrections |
| `anthropic/claude-3-sonnet` | 💰💰 Modéré | ⚡⚡ Rapide | ⭐⭐⭐⭐ | Documents complexes |
| `openai/gpt-4-turbo` | 💰💰💰 Cher | ⚡⚡ Rapide | ⭐⭐⭐⭐⭐ | Tâches critiques |
| `meta-llama/llama-2-70b-chat` | 💰 Bon marché | ⚡⚡ Rapide | ⭐⭐⭐ | Alternative open-source |

### 3. Configuration Avancée

Pour une configuration plus fine, éditez `backend/services/openRouterService.js` :

```javascript
// Modèles par défaut selon le type de tâche
const MODEL_CONFIG = {
  chat: 'anthropic/claude-3-haiku',        // Chat rapide et économique
  correction: 'anthropic/claude-3-sonnet', // Correction précise
  generation: 'openai/gpt-4-turbo',        // Génération créative
  formula: 'anthropic/claude-3-sonnet'     // Formules Excel
};
```

## 🚀 Test de Fonctionnement

### 1. Test Backend
```bash
# Dans le dossier backend
cd backend
npm start

# Test de l'endpoint
curl -X GET http://localhost:5000/api/ai/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Test Frontend
1. Lancez l'application : `npm run dev`
2. Connectez-vous avec un compte
3. Ouvrez le chat NovaCopilot (bouton 🤖)
4. Tapez : "Bonjour, peux-tu me confirmer que tu fonctionnes ?"

### 3. Vérification des Logs
```bash
# Logs backend pour voir les appels API
docker-compose logs -f backend

# Rechercher les logs OpenRouter
grep "OpenRouter" logs/backend.log
```

## 💡 Optimisation des Coûts

### 1. Choix du Modèle
- **Claude 3 Haiku** : Le plus économique pour usage quotidien
- **Claude 3 Sonnet** : Bon rapport qualité/prix
- **GPT-4 Turbo** : Réservé aux tâches importantes

### 2. Limitation des Tokens
```javascript
// Dans openRouterService.js
const response = await axios.post(url, {
  model: this.defaultModel,
  messages: messages,
  max_tokens: 500,        // Limiter la réponse
  temperature: 0.7,
  // Autres paramètres...
});
```

### 3. Cache des Réponses
```javascript
// Implémenter un cache simple
const responseCache = new Map();

async chat(messages) {
  const cacheKey = JSON.stringify(messages);
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  const response = await this.callAPI(messages);
  responseCache.set(cacheKey, response);
  return response;
}
```

## 🔧 Dépannage

### Problème : "API Key not found"
```bash
# Vérifier la variable d'environnement
echo $OPENROUTER_API_KEY

# Redémarrer le backend
docker-compose restart backend
```

### Problème : "Insufficient credits"
1. Allez sur [openrouter.ai/credits](https://openrouter.ai/credits)
2. Ajoutez des crédits à votre compte
3. Vérifiez votre usage dans le dashboard

### Problème : "Model not found"
```javascript
// Lister les modèles disponibles
const models = await openRouterService.getAvailableModels();
console.log(models);
```

### Problème : Réponses lentes
1. Changez pour un modèle plus rapide (Claude 3 Haiku)
2. Réduisez `max_tokens`
3. Vérifiez votre connexion internet

## 📊 Monitoring et Usage

### 1. Dashboard OpenRouter
- Allez sur [openrouter.ai/activity](https://openrouter.ai/activity)
- Surveillez votre usage en temps réel
- Analysez les coûts par modèle

### 2. Logs NovaSuite AI
```bash
# Voir les statistiques d'usage
grep "usage" logs/backend.log | tail -20

# Voir les erreurs API
grep "OpenRouter.*Error" logs/backend.log
```

### 3. Alertes de Coût
```javascript
// Dans openRouterService.js - ajouter une vérification
if (result.usage && result.usage.total_tokens > 1000) {
  console.warn(`High token usage: ${result.usage.total_tokens} tokens`);
}
```

## 🎯 Bonnes Pratiques

### 1. Sécurité
- ✅ Ne jamais exposer la clé API côté frontend
- ✅ Utiliser des variables d'environnement
- ✅ Rotation régulière des clés API
- ✅ Limitation des permissions par clé

### 2. Performance
- ✅ Utiliser le modèle le plus adapté à la tâche
- ✅ Implémenter un cache pour les réponses fréquentes
- ✅ Limiter la longueur des conversations
- ✅ Timeout approprié pour les requêtes

### 3. Coûts
- ✅ Surveiller l'usage quotidien
- ✅ Définir des limites de dépenses
- ✅ Optimiser les prompts pour réduire les tokens
- ✅ Utiliser des modèles économiques pour les tâches simples

## 🔄 Migration depuis OpenAI

Si vous avez déjà une clé OpenAI, vous pouvez utiliser les deux :

```bash
# Dans backend/.env
OPENROUTER_API_KEY=sk-or-v1-votre-cle-openrouter
OPENAI_API_KEY=sk-votre-cle-openai

# Le service utilisera OpenRouter en priorité
# et OpenAI en fallback si nécessaire
```

## 📞 Support

### OpenRouter
- 📚 Documentation : [openrouter.ai/docs](https://openrouter.ai/docs)
- 💬 Discord : [discord.gg/openrouter](https://discord.gg/openrouter)
- 📧 Email : support@openrouter.ai

### NovaSuite AI
- 🐛 Issues GitHub : [github.com/julien97300/NovaSuite-AI/issues](https://github.com/julien97300/NovaSuite-AI/issues)
- 📖 Documentation : Voir les fichiers README et guides

---

**🎉 Félicitations ! Votre assistant IA NovaCopilot est maintenant alimenté par OpenRouter !**

Vous avez accès aux meilleurs modèles d'IA du marché avec une API unifiée et des prix compétitifs. Profitez de votre suite bureautique intelligente ! 🚀
