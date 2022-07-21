const pool = require('../config/db.config');

class Post {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM POST');
        return rows;
    }
}

module.exports = new Post();