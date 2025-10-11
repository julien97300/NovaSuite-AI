// Store dynamique et réactif pour NovaSuite AI
class DynamicStore {
  constructor() {
    this.data = this.loadFromStorage() || this.getInitialData();
    this.listeners = new Set();
    this.activitySimulator = null;
    this.startActivitySimulation();
  }

  // Données initiales réalistes
  getInitialData() {
    return {
      user: null,
      documents: [
        {
          id: 1,
          title: 'Rapport Mensuel - Octobre 2024',
          type: 'document',
          size: '245 KB',
          date: new Date('2024-10-06'),
          lastModified: new Date('2024-10-06'),
          author: 'Demo User',
          content: 'Rapport mensuel détaillé des activités...',
          collaborators: ['marie.dupont@example.com'],
          status: 'draft',
          wordCount: 1247,
          readTime: '5 min'
        },
        {
          id: 2,
          title: 'Budget Prévisionnel 2025',
          type: 'spreadsheet',
          size: '512 KB',
          date: new Date('2024-10-05'),
          lastModified: new Date('2024-10-05'),
          author: 'Demo User',
          content: 'Feuille de calcul avec prévisions budgétaires...',
          collaborators: ['jean.martin@example.com', 'sophie.bernard@example.com'],
          status: 'review',
          cellCount: 2847,
          formulas: 156
        },
        {
          id: 3,
          title: 'Présentation Stratégie Q4',
          type: 'presentation',
          size: '1.2 MB',
          date: new Date('2024-10-04'),
          lastModified: new Date('2024-10-04'),
          author: 'Demo User',
          content: 'Présentation stratégique pour le quatrième trimestre...',
          collaborators: ['paul.durand@example.com'],
          status: 'final',
          slideCount: 24,
          duration: '15 min'
        }
      ],
      attachments: [
        {
          id: 1,
          name: 'Présentation_Q4.pptx',
          type: 'presentation',
          size: '2.1 MB',
          icon: '🎯',
          uploadDate: new Date('2024-10-03'),
          downloads: 12,
          views: 45,
          tags: ['stratégie', 'Q4', 'présentation']
        },
        {
          id: 2,
          name: 'Logo_Entreprise.png',
          type: 'image',
          size: '512 KB',
          icon: '🖼️',
          uploadDate: new Date('2024-10-02'),
          downloads: 8,
          views: 23,
          tags: ['logo', 'branding', 'image']
        },
        {
          id: 3,
          name: 'Rapport_Financier.pdf',
          type: 'document',
          size: '1.2 MB',
          icon: '📄',
          uploadDate: new Date('2024-10-01'),
          downloads: 15,
          views: 67,
          tags: ['finance', 'rapport', 'pdf']
        }
      ],
      chatHistory: [
        {
          id: 1,
          role: 'assistant',
          content: '👋 Bonjour ! Je suis NovaCopilot, votre assistant IA. Comment puis-je vous aider avec vos documents aujourd\'hui ?',
          timestamp: new Date(),
          reactions: []
        }
      ],
      activities: [
        {
          id: 1,
          type: 'document_created',
          message: 'Nouveau document créé',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          user: 'Demo User',
          details: 'Rapport Mensuel - Octobre 2024'
        },
        {
          id: 2,
          type: 'collaboration',
          message: 'Marie Dupont a rejoint la collaboration',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          user: 'Marie Dupont',
          details: 'Budget Prévisionnel 2025'
        }
      ],
      stats: {
        documentsCreated: 3,
        collaborations: 4,
        aiInteractions: 12,
        filesUploaded: 3,
        totalStorage: '3.8 MB',
        activeUsers: 1,
        lastActivity: new Date()
      },
      notifications: [
        {
          id: 1,
          type: 'info',
          title: 'Nouveau collaborateur',
          message: 'Marie Dupont a été ajoutée au document "Budget 2025"',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          read: false
        }
      ],
      preferences: {
        theme: 'light',
        language: 'fr',
        notifications: true,
        autoSave: true,
        collaborationAlerts: true
      }
    };
  }

