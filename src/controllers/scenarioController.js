const ScenarioModel = require('../models/scenarioModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     Scenario:
 *       type: object
 *       required:
 *         - scenario_id
 *         - parent_portfolio_id
 *       properties:
 *         scenario_id:
 *           type: string
 *           description: The scenario ID
 *         parent_portfolio_id:
 *           type: string
 *           description: The parent portfolio ID
 */

/**
 * @swagger
 * /scenario:
 *   get:
 *     summary: Get all scenarios
 *     tags: [Scenario]
 *     responses:
 *       200:
 *         description: List of all scenarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scenario'
 */
async function getAllScenarios(req, res) {
    try {
        const scenarios = await ScenarioModel.getAll();
        res.json(scenarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /scenario/{id}:
 *   get:
 *     summary: Get scenario by ID
 *     tags: [Scenario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Scenario ID
 *     responses:
 *       200:
 *         description: Scenario details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 *       404:
 *         description: Scenario not found
 */
async function getScenarioById(req, res) {
    try {
        const scenario = await ScenarioModel.getById(req.params.id);
        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        res.json(scenario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /scenario/portfolio/{portfolioId}:
 *   get:
 *     summary: Get scenarios by portfolio ID
 *     tags: [Scenario]
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         schema:
 *           type: string
 *         required: true
 *         description: Portfolio ID
 *     responses:
 *       200:
 *         description: List of scenarios for the portfolio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scenario'
 */
async function getScenariosByPortfolioId(req, res) {
    try {
        const scenarios = await ScenarioModel.getByPortfolioId(req.params.portfolioId);
        res.json(scenarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /scenario:
 *   post:
 *     summary: Create a new scenario
 *     tags: [Scenario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scenario'
 *     responses:
 *       201:
 *         description: Scenario created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 */
async function createScenario(req, res) {
    try {
        const scenario = await ScenarioModel.create(req.body);
        res.status(201).json(scenario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /scenario/{id}:
 *   put:
 *     summary: Update scenario by ID
 *     tags: [Scenario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Scenario ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scenario'
 *     responses:
 *       200:
 *         description: Scenario updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 *       404:
 *         description: Scenario not found
 */
async function updateScenario(req, res) {
    try {
        const scenario = await ScenarioModel.update(req.params.id, req.body);
        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        res.json(scenario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /scenario/{id}:
 *   delete:
 *     summary: Delete scenario by ID
 *     tags: [Scenario]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Scenario ID
 *     responses:
 *       200:
 *         description: Scenario deleted successfully
 *       404:
 *         description: Scenario not found
 */
async function deleteScenario(req, res) {
    try {
        const result = await ScenarioModel.delete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        res.json({ message: 'Scenario deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllScenarios,
    getScenarioById,
    getScenariosByPortfolioId,
    createScenario,
    updateScenario,
    deleteScenario
};
