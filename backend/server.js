const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import des modules
const { sequelize, testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import des routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const aiRoutes = require('./routes/ai');
const onlyofficeRoutes = require('./routes/onlyoffice');
const collaborationRoutes = require('./routes/collaboration');

// Initialisation de l'application
const app = express();
const server = http.createServer(app);

// Configuration Socket.IO pour la collaboration en temps réel
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware de sécurité
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// Configuration CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware de parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/onlyoffice', onlyofficeRoutes);
app.use('/api/collaboration', collaborationRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NovaSuite AI Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Gestion des collaborations en temps réel avec Socket.IO
const activeUsers = new Map();
const documentRooms = new Map();

io.on('connection', (socket) => {
  console.log(`Utilisateur connecté: ${socket.id}`);

  // Rejoindre une room de document
  socket.on('join-document', (data) => {
    const { documentId, userId, userName } = data;
    
    socket.join(documentId);
    
    // Ajouter l'utilisateur à la liste des utilisateurs actifs
    if (!documentRooms.has(documentId)) {
      documentRooms.set(documentId, new Set());
    }
    
    const userInfo = { socketId: socket.id, userId, userName };
    documentRooms.get(documentId).add(userInfo);
    activeUsers.set(socket.id, { documentId, userId, userName });
    
    // Notifier les autres utilisateurs
    socket.to(documentId).emit('user-joined', {
      userId,
      userName,
      activeUsers: Array.from(documentRooms.get(documentId))
    });
    
    console.log(`Utilisateur ${userName} a rejoint le document ${documentId}`);
  });

  // Quitter une room de document
  socket.on('leave-document', (documentId) => {
    socket.leave(documentId);
    
    if (activeUsers.has(socket.id)) {
      const userInfo = activeUsers.get(socket.id);
      
      if (documentRooms.has(documentId)) {
        const users = documentRooms.get(documentId);
        users.forEach(user => {
          if (user.socketId === socket.id) {
            users.delete(user);
          }
        });
        
        // Notifier les autres utilisateurs
        socket.to(documentId).emit('user-left', {
          userId: userInfo.userId,
          userName: userInfo.userName,
          activeUsers: Array.from(users)
        });
      }
      
      activeUsers.delete(socket.id);
    }
  });

  // Synchronisation des modifications de document
  socket.on('document-change', (data) => {
    const { documentId, changes, userId } = data;
    
    // Diffuser les changements aux autres utilisateurs du document
    socket.to(documentId).emit('document-updated', {
      changes,
      userId,
      timestamp: new Date().toISOString()
    });
  });

  // Curseur en temps réel
  socket.on('cursor-position', (data) => {
    const { documentId, position, userId, userName } = data;
    
    socket.to(documentId).emit('cursor-updated', {
      position,
      userId,
      userName,
      socketId: socket.id
    });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
    
    if (activeUsers.has(socket.id)) {
      const userInfo = activeUsers.get(socket.id);
      const { documentId, userId, userName } = userInfo;
      
      if (documentRooms.has(documentId)) {
        const users = documentRooms.get(documentId);
        users.forEach(user => {
          if (user.socketId === socket.id) {
            users.delete(user);
          }
        });
        
        // Notifier les autres utilisateurs
        socket.to(documentId).emit('user-left', {
          userId,
          userName,
          activeUsers: Array.from(users)
        });
      }
      
      activeUsers.delete(socket.id);
    }
  });
});

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await testConnection();
    
    // Synchronisation des modèles (création des tables)
    await sequelize.sync({ alter: true });
    console.log('✅ Base de données synchronisée');
    
    // Démarrage du serveur
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Serveur NovaSuite AI démarré sur le port ${PORT}`);
      console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS autorisé pour: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des signaux de fermeture
process.on('SIGTERM', async () => {
  console.log('🔄 Arrêt du serveur...');
  await sequelize.close();
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🔄 Arrêt du serveur...');
  await sequelize.close();
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

// Démarrage
startServer();

module.exports = app;
