const pool = require('../config/db.config');
const CustomError = require('../framework').CustomError;
const {
    hashPassword,
    comparePassword
} = require('../utils/password.utils');
class Auth {
    async register(username, email, password, phone=null, gender='other', dob=null) {
        const [rows] = await pool.query("SELECT EMAIL FROM CUSTOMER WHERE EMAIL=?", email);
        if (rows.length > 0)
            throw new CustomError.BadRequestError("Provided email is already registered");
            
        const {
            hashedPassword,
            salt
        } = await hashPassword(password);

        if (dob) {
            const dateofbirth = new Date(dob);
            dob = dateofbirth.getDate() + '/' + (dateofbirth.getMonth() + 1) + '/' + dateofbirth.getFullYear();
        }
        const customer = 
            await pool.query("INSERT INTO CUSTOMER(name, email, password, phone, gender, dob, salt) VALUES(?, ?, ?, ?, ?, ?, ?)",
                            [username, email, hashedPassword, phone || 'null', gender, dob || 'null', salt]);
        return customer;
    }
}

module.exports = new Auth();