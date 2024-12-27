const express = require('express');
const router = express.Router();
const {
    getAllPortfolios,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require('../controllers/portfolioController');

// Get all portfolios
router.get('/', getAllPortfolios);

// Get portfolio by ID
router.get('/:id', getPortfolioById);

// Create new portfolio
router.post('/', createPortfolio);

// Update portfolio
router.put('/:id', updatePortfolio);

// Delete portfolio
router.delete('/:id', deletePortfolio);

module.exports = router;
