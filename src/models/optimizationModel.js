const sql = require('mssql');
const { config } = require('../config/database');
const optimizationEvents = require('../services/eventEmitter');

class OptimizationModel {
    static async create(optimizationData) {
        try {
            const pool = await sql.connect(config);
            
            // First try to check if the table exists
            const checkTable = await pool.request()
                .query(`
                    SELECT OBJECT_ID('RMSDSMODEL.Optimization') as TableExists;
                `);
            
            if (!checkTable.recordset[0].TableExists) {
                throw new Error('Table RMSDSMODEL.Optimization does not exist. Please check schema and table name.');
            }

            const result = await pool.request()
                .input('portfolio_id', sql.VarChar(50), optimizationData.portfolio_id)
                .input('scenario_id', sql.VarChar(50), optimizationData.scenario_id)
                .input('shipper', sql.VarChar(50), optimizationData.shipper)
                .input('is_completed', sql.Int, optimizationData.is_completed || 0)
                .input('percentage', sql.Decimal(5,2), optimizationData.percentage || 0.00)
                .query(`
                    INSERT INTO RMSDSMODEL.Optimization
                    (portfolio_id, scenario_id, shipper, is_completed, percentage)
                    VALUES
                    (@portfolio_id, @scenario_id, @shipper, @is_completed, @percentage);
                    
                    SELECT * FROM RMSDSMODEL.Optimization
                    WHERE Id = SCOPE_IDENTITY();
                `);

            // Emit event for background processing
            optimizationEvents.emit('optimization.created', result.recordset[0]);
            
            return result.recordset[0];
        } catch (error) {
            console.error('Detailed error:', error);
            throw new Error(`Failed to create optimization record: ${error.message}`);
        }
    }

    static async getWithFilters(filters) {
        try {
            const pool = await sql.connect(config);
            let query = 'SELECT * FROM [RMSDSMODEL].[Optimization] WHERE 1=1';
            const request = pool.request();

            if (filters.portfolio_id) {
                query += ' AND portfolio_id = @portfolio_id';
                request.input('portfolio_id', sql.VarChar(50), filters.portfolio_id);
            }

            if (filters.scenario_id) {
                query += ' AND scenario_id = @scenario_id';
                request.input('scenario_id', sql.VarChar(50), filters.scenario_id);
            }

            if (filters.shipper) {
                query += ' AND shipper = @shipper';
                request.input('shipper', sql.VarChar(50), filters.shipper);
            }

            if (filters.is_completed !== undefined) {
                query += ' AND is_completed = @is_completed';
                request.input('is_completed', sql.Int, filters.is_completed);
            }

            // Remove percentage filter
            if (filters.percentage !== undefined) {
                delete filters.percentage;
            }

            query += ' ORDER BY Id DESC';
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM [RMSDSMODEL].[Optimization] WHERE Id = @id');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async getOptimizationResult(id) {
        try {
            const pool = await sql.connect(config);
            // First verify the optimization exists
            const optimization = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM [RMSDSMODEL].[Optimization] WHERE Id = @id');
            
            if (optimization.recordset.length === 0) {
                return null;
            }

            // Get the optimization results
            const OptResultModel = require('./optResultModel');
            const results = await OptResultModel.getByOptimizationId(id);
            
            return {
                optimization: optimization.recordset[0],
                results: results
            };
        } catch (error) {
            throw error;
        }
    }

    static async update(id, optimizationData) {
        try {
            const pool = await sql.connect(config);
            
            // Get current optimization data
            const currentData = await this.getById(id);
            if (!currentData) {
                throw new Error('Optimization not found');
            }

            // Merge current data with updates
            const updatedData = {
                ...currentData,
                ...optimizationData
            };

            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('portfolio_id', sql.VarChar(50), updatedData.portfolio_id)
                .input('scenario_id', sql.VarChar(50), updatedData.scenario_id)
                .input('shipper', sql.VarChar(50), updatedData.shipper)
                .input('is_completed', sql.Int, updatedData.is_completed)
                .input('percentage', sql.Decimal(5,2), updatedData.percentage)
                .query(`
                    UPDATE [RMSDSMODEL].[Optimization]
                    SET portfolio_id = @portfolio_id,
                        scenario_id = @scenario_id,
                        shipper = @shipper,
                        is_completed = @is_completed,
                        percentage = @percentage
                    WHERE Id = @id;

                    SELECT * FROM [RMSDSMODEL].[Optimization]
                    WHERE Id = @id;
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async generateDummyDataFromPortfolio(optimizationId, rgt = 'RGTSU') {
        try {
            // Get optimization details
            const optimization = await this.getById(optimizationId);
            if (!optimization) {
                throw new Error('Optimization not found');
            }

            // Get portfolio details
            const PortfolioModel = require('./portfolioModel');
            const portfolio = await PortfolioModel.getById(optimization.portfolio_id);
            if (!portfolio) {
                throw new Error('Portfolio not found');
            }

            // Generate dummy data using portfolio dates
            const OptResultModel = require('./optResultModel');
            const result = await OptResultModel.generateDummyData(
                optimizationId,
                portfolio.start_date,
                portfolio.end_date,
                rgt,
                optimization.shipper
            );

            return result;
        } catch (error) {
            console.error('Error generating dummy data:', error);
            throw error;
        }
    }
}

module.exports = OptimizationModel;
