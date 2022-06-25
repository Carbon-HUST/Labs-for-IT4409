const pool = require('../config/db.config');

class Voucher {
    async findById(id) {
        const [rows] = await pool.query("SELECT * FROM voucher WHERE id = ?", [id]);
        return rows;
    }
}

module.exports = new Voucher();