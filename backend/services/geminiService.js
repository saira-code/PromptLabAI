/**
 * PromptLab AI - Google Gemini Integration Service
 */

const { GoogleGenAI } = require('@google/genai');

/**
 * Safely extracts and cleans JSON string from Gemini's response text.
 * @param {string} text - Raw text from Gemini response
 * @returns {string} Cleaned JSON string
 */
function cleanGeminiResponse(text) {
    if (typeof text !== 'string') {
        throw new Error("Gemini response is not a string.");
    }

    let cleaned = text.trim();

    // 1. Remove markdown code fences if present at the start/end
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/, '');
    cleaned = cleaned.replace(/```$/, '');
    cleaned = cleaned.trim();

    // 2. Extract only the JSON object if there's additional text before or after
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');

    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
        throw new Error("No JSON object structure found in response.");
    }

    cleaned = cleaned.slice(startIdx, endIdx + 1);
    return cleaned;
}

/**
 * Connects to Google Gemini 3.1 Flash-Lite and returns a structured JSON Prompt Kit.
 * @param {Object} data - Sanity-checked project details
 */
async function generatePrompts(data) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        const error = new Error("GEMINI_API_KEY is not defined in environment variables. Please check your .env file.");
        error.statusCode = 500;
        throw error;
    }

    // Initialize Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Formulate prompt instructing the model to act as a system design and prompt engineering expert
    const instructions = `You are a Senior Software Architect and an AI Prompt Engineering Expert.
Your task is to generate ONE complete Developer Prompt Kit consisting of four prompts:
1. Planning Prompt
2. Development Prompt
3. Improvement Prompt
4. Deployment Prompt

Each prompt must be highly detailed, professional, ready to copy and use, and custom-tailored to the user's project specifications.

The target environment where these prompts will be used is the AI Coding Assistant: "${data.targetAssistant}".
Tailor the prompts according to the strengths, context limits, and workflow of that assistant (e.g. Cursor, Claude, Antigravity IDE, GitHub Copilot, Gemini CLI) while keeping the project requirements unchanged. Focus on how that specific assistant interfaces with code files (e.g., inline edits, workspace indexing, terminal access, chat consoles).

You MUST return the output as a valid JSON object matching the following structure exactly. Do NOT wrap the JSON in markdown formatting (like \`\`\`json ... \`\`\`). Return only the raw JSON.

Expected JSON Output Format:
{
  "planning": {
    "purpose": "Define project requirements, architecture, API specifications, and development strategy.",
    "prompt": "[A detailed planning prompt optimized for ${data.targetAssistant}]"
  },
  "development": {
    "purpose": "Generate implementation prompts for frontend, backend, database, and application logic.",
    "prompt": "[A detailed development prompt optimized for ${data.targetAssistant}]"
  },
  "improvement": {
    "purpose": "Create prompts for debugging, testing, optimization, security, and code quality.",
    "prompt": "[A detailed improvement prompt optimized for ${data.targetAssistant}]"
  },
  "deployment": {
    "purpose": "Generate deployment prompts for Docker, AWS, CI/CD, production configuration, and monitoring.",
    "prompt": "[A detailed deployment prompt optimized for ${data.targetAssistant}]"
  }
}

Project Specifications:
- Project Name: ${data.projectName}
- Project Description: ${data.description}
- Programming Language: ${data.language}
- Frontend Framework: ${data.frontend}
- Backend Framework: ${data.backend}
- Database: ${data.database}
- Deployment Platform: ${data.deployment}
- AI Coding Assistant target: ${data.targetAssistant}
`;

    try {
        // Request model generation with JSON output constraint using unified SDK
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: [{ role: 'user', parts: [{ text: instructions }] }],
            config: {
                responseMimeType: "application/json"
            }
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error("Received an empty response from Gemini API.");
        }

        // Clean the response text to extract valid JSON
        console.log("[Gemini Service] Raw response from Gemini model:", responseText);
        const cleanedText = cleanGeminiResponse(responseText);
        console.log("[Gemini Service] Cleaned JSON string:", cleanedText);

        // Parse response content before returning
        const promptKit = JSON.parse(cleanedText);
        
        // Assert JSON contains the required prompt objects
        const requiredKeys = ['planning', 'development', 'improvement', 'deployment'];
        for (const key of requiredKeys) {
            if (!promptKit[key] || typeof promptKit[key].prompt !== 'string') {
                throw new Error(`Invalid prompt kit format: Missing '${key}' prompt data.`);
            }
        }

        return promptKit;

    } catch (err) {
        console.error("[Gemini Service SDK Error]:", err);
        const error = new Error(`Gemini API connection error: ${err.message}`);
        error.statusCode = 502; // Bad Gateway
        throw error;
    }
}

module.exports = {
    generatePrompts
};
