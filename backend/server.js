/**
 * PromptLab AI - Backend Server Entrypoint
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const promptRoutes = require('./routes/promptRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Middlewares
app.use(cors());
app.use(express.json());

// Root Endpoint Status check
app.get('/', (req, res) => {
    res.status(200).json({
        message: "PromptLab AI Backend Running"
    });
});

// Register API Routes
app.use('/api', promptRoutes);

// 404 Route Fallback handler
app.use((req, res, next) => {
    res.status(404).json({
        error: "Endpoint not found"
    });
});

// Global Error Intercept Handler (Suppresses stack traces to prevent security leaks)
app.use((err, req, res, next) => {
    console.error(`[Error Boundary Capture]:`, err.stack || err);
    
    const statusCode = err.statusCode || 500;
    const clientMessage = statusCode === 500 
        ? "An internal server error occurred while contacting Gemini API." 
        : (err.message || "Internal Server Error");

    res.status(statusCode).json({
        error: clientMessage
    });
});

// Initialize Server listener
app.listen(PORT, () => {
    console.log(`[PromptLab Backend]: Running on port ${PORT}`);
});
