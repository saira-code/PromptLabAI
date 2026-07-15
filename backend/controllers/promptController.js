/**
 * PromptLab AI - Prompt Controller
 */

const geminiService = require('../services/geminiService');

/**
 * Validates request payload and coordinates with geminiService to generate prompt kits.
 */
async function generatePromptKit(req, res, next) {
    try {
        const {
            projectName,
            description,
            language,
            frontend,
            backend,
            database,
            deployment,
            targetAssistant
        } = req.body;

        // Validation mapping check
        const requiredFields = {
            projectName: "Project Name",
            description: "Project Description",
            language: "Programming Language",
            frontend: "Frontend Framework",
            backend: "Backend Framework",
            database: "Database",
            deployment: "Deployment Platform",
            targetAssistant: "Target AI Coding Assistant"
        };

        for (const [key, label] of Object.entries(requiredFields)) {
            const val = req.body[key];
            if (!val || typeof val !== 'string' || val.trim() === '') {
                return res.status(400).json({
                    error: `Validation failed: '${label}' is required and must be a non-empty string.`
                });
            }
        }

        // Invoke service layer (Do NOT contain API client setup here)
        const promptKit = await geminiService.generatePrompts({
            projectName: projectName.trim(),
            description: description.trim(),
            language: language.trim(),
            frontend: frontend.trim(),
            backend: backend.trim(),
            database: database.trim(),
            deployment: deployment.trim(),
            targetAssistant: targetAssistant.trim()
        });

        // Return successful payload response
        return res.status(200).json(promptKit);

    } catch (error) {
        // Forward error to the global middleware handler
        next(error);
    }
}

module.exports = {
    generatePromptKit
};
