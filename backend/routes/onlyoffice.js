const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  handleCallback,
  getDocumentConfig,
  getDocumentHistory,
  restoreDocumentVersion
} = require('../controllers/onlyofficeController');

const router = express.Router();

// Callback OnlyOffice (pas d'authentification requise car appelé par OnlyOffice)
router.post('/callback', handleCallback);

// Routes protégées
router.get('/config/:id', authenticateToken, getDocumentConfig);
router.get('/history/:id', authenticateToken, getDocumentHistory);
router.post('/restore/:id/:version', authenticateToken, restoreDocumentVersion);

module.exports = router;
