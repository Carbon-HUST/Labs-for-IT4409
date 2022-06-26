const pool = require('../config/db.config');
const CustomError = require('../framework').CustomError;

class Publisher {
    async getAll() {
        const [rows] = await pool.query("SELECT * FROM publisher");
        return rows;
    }

    async findById(id) {
        if (!id || id < 0) {
            return null;
        }

        const [rows] = await pool.query("SELECT * FROM publisher WHERE id = ?", [id]);
        //console.log(rows);
        if (rows.length === 0)
            return null;
        return rows[0];
    }

    async create(name) {
        if (!name) {
            return new CustomError.BadRequestError("Name is required");
        }

        const [rows] = await pool.query("INSERT INTO publisher(name) VALUES(?)", [name]);
        //console.log(rows);
        if (rows.affectedRows === 1) {
            return rows.insertId;
        }

        return false;
    }

    async update(id, name) {
        if (!id || !name) {
            throw new CustomError.BadRequestError("Not enough information provided");
        }

        const [rows] = await pool.query("UPDATE publisher SET name = ? WHERE id = ?", [name, id]);
        if (rows.affectedRows === 1) {
            return true;
        }

        return false;
    }

    async delete(id) {
        if (!id) {
            throw new CustomError.BadRequestError("Not enough information provided");
        }

        const [rows] = await pool.query("DELETE FROM publisher WHERE id = ?", [id]);
        if (rows.affectedRows === 1) {
            return true;
        }

        return false;
    }
}

module.exports = new Publisher();