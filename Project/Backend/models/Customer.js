const pool = require('../config/db.config');

class Customer {
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        const [rows] = await pool.query("SELECT * FROM CUSTOMER WHERE EMAIL = ?", email);
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
}

module.exports = new Customer();