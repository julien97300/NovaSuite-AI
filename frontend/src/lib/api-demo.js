// API simulée pour la démo NovaSuite AI

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulation des réponses API
const mockResponses = {
  // Authentification
  login: async (credentials) => {
    await delay(800);
    return {
      success: true,
      data: {
        user: {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: credentials.email,
          createdAt: new Date().toISOString()
        },
        token: 'demo_jwt_token_' + Date.now()
      }
    };
  },

  register: async (userData) => {
    await delay(1000);
    return {
      success: true,
      data: {
        user: {
          id: 1,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          createdAt: new Date().toISOString()
        },
        token: 'demo_jwt_token_' + Date.now()
      }
    };
  },

  verifyToken: async () => {
    await delay(300);
    return {
      success: true,
      data: {
        user: {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@novasuite.ai',
          createdAt: '2024-01-15T08:00:00Z'
        }
      }
    };
  }
};

// API d'authentification
export const authAPI = {
  login: mockResponses.login,
  register: mockResponses.register,
  verifyToken: mockResponses.verifyToken,
  logout: async () => {
    await delay(200);
    return { success: true };
  }
};

// API des documents
export const documentsAPI = {
  getDocuments: async (params = {}) => {
    await delay(500);
    const mockDocuments = [
      {
        id: 1,
        title: 'Rapport Mensuel - Octobre 2024',
        documentType: 'document',
        fileName: 'rapport-octobre.docx',
        fileSize: 245760,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdAt: '2024-10-01T10:30:00Z',
        lastEditedAt: '2024-10-06T14:20:00Z',
        version: 3,
        owner: {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@novasuite.ai'
        }
      },
      {
        id: 2,
        title: 'Budget Prévisionnel 2025',
        documentType: 'spreadsheet',
        fileName: 'budget-2025.xlsx',
        fileSize: 512000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        createdAt: '2024-09-28T09:15:00Z',
        lastEditedAt: '2024-10-05T16:45:00Z',
        version: 7,
        owner: {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@novasuite.ai'
        }
      },
      {
        id: 3,
        title: 'Présentation Stratégie Q4',
        documentType: 'presentation',
        fileName: 'strategie-q4.pptx',
        fileSize: 1024000,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        createdAt: '2024-10-03T11:00:00Z',
        lastEditedAt: '2024-10-06T13:30:00Z',
        version: 2,
        owner: {
          id: 1,
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@novasuite.ai'
        }
      }
    ];

    return {
      success: true,
      data: {
        documents: mockDocuments,
        total: mockDocuments.length,
        pagination: {
          page: 1,
          limit: 20,
          pages: 1
        }
      }
    };
  },

  createDocument: async (documentData) => {
    await delay(800);
    const newDocument = {
      id: Date.now(),
      ...documentData,
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
      version: 1,
      owner: {
        id: 1,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@novasuite.ai'
      }
    };

    return {
      success: true,
      data: { document: newDocument }
    };
  },

  uploadDocument: async (file) => {
    await delay(1500);
    return {
      success: true,
      data: {
        document: {
          id: Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          documentType: getDocumentType(file.type),
          createdAt: new Date().toISOString(),
          lastEditedAt: new Date().toISOString(),
          version: 1,
          owner: {
            id: 1,
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@novasuite.ai'
          }
        }
      }
    };
  }
};

