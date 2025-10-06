const errorHandler = (err, req, res, next) => {
  console.error('Erreur capturée:', err);

  // Erreur de validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors
    });
  }

  // Erreur de contrainte unique Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return res.status(409).json({
      success: false,
      message: `Cette valeur pour ${field} existe déjà`
    });
  }

  // Erreur de clé étrangère Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Référence invalide vers un élément inexistant'
    });
  }

  // Erreur de connexion à la base de données
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Erreur de connexion à la base de données'
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  // Erreur de fichier trop volumineux (Multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Fichier trop volumineux'
    });
  }

  // Erreur de type de fichier non autorisé (Multer)
  if (err.code === 'LIMIT_FILE_TYPE') {
    return res.status(415).json({
      success: false,
      message: 'Type de fichier non autorisé'
    });
  }

  // Erreur personnalisée avec status
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'Erreur'
    });
  }

  // Erreur générique
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
