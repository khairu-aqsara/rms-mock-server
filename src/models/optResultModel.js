const sql = require('mssql');
const { config } = require('../config/database');

class OptResultModel {
    static async create(resultData) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('optimization_id', sql.Int, resultData.optimization_id)
                .input('delivery_date', sql.Date, resultData.delivery_date ? new Date(resultData.delivery_date) : null)
                .input('rgt', sql.VarChar(50), resultData.rgt)
                .input('shipper', sql.VarChar(50), resultData.shipper)
                .input('volume', sql.Decimal(18, 0), resultData.volume)
                .input('untouched_volume', sql.Decimal(18, 0), resultData.untouched_volume)
                .input('vessel_name', sql.VarChar(50), resultData.vessel_name)
                .input('mmbtu', sql.Decimal(18, 0), resultData.mmbtu)
                .input('mmscf', sql.Decimal(18, 0), resultData.mmscf)
                .query(`
                    INSERT INTO [RMSDSMODEL].[opt_result]
                    (optimization_id, delivery_date, rgt, shipper, volume, 
                     untouched_volume, vessel_name, mmbtu, mmscf)
                    VALUES
                    (@optimization_id, @delivery_date, @rgt, @shipper, @volume,
                     @untouched_volume, @vessel_name, @mmbtu, @mmscf);
                    
                    SELECT * FROM [RMSDSMODEL].[opt_result]
                    WHERE Id = SCOPE_IDENTITY();
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async bulkCreate(resultsData) {
        try {
            const pool = await sql.connect(config);
            const table = new sql.Table('[RMSDSMODEL].[opt_result]');
            
            table.create = false;
            table.columns.add('optimization_id', sql.Int, { nullable: true });
            table.columns.add('delivery_date', sql.Date, { nullable: true });
            table.columns.add('rgt', sql.VarChar(50), { nullable: true });
            table.columns.add('shipper', sql.VarChar(50), { nullable: true });
            table.columns.add('volume', sql.Decimal(18, 0), { nullable: true });
            table.columns.add('untouched_volume', sql.Decimal(18, 0), { nullable: true });
            table.columns.add('vessel_name', sql.VarChar(50), { nullable: true });
            table.columns.add('mmbtu', sql.Decimal(18, 0), { nullable: true });
            table.columns.add('mmscf', sql.Decimal(18, 0), { nullable: true });

            resultsData.forEach(result => {
                table.rows.add(
                    result.optimization_id,
                    result.delivery_date ? new Date(result.delivery_date) : null,
                    result.rgt,
                    result.shipper,
                    result.volume,
                    result.untouched_volume,
                    result.vessel_name,
                    result.mmbtu,
                    result.mmscf
                );
            });

            await pool.request().bulk(table);
            return { success: true, message: `${resultsData.length} records inserted successfully` };
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM [RMSDSMODEL].[opt_result] WHERE Id = @id');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByOptimizationId(optimizationId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('optimization_id', sql.Int, optimizationId)
                .query(`
                    SELECT * FROM [RMSDSMODEL].[opt_result] 
                    WHERE optimization_id = @optimization_id
                    ORDER BY delivery_date
                `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, resultData) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('optimization_id', sql.Int, resultData.optimization_id)
                .input('delivery_date', sql.Date, resultData.delivery_date ? new Date(resultData.delivery_date) : null)
                .input('rgt', sql.VarChar(50), resultData.rgt)
                .input('shipper', sql.VarChar(50), resultData.shipper)
                .input('volume', sql.Decimal(18, 0), resultData.volume)
                .input('untouched_volume', sql.Decimal(18, 0), resultData.untouched_volume)
                .input('vessel_name', sql.VarChar(50), resultData.vessel_name)
                .input('mmbtu', sql.Decimal(18, 0), resultData.mmbtu)
                .input('mmscf', sql.Decimal(18, 0), resultData.mmscf)
                .query(`
                    UPDATE [RMSDSMODEL].[opt_result]
                    SET optimization_id = @optimization_id,
                        delivery_date = @delivery_date,
                        rgt = @rgt,
                        shipper = @shipper,
                        volume = @volume,
                        untouched_volume = @untouched_volume,
                        vessel_name = @vessel_name,
                        mmbtu = @mmbtu,
                        mmscf = @mmscf
                    WHERE Id = @id;
                    
                    SELECT * FROM [RMSDSMODEL].[opt_result]
                    WHERE Id = @id;
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const pool = await sql.connect(config);
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM [RMSDSMODEL].[opt_result] WHERE Id = @id');
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async deleteByOptimizationId(optimizationId) {
        try {
            const pool = await sql.connect(config);
            await pool.request()
                .input('optimization_id', sql.Int, optimizationId)
                .query('DELETE FROM [RMSDSMODEL].[opt_result] WHERE optimization_id = @optimization_id');
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async generateDummyData(optimization_id, start_date, end_date, rgt, shipper) {
        try {
            const dummyData = [];
            const startDate = start_date instanceof Date ? start_date : new Date(start_date);
            const endDate = end_date instanceof Date ? end_date : new Date(end_date);

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error('Invalid date format. Please provide dates in YYYY-MM-DD format or Date objects');
            }

            if (startDate > endDate) {
                throw new Error('Start date cannot be later than end date');
            }

            // Calculate total days for progress tracking
            const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            let currentDay = 0;

            // Get OptimizationModel for progress updates
            const OptimizationModel = require('./optimizationModel');

            // Clone startDate to avoid modifying the original date
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const randomVolume = Math.floor(Math.random() * (1000000 - 500000) + 500000);
                const randomMMBTU = Math.floor(randomVolume * 1.05);
                const randomMMSCF = Math.floor(randomVolume * 0.95);
                
                dummyData.push({
                    optimization_id,
                    delivery_date: new Date(date),
                    rgt,
                    shipper,
                    volume: randomVolume,
                    untouched_volume: randomVolume,
                    vessel_name: `Vessel-${Math.floor(Math.random() * 100)}`,
                    mmbtu: randomMMBTU,
                    mmscf: randomMMSCF
                });

                // Update progress
                currentDay++;
                const percentage = parseFloat(((currentDay / totalDays) * 100).toFixed(2));
                await OptimizationModel.update(optimization_id, {
                    is_completed: percentage >= 100 ? 1 : 0,
                    percentage: percentage
                });
            }

            const result = await this.bulkCreate(dummyData);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = OptResultModel;
