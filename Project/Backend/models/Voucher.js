const pool = require('../config/db.config');

class Voucher {
    async findById(id) {
        if (!id || id < 0) {
            return null;
        }

        const [rows] = await pool.query("SELECT * FROM voucher WHERE id = ?", [id]);
        //console.log(rows);
        if (rows.length === 0)
            return null;
        return rows[0];
    }

    async getAll() {
        const [rows] = await pool.query("SELECT * FROM voucher");
        return rows;
    }

    async create(name, start, end, value, stock, description, minCartTotal = 0, usagePerCustomer = null) {
        if (!name || !start || !end || !value || (!stock && stock != 0) || !description) {
            return new CustomError.BadRequestError("Not enough information provided");
        }

        const [rows] = 
            await pool.query("INSERT INTO voucher(name, start, end, value, min_cart_total, stock, usage_per_customer, description) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", 
                            [name, start, end, value, minCartTotal, stock, usagePerCustomer, description]);
        //console.log(rows);
        if (rows.affectedRows === 1) {
            return rows.insertId;
        }

        return false;
    }

    async update(id, updatingProperties = {}) {
        if (!id) {
            throw new CustomError.BadRequestError("Voucher's id is missing");
        }

        const propertyKeys = Object.keys(updatingProperties);
        if (propertyKeys.length === 0) {
            return true;
        }

        const properties = ['name', 'start', 'end', 'value', 'min_cart_total', 'stock', 'usage_per_customer', 'description'];
        let query = "UPDATE voucher SET ";
        const queryValue = [];

        propertyKeys.forEach((key, index) => {
            if (properties.indexOf(key) !== -1) {
                if (index != propertyKeys.length - 1) {
                    query += `${key} = ?, `;
                } else {
                    query += `${key} = ? `;
                }
                queryValue.push(updatingProperties[key]);
            }
        });

        query += "WHERE id = ?";
        queryValue.push(id);

        const [rows] = await pool.query(query, queryValue);
        if (rows.affectedRows === 1) {
            return true;
        }

        return false;
    }

    async delete(id) {
        if (!id) {
            throw new CustomError.BadRequestError("Voucher's id is missing");
        }

        const [rows] = await pool.query("DELETE FROM voucher WHERE id = ?", [id]);
        if (rows.affectedRows === 1) {
            return true;
        }

        return false;
    }
}

module.exports = new Voucher();