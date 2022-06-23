const pool = require('../config/db.config');

class Customer {
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        const [rows] = await pool.query("SELECT * FROM CUSTOMER WHERE EMAIL = ?", email);
        return rows;
    }

    async findById(id) {
        if (!id) {
            return null;
        }

        const [rows] = await pool.query("SELECT * FROM CUSTOMER WHERE ID = ?", [id]);
        return rows;
    }

    async create(username, email, password, phone, gender, dob, salt) {
        if (dob) {
            const dateofbirth = new Date(dob);
            dob = dateofbirth.getDate() + '/' + (dateofbirth.getMonth() + 1) + '/' + dateofbirth.getFullYear();
        }
        const customer = 
            await pool.query("INSERT INTO CUSTOMER(name, email, password, phone, gender, dob, salt) VALUES(?, ?, ?, ?, ?, ?, ?)",
                            [username, email, password, phone || 'null', gender, dob || 'null', salt]);
        return customer;
    }

    async updateProfile(id, username, phone, dob, gender) {
        if (dob) {
            const dateofbirth = new Date(dob);
            dob = dateofbirth.getFullYear() + '-' + (dateofbirth.getMonth() + 1) + '-' + dateofbirth.getDate();
        }

        let query = "UPDATE CUSTOMER SET ";
        const parameter = [];
        if (username) {
            query += 'name = ?, ';
            parameter.push(username);
        }

        if (phone) {
            query += 'phone = ?, ';
            parameter.push(phone);
        }

        if (dob) {
            query += 'dob = ?, ';
            parameter.push(dob);
        }

        if (gender) {
            query += 'gender = ?, ';
            parameter.push(gender);
        }

        query = query.substring(0, query.length - 2);
        query += ' WHERE id = ?';
        parameter.push(id);

        const [rows] =  await pool.query(query, parameter);
        return rows;
    }

    async changePassword(id, newPassword, salt) {
        if (!newPassword || !id) {
            return null;
        }

        const [rows] = await pool.query("UPDATE CUSTOMER SET password = ?, salt = ? where id = ?", [newPassword, salt, id]);
        return rows;
    }

    async updateAvatar(id, avatarUrl) {
        if (!id) {
            return null;
        }

        const [rows] = await pool.query("UPDATE CUSTOMER SET avatar = ? where id = ?", [avatarUrl, id]);
        return rows;
    }
}

module.exports = new Customer();