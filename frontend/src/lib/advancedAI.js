// Service IA avancé avec apprentissage contextuel
class AdvancedAIService {
  constructor() {
    this.conversationContext = [];
    this.userPreferences = this.loadPreferences();
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.responsePatterns = this.initializePatterns();
    this.learningData = this.loadLearningData();
  }

  // Initialiser la base de connaissances
  initializeKnowledgeBase() {
    return {
      documents: {
        types: ['rapport', 'lettre', 'mémo', 'contrat', 'présentation', 'article'],
        structures: {
          rapport: ['introduction', 'contexte', 'analyse', 'recommandations', 'conclusion'],
          lettre: ['en-tête', 'formule d\'appel', 'corps', 'formule de politesse', 'signature'],
          mémo: ['destinataire', 'expéditeur', 'objet', 'date', 'message'],
          présentation: ['titre', 'agenda', 'développement', 'conclusion', 'questions']
        }
      },
      excel: {
        formules: {
          'somme': 'SOMME(plage)',
          'moyenne': 'MOYENNE(plage)',
          'si': 'SI(condition; valeur_si_vrai; valeur_si_faux)',
          'recherchev': 'RECHERCHEV(valeur; tableau; colonne; faux)',
          'nb.si': 'NB.SI(plage; critère)',
          'concatener': 'CONCATENER(texte1; texte2)',
          'aujourdhui': 'AUJOURDHUI()',
          'max': 'MAX(plage)',
          'min': 'MIN(plage)',
          'arrondi': 'ARRONDI(nombre; décimales)'
        },
        fonctions: {
          'calcul': ['SOMME', 'MOYENNE', 'MAX', 'MIN', 'ARRONDI'],
          'logique': ['SI', 'ET', 'OU', 'NON'],
          'recherche': ['RECHERCHEV', 'RECHERCHEH', 'INDEX', 'EQUIV'],
          'texte': ['CONCATENER', 'GAUCHE', 'DROITE', 'STXT'],
          'date': ['AUJOURDHUI', 'MAINTENANT', 'ANNEE', 'MOIS', 'JOUR']
        }
      },
      presentations: {
        types: ['commerciale', 'formation', 'rapport', 'pitch', 'conférence'],
        structures: {
          commerciale: ['accroche', 'problème', 'solution', 'bénéfices', 'preuve', 'appel à l\'action'],
          formation: ['objectifs', 'programme', 'théorie', 'pratique', 'évaluation'],
          pitch: ['problème', 'solution', 'marché', 'modèle économique', 'équipe', 'financement']
        }
      }
    };
  }

  // Initialiser les patterns de réponse
  initializePatterns() {
    return {
      greeting: [
        '👋 Bonjour ! Je suis NovaCopilot, ravi de vous aider.',
        '🌟 Salut ! Prêt à créer quelque chose d\'extraordinaire ensemble ?',
        '✨ Hello ! Votre assistant IA est à votre service.'
      ],
      document_help: [
        '📄 Je vais vous aider à créer un document professionnel.',
        '✍️ Parfait ! Créons ensemble un document de qualité.',
        '📝 Excellente idée ! Je vais vous guider dans la rédaction.'
      ],
      excel_help: [
        '📊 Les tableurs, c\'est ma spécialité ! Que voulez-vous calculer ?',
        '🧮 Excel n\'a plus de secrets pour moi. Quel est votre défi ?',
        '📈 Parfait ! Je vais créer la formule exacte pour vos besoins.'
      ],
      presentation_help: [
        '🎯 Une présentation impactante, c\'est parti !',
        '🎨 Créons une présentation qui marquera les esprits !',
        '📊 Je vais structurer votre présentation pour un maximum d\'impact.'
      ]
    };
  }

  // Charger les préférences utilisateur
  loadPreferences() {
    try {
      const stored = localStorage.getItem('novasuite_ai_preferences');
      return stored ? JSON.parse(stored) : {
        style: 'professionnel',
        verbosity: 'détaillé',
        language: 'français',
        examples: true,
        explanations: true
      };
    } catch {
      return {};
    }
  }

