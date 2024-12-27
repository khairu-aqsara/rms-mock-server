const express = require('express');
const router = express.Router();
const {
    getAllScenarios,
    getScenarioById,
    getScenariosByPortfolioId,
    createScenario,
    updateScenario,
    deleteScenario
} = require('../controllers/scenarioController');

// Get all scenarios
router.get('/', getAllScenarios);

// Get scenarios by portfolio ID
router.get('/portfolio/:portfolioId', getScenariosByPortfolioId);

// Get scenario by ID
router.get('/:id', getScenarioById);

// Create new scenario
router.post('/', createScenario);

// Update scenario
router.put('/:id', updateScenario);

// Delete scenario
router.delete('/:id', deleteScenario);

module.exports = router;
