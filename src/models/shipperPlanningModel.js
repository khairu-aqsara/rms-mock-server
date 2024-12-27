const sql = require('mssql');
const { config } = require('../config/database');

class ShipperPlanningModel {
    static async getWithFilters(filters) {
        try {
            const pool = await sql.connect(config);
            let query = 'SELECT * FROM [RMSDSMODEL].[shipper_planning] WHERE 1=1';
            const request = pool.request();

            if (filters.portfolio_id) {
                query += ' AND portfolio_id = @portfolio_id';
                request.input('portfolio_id', sql.VarChar(100), filters.portfolio_id);
            }

            if (filters.scenario_id) {
                query += ' AND scenario_id = @scenario_id';
                request.input('scenario_id', sql.VarChar(100), filters.scenario_id);
            }

            if (filters.shipper) {
                query += ' AND shipper = @shipper';
                request.input('shipper', sql.VarChar(100), filters.shipper);
            }

            query += ' ORDER BY delivery_date';
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async bulkCreate(shipperPlannings) {
        try {
            const pool = await sql.connect(config);
            const table = new sql.Table('[RMSDSMODEL].[shipper_planning]');
            
            table.create = false;
            table.columns.add('portfolio_id', sql.VarChar(100), { nullable: true });
            table.columns.add('scenario_id', sql.VarChar(100), { nullable: true });
            table.columns.add('shipper', sql.VarChar(100), { nullable: true });
            table.columns.add('delivery_date', sql.DateTime, { nullable: true });
            table.columns.add('vessel_name', sql.VarChar(100), { nullable: true });
            table.columns.add('volume_m3', sql.Numeric(18, 0), { nullable: true });
            table.columns.add('activity', sql.VarChar(100), { nullable: true });

            // Add rows to the table
            shipperPlannings.forEach(planning => {
                table.rows.add(
                    planning.portfolio_id,
                    planning.scenario_id,
                    planning.shipper,
                    planning.delivery_date ? new Date(planning.delivery_date) : null,
                    planning.vessel_name,
                    planning.volume_m3,
                    planning.activity
                );
            });

            // Bulk insert the data
            await pool.request().bulk(table);
            return { success: true, message: `${shipperPlannings.length} records inserted successfully` };
        } catch (error) {
            throw error;
        }
    }

    static async bulkDelete(criteria) {
        try {
            const pool = await sql.connect(config);
            let query = 'DELETE FROM [RMSDSMODEL].[shipper_planning] WHERE 1=1';
            const request = pool.request();

            if (criteria.portfolio_ids && criteria.portfolio_ids.length > 0) {
                query += ' AND portfolio_id IN (@portfolio_ids)';
                request.input('portfolio_ids', sql.VarChar(sql.MAX), criteria.portfolio_ids.join(','));
            }

            if (criteria.scenario_ids && criteria.scenario_ids.length > 0) {
                query += ' AND scenario_id IN (@scenario_ids)';
                request.input('scenario_ids', sql.VarChar(sql.MAX), criteria.scenario_ids.join(','));
            }

            if (criteria.shippers && criteria.shippers.length > 0) {
                query += ' AND shipper IN (@shippers)';
                request.input('shippers', sql.VarChar(sql.MAX), criteria.shippers.join(','));
            }

            const result = await request.query(query);
            return { 
                success: true, 
                message: `${result.rowsAffected[0]} records deleted successfully` 
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ShipperPlanningModel;
