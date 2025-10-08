const axios = require('axios');

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.defaultModel = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
    
    if (!this.apiKey) {
      console.warn('⚠️  OpenRouter API key not found. Chat IA will use fallback responses.');
    }
  }

  async chat(messages, options = {}) {
    try {
      if (!this.apiKey) {
        return this.getFallbackResponse(messages);
      }

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.defaultModel,
          messages: this.formatMessages(messages),
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.CORS_ORIGIN || 'http://localhost:3000',
            'X-Title': 'NovaSuite AI'
          },
          timeout: 30000
        }
      );

      return {
        success: true,
        message: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage
      };

    } catch (error) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      
      // Fallback en cas d'erreur
      return this.getFallbackResponse(messages);
    }
  }

  formatMessages(messages) {
    // Ajouter le contexte système pour NovaCopilot
    const systemMessage = {
      role: 'system',
      content: `Tu es NovaCopilot, l'assistant IA intégré de NovaSuite AI, une suite bureautique intelligente. 

Ton rôle est d'aider les utilisateurs avec :
- La création et édition de documents (Word, Excel, PowerPoint)
- La génération de contenu professionnel
- L'amélioration et correction de textes
- La création de formules Excel et calculs
- La génération de présentations et slides
- L'organisation et structuration d'informations
- Les conseils de productivité bureautique

Réponds de manière concise, professionnelle et utile. Utilise des emojis appropriés pour rendre tes réponses plus engageantes. Si on te demande quelque chose en dehors de ton domaine bureautique, redirige poliment vers tes spécialités.`
    };

    return [systemMessage, ...messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content || msg.message || msg
    }))];
  }

  getFallbackResponse(messages) {
    const lastMessage = messages[messages.length - 1];
    const userMessage = (lastMessage.content || lastMessage.message || lastMessage).toLowerCase();

    // Réponses intelligentes basées sur des mots-clés
    const responses = {
      // Salutations
      'bonjour': '👋 Bonjour ! Je suis NovaCopilot, votre assistant IA. Comment puis-je vous aider avec vos documents aujourd\'hui ?',
      'salut': '👋 Salut ! Prêt à travailler sur vos documents ? Je peux vous aider avec Word, Excel, PowerPoint et bien plus !',
      'hello': '👋 Hello! I\'m NovaCopilot, ready to help you with your documents and office tasks!',

      // Documents
      'document': '📄 Je peux vous aider à créer, structurer et améliorer vos documents. Voulez-vous que je génère du contenu, corrige un texte, ou vous aide avec la mise en forme ?',
      'word': '📝 Pour vos documents Word, je peux générer du contenu, corriger l\'orthographe, améliorer le style, ou créer des structures de documents professionnels.',
      'texte': '✍️ Je peux vous aider à rédiger, corriger, reformuler ou structurer vos textes. Partagez-moi votre contenu ou dites-moi ce que vous voulez créer !',

      // Tableurs
      'excel': '📊 Pour Excel, je peux créer des formules, analyser des données, générer des graphiques, ou vous expliquer des fonctions complexes. Quel est votre besoin ?',
      'tableur': '📈 Les tableurs n\'ont plus de secrets pour moi ! Formules, analyses, graphiques, tableaux croisés... Que voulez-vous accomplir ?',
      'formule': '🧮 Je peux créer des formules Excel adaptées à vos besoins. Décrivez-moi ce que vous voulez calculer et je vous donnerai la formule exacte !',

      // Présentations
      'presentation': '🎯 Pour vos présentations, je peux créer des structures, générer du contenu pour les slides, suggérer des designs, ou vous aider avec le storytelling.',
      'powerpoint': '🎨 PowerPoint est ma spécialité ! Je peux créer des plans de présentation, du contenu engageant, et des conseils de design professionnel.',
      'slide': '📋 Besoin d\'aide pour vos slides ? Je peux générer du contenu, structurer votre présentation, ou suggérer des améliorations visuelles.',

      // IA et aide
      'aide': '🤝 Je suis là pour vous aider ! Spécialisé dans les tâches bureautiques : documents, tableurs, présentations, correction de textes, génération de contenu...',
      'help': '🆘 I\'m here to help with office tasks! Documents, spreadsheets, presentations, text correction, content generation... What do you need?',
      'comment': '💡 Dites-moi simplement ce que vous voulez faire ! Par exemple : "Crée-moi un plan de présentation sur..." ou "Corrige ce texte..." ou "Aide-moi avec une formule Excel pour..."',

      // Fonctionnalités
      'generer': '✨ Je peux générer du contenu pour tous vos besoins bureautiques ! Documents, présentations, emails professionnels, rapports... Que voulez-vous créer ?',
      'corriger': '✅ Je corrige l\'orthographe, la grammaire, améliore le style et la clarté de vos textes. Partagez-moi votre contenu !',
      'ameliorer': '⬆️ Je peux améliorer vos textes en termes de style, clarté, structure et impact professionnel. Montrez-moi ce que vous voulez optimiser !'
    };

    // Chercher une réponse appropriée
    for (const [keyword, response] of Object.entries(responses)) {
      if (userMessage.includes(keyword)) {
        return {
          success: true,
          message: response,
          model: 'fallback',
          usage: null
        };
      }
    }

    // Réponse par défaut
    return {
      success: true,
      message: `🤖 Je suis NovaCopilot, votre assistant IA bureautique ! 

Je peux vous aider avec :
📄 **Documents** - Création, correction, amélioration de textes
📊 **Tableurs** - Formules Excel, analyses de données
🎯 **Présentations** - Structure, contenu, design de slides
✨ **Génération de contenu** - Emails, rapports, lettres professionnelles

💡 **Astuce** : Soyez spécifique dans vos demandes ! Par exemple :
• "Crée-moi un plan de présentation sur le marketing digital"
• "Corrige ce texte : [votre texte]"
• "Aide-moi avec une formule Excel pour calculer..."

Comment puis-je vous aider aujourd'hui ? 😊`,
      model: 'fallback',
      usage: null
    };
  }

  // Méthodes spécialisées pour différents types de tâches
  async generateDocument(prompt, type = 'general') {
    const systemPrompts = {
      letter: 'Génère une lettre professionnelle bien structurée avec en-tête, corps et conclusion appropriés.',
      report: 'Crée un rapport professionnel avec introduction, développement structuré et conclusion.',
      email: 'Rédige un email professionnel avec objet clair, formule de politesse et contenu concis.',
      general: 'Génère un document professionnel bien structuré et adapté au contexte.'
    };

    return await this.chat([
      { role: 'user', content: `${systemPrompts[type]} Sujet : ${prompt}` }
    ]);
  }

  async correctText(text) {
    return await this.chat([
      { 
        role: 'user', 
        content: `Corrige ce texte en améliorant l'orthographe, la grammaire, la syntaxe et le style professionnel. Garde le sens original mais rends-le plus clair et impactant :

${text}` 
      }
    ]);
  }

  async generatePresentation(topic, slideCount = 5) {
    return await this.chat([
      { 
        role: 'user', 
        content: `Crée un plan de présentation PowerPoint sur "${topic}" avec ${slideCount} slides. Pour chaque slide, donne :
- Le titre
- Les points clés (3-5 maximum)
- Une suggestion visuelle

Format : 
Slide 1: [Titre]
- Point 1
- Point 2
🎨 Suggestion : [description visuelle]` 
      }
    ]);
  }

  async generateExcelFormula(description) {
    return await this.chat([
      { 
        role: 'user', 
        content: `Crée une formule Excel pour : ${description}

Donne :
1. La formule exacte
2. Une explication simple de son fonctionnement
3. Un exemple concret d'utilisation` 
      }
    ]);
  }

  // Méthode pour obtenir les modèles disponibles
  async getAvailableModels() {
    try {
      if (!this.apiKey) {
        return { success: false, models: [] };
      }

      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        models: response.data.data.filter(model => 
          model.id.includes('claude') || 
          model.id.includes('gpt') || 
          model.id.includes('llama')
        )
      };
    } catch (error) {
      console.error('Error fetching models:', error);
      return { success: false, models: [] };
    }
  }
}

module.exports = new OpenRouterService();
