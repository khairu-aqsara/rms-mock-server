const PortfolioModel = require('../models/portfolioModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       required:
 *         - portfolio_id
 *         - start_date
 *         - end_date
 *       properties:
 *         portfolio_id:
 *           type: string
 *           description: The portfolio ID
 *         start_date:
 *           type: string
 *           description: Start date of the portfolio
 *         end_date:
 *           type: string
 *           description: End date of the portfolio
 */

/**
 * @swagger
 * /portfolio:
 *   get:
 *     summary: Get all portfolios
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: List of all portfolios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Portfolio'
 */
async function getAllPortfolios(req, res) {
    try {
        const portfolios = await PortfolioModel.getAll();
        res.json(portfolios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /portfolio/{id}:
 *   get:
 *     summary: Get portfolio by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Portfolio ID
 *     responses:
 *       200:
 *         description: Portfolio details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 *       404:
 *         description: Portfolio not found
 */
async function getPortfolioById(req, res) {
    try {
        const portfolio = await PortfolioModel.getById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /portfolio:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 */
async function createPortfolio(req, res) {
    try {
        const portfolio = await PortfolioModel.create(req.body);
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /portfolio/{id}:
 *   put:
 *     summary: Update portfolio by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Portfolio ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 *       404:
 *         description: Portfolio not found
 */
async function updatePortfolio(req, res) {
    try {
        const portfolio = await PortfolioModel.update(req.params.id, req.body);
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @swagger
 * /portfolio/{id}:
 *   delete:
 *     summary: Delete portfolio by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Portfolio ID
 *     responses:
 *       200:
 *         description: Portfolio deleted successfully
 *       404:
 *         description: Portfolio not found
 */
async function deletePortfolio(req, res) {
    try {
        const result = await PortfolioModel.delete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllPortfolios,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
};
