const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Inscription
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // Générer le token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Connexion
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier que le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Mettre à jour la dernière connexion
    await user.update({ lastLogin: new Date() });

    // Générer le token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir le profil utilisateur
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          association: 'documents',
          attributes: ['id', 'title', 'documentType', 'createdAt']
        },
        {
          association: 'folders',
          attributes: ['id', 'name', 'color', 'createdAt']
        }
      ]
    });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour le profil
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, preferences } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    await user.update({
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(preferences && { preferences: { ...user.preferences, ...preferences } })
    });

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Changer le mot de passe
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Vérifier le token
const verifyToken = async (req, res) => {
  res.json({
    success: true,
    message: 'Token valide',
    data: { user: req.user }
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
};
