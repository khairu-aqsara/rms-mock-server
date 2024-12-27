const { testConnection } = require('../config/database');

/**
 * @swagger
 * /check/db/connection:
 *   get:
 *     summary: Check database connection
 *     description: Tests the connection to SQL Server database
 *     tags: [Check]
 *     responses:
 *       200:
 *         description: Connection test result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the connection was successful
 *                 message:
 *                   type: string
 *                   description: Details about the connection status
 */
async function checkDbConnection(req, res) {
    try {
        const result = await testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error checking database connection: ${error.message}`
        });
    }
}

module.exports = {
    checkDbConnection
};
