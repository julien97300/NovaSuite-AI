const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Collaboration = sequelize.define('Collaboration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  permission: {
    type: DataTypes.ENUM('read', 'write', 'admin'),
    allowNull: false,
    defaultValue: 'read'
  },
  invitedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  invitedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  acceptedAt: {
    type: DataTypes.DATE
  },
  lastAccessAt: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'collaborations',
  indexes: [
    {
      unique: true,
      fields: ['documentId', 'userId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['permission']
    }
  ]
});

module.exports = Collaboration;
