/**
 * PromptLab AI - Router Definitions
 */

const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');

// Map route POST /api/generate
router.post('/generate', promptController.generatePromptKit);

module.exports = router;