// API de l'IA
export const aiAPI = {
  generateContent: async (params) => {
    await delay(2000);
    const mockContent = generateMockContent(params.prompt, params.type);
    
    return {
      success: true,
      data: {
        content: mockContent,
        usage: {
          promptTokens: 50,
          completionTokens: 200,
          totalTokens: 250
        }
      }
    };
  },

  correctText: async (params) => {
    await delay(1500);
    const corrections = generateMockCorrections(params.text);
    
    return {
      success: true,
      data: {
        correctedText: corrections.correctedText,
        corrections: corrections.corrections,
        usage: {
          promptTokens: 100,
          completionTokens: 150,
          totalTokens: 250
        }
      }
    };
  },

  summarizeText: async (params) => {
    await delay(1200);
    const summary = generateMockSummary(params.text, params.length);
    
    return {
      success: true,
      data: {
        summary: summary,
        usage: {
          promptTokens: 200,
          completionTokens: 80,
          totalTokens: 280
        }
      }
    };
  },

  generatePresentation: async (params) => {
    await delay(3000);
    const presentation = generateMockPresentation(params.topic, params.slideCount);
    
    return {
      success: true,
      data: {
        presentation: presentation,
        usage: {
          promptTokens: 80,
          completionTokens: 400,
          totalTokens: 480
        }
      }
    };
  },

  generateFormula: async (params) => {
    await delay(1000);
    const formula = generateMockFormula(params.description);
    
    return {
      success: true,
      data: {
        formula: formula.formula,
        explanation: formula.explanation,
        example: formula.example,
        alternatives: formula.alternatives,
        usage: {
          promptTokens: 60,
          completionTokens: 120,
          totalTokens: 180
        }
      }
    };
  }
};

// Fonctions utilitaires pour générer du contenu de démo
function getDocumentType(mimeType) {
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  return 'document';
}

function generateMockContent(prompt, type) {
  const templates = {
    document: `# ${prompt}

Ceci est un exemple de contenu généré par NovaCopilot pour votre demande : "${prompt}".

## Introduction

L'intelligence artificielle révolutionne la façon dont nous créons et gérons les documents. Avec NovaSuite AI, vous bénéficiez d'un assistant intelligent qui comprend vos besoins et génère du contenu de qualité.

## Développement

Le contenu généré s'adapte automatiquement au contexte de votre demande. Que vous ayez besoin d'un rapport, d'un article ou d'une présentation, NovaCopilot analyse votre prompt et produit un résultat pertinent et structuré.

## Conclusion

Cette démonstration illustre les capacités de génération de contenu de NovaSuite AI. Dans un environnement de production, le contenu serait encore plus précis et adapté à vos besoins spécifiques.`,

    email: `Objet : ${prompt}

Bonjour,

J'espère que ce message vous trouve en bonne santé. Je vous écris concernant ${prompt.toLowerCase()}.

Suite à nos échanges précédents, je souhaitais faire le point sur l'avancement du projet et vous proposer les prochaines étapes.

Pourriez-vous me confirmer votre disponibilité pour une réunion cette semaine ?

Cordialement,
[Votre nom]`,

    presentation: `# ${prompt}

## Slide 1 : Introduction
- Présentation du sujet
- Objectifs de la présentation
- Plan de la présentation

## Slide 2 : Contexte
- Situation actuelle
- Enjeux identifiés
- Opportunités

## Slide 3 : Solutions proposées
- Approche recommandée
- Bénéfices attendus
- Ressources nécessaires

## Slide 4 : Conclusion
- Récapitulatif des points clés
- Prochaines étapes
- Questions et discussion`
  };

  return templates[type] || templates.document;
}

function generateMockCorrections(text) {
  const corrections = [
    {
      type: 'Orthographe',
      original: 'developement',
      corrected: 'développement',
      explanation: 'Erreur d\'orthographe courante'
    },
    {
      type: 'Grammaire',
      original: 'Les utilisateurs peut',
      corrected: 'Les utilisateurs peuvent',
      explanation: 'Accord sujet-verbe'
    },
    {
      type: 'Style',
      original: 'très très important',
      corrected: 'crucial',
      explanation: 'Éviter les répétitions'
    }
  ];

  let correctedText = text;
  corrections.forEach(correction => {
    correctedText = correctedText.replace(correction.original, correction.corrected);
  });

  return { correctedText, corrections };
}

