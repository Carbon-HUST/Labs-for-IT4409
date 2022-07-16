const mysql2 = require('mysql2');
const fs = require('fs');
const path = require('path');

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    ssl: {
        cert: fs.readFileSync(path.join(__dirname, '..', 'BaltimoreCyberTrustRoot.crt.pem'))
    }
});

const promisePool = pool.promise();

module.exports = promisePool;