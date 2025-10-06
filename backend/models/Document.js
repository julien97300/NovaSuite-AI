const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documentType: {
    type: DataTypes.ENUM('document', 'spreadsheet', 'presentation', 'pdf', 'other'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  shareToken: {
    type: DataTypes.STRING,
    unique: true
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  lastEditedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  folderId: {
    type: DataTypes.UUID,
    references: {
      model: 'folders',
      key: 'id'
    }
  }
}, {
  tableName: 'documents',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['documentType']
    },
    {
      fields: ['status']
    },
    {
      fields: ['shareToken']
    }
  ]
});

// Méthodes d'instance
Document.prototype.getFileExtension = function() {
  return this.fileName.split('.').pop().toLowerCase();
};

Document.prototype.isOfficeDocument = function() {
  const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  return officeExtensions.includes(this.getFileExtension());
};

Document.prototype.canEdit = function() {
  return this.isOfficeDocument() || this.mimeType.startsWith('text/');
};

module.exports = Document;
