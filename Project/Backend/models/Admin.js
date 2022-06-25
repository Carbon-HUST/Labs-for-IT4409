const pool = require('../config/db.config');

class Admin {
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        const [rows] = await pool.query("SELECT * FROM admin WHERE EMAIL = ?", email);
        return rows;
    }

    async findById(id) {
        if (!id) {
            return null;
        }

        const [rows] = await pool.query("SELECT * FROM admin WHERE id = ?", [id]);
        return rows;
    }

    async changePassword(id, newPassword, salt) {
        if (!newPassword || !id) {
            return null;
        }

        const [rows] = await pool.query("UPDATE admin SET password = ?, salt = ? where id = ?", [newPassword, salt, id]);
        return rows;
    }
}

module.exports = new Admin();