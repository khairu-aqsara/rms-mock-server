const sql = require('mssql');
const { config } = require('../config/database');

class PortfolioModel {
    static async getAll() {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .query('SELECT * FROM [RMSDSMODEL].[portfolio_details]');
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async getById(portfolioId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('portfolio_id', sql.VarChar(100), portfolioId)
                .query('SELECT * FROM [RMSDSMODEL].[portfolio_details] WHERE portfolio_id = @portfolio_id');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(portfolioData) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('portfolio_id', sql.VarChar(100), portfolioData.portfolio_id)
                .input('start_date', sql.VarChar(100), portfolioData.start_date)
                .input('end_date', sql.VarChar(100), portfolioData.end_date)
                .query(`
                    INSERT INTO [RMSDSMODEL].[portfolio_details] (portfolio_id, start_date, end_date)
                    VALUES (@portfolio_id, @start_date, @end_date);
                    SELECT * FROM [RMSDSMODEL].[portfolio_details] WHERE portfolio_id = @portfolio_id;
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(portfolioId, portfolioData) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('portfolio_id', sql.VarChar(100), portfolioId)
                .input('start_date', sql.VarChar(100), portfolioData.start_date)
                .input('end_date', sql.VarChar(100), portfolioData.end_date)
                .query(`
                    UPDATE [RMSDSMODEL].[portfolio_details]
                    SET start_date = @start_date,
                        end_date = @end_date
                    WHERE portfolio_id = @portfolio_id;
                    SELECT * FROM [RMSDSMODEL].[portfolio_details] WHERE portfolio_id = @portfolio_id;
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(portfolioId) {
        try {
            const pool = await sql.connect(config);
            await pool.request()
                .input('portfolio_id', sql.VarChar(100), portfolioId)
                .query('DELETE FROM [RMSDSMODEL].[portfolio_details] WHERE portfolio_id = @portfolio_id');
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PortfolioModel;
