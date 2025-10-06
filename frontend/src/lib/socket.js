import { io } from 'socket.io-client';
import { useCollaborationStore, useAuthStore } from './store';
import toast from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      upgrade: true
    });

    this.setupEventListeners();
    useCollaborationStore.getState().setSocket(this.socket);
    
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connexion établie
    this.socket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO');
      this.isConnected = true;
      useCollaborationStore.getState().setConnected(true);
    });

    // Déconnexion
    this.socket.on('disconnect', (reason) => {
      console.log('Déconnecté du serveur Socket.IO:', reason);
      this.isConnected = false;
      useCollaborationStore.getState().setConnected(false);
      
      if (reason === 'io server disconnect') {
        // Le serveur a fermé la connexion, reconnexion manuelle nécessaire
        this.socket.connect();
      }
    });

    // Erreur de connexion
    this.socket.on('connect_error', (error) => {
      console.error('Erreur de connexion Socket.IO:', error);
      toast.error('Erreur de connexion temps réel');
    });

    // Utilisateur rejoint le document
    this.socket.on('user-joined', (data) => {
      const { userId, userName, activeUsers } = data;
      useCollaborationStore.getState().setActiveUsers(activeUsers);
      toast.success(`${userName} a rejoint le document`);
    });

    // Utilisateur quitte le document
    this.socket.on('user-left', (data) => {
      const { userId, userName, activeUsers } = data;
      useCollaborationStore.getState().setActiveUsers(activeUsers);
      toast(`${userName} a quitté le document`, {
        icon: '👋'
      });
    });

    // Document mis à jour
    this.socket.on('document-updated', (data) => {
      const { changes, userId, timestamp } = data;
      const currentUser = useAuthStore.getState().user;
      
      // Ne pas traiter ses propres changements
      if (userId !== currentUser?.id) {
        useCollaborationStore.getState().addDocumentChange({
          ...changes,
          userId,
          timestamp,
          id: Date.now()
        });
      }
    });

    // Curseur mis à jour
    this.socket.on('cursor-updated', (data) => {
      const { position, userId, userName, socketId } = data;
      // Traiter la position du curseur des autres utilisateurs
      this.handleCursorUpdate(position, userId, userName, socketId);
    });
  }

  // Rejoindre un document
  joinDocument(documentId) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket non connecté');
      return;
    }

    const user = useAuthStore.getState().user;
    if (!user) {
      console.warn('Utilisateur non authentifié');
      return;
    }

    this.socket.emit('join-document', {
      documentId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`
    });
  }

  // Quitter un document
  leaveDocument(documentId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('leave-document', documentId);
  }

  // Envoyer les changements du document
  sendDocumentChanges(documentId, changes) {
    if (!this.socket || !this.isConnected) return;

    const user = useAuthStore.getState().user;
    if (!user) return;

    this.socket.emit('document-change', {
      documentId,
      changes,
      userId: user.id
    });
  }

  // Envoyer la position du curseur
  sendCursorPosition(documentId, position) {
    if (!this.socket || !this.isConnected) return;

    const user = useAuthStore.getState().user;
    if (!user) return;

    this.socket.emit('cursor-position', {
      documentId,
      position,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`
    });
  }

  // Gérer la mise à jour du curseur
  handleCursorUpdate(position, userId, userName, socketId) {
    // Logique pour afficher le curseur des autres utilisateurs
    // Cette fonction sera appelée par les composants d'édition
    console.log(`Curseur de ${userName} à la position:`, position);
  }

  // Déconnecter le socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      useCollaborationStore.getState().setConnected(false);
      useCollaborationStore.getState().setSocket(null);
    }
  }

  // Obtenir le statut de connexion
  getConnectionStatus() {
    return this.isConnected;
  }

  // Obtenir l'instance du socket
  getSocket() {
    return this.socket;
  }
}

// Instance singleton
const socketService = new SocketService();

export default socketService;
