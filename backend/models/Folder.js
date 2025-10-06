const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Folder = sequelize.define('Folder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#3B82F6',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  shareToken: {
    type: DataTypes.STRING,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.UUID,
    references: {
      model: 'folders',
      key: 'id'
    }
  }
}, {
  tableName: 'folders',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['parentId']
    }
  ]
});

// Relations auto-référentielles pour les sous-dossiers
Folder.hasMany(Folder, { 
  as: 'subfolders', 
  foreignKey: 'parentId',
  onDelete: 'CASCADE'
});

Folder.belongsTo(Folder, { 
  as: 'parent', 
  foreignKey: 'parentId' 
});

module.exports = Folder;
