const express = require('express');
const router = express.Router();
const {
    getShipperPlanning,
    bulkCreateShipperPlanning,
    bulkDeleteShipperPlanning
} = require('../controllers/shipperPlanningController');

// Get shipper planning records with filters
router.get('/', getShipperPlanning);

// Bulk create shipper planning records
router.post('/bulk', bulkCreateShipperPlanning);

// Bulk delete shipper planning records
router.delete('/bulk', bulkDeleteShipperPlanning);

module.exports = router;
