// Service API réel pour NovaSuite AI
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Méthode utilitaire pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré, rediriger vers la connexion
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expirée');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Authentification
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  // Documents
  async getDocuments() {
    return this.request('/api/documents');
  }

  async getDocument(id) {
    return this.request(`/api/documents/${id}`);
  }

  async createDocument(documentData) {
    return this.request('/api/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  }

  async updateDocument(id, documentData) {
    return this.request(`/api/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  async deleteDocument(id) {
    return this.request(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload de fichiers
  async uploadFile(file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Gestion du progrès
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Réponse invalide du serveur'));
          }
        } else {
          reject(new Error(`Erreur d'upload: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Erreur réseau lors de l\'upload'));
      });

      xhr.open('POST', `${this.baseURL}/api/documents/upload`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }

  // IA - Chat avec NovaCopilot
  async chatWithAI(message, messages = [], context = '') {
    return this.request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        messages: messages.slice(-10), // Garder les 10 derniers messages
        context 
      }),
    });
  }

  // IA - Génération de contenu
  async generateContent(prompt, type = 'document', options = {}) {
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, type, options }),
    });
  }

  // IA - Correction de texte
  async correctText(text, language = 'fr') {
    return this.request('/api/ai/correct', {
      method: 'POST',
      body: JSON.stringify({ text, language }),
    });
  }

  // IA - Résumé de texte
  async summarizeText(text, length = 'medium') {
    return this.request('/api/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ text, length }),
    });
  }

  // IA - Génération de présentation
  async generatePresentation(topic, slideCount = 10) {
    return this.request('/api/ai/presentation', {
      method: 'POST',
      body: JSON.stringify({ topic, slideCount }),
    });
  }

  // IA - Génération de formule Excel
  async generateFormula(description, context = '') {
    return this.request('/api/ai/formula', {
      method: 'POST',
      body: JSON.stringify({ description, context }),
    });
  }

  // IA - Aide contextuelle
  async getContextualHelp(documentType, content, question) {
    return this.request('/api/ai/help', {
      method: 'POST',
      body: JSON.stringify({ documentType, content, question }),
    });
  }

  // IA - Obtenir les modèles disponibles
  async getAvailableModels() {
    return this.request('/api/ai/models');
  }

  // IA - Test de connexion
  async testAIConnection() {
    return this.request('/api/ai/test');
  }

  // Collaboration
  async shareDocument(documentId, userEmail, permissions = 'read') {
    return this.request('/api/collaboration/share', {
      method: 'POST',
      body: JSON.stringify({ documentId, userEmail, permissions }),
    });
  }

  async getSharedDocuments() {
    return this.request('/api/collaboration/shared');
  }

  async getCollaborators(documentId) {
    return this.request(`/api/collaboration/${documentId}/collaborators`);
  }

  // OnlyOffice
  async getOnlyOfficeConfig(documentId) {
    return this.request(`/api/onlyoffice/config/${documentId}`);
  }

  async saveOnlyOfficeDocument(documentId, content) {
    return this.request(`/api/onlyoffice/save/${documentId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Utilitaires
  async healthCheck() {
    return this.request('/api/health');
  }

  // Méthodes de gestion des erreurs
  handleError(error) {
    console.error('API Service Error:', error);
    
    // Afficher une notification à l'utilisateur
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification(error.message, 'error');
    }
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }

  // Méthode pour vérifier la connectivité
  async checkConnection() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Instance singleton
const apiService = new ApiService();

export default apiService;

// Exports nommés pour compatibilité
export const {
  login,
  register,
  logout,
  getProfile,
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  uploadFile,
  chatWithAI,
  generateContent,
  correctText,
  summarizeText,
  generatePresentation,
  generateFormula,
  getContextualHelp,
  getAvailableModels,
  testAIConnection,
  shareDocument,
  getSharedDocuments,
  getCollaborators,
  getOnlyOfficeConfig,
  saveOnlyOfficeDocument,
  healthCheck,
  checkConnection
} = apiService;
