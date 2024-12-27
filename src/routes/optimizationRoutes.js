const express = require('express');
const router = express.Router();
const {
    createOptimization,
    getOptimizations,
    getOptimizationById,
    getOptimizationResult
} = require('../controllers/optimizationController');

// Get optimization records with filters
router.get('/', getOptimizations);

// Get optimization record by ID
router.get('/:id', getOptimizationById);

// Get optimization result by ID
router.get('/:id/result', getOptimizationResult);

// Create new optimization record
router.post('/', createOptimization);

module.exports = router;
