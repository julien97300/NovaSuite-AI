const { Document, User, Folder, Collaboration } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

// Obtenir tous les documents de l'utilisateur
const getDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, search, folderId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    
    if (type) {
      whereClause.documentType = type;
    }
    
    if (search) {
      whereClause.title = { [Op.iLike]: `%${search}%` };
    }
    
    if (folderId) {
      whereClause.folderId = folderId;
    }

    const { count, rows: documents } = await Document.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'name', 'color']
        }
      ],
      order: [['lastEditedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir un document par ID
const getDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'name', 'color']
        },
        {
          model: Collaboration,
          as: 'collaborations',
          include: [
            {
              model: User,
              as: 'collaborator',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Vérifier les permissions
    const hasAccess = document.userId === req.user.id || 
                     document.collaborations.some(collab => 
                       collab.userId === req.user.id && collab.isActive
                     );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce document'
      });
    }

    res.json({
      success: true,
      data: { document }
    });
  } catch (error) {
    next(error);
  }
};

// Créer un nouveau document
const createDocument = async (req, res, next) => {
  try {
    const { title, description, documentType, folderId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Fichier requis'
      });
    }

    // Déterminer le type de document basé sur l'extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    let detectedType = 'other';
    
    if (['.doc', '.docx', '.odt', '.rtf', '.txt'].includes(fileExtension)) {
      detectedType = 'document';
    } else if (['.xls', '.xlsx', '.ods'].includes(fileExtension)) {
      detectedType = 'spreadsheet';
    } else if (['.ppt', '.pptx', '.odp'].includes(fileExtension)) {
      detectedType = 'presentation';
    } else if (fileExtension === '.pdf') {
      detectedType = 'pdf';
    }

    const document = await Document.create({
      title: title || path.basename(file.originalname, fileExtension),
      description,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
      documentType: documentType || detectedType,
      userId: req.user.id,
      folderId: folderId || null,
      shareToken: uuidv4()
    });

    const documentWithRelations = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'name', 'color']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Document créé avec succès',
      data: { document: documentWithRelations }
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un document
const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, folderId, tags } = req.body;

    const document = await Document.findOne({
      where: { id, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    await document.update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(folderId !== undefined && { folderId }),
      ...(tags && { tags }),
      lastEditedAt: new Date()
    });

    const updatedDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'name', 'color']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Document mis à jour avec succès',
      data: { document: updatedDocument }
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un document
const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findOne({
      where: { id, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Supprimer le fichier physique
    try {
      await fs.unlink(document.filePath);
    } catch (fileError) {
      console.warn('Impossible de supprimer le fichier physique:', fileError.message);
    }

    await document.destroy();

    res.json({
      success: true,
      message: 'Document supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Télécharger un document
const downloadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findByPk(id);
    
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
                         documentId: id,
                         userId: req.user.id,
                         isActive: true
                       }
                     });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ce document'
      });
    }

    res.download(document.filePath, document.originalName);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument
};
