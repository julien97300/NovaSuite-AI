const { Document } = require('../models');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Callback OnlyOffice pour la sauvegarde des documents
const handleCallback = async (req, res, next) => {
  try {
    const { key, status, url, users, actions, lastsave, notmodified } = req.body;
    
    console.log('OnlyOffice Callback:', {
      key,
      status,
      url,
      users: users?.length || 0,
      actions: actions?.length || 0
    });

    // Extraire l'ID du document depuis la clé
    const documentId = key.split('_')[0];
    
    const document = await Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        error: 1,
        message: 'Document non trouvé'
      });
    }

    // Gérer les différents statuts OnlyOffice
    switch (status) {
      case 0: // Document en cours d'ouverture
        console.log(`Document ${documentId} en cours d'ouverture`);
        break;
        
      case 1: // Document en cours d'édition
        console.log(`Document ${documentId} en cours d'édition par ${users?.length || 0} utilisateur(s)`);
        break;
        
      case 2: // Document prêt pour la sauvegarde
        if (url) {
          await saveDocumentFromUrl(document, url);
          console.log(`Document ${documentId} sauvegardé depuis ${url}`);
        }
        break;
        
      case 3: // Erreur de sauvegarde
        console.error(`Erreur de sauvegarde pour le document ${documentId}`);
        return res.status(500).json({
          error: 1,
          message: 'Erreur de sauvegarde'
        });
        
      case 4: // Document fermé sans modifications
        console.log(`Document ${documentId} fermé sans modifications`);
        break;
        
      case 6: // Document en cours de modification, force la sauvegarde
        if (url) {
          await saveDocumentFromUrl(document, url);
          console.log(`Document ${documentId} sauvegardé (force) depuis ${url}`);
        }
        break;
        
      case 7: // Erreur lors de la force de sauvegarde
        console.error(`Erreur de force de sauvegarde pour le document ${documentId}`);
        return res.status(500).json({
          error: 1,
          message: 'Erreur de force de sauvegarde'
        });
        
      default:
        console.log(`Statut OnlyOffice non géré: ${status} pour le document ${documentId}`);
    }

    // Réponse de succès pour OnlyOffice
    res.json({ error: 0 });
    
  } catch (error) {
    console.error('Erreur callback OnlyOffice:', error);
    res.status(500).json({
      error: 1,
      message: 'Erreur interne du serveur'
    });
  }
};

// Sauvegarder le document depuis l'URL fournie par OnlyOffice
const saveDocumentFromUrl = async (document, url) => {
  try {
    // Télécharger le fichier depuis OnlyOffice
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    // Créer un nouveau nom de fichier avec timestamp
    const timestamp = Date.now();
    const fileExtension = path.extname(document.fileName);
    const newFileName = `${path.basename(document.fileName, fileExtension)}_${timestamp}${fileExtension}`;
    const newFilePath = path.join('uploads', newFileName);

    // Sauvegarder le fichier
    const writer = require('fs').createWriteStream(newFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Obtenir la taille du nouveau fichier
    const stats = await fs.stat(newFilePath);

    // Mettre à jour le document dans la base de données
    await document.update({
      fileName: newFileName,
      filePath: newFilePath,
      fileSize: stats.size,
      version: document.version + 1,
      lastEditedAt: new Date()
    });

    console.log(`Document ${document.id} sauvegardé: ${newFilePath}`);
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du document:', error);
    throw error;
  }
};

// Configuration OnlyOffice pour un document
const getDocumentConfig = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findByPk(id, {
      include: [
        {
          association: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
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
    const hasAccess = document.userId === req.user.id;
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // Déterminer le type OnlyOffice
    const getDocumentType = (docType) => {
      switch (docType) {
        case 'document': return 'word';
        case 'spreadsheet': return 'cell';
        case 'presentation': return 'slide';
        default: return 'word';
      }
    };

    // Configuration OnlyOffice
    const config = {
      document: {
        fileType: path.extname(document.fileName).substring(1),
        key: `${document.id}_${document.version}_${Date.now()}`,
        title: document.title,
        url: `${req.protocol}://${req.get('host')}/api/documents/${document.id}/download`,
        permissions: {
          edit: true,
          download: true,
          print: true,
          review: true,
          comment: true,
          fillForms: true,
          modifyFilter: true,
          modifyContentControl: true
        }
      },
      documentType: getDocumentType(document.documentType),
      editorConfig: {
        mode: 'edit',
        lang: 'fr',
        callbackUrl: `${req.protocol}://${req.get('host')}/api/onlyoffice/callback`,
        user: {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          group: 'users'
        },
        customization: {
          autosave: true,
          chat: false,
          comments: true,
          help: true,
          hideRightMenu: false,
          logo: {
            image: '',
            imageEmbedded: '',
            url: ''
          },
          reviewDisplay: 'original',
          showReviewChanges: true,
          toolbarNoTabs: false,
          zoom: 100,
          compactToolbar: false,
          leftMenu: true,
          rightMenu: true,
          toolbar: true,
          statusBar: true,
          ruler: true,
          header: true
        },
        plugins: {
          autostart: [],
          pluginsData: []
        }
      },
      events: {
        onAppReady: null,
        onDocumentStateChange: null,
        onMetaChange: null,
        onDocumentReady: null,
        onInfo: null,
        onWarning: null,
        onError: null,
        onRequestSaveAs: null,
        onRequestInsertImage: null,
        onRequestMailMergeRecipients: null,
        onRequestCompareFile: null,
        onRequestEditRights: null,
        onRequestHistory: null,
        onRequestHistoryClose: null,
        onRequestHistoryData: null,
        onRequestRestore: null
      },
      width: '100%',
      height: '100%'
    };

    res.json({
      success: true,
      data: { config }
    });

  } catch (error) {
    next(error);
  }
};

// Obtenir l'historique des versions d'un document
const getDocumentHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // TODO: Implémenter la gestion de l'historique des versions
    const history = {
      currentVersion: document.version,
      history: [
        {
          key: `${document.id}_${document.version}`,
          version: document.version,
          created: document.lastEditedAt,
          user: {
            id: document.userId,
            name: `${document.owner?.firstName} ${document.owner?.lastName}`
          },
          changes: null,
          serverVersion: null,
          previous: document.version > 1 ? {
            key: `${document.id}_${document.version - 1}`,
            url: `${req.protocol}://${req.get('host')}/api/documents/${document.id}/version/${document.version - 1}`
          } : null
        }
      ]
    };

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    next(error);
  }
};

// Restaurer une version spécifique d'un document
const restoreDocumentVersion = async (req, res, next) => {
  try {
    const { id, version } = req.params;
    
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Vérifier les permissions
    if (document.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // TODO: Implémenter la restauration de version
    res.json({
      success: true,
      message: 'Version restaurée avec succès'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCallback,
  getDocumentConfig,
  getDocumentHistory,
  restoreDocumentVersion
};