  // Charger depuis le localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('novasuite_dynamic_data');
      if (stored) {
        const data = JSON.parse(stored);
        // Convertir les dates string en objets Date
        this.convertDates(data);
        return data;
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des données:', error);
    }
    return null;
  }

  // Convertir les dates string en objets Date
  convertDates(obj) {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])) {
          obj[key] = new Date(obj[key]);
        } else if (typeof obj[key] === 'object') {
          this.convertDates(obj[key]);
        }
      }
    }
  }

  // Sauvegarder dans le localStorage
  saveToStorage() {
    try {
      localStorage.setItem('novasuite_dynamic_data', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde:', error);
    }
  }

  // Écouter les changements
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notifier les changements
  notify() {
    this.listeners.forEach(callback => callback(this.data));
    this.saveToStorage();
  }

  // Obtenir les données
  getData() {
    return this.data;
  }

  // Mettre à jour les données
  updateData(updates) {
    this.data = { ...this.data, ...updates };
    this.notify();
  }

  // Ajouter un document
  addDocument(document) {
    const newDoc = {
      id: Date.now(),
      ...document,
      date: new Date(),
      lastModified: new Date(),
      author: this.data.user?.firstName + ' ' + this.data.user?.lastName || 'Demo User',
      collaborators: [],
      status: 'draft'
    };

    this.data.documents.unshift(newDoc);
    this.data.stats.documentsCreated++;
    this.addActivity('document_created', `Document "${document.title}" créé`, newDoc.title);
    this.notify();
    return newDoc;
  }

  // Modifier un document
  updateDocument(id, updates) {
    const docIndex = this.data.documents.findIndex(doc => doc.id === id);
    if (docIndex !== -1) {
      this.data.documents[docIndex] = {
        ...this.data.documents[docIndex],
        ...updates,
        lastModified: new Date()
      };
      this.addActivity('document_updated', `Document "${this.data.documents[docIndex].title}" modifié`);
      this.notify();
      return this.data.documents[docIndex];
    }
    return null;
  }

  // Supprimer un document
  deleteDocument(id) {
    const docIndex = this.data.documents.findIndex(doc => doc.id === id);
    if (docIndex !== -1) {
      const doc = this.data.documents[docIndex];
      this.data.documents.splice(docIndex, 1);
      this.addActivity('document_deleted', `Document "${doc.title}" supprimé`);
      this.notify();
      return true;
    }
    return false;
  }

  // Ajouter un fichier
  addFile(file) {
    const newFile = {
      id: Date.now(),
      name: file.name,
      type: this.getFileType(file.name),
      size: this.formatFileSize(file.size),
      icon: this.getFileIcon(file.name),
      uploadDate: new Date(),
      downloads: 0,
      views: 0,
      tags: this.generateTags(file.name)
    };

    this.data.attachments.unshift(newFile);
    this.data.stats.filesUploaded++;
    this.addActivity('file_uploaded', `Fichier "${file.name}" uploadé`);
    this.notify();
    return newFile;
  }

  // Supprimer un fichier
  deleteFile(id) {
    const fileIndex = this.data.attachments.findIndex(file => file.id === id);
    if (fileIndex !== -1) {
      const file = this.data.attachments[fileIndex];
      this.data.attachments.splice(fileIndex, 1);
      this.addActivity('file_deleted', `Fichier "${file.name}" supprimé`);
      this.notify();
      return true;
    }
    return false;
  }

  // Ajouter un message de chat
  addChatMessage(message, role = 'user') {
    const newMessage = {
      id: Date.now(),
      role,
      content: message,
      timestamp: new Date(),
      reactions: []
    };

    this.data.chatHistory.push(newMessage);
    this.data.stats.aiInteractions++;
    
    // Limiter l'historique à 50 messages
    if (this.data.chatHistory.length > 50) {
      this.data.chatHistory = this.data.chatHistory.slice(-50);
    }

    this.notify();
    return newMessage;
  }

  // Ajouter une activité
  addActivity(type, message, details = '') {
    const newActivity = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date(),
      user: this.data.user?.firstName + ' ' + this.data.user?.lastName || 'Demo User',
      details
    };

    this.data.activities.unshift(newActivity);
    
    // Limiter à 20 activités
    if (this.data.activities.length > 20) {
      this.data.activities = this.data.activities.slice(0, 20);
    }

    this.data.stats.lastActivity = new Date();
    this.notify();
  }

  // Ajouter une notification
  addNotification(type, title, message) {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };

    this.data.notifications.unshift(newNotification);
    
    // Limiter à 10 notifications
    if (this.data.notifications.length > 10) {
      this.data.notifications = this.data.notifications.slice(0, 10);
    }

    this.notify();
  }

  // Marquer une notification comme lue
  markNotificationRead(id) {
    const notification = this.data.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  // Simuler l'activité en arrière-plan
  startActivitySimulation() {
    // Simuler des collaborateurs actifs
    this.activitySimulator = setInterval(() => {
      const activities = [
        { type: 'collaboration', message: 'Marie Dupont consulte un document', user: 'Marie Dupont' },
        { type: 'file_view', message: 'Jean Martin a ouvert une présentation', user: 'Jean Martin' },
        { type: 'document_edit', message: 'Sophie Bernard modifie un tableur', user: 'Sophie Bernard' },
        { type: 'ai_interaction', message: 'Paul Durand utilise NovaCopilot', user: 'Paul Durand' }
      ];

      // 30% de chance d'activité toutes les 30 secondes
      if (Math.random() < 0.3) {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivity(activity.type, activity.message, '');
        
        // Parfois ajouter une notification
        if (Math.random() < 0.2) {
          this.addNotification('info', 'Activité collaborative', activity.message);
        }
      }

      // Mettre à jour les vues et téléchargements
      if (Math.random() < 0.1) {
        const randomFile = this.data.attachments[Math.floor(Math.random() * this.data.attachments.length)];
        if (randomFile) {
          randomFile.views += Math.floor(Math.random() * 3) + 1;
          if (Math.random() < 0.3) {
            randomFile.downloads += 1;
          }
          this.notify();
        }
      }

    }, 30000); // Toutes les 30 secondes
  }

  // Arrêter la simulation
  stopActivitySimulation() {
    if (this.activitySimulator) {
      clearInterval(this.activitySimulator);
      this.activitySimulator = null;
    }
  }

  // Utilitaires
  getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      'pdf': 'document',
      'doc': 'document',
      'docx': 'document',
      'txt': 'document',
      'xls': 'spreadsheet',
      'xlsx': 'spreadsheet',
      'ppt': 'presentation',
      'pptx': 'presentation',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'mp4': 'video',
      'avi': 'video',
      'mov': 'video',
      'mp3': 'audio',
      'wav': 'audio',
      'zip': 'archive',
      'rar': 'archive'
    };
    return types[ext] || 'document';
  }

  getFileIcon(filename) {
    const type = this.getFileType(filename);
    const icons = {
      'document': '📄',
      'spreadsheet': '📊',
      'presentation': '🎯',
      'image': '🖼️',
      'video': '🎬',
      'audio': '🎵',
      'archive': '📦'
    };
    return icons[type] || '📄';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  generateTags(filename) {
    const name = filename.toLowerCase();
    const tags = [];
    
    if (name.includes('rapport')) tags.push('rapport');
    if (name.includes('budget')) tags.push('budget');
    if (name.includes('présentation')) tags.push('présentation');
    if (name.includes('logo')) tags.push('logo', 'branding');
    if (name.includes('finance')) tags.push('finance');
    if (name.includes('strategy') || name.includes('stratégie')) tags.push('stratégie');
    
    return tags;
  }

  // Nettoyer les ressources
  destroy() {
    this.stopActivitySimulation();
    this.listeners.clear();
  }
}

// Instance singleton
const dynamicStore = new DynamicStore();

export default dynamicStore;
