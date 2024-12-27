const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
require('dotenv').config();

const checkRoutes = require('./routes/checkRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const shipperPlanningRoutes = require('./routes/shipperPlanningRoutes');
const optimizationRoutes = require('./routes/optimizationRoutes');
const BackgroundTasks = require('./services/backgroundTasks');

const app = express();
const port = process.env.PORT || 3000;
const productionUrl = process.env.PRODUCTION_URL || 'https://rmsds.khairu-aqsara.net';

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RMSGAS-2 API Documentation',
            version: '1.0.0',
            description: 'REST API documentation for RMSGAS-2',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' ? productionUrl : `http://localhost:${port}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
    },
    apis: ['./src/controllers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());  // Add CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize background tasks
BackgroundTasks.init();

// Routes
app.use('/check', checkRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/scenario', scenarioRoutes);
app.use('/shipper-planning', shipperPlanningRoutes);
app.use('/optimization', optimizationRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});

module.exports = app;
