const User = require('./User');
const Document = require('./Document');
const Folder = require('./Folder');
const Collaboration = require('./Collaboration');

// Définition des associations entre les modèles

// User - Document (Un utilisateur peut avoir plusieurs documents)
User.hasMany(Document, { 
  foreignKey: 'userId', 
  as: 'documents',
  onDelete: 'CASCADE'
});
Document.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'owner' 
});

// User - Folder (Un utilisateur peut avoir plusieurs dossiers)
User.hasMany(Folder, { 
  foreignKey: 'userId', 
  as: 'folders',
  onDelete: 'CASCADE'
});
Folder.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'owner' 
});

// Folder - Document (Un dossier peut contenir plusieurs documents)
Folder.hasMany(Document, { 
  foreignKey: 'folderId', 
  as: 'documents',
  onDelete: 'SET NULL'
});
Document.belongsTo(Folder, { 
  foreignKey: 'folderId', 
  as: 'folder' 
});

// Document - Collaboration (Un document peut avoir plusieurs collaborateurs)
Document.hasMany(Collaboration, { 
  foreignKey: 'documentId', 
  as: 'collaborations',
  onDelete: 'CASCADE'
});
Collaboration.belongsTo(Document, { 
  foreignKey: 'documentId', 
  as: 'document' 
});

// User - Collaboration (Un utilisateur peut collaborer sur plusieurs documents)
User.hasMany(Collaboration, { 
  foreignKey: 'userId', 
  as: 'collaborations',
  onDelete: 'CASCADE'
});
Collaboration.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'collaborator' 
});

// User - Collaboration (Utilisateur qui a invité)
User.hasMany(Collaboration, { 
  foreignKey: 'invitedBy', 
  as: 'invitations',
  onDelete: 'CASCADE'
});
Collaboration.belongsTo(User, { 
  foreignKey: 'invitedBy', 
  as: 'inviter' 
});

// Association Many-to-Many entre User et Document via Collaboration
User.belongsToMany(Document, {
  through: Collaboration,
  foreignKey: 'userId',
  otherKey: 'documentId',
  as: 'sharedDocuments'
});

Document.belongsToMany(User, {
  through: Collaboration,
  foreignKey: 'documentId',
  otherKey: 'userId',
  as: 'collaborators'
});

module.exports = {
  User,
  Document,
  Folder,
  Collaboration
};
