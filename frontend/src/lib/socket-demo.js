// Service Socket.IO simulé pour la démo

class MockSocketService {
  constructor() {
    this.connected = false;
    this.listeners = new Map();
    this.currentDocument = null;
    this.mockUsers = [
      {
        userId: 2,
        userName: 'Alice Martin',
        userEmail: 'alice@example.com',
        cursor: { x: 150, y: 200 },
        lastActivity: new Date().toISOString()
      },
      {
        userId: 3,
        userName: 'Bob Dupont',
        userEmail: 'bob@example.com',
        cursor: { x: 300, y: 150 },
        lastActivity: new Date().toISOString()
      }
    ];
  }

  connect() {
    console.log('🔌 Connexion Socket.IO simulée');
    this.connected = true;
    
    // Simuler la connexion après un délai
    setTimeout(() => {
      this.emit('connect');
      this.emit('user_connected', {
        message: 'Connexion établie avec succès',
        timestamp: new Date().toISOString()
      });
    }, 500);
  }

  disconnect() {
    console.log('🔌 Déconnexion Socket.IO simulée');
    this.connected = false;
    this.currentDocument = null;
    this.emit('disconnect');
  }

  getConnectionStatus() {
    return this.connected;
  }

  // Gestion des événements
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erreur dans le callback Socket.IO:', error);
        }
      });
    }
  }

  // Méthodes spécifiques aux documents
  joinDocument(documentId) {
    console.log('📄 Rejoindre le document:', documentId);
    this.currentDocument = documentId;
    
    // Simuler l'arrivée d'autres utilisateurs
    setTimeout(() => {
      this.emit('document_joined', {
        documentId,
        activeUsers: this.mockUsers,
        message: `Vous avez rejoint le document ${documentId}`
      });

      // Simuler l'activité des autres utilisateurs
      this.simulateUserActivity();
    }, 300);
  }

  leaveDocument(documentId) {
    console.log('📄 Quitter le document:', documentId);
    this.currentDocument = null;
    
    this.emit('document_left', {
      documentId,
      message: `Vous avez quitté le document ${documentId}`
    });
  }

  sendDocumentChanges(documentId, changes) {
    console.log('📝 Changements envoyés:', documentId, changes);
    
    // Simuler la propagation des changements aux autres utilisateurs
    setTimeout(() => {
      this.emit('document_changes', {
        documentId,
        changes,
        userId: 1, // ID de l'utilisateur actuel
        timestamp: new Date().toISOString()
      });
    }, 100);
  }

  updateCursor(documentId, position) {
    console.log('🖱️ Position du curseur mise à jour:', position);
    
    // Simuler la mise à jour du curseur pour les autres utilisateurs
    this.emit('cursor_update', {
      documentId,
      userId: 1,
      position,
      timestamp: new Date().toISOString()
    });
  }

  sendMessage(documentId, message) {
    console.log('💬 Message envoyé:', message);
    
    // Simuler l'envoi du message
    setTimeout(() => {
      this.emit('message_received', {
        documentId,
        message: {
          id: Date.now(),
          userId: 1,
          userName: 'Demo User',
          content: message,
          timestamp: new Date().toISOString()
        }
      });

      // Simuler une réponse automatique
      setTimeout(() => {
        this.simulateIncomingMessage(documentId);
      }, 2000);
    }, 200);
  }

  // Méthodes de simulation
  simulateUserActivity() {
    if (!this.currentDocument) return;

    // Simuler le mouvement des curseurs des autres utilisateurs
    setInterval(() => {
      if (this.currentDocument && this.connected) {
        this.mockUsers.forEach(user => {
          // Mouvement aléatoire du curseur
          user.cursor.x += (Math.random() - 0.5) * 20;
          user.cursor.y += (Math.random() - 0.5) * 20;
          
          // Garder le curseur dans des limites raisonnables
          user.cursor.x = Math.max(50, Math.min(800, user.cursor.x));
          user.cursor.y = Math.max(50, Math.min(600, user.cursor.y));
          
          user.lastActivity = new Date().toISOString();
        });

        this.emit('users_activity_update', {
          documentId: this.currentDocument,
          activeUsers: [...this.mockUsers]
        });
      }
    }, 3000);

    // Simuler des changements de document occasionnels
    setInterval(() => {
      if (this.currentDocument && this.connected && Math.random() > 0.7) {
        const randomUser = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
        this.emit('document_changes', {
          documentId: this.currentDocument,
          changes: {
            type: 'text_edit',
            user: randomUser.userName,
            timestamp: new Date().toISOString()
          },
          userId: randomUser.userId
        });
      }
    }, 8000);
  }

  simulateIncomingMessage(documentId) {
    const responses = [
      "Excellente idée ! Je suis d'accord avec cette approche.",
      "Pouvez-vous préciser ce point ?",
      "J'ai ajouté quelques modifications dans la section 2.",
      "Parfait, cela correspond exactement à ce que nous cherchions.",
      "Je pense qu'il faudrait aussi considérer l'aspect budgétaire."
    ];

    const randomUser = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    this.emit('message_received', {
      documentId,
      message: {
        id: Date.now(),
        userId: randomUser.userId,
        userName: randomUser.userName,
        content: randomResponse,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Méthodes utilitaires
  getActiveUsers(documentId) {
    if (documentId === this.currentDocument) {
      return this.mockUsers;
    }
    return [];
  }

  isUserOnline(userId) {
    return this.mockUsers.some(user => user.userId === userId);
  }
}

// Instance singleton
const socketService = new MockSocketService();

export default socketService;
