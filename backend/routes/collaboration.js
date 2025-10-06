const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  inviteCollaborator,
  getCollaborators,
  updateCollaboratorPermission,
  removeCollaborator,
  acceptInvitation,
  getPendingInvitations,
  getSharedDocuments,
  updateLastAccess
} = require('../controllers/collaborationController');

const router = express.Router();

// Validation middleware
const validateInvite = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email valide requis'),
  body('permission')
    .optional()
    .isIn(['read', 'write', 'admin'])
    .withMessage('Permission invalide')
];

const validatePermissionUpdate = [
  body('permission')
    .isIn(['read', 'write', 'admin'])
    .withMessage('Permission invalide')
];

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken);

// Routes de collaboration
router.post('/documents/:documentId/invite', validateInvite, inviteCollaborator);
router.get('/documents/:documentId/collaborators', getCollaborators);
router.put('/documents/:documentId/collaborators/:collaborationId', validatePermissionUpdate, updateCollaboratorPermission);
router.delete('/documents/:documentId/collaborators/:collaborationId', removeCollaborator);

// Routes pour les invitations
router.post('/invitations/:collaborationId/accept', acceptInvitation);
router.get('/invitations/pending', getPendingInvitations);

// Routes pour les documents partagés
router.get('/shared-documents', getSharedDocuments);
router.post('/documents/:documentId/access', updateLastAccess);

module.exports = router;
