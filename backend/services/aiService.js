const OpenAI = require('openai');

class NovaCopilotService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Génération de contenu
  async generateContent(prompt, type = 'document', options = {}) {
    try {
      const systemPrompts = {
        document: "Tu es un assistant de rédaction professionnel. Génère du contenu structuré, clair et bien organisé.",
        presentation: "Tu es un expert en création de présentations. Crée du contenu pour des diapositives avec des titres accrocheurs et du contenu concis.",
        spreadsheet: "Tu es un expert en analyse de données. Aide à créer des formules, analyser des données et structurer des tableaux.",
        email: "Tu es un assistant de communication professionnelle. Rédige des emails clairs, courtois et efficaces."
      };

      const messages = [
        {
          role: "system",
          content: systemPrompts[type] || systemPrompts.document
        },
        {
          role: "user",
          content: prompt
        }
      ];

      const response = await this.openai.chat.completions.create({
        model: options.model || "gpt-4.1-mini",
        messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      return {
        success: true,
        content: response.choices[0].message.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('Erreur génération IA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Correction orthographique et grammaticale
  async correctText(text, language = 'fr') {
    try {
      const prompt = `Corrige l'orthographe, la grammaire et améliore la syntaxe du texte suivant en ${language === 'fr' ? 'français' : 'anglais'}. 
      Retourne le texte corrigé et une liste des corrections apportées au format JSON:
      {
        "correctedText": "texte corrigé",
        "corrections": [
          {
            "original": "texte original",
            "corrected": "texte corrigé",
            "type": "orthographe|grammaire|syntaxe",
            "explanation": "explication de la correction"
          }
        ]
      }

      Texte à corriger:
      ${text}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un correcteur professionnel. Retourne uniquement du JSON valide."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        ...result,
        usage: response.usage
      };
    } catch (error) {
      console.error('Erreur correction IA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Résumé de texte
  async summarizeText(text, length = 'medium') {
    try {
      const lengthInstructions = {
        short: "en 2-3 phrases maximum",
        medium: "en un paragraphe de 5-7 phrases",
        long: "en 2-3 paragraphes détaillés"
      };

      const prompt = `Résume le texte suivant ${lengthInstructions[length] || lengthInstructions.medium}. 
      Le résumé doit capturer les points clés et l'essence du document:

      ${text}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en synthèse de documents. Crée des résumés clairs et informatifs."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: length === 'short' ? 200 : length === 'medium' ? 500 : 1000,
        temperature: 0.5
      });

      return {
        success: true,
        summary: response.choices[0].message.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('Erreur résumé IA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Génération de présentation
  async generatePresentation(topic, slideCount = 10) {
    try {
      const prompt = `Crée une présentation de ${slideCount} diapositives sur le sujet: "${topic}".
      
      Retourne le résultat au format JSON avec cette structure:
      {
        "title": "Titre de la présentation",
        "slides": [
          {
            "slideNumber": 1,
            "title": "Titre de la diapositive",
            "content": "Contenu principal (3-5 points maximum)",
            "notes": "Notes du présentateur (optionnel)"
          }
        ]
      }

      Assure-toi que:
      - La première diapositive est une diapositive de titre
      - La dernière diapositive est une conclusion/questions
      - Chaque diapositive a un contenu concis et impactant
      - Le contenu est structuré avec des puces ou des points clés`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en création de présentations professionnelles. Retourne uniquement du JSON valide."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        presentation: result,
        usage: response.usage
      };
    } catch (error) {
      console.error('Erreur génération présentation IA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Aide pour formules Excel/Calc
  async generateFormula(description, context = '') {
    try {
      const prompt = `Génère une formule Excel/LibreOffice Calc pour: "${description}"
      
      ${context ? `Contexte: ${context}` : ''}
      
      Retourne le résultat au format JSON:
      {
        "formula": "=FORMULE()",
        "explanation": "Explication de la formule",
        "example": "Exemple d'utilisation",
        "alternatives": ["Formules alternatives si applicable"]
      }`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en formules Excel et LibreOffice Calc. Retourne uniquement du JSON valide."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        ...result,
        usage: response.usage
      };
    } catch (error) {
      console.error('Erreur génération formule IA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Assistant contextuel
  async getContextualHelp(documentType, content, question) {
    try {
      const contextPrompts = {
        document: "Tu aides à améliorer la rédaction de documents texte.",
        spreadsheet: "Tu aides avec les calculs, formules et analyse de données dans les tableurs.",
        presentation: "Tu aides à créer et améliorer des présentations impactantes.",
        pdf: "Tu aides à analyser et extraire des informations de documents PDF."
      };

      const messages = [
        {
          role: "system",
          content: `${contextPrompts[documentType] || contextPrompts.document} Sois concis et pratique dans tes réponses.`
        },
        {
          role: "user",
          content: `Contexte du document: ${content.substring(0, 1000)}...
          
          Question: ${question}`
        }
      ];

      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
        max_tokens: 1000,
        temperature: 0.6
      });

      return {
        success: true,
        answer: response.choices[0].message.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('Erreur aide contextuelle IA:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new NovaCopilotService();
