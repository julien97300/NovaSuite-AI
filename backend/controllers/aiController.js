const aiService = require('../services/aiService');

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

    const result = await aiService.generateContent(prompt, type, options);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de contenu',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        content: result.content,
        usage: result.usage
      }
    });
  } catch (error) {
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

    const result = await aiService.correctText(text, language);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la correction',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        correctedText: result.correctedText,
        corrections: result.corrections,
        usage: result.usage
      }
    });
  } catch (error) {
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

    const result = await aiService.summarizeText(text, length);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du résumé',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        summary: result.summary,
        usage: result.usage
      }
    });
  } catch (error) {
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

    const result = await aiService.generatePresentation(topic, slideCount);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de présentation',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        presentation: result.presentation,
        usage: result.usage
      }
    });
  } catch (error) {
    next(error);
  }
};

// Génération de formule
const generateFormula = async (req, res, next) => {
  try {
    const { description, context = '' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description de la formule requise'
      });
    }

    const result = await aiService.generateFormula(description, context);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de formule',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        formula: result.formula,
        explanation: result.explanation,
        example: result.example,
        alternatives: result.alternatives,
        usage: result.usage
      }
    });
  } catch (error) {
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

    const result = await aiService.getContextualHelp(
      documentType || 'document',
      content || '',
      question
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'aide contextuelle',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        answer: result.answer,
        usage: result.usage
      }
    });
  } catch (error) {
    next(error);
  }
};

// Chat avec l'assistant IA
const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, context = '', documentType = 'document' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message requis'
      });
    }

    // Utiliser l'aide contextuelle pour le chat
    const result = await aiService.getContextualHelp(documentType, context, message);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du chat avec l\'assistant',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        response: result.answer,
        usage: result.usage
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateContent,
  correctText,
  summarizeText,
  generatePresentation,
  generateFormula,
  getContextualHelp,
  chatWithAssistant
};
