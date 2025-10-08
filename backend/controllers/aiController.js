const openRouterService = require('../services/openRouterService');

// Chat avec l'assistant IA (fonction principale)
const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, messages = [], context = '', documentType = 'document' } = req.body;

    if (!message && (!messages || messages.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message ou historique de conversation requis'
      });
    }

    // Construire l'historique des messages
    let conversationMessages = [];
    
    if (messages && messages.length > 0) {
      conversationMessages = messages;
    }
    
    // Ajouter le nouveau message
    if (message) {
      conversationMessages.push({
        role: 'user',
        content: message
      });
    }

    // Ajouter le contexte si fourni
    if (context) {
      conversationMessages.unshift({
        role: 'user',
        content: `Contexte du document (${documentType}) : ${context}`
      });
    }

    const result = await openRouterService.chat(conversationMessages);

    res.json({
      success: true,
      data: {
        response: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    next(error);
  }
};

// Génération de contenu
const generateContent = async (req, res, next) => {
  try {
    const { prompt, type = 'document', options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt requis'
      });
    }

    let result;
    switch (type) {
      case 'letter':
        result = await openRouterService.generateDocument(prompt, 'letter');
        break;
      case 'report':
        result = await openRouterService.generateDocument(prompt, 'report');
        break;
      case 'email':
        result = await openRouterService.generateDocument(prompt, 'email');
        break;
      default:
        result = await openRouterService.generateDocument(prompt, 'general');
    }

    res.json({
      success: true,
      data: {
        content: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Content generation error:', error);
    next(error);
  }
};

// Correction de texte
const correctText = async (req, res, next) => {
  try {
    const { text, language = 'fr' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Texte à corriger requis'
      });
    }

    const result = await openRouterService.correctText(text);

    res.json({
      success: true,
      data: {
        correctedText: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Text correction error:', error);
    next(error);
  }
};

// Résumé de texte
const summarizeText = async (req, res, next) => {
  try {
    const { text, length = 'medium' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Texte à résumer requis'
      });
    }

    const lengthInstructions = {
      short: 'en 2-3 phrases maximum',
      medium: 'en un paragraphe de 5-7 phrases',
      long: 'en 2-3 paragraphes détaillés'
    };

    const result = await openRouterService.chat([
      {
        role: 'user',
        content: `Résume ce texte ${lengthInstructions[length] || lengthInstructions.medium} en gardant les points essentiels :

${text}`
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Text summarization error:', error);
    next(error);
  }
};

// Génération de présentation
const generatePresentation = async (req, res, next) => {
  try {
    const { topic, slideCount = 10 } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Sujet de présentation requis'
      });
    }

    const result = await openRouterService.generatePresentation(topic, slideCount);

    res.json({
      success: true,
      data: {
        presentation: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Presentation generation error:', error);
    next(error);
  }
};

// Génération de formule Excel
const generateFormula = async (req, res, next) => {
  try {
    const { description, context = '' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description de la formule requise'
      });
    }

    const result = await openRouterService.generateExcelFormula(description);

    res.json({
      success: true,
      data: {
        formula: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Formula generation error:', error);
    next(error);
  }
};

// Aide contextuelle
const getContextualHelp = async (req, res, next) => {
  try {
    const { documentType, content, question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question requise'
      });
    }

    const contextMessage = content 
      ? `Contexte du document (${documentType || 'document'}) : ${content}\n\nQuestion : ${question}`
      : question;

    const result = await openRouterService.chat([
      {
        role: 'user',
        content: contextMessage
      }
    ]);

    res.json({
      success: true,
      data: {
        answer: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Contextual help error:', error);
    next(error);
  }
};

// Obtenir les modèles disponibles
const getAvailableModels = async (req, res, next) => {
  try {
    const result = await openRouterService.getAvailableModels();

    res.json({
      success: result.success,
      data: {
        models: result.models
      }
    });
  } catch (error) {
    console.error('Get models error:', error);
    next(error);
  }
};

// Endpoint de test pour vérifier la connexion OpenRouter
const testConnection = async (req, res, next) => {
  try {
    const result = await openRouterService.chat([
      {
        role: 'user',
        content: 'Bonjour, peux-tu me confirmer que tu es bien NovaCopilot et que la connexion fonctionne ?'
      }
    ]);

    res.json({
      success: true,
      data: {
        message: 'Connexion OpenRouter testée avec succès',
        response: result.message,
        model: result.model,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion OpenRouter',
      error: error.message
    });
  }
};

module.exports = {
  chatWithAssistant,
  generateContent,
  correctText,
  summarizeText,
  generatePresentation,
  generateFormula,
  getContextualHelp,
  getAvailableModels,
  testConnection
};
