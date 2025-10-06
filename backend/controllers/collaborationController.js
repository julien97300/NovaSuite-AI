const { Collaboration, Document, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Inviter un utilisateur à collaborer sur un document
const inviteCollaborator = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { email, permission = 'read' } = req.body;

    // Vérifier que le document existe et que l'utilisateur en est propriétaire
    const document = await Document.findOne({
      where: { id: documentId, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé ou accès non autorisé'
      });
    }

    // Trouver l'utilisateur à inviter
    const userToInvite = await User.findOne({ where: { email } });
    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur n'est pas déjà collaborateur
    const existingCollaboration = await Collaboration.findOne({
      where: {
        documentId,
        userId: userToInvite.id
      }
    });

    if (existingCollaboration) {
      return res.status(409).json({
        success: false,
        message: 'Cet utilisateur est déjà collaborateur sur ce document'
      });
    }

    // Créer la collaboration
    const collaboration = await Collaboration.create({
      documentId,
      userId: userToInvite.id,
      permission,
      invitedBy: req.user.id,
      invitedAt: new Date(),
      isActive: true
    });

    const collaborationWithUser = await Collaboration.findByPk(collaboration.id, {
      include: [
        {
          model: User,
          as: 'collaborator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'inviter',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Collaborateur invité avec succès',
      data: { collaboration: collaborationWithUser }
    });

  } catch (error) {
    next(error);
  }
};

// Obtenir les collaborateurs d'un document
const getCollaborators = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    // Vérifier l'accès au document
    const document = await Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Vérifier les permissions
    const hasAccess = document.userId === req.user.id || 
                     await Collaboration.findOne({
                       where: {
                         documentId,
                         userId: req.user.id,
                         isActive: true
                       }
                     });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const collaborations = await Collaboration.findAll({
      where: { documentId, isActive: true },
      include: [
        {
          model: User,
          as: 'collaborator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'inviter',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['invitedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { collaborations }
    });

  } catch (error) {
    next(error);
  }
};

// Mettre à jour les permissions d'un collaborateur
const updateCollaboratorPermission = async (req, res, next) => {
  try {
    const { documentId, collaborationId } = req.params;
    const { permission } = req.body;

    // Vérifier que l'utilisateur est propriétaire du document
    const document = await Document.findOne({
      where: { id: documentId, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé ou accès non autorisé'
      });
    }

    const collaboration = await Collaboration.findOne({
      where: { id: collaborationId, documentId }
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration non trouvée'
      });
    }

    await collaboration.update({ permission });

    const updatedCollaboration = await Collaboration.findByPk(collaboration.id, {
      include: [
        {
          model: User,
          as: 'collaborator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Permissions mises à jour avec succès',
      data: { collaboration: updatedCollaboration }
    });

  } catch (error) {
    next(error);
  }
};

// Supprimer un collaborateur
const removeCollaborator = async (req, res, next) => {
  try {
    const { documentId, collaborationId } = req.params;

    // Vérifier que l'utilisateur est propriétaire du document
    const document = await Document.findOne({
      where: { id: documentId, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé ou accès non autorisé'
      });
    }

    const collaboration = await Collaboration.findOne({
      where: { id: collaborationId, documentId }
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration non trouvée'
      });
    }

    await collaboration.update({ isActive: false });

    res.json({
      success: true,
      message: 'Collaborateur supprimé avec succès'
    });

  } catch (error) {
    next(error);
  }
};

// Accepter une invitation de collaboration
const acceptInvitation = async (req, res, next) => {
  try {
    const { collaborationId } = req.params;

    const collaboration = await Collaboration.findOne({
      where: { 
        id: collaborationId, 
        userId: req.user.id,
        isActive: true
      },
      include: [
        {
          model: Document,
          as: 'document',
          attributes: ['id', 'title', 'documentType']
        }
      ]
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Invitation non trouvée'
      });
    }

    await collaboration.update({ 
      acceptedAt: new Date(),
      lastAccessAt: new Date()
    });

    res.json({
      success: true,
      message: 'Invitation acceptée avec succès',
      data: { collaboration }
    });

  } catch (error) {
    next(error);
  }
};

// Obtenir les invitations en attente pour l'utilisateur connecté
const getPendingInvitations = async (req, res, next) => {
  try {
    const invitations = await Collaboration.findAll({
      where: {
        userId: req.user.id,
        isActive: true,
        acceptedAt: null
      },
      include: [
        {
          model: Document,
          as: 'document',
          attributes: ['id', 'title', 'documentType', 'createdAt']
        },
        {
          model: User,
          as: 'inviter',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['invitedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { invitations }
    });

  } catch (error) {
    next(error);
  }
};

// Obtenir les documents partagés avec l'utilisateur
const getSharedDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const collaborations = await Collaboration.findAndCountAll({
      where: {
        userId: req.user.id,
        isActive: true,
        acceptedAt: { [Op.ne]: null }
      },
      include: [
        {
          model: Document,
          as: 'document',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ],
      order: [['lastAccessAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        collaborations: collaborations.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: collaborations.count,
          pages: Math.ceil(collaborations.count / limit)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Mettre à jour l'accès à un document partagé
const updateLastAccess = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const collaboration = await Collaboration.findOne({
      where: {
        documentId,
        userId: req.user.id,
        isActive: true
      }
    });

    if (collaboration) {
      await collaboration.update({ lastAccessAt: new Date() });
    }

    res.json({
      success: true,
      message: 'Accès mis à jour'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  inviteCollaborator,
  getCollaborators,
  updateCollaboratorPermission,
  removeCollaborator,
  acceptInvitation,
  getPendingInvitations,
  getSharedDocuments,
  updateLastAccess
};
