const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  generateContent,
  correctText,
  summarizeText,
  generatePresentation,
  generateFormula,
  getContextualHelp,
  chatWithAssistant
} = require('../controllers/aiController');

const router = express.Router();

// Validation middleware
const validateGenerate = [
  body('prompt')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Prompt requis')
];

const validateCorrect = [
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Texte à corriger requis')
];

const validateSummarize = [
  body('text')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Texte à résumer requis (minimum 10 caractères)')
];

const validatePresentation = [
  body('topic')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Sujet de présentation requis')
];

const validateFormula = [
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description de la formule requise')
];

const validateHelp = [
  body('question')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Question requise')
];

const validateChat = [
  body('message')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message requis')
];

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken);

// Routes IA NovaCopilot
router.post('/generate', validateGenerate, generateContent);
router.post('/correct', validateCorrect, correctText);
router.post('/summarize', validateSummarize, summarizeText);
router.post('/presentation', validatePresentation, generatePresentation);
router.post('/formula', validateFormula, generateFormula);
router.post('/help', validateHelp, getContextualHelp);
router.post('/chat', validateChat, chatWithAssistant);

module.exports = router;
