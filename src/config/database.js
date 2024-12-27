const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
};

async function testConnection() {
    try {
        const pool = await sql.connect(config);
        await pool.request().query('SELECT 1');
        await sql.close();
        return { success: true, message: 'Database connection successful' };
    } catch (error) {
        await sql.close();
        return { success: false, message: `Database connection failed: ${error.message}` };
    }
}

module.exports = {
    config,
    testConnection
};