function generateMockSummary(text, length) {
  const summaries = {
    short: "Résumé concis du texte fourni, mettant en avant les points essentiels.",
    medium: "Ce résumé présente les idées principales du document original. Il synthétise les concepts clés tout en conservant la structure logique du texte. Les points importants sont mis en évidence pour faciliter la compréhension.",
    long: "Ce résumé détaillé analyse le contenu du document original en profondeur. Il présente une synthèse structurée des idées principales, développe les concepts clés et met en perspective les différents arguments présentés. L'objectif est de fournir une vue d'ensemble complète tout en conservant les nuances du texte original. Cette approche permet une compréhension rapide des enjeux tout en préservant la richesse du contenu initial."
  };

  return summaries[length] || summaries.medium;
}

function generateMockPresentation(topic, slideCount) {
  const slides = [];
  
  slides.push({
    slideNumber: 1,
    title: topic,
    content: `Présentation sur : ${topic}\n\nPar : Demo User\nDate : ${new Date().toLocaleDateString('fr-FR')}`,
    notes: "Slide de titre - présenter le sujet et l'orateur"
  });

  for (let i = 2; i <= Math.min(slideCount, 10); i++) {
    slides.push({
      slideNumber: i,
      title: `Point ${i-1} : Aspect important`,
      content: `• Point clé numéro ${i-1}\n• Explication détaillée\n• Exemples concrets\n• Impact et bénéfices`,
      notes: `Notes pour la slide ${i} - développer les points mentionnés`
    });
  }

  if (slideCount > 10) {
    slides.push({
      slideNumber: slideCount,
      title: "Conclusion",
      content: "• Récapitulatif des points clés\n• Prochaines étapes\n• Questions et discussion",
      notes: "Slide de conclusion - résumer et ouvrir le débat"
    });
  }

  return {
    title: topic,
    slideCount: slides.length,
    slides: slides
  };
}

function generateMockFormula(description) {
  const formulas = {
    "moyenne": {
      formula: "=AVERAGE(A1:A10)",
      explanation: "Cette formule calcule la moyenne arithmétique des valeurs dans la plage A1:A10",
      example: "Si A1:A10 contient les valeurs 10, 20, 30, la formule retournera 20",
      alternatives: ["=MOYENNE(A1:A10)", "=SUM(A1:A10)/COUNT(A1:A10)"]
    },
    "somme": {
      formula: "=SUM(A1:A10)",
      explanation: "Cette formule additionne toutes les valeurs dans la plage spécifiée",
      example: "Si A1:A10 contient 1, 2, 3, 4, 5, la formule retournera 15",
      alternatives: ["=SOMME(A1:A10)", "=A1+A2+A3+A4+A5+A6+A7+A8+A9+A10"]
    }
  };

  // Recherche par mot-clé dans la description
  for (const [key, formula] of Object.entries(formulas)) {
    if (description.toLowerCase().includes(key)) {
      return formula;
    }
  }

  // Formule par défaut
  return {
    formula: "=SUM(A1:A10)",
    explanation: "Formule générique basée sur votre description. Ajustez les références de cellules selon vos besoins.",
    example: "Remplacez A1:A10 par votre plage de données réelle",
    alternatives: ["=SOMME(A1:A10)"]
  };
}

// Fonction utilitaire pour télécharger des fichiers (simulation)
export const downloadFile = async (documentId, fileName) => {
  // Simulation du téléchargement
  console.log(`Téléchargement simulé du fichier: ${fileName} (ID: ${documentId})`);
  
  // Créer un blob de démonstration
  const content = `Contenu de démonstration pour le fichier: ${fileName}\n\nCeci est un fichier de démonstration généré par NovaSuite AI.\nDocument ID: ${documentId}\nGénéré le: ${new Date().toLocaleString('fr-FR')}`;
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Créer un lien de téléchargement
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'document-demo.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default {
  authAPI,
  documentsAPI,
  aiAPI,
  downloadFile
};
