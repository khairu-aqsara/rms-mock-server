const OptimizationModel = require('../models/optimizationModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     Optimization:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *           description: Auto-generated ID
 *           readOnly: true
 *         portfolio_id:
 *           type: string
 *           description: Portfolio ID
 *         scenario_id:
 *           type: string
 *           description: Scenario ID
 *         shipper:
 *           type: string
 *           description: Shipper name
 *         is_completed:
 *           type: integer
 *           description: Completion status (0 or 1)
 *           default: 0
 *         percentage:
 *           type: number
 *           format: float
 *           description: Optimization progress percentage
 *           minimum: 0
 *           maximum: 100
 *           default: 0
 */

/**
 * @swagger
 * /optimization:
 *   post:
 *     summary: Create a new optimization record
 *     tags: [Optimization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - portfolio_id
 *               - scenario_id
 *               - shipper
 *             properties:
 *               portfolio_id:
 *                 type: string
 *               scenario_id:
 *                 type: string
 *               shipper:
 *                 type: string
 *               is_completed:
 *                 type: integer
 *                 default: 0
 *               percentage:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 0
 *     responses:
 *       201:
 *         description: Optimization record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Optimization'
 */
async function createOptimization(req, res) {
    try {
        const optimization = await OptimizationModel.create(req.body);
        res.status(201).json(optimization);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error creating optimization record: ${error.message}` 
        });
    }
}

/**
 * @swagger
 * /optimization:
 *   get:
 *     summary: Get optimization records with filters
 *     tags: [Optimization]
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
 *       - in: query
 *         name: is_completed
 *         schema:
 *           type: integer
 *         description: Filter by completion status (0 or 1)
 *       - in: query
 *         name: percentage
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter by percentage value
 *     responses:
 *       200:
 *         description: List of optimization records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Optimization'
 */
async function getOptimizations(req, res) {
    try {
        const filters = {
            portfolio_id: req.query.portfolio_id,
            scenario_id: req.query.scenario_id,
            shipper: req.query.shipper,
            is_completed: req.query.is_completed !== undefined ? parseInt(req.query.is_completed) : undefined,
            percentage: req.query.percentage !== undefined ? parseFloat(req.query.percentage) : undefined
        };
        const records = await OptimizationModel.getWithFilters(filters);
        res.json(records);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error retrieving optimization records: ${error.message}` 
        });
    }
}

/**
 * @swagger
 * /optimization/{id}:
 *   get:
 *     summary: Get optimization record by ID
 *     tags: [Optimization]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Optimization record ID
 *     responses:
 *       200:
 *         description: Optimization record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Optimization'
 *       404:
 *         description: Optimization record not found
 */
async function getOptimizationById(req, res) {
    try {
        const optimization = await OptimizationModel.getById(parseInt(req.params.id));
        if (!optimization) {
            return res.status(404).json({ message: 'Optimization record not found' });
        }
        res.json(optimization);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error retrieving optimization record: ${error.message}` 
        });
    }
}

const OptResultModel = require('../models/optResultModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     OptimizationResult:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *           description: Auto-generated ID
 *         optimization_id:
 *           type: integer
 *           description: Reference to the optimization record
 *         delivery_date:
 *           type: string
 *           format: date
 *           description: Delivery date
 *         rgt:
 *           type: string
 *           maxLength: 50
 *           description: RGT value
 *         shipper:
 *           type: string
 *           maxLength: 50
 *           description: Shipper name
 *         volume:
 *           type: number
 *           format: decimal
 *           description: Volume value
 *         untouched_volume:
 *           type: number
 *           format: decimal
 *           description: Untouched volume value
 *         vessel_name:
 *           type: string
 *           maxLength: 50
 *           description: Vessel name
 *         mmbtu:
 *           type: number
 *           format: decimal
 *           description: MMBTU value
 *         mmscf:
 *           type: number
 *           format: decimal
 *           description: MMSCF value
 */

/**
 * @swagger
 * /optimization/{id}/result:
 *   get:
 *     summary: Get optimization results by optimization ID
 *     tags: [Optimization]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Optimization ID
 *     responses:
 *       200:
 *         description: List of optimization results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OptimizationResult'
 *       404:
 *         description: No results found for this optimization ID
 */
async function getOptimizationResult(req, res) {
    try {
        const results = await OptResultModel.getByOptimizationId(parseInt(req.params.id));
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No results found for this optimization ID' });
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error retrieving optimization results: ${error.message}` 
        });
    }
}

module.exports = {
    createOptimization,
    getOptimizations,
    getOptimizationById,
    getOptimizationResult
};
