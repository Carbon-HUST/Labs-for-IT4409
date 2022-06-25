const pool = require('../config/db.config');

class Order {
    async getAll(customerId) {
        const [rows] = await pool.query("SELECT * FROM order_ WHERE customer_id = ?", [customerId]);
        return rows;
    }
    async getAllPaging(id, page, limit) {
        page = Number(page) || 1;
        limit = Number(limit) || 10;
        const skip = (page - 1) * limit;

        const [rows] = await pool.query("SELECT * FROM order_ WHERE customer_id = ? LIMIT ? OFFSET ?", [id, limit, skip]);
        return rows;
    }
}

module.exports = new Order();