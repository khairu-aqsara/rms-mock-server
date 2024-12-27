const sql = require('mssql');
const { config } = require('../config/database');

class ScenarioModel {
    static async getAll() {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .query('SELECT * FROM [RMSDSMODEL].[scenario_details]');
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async getById(scenarioId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('scenario_id', sql.VarChar(100), scenarioId)
                .query('SELECT * FROM [RMSDSMODEL].[scenario_details] WHERE scenario_id = @scenario_id');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByPortfolioId(portfolioId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('parent_portfolio_id', sql.VarChar(100), portfolioId)
                .query('SELECT * FROM [RMSDSMODEL].[scenario_details] WHERE parent_portfolio_id = @parent_portfolio_id');
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async create(scenarioData) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('parent_portfolio_id', sql.VarChar(100), scenarioData.parent_portfolio_id)
                .input('scenario_id', sql.VarChar(100), scenarioData.scenario_id)
                .query(`
                    INSERT INTO [RMSDSMODEL].[scenario_details] (parent_portfolio_id, scenario_id)
                    VALUES (@parent_portfolio_id, @scenario_id);
                    SELECT * FROM [RMSDSMODEL].[scenario_details] WHERE scenario_id = @scenario_id;
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(scenarioId, scenarioData) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('scenario_id', sql.VarChar(100), scenarioId)
                .input('parent_portfolio_id', sql.VarChar(100), scenarioData.parent_portfolio_id)
                .query(`
                    UPDATE [RMSDSMODEL].[scenario_details]
                    SET parent_portfolio_id = @parent_portfolio_id
                    WHERE scenario_id = @scenario_id;
                    SELECT * FROM [RMSDSMODEL].[scenario_details] WHERE scenario_id = @scenario_id;
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(scenarioId) {
        try {
            const pool = await sql.connect(config);
            await pool.request()
                .input('scenario_id', sql.VarChar(100), scenarioId)
                .query('DELETE FROM [RMSDSMODEL].[scenario_details] WHERE scenario_id = @scenario_id');
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ScenarioModel;