  // Charger les données d'apprentissage
  loadLearningData() {
    try {
      const stored = localStorage.getItem('novasuite_ai_learning');
      return stored ? JSON.parse(stored) : {
        commonQuestions: {},
        userPatterns: {},
        successfulResponses: {},
        feedbackHistory: []
      };
    } catch {
      return {};
    }
  }

  // Sauvegarder les données d'apprentissage
  saveLearningData() {
    try {
      localStorage.setItem('novasuite_ai_learning', JSON.stringify(this.learningData));
    } catch (error) {
      console.warn('Erreur sauvegarde apprentissage:', error);
    }
  }

  // Analyser le message utilisateur
  analyzeMessage(message) {
    const analysis = {
      intent: this.detectIntent(message),
      entities: this.extractEntities(message),
      sentiment: this.analyzeSentiment(message),
      complexity: this.assessComplexity(message),
      context: this.getContext(message)
    };

    // Apprendre des patterns utilisateur
    this.learnFromMessage(message, analysis);

    return analysis;
  }

  // Détecter l'intention
  detectIntent(message) {
    const msg = message.toLowerCase();
    
    const intents = {
      greeting: ['bonjour', 'salut', 'hello', 'bonsoir', 'hey'],
      document_creation: ['créer', 'rédiger', 'écrire', 'document', 'lettre', 'rapport'],
      document_correction: ['corriger', 'réviser', 'améliorer', 'relire', 'orthographe'],
      excel_help: ['excel', 'formule', 'calcul', 'tableur', 'somme', 'moyenne'],
      presentation_help: ['présentation', 'slide', 'powerpoint', 'diaporama'],
      explanation: ['expliquer', 'comment', 'pourquoi', 'qu\'est-ce que'],
      help: ['aide', 'help', 'assistance', 'support']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => msg.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  // Extraire les entités
  extractEntities(message) {
    const entities = {
      documentType: null,
      topic: null,
      urgency: null,
      length: null,
      style: null
    };

    const msg = message.toLowerCase();

    // Types de documents
    const docTypes = ['rapport', 'lettre', 'mémo', 'contrat', 'présentation', 'email'];
    entities.documentType = docTypes.find(type => msg.includes(type));

    // Urgence
    if (msg.includes('urgent') || msg.includes('rapidement') || msg.includes('vite')) {
      entities.urgency = 'high';
    }

    // Longueur
    if (msg.includes('court') || msg.includes('bref')) {
      entities.length = 'short';
    } else if (msg.includes('long') || msg.includes('détaillé')) {
      entities.length = 'long';
    }

    // Style
    if (msg.includes('formel') || msg.includes('professionnel')) {
      entities.style = 'formal';
    } else if (msg.includes('décontracté') || msg.includes('informel')) {
      entities.style = 'casual';
    }

    return entities;
  }

  // Analyser le sentiment
  analyzeSentiment(message) {
    const msg = message.toLowerCase();
    
    const positive = ['merci', 'parfait', 'excellent', 'super', 'génial', 'bravo'];
    const negative = ['problème', 'erreur', 'difficile', 'compliqué', 'frustrant'];
    
    const positiveCount = positive.filter(word => msg.includes(word)).length;
    const negativeCount = negative.filter(word => msg.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Évaluer la complexité
  assessComplexity(message) {
    const words = message.split(' ').length;
    const hasSpecificTerms = /\b(formule|fonction|macro|vba|pivot|graphique)\b/i.test(message);
    
    if (words > 20 || hasSpecificTerms) return 'high';
    if (words > 10) return 'medium';
    return 'low';
  }

  // Obtenir le contexte
  getContext(message) {
    return {
      previousMessages: this.conversationContext.slice(-3),
      timeOfDay: this.getTimeOfDay(),
      sessionLength: this.conversationContext.length
    };
  }

  // Obtenir l'heure de la journée
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  // Générer une réponse intelligente
  async generateResponse(message) {
    const analysis = this.analyzeMessage(message);
    
    // Ajouter à l'historique
    this.conversationContext.push({
      role: 'user',
      content: message,
      analysis,
      timestamp: new Date()
    });

    // Générer la réponse basée sur l'analyse
    let response = await this.craftResponse(analysis, message);
    
    // Personnaliser selon les préférences
    response = this.personalizeResponse(response, analysis);
    
    // Ajouter la réponse à l'historique
    this.conversationContext.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    // Limiter l'historique
    if (this.conversationContext.length > 20) {
      this.conversationContext = this.conversationContext.slice(-20);
    }

    return {
      response,
      confidence: this.calculateConfidence(analysis),
      suggestions: this.generateSuggestions(analysis),
      followUp: this.generateFollowUp(analysis)
    };
  }

  // Créer la réponse
  async craftResponse(analysis, originalMessage) {
    const { intent, entities, sentiment, complexity } = analysis;

    switch (intent) {
      case 'greeting':
        return this.handleGreeting(sentiment);
      
      case 'document_creation':
        return this.handleDocumentCreation(entities, originalMessage);
      
      case 'document_correction':
        return this.handleDocumentCorrection(originalMessage);
      
      case 'excel_help':
        return this.handleExcelHelp(originalMessage);
      
      case 'presentation_help':
        return this.handlePresentationHelp(entities, originalMessage);
      
      case 'explanation':
        return this.handleExplanation(originalMessage);
      
      case 'help':
        return this.handleGeneralHelp();
      
      default:
        return this.handleGeneral(originalMessage, analysis);
    }
  }

  // Gérer les salutations
  handleGreeting(sentiment) {
    const timeGreeting = this.getTimeGreeting();
    const patterns = this.responsePatterns.greeting;
    const baseResponse = patterns[Math.floor(Math.random() * patterns.length)];
    
    return `${timeGreeting} ${baseResponse} Comment puis-je vous aider aujourd'hui ?`;
  }

  // Obtenir la salutation selon l'heure
  getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Bonjour !';
    if (hour < 18) return '☀️ Bon après-midi !';
    return '🌆 Bonsoir !';
  }

  // Gérer la création de documents
  handleDocumentCreation(entities, message) {
    const docType = entities.documentType || 'document';
    const structure = this.knowledgeBase.documents.structures[docType];
    
    let response = `📄 Parfait ! Je vais vous aider à créer un ${docType} professionnel.\n\n`;
    
    if (structure) {
      response += `**Structure recommandée :**\n`;
      structure.forEach((section, index) => {
        response += `${index + 1}. ${section.charAt(0).toUpperCase() + section.slice(1)}\n`;
      });
      response += '\n';
    }

    response += `💡 **Conseils pour votre ${docType} :**\n`;
    response += `• Commencez par définir votre objectif principal\n`;
    response += `• Structurez vos idées avant de rédiger\n`;
    response += `• Utilisez un ton ${entities.style === 'casual' ? 'décontracté' : 'professionnel'}\n`;
    
    if (entities.urgency === 'high') {
      response += `• ⚡ Mode urgent activé : je vais vous donner des conseils rapides et efficaces\n`;
    }

    response += `\n🚀 Dites-moi quel est le sujet principal et je vous aiderai à structurer le contenu !`;

    return response;
  }

  // Gérer la correction de documents
  handleDocumentCorrection(message) {
    return `✅ Je vais analyser et corriger votre texte avec attention !\n\n` +
           `**Ce que je vais vérifier :**\n` +
           `• 📝 Orthographe et grammaire\n` +
           `• 🎯 Clarté et cohérence\n` +
           `• 💼 Style professionnel\n` +
           `• 📊 Structure et organisation\n\n` +
           `📋 Collez votre texte et je vous proposerai une version améliorée avec mes suggestions !`;
  }

  // Gérer l'aide Excel
  handleExcelHelp(message) {
    const msg = message.toLowerCase();
    let response = `📊 Excel, c'est ma spécialité ! `;

    // Détecter le type de besoin
    if (msg.includes('somme') || msg.includes('total')) {
      response += `Pour calculer une somme :\n\n` +
                 `**Formule :** \`=SOMME(A1:A10)\`\n` +
                 `**Exemple :** Additionner les valeurs de A1 à A10\n\n` +
                 `💡 **Astuce :** Vous pouvez aussi utiliser ALT + = pour une somme automatique !`;
    } else if (msg.includes('moyenne')) {
      response += `Pour calculer une moyenne :\n\n` +
                 `**Formule :** \`=MOYENNE(A1:A10)\`\n` +
                 `**Exemple :** Moyenne des valeurs de A1 à A10\n\n` +
                 `📈 **Bonus :** Utilisez MOYENNE.SI pour une moyenne conditionnelle !`;
    } else if (msg.includes('si') || msg.includes('condition')) {
      response += `Pour les conditions avec SI :\n\n` +
                 `**Formule :** \`=SI(A1>10;"Élevé";"Faible")\`\n` +
                 `**Explication :** Si A1 > 10, affiche "Élevé", sinon "Faible"\n\n` +
                 `🔗 **Avancé :** Combinez avec ET/OU pour des conditions complexes !`;
    } else {
      response += `Que voulez-vous faire ?\n\n` +
                 `**Formules populaires :**\n` +
                 `• 🧮 SOMME - Additionner des valeurs\n` +
                 `• 📊 MOYENNE - Calculer une moyenne\n` +
                 `• 🔍 RECHERCHEV - Rechercher des données\n` +
                 `• ⚖️ SI - Conditions logiques\n` +
                 `• 📅 AUJOURDHUI - Date actuelle\n\n` +
                 `Décrivez votre besoin et je créerai la formule parfaite !`;
    }

    return response;
  }

  // Gérer l'aide pour les présentations
  handlePresentationHelp(entities, message) {
    const presType = entities.documentType === 'présentation' ? 'présentation' : 'présentation';
    
    return `🎯 Créons une présentation impactante !\n\n` +
           `**Structure gagnante :**\n` +
           `1. 🎪 **Accroche** - Captez l'attention dès le début\n` +
           `2. 📋 **Agenda** - Présentez le plan\n` +
           `3. 💡 **Développement** - Vos points clés avec exemples\n` +
           `4. 🎯 **Conclusion** - Résumé et appel à l'action\n` +
           `5. ❓ **Questions** - Interaction avec l'audience\n\n` +
           `**Conseils design :**\n` +
           `• 📏 Règle 6x6 : max 6 puces, 6 mots par puce\n` +
           `• 🎨 Couleurs cohérentes (2-3 maximum)\n` +
           `• 📸 Images de qualité et pertinentes\n` +
           `• 📝 Police lisible (min 24pt)\n\n` +
           `🚀 Quel est le sujet de votre présentation ? Je vais créer un plan détaillé !`;
  }

  // Gérer les explications
  handleExplanation(message) {
    return `🤔 Excellente question ! J'adore expliquer.\n\n` +
           `Pour vous donner la meilleure explication possible, pouvez-vous préciser :\n` +
           `• 🎯 Le contexte (document, Excel, présentation ?)\n` +
           `• 📊 Votre niveau (débutant, intermédiaire, avancé)\n` +
           `• 🎪 Un exemple concret si possible\n\n` +
           `💡 Plus vous êtes précis, plus ma réponse sera utile !`;
  }

  // Gérer l'aide générale
  handleGeneralHelp() {
    return `🤝 Je suis NovaCopilot, votre assistant IA spécialisé en bureautique !\n\n` +
           `**Mes spécialités :**\n` +
           `📄 **Documents** - Rédaction, correction, structuration\n` +
           `📊 **Excel** - Formules, analyses, graphiques\n` +
           `🎯 **Présentations** - Structure, design, impact\n` +
           `✉️ **Emails** - Communication professionnelle\n` +
           `📋 **Organisation** - Planification, gestion de projet\n\n` +
           `**Comment m'utiliser :**\n` +
           `• Soyez précis dans vos demandes\n` +
           `• N'hésitez pas à donner du contexte\n` +
           `• Demandez des exemples concrets\n\n` +
           `🚀 Que voulez-vous accomplir aujourd'hui ?`;
  }

  // Gérer les questions générales
  handleGeneral(message, analysis) {
    const responses = [
      `🤖 Intéressant ! Laissez-moi réfléchir à votre demande...`,
      `💭 Je comprends votre question. Voici mon approche :`,
      `🎯 Parfait ! Je vais vous aider avec ça.`
    ];

    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return `${baseResponse}\n\n` +
           `Pour vous donner la réponse la plus pertinente, pourriez-vous me préciser :\n` +
           `• 📋 Le contexte de votre demande\n` +
           `• 🎯 Votre objectif final\n` +
           `• 📊 Des détails spécifiques\n\n` +
           `💡 En attendant, voici quelques suggestions générales qui pourraient vous aider...`;
  }

  // Personnaliser la réponse
  personalizeResponse(response, analysis) {
    // Ajouter des emojis selon le sentiment
    if (analysis.sentiment === 'positive') {
      response = response.replace(/\./g, ' ! 😊');
    }

    // Ajuster selon la complexité
    if (analysis.complexity === 'high') {
      response += `\n\n🔬 **Note technique :** Cette demande est complexe. N'hésitez pas à me poser des questions de suivi !`;
    }

    return response;
  }

  // Calculer la confiance
  calculateConfidence(analysis) {
    let confidence = 0.7; // Base

    if (analysis.intent !== 'general') confidence += 0.2;
    if (analysis.entities.documentType) confidence += 0.1;
    if (analysis.complexity === 'low') confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  // Générer des suggestions
  generateSuggestions(analysis) {
    const suggestions = [];

    switch (analysis.intent) {
      case 'document_creation':
        suggestions.push('Créer un plan détaillé', 'Choisir un modèle', 'Définir le public cible');
        break;
      case 'excel_help':
        suggestions.push('Voir des exemples', 'Formules avancées', 'Créer un graphique');
        break;
      case 'presentation_help':
        suggestions.push('Structurer le contenu', 'Conseils design', 'Techniques de présentation');
        break;
      default:
        suggestions.push('Poser une question spécifique', 'Voir des exemples', 'Obtenir de l\'aide');
    }

    return suggestions;
  }

  // Générer des questions de suivi
  generateFollowUp(analysis) {
    const followUps = [];

    if (analysis.intent === 'document_creation') {
      followUps.push('Quel est le public cible ?', 'Quelle est la longueur souhaitée ?');
    } else if (analysis.intent === 'excel_help') {
      followUps.push('Avez-vous des données d\'exemple ?', 'Quel résultat attendez-vous ?');
    }

    return followUps;
  }

  // Apprendre du message
  learnFromMessage(message, analysis) {
    // Enregistrer les patterns fréquents
    const intent = analysis.intent;
    if (!this.learningData.commonQuestions[intent]) {
      this.learningData.commonQuestions[intent] = 0;
    }
    this.learningData.commonQuestions[intent]++;

    // Sauvegarder périodiquement
    if (Math.random() < 0.1) {
      this.saveLearningData();
    }
  }

  // Obtenir les statistiques d'apprentissage
  getLearningStats() {
    return {
      totalInteractions: this.conversationContext.length,
      commonIntents: this.learningData.commonQuestions,
      averageConfidence: 0.85,
      learningProgress: 'En cours'
    };
  }

  // Réinitialiser la conversation
  resetConversation() {
    this.conversationContext = [];
  }

  // Nettoyer les ressources
  destroy() {
    this.saveLearningData();
    this.conversationContext = [];
  }
}

// Instance singleton
const advancedAI = new AdvancedAIService();

export default advancedAI;
