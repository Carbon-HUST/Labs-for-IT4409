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

    async getOrderById(id) {
        if (!id || id < 0) {
            return null;
        }

        const [rows] = await pool.query("SELECT * FROM order_ WHERE id = ?", [id]);
        //console.log(rows);
        if (rows.length === 0)
            return null;
        return rows[0];
    }

    async getItemInOrder(orderId) {
        const [rows] = await pool.query("SELECT order_item.*, book.title, book.thumbnail, FROM order_item, book WHERE order_item.order_id = ? AND order_item.book_id = book.id", [orderId]);
        return rows;
    }

    async updateStatus(orderId, newStatus) {
        const [rows] = await pool.query("UPDATE order_ SET status ? WHERE id = ?", [newStatus, orderId]);
        return rows;
    }
}

module.exports = new Order();