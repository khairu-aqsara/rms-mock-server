const ShipperPlanningModel = require('../models/shipperPlanningModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     ShipperPlanning:
 *       type: object
 *       properties:
 *         portfolio_id:
 *           type: string
 *           description: Portfolio ID
 *         scenario_id:
 *           type: string
 *           description: Scenario ID
 *         shipper:
 *           type: string
 *           description: Shipper name
 *         delivery_date:
 *           type: string
 *           format: date-time
 *           description: Delivery date and time
 *         vessel_name:
 *           type: string
 *           description: Vessel name
 *         volume_m3:
 *           type: number
 *           description: Volume in cubic meters
 *         activity:
 *           type: string
 *           description: Activity description
 *     BulkDeleteCriteria:
 *       type: object
 *       properties:
 *         portfolio_ids:
 *           type: array
 *           items:
 *             type: string
 *           description: List of portfolio IDs to delete
 *         scenario_ids:
 *           type: array
 *           items:
 *             type: string
 *           description: List of scenario IDs to delete
 *         shippers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of shippers to delete
 *     ShipperPlanningFilters:
 *       type: object
 *       properties:
 *         portfolio_id:
 *           type: string
 *           description: Filter by portfolio ID
 *         scenario_id:
 *           type: string
 *           description: Filter by scenario ID
 *         shipper:
 *           type: string
 *           description: Filter by shipper name
 */

/**
 * @swagger
 * /shipper-planning:
 *   get:
 *     summary: Get shipper planning records with filters
 *     tags: [ShipperPlanning]
 *     parameters:
 *       - in: query
 *         name: portfolio_id
 *         schema:
 *           type: string
 *         description: Filter by portfolio ID
 *       - in: query
 *         name: scenario_id
 *         schema:
 *           type: string
 *         description: Filter by scenario ID
 *       - in: query
 *         name: shipper
 *         schema:
 *           type: string
 *         description: Filter by shipper name
 *     responses:
 *       200:
 *         description: List of shipper planning records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShipperPlanning'
 */
async function getShipperPlanning(req, res) {
    try {
        const filters = {
            portfolio_id: req.query.portfolio_id,
            scenario_id: req.query.scenario_id,
            shipper: req.query.shipper
        };
        const records = await ShipperPlanningModel.getWithFilters(filters);
        res.json(records);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error retrieving shipper planning records: ${error.message}` 
        });
    }
}

/**
 * @swagger
 * /shipper-planning/bulk:
 *   post:
 *     summary: Bulk create shipper planning records
 *     tags: [ShipperPlanning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ShipperPlanning'
 *     responses:
 *       201:
 *         description: Records created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
async function bulkCreateShipperPlanning(req, res) {
    try {
        const result = await ShipperPlanningModel.bulkCreate(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error creating shipper planning records: ${error.message}` 
        });
    }
}

/**
 * @swagger
 * /shipper-planning/bulk:
 *   delete:
 *     summary: Bulk delete shipper planning records
 *     tags: [ShipperPlanning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkDeleteCriteria'
 *     responses:
 *       200:
 *         description: Records deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
async function bulkDeleteShipperPlanning(req, res) {
    try {
        const result = await ShipperPlanningModel.bulkDelete(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error deleting shipper planning records: ${error.message}` 
        });
    }
}

module.exports = {
    getShipperPlanning,
    bulkCreateShipperPlanning,
    bulkDeleteShipperPlanning
};
