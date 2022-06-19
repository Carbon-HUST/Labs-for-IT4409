const Customer = require('../models/Customer');
const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;
const { hashPassword, comparePassword } = require('../utils/password.utils');
const jwt = require('jsonwebtoken');

class AuthController extends BaseController {
    async register() {
        const {
            username,
            email,
            password,
            confirmPassword,
            phone,
            gender,
            dob,
        } = this.body;

        if (!username || !email || !password || !confirmPassword) {
            throw new CustomError.BadRequestError("Not enough information provided");
        }

        if (username.length == 0 || username.length > 255) {
            throw new CustomError.BadRequestError("Invalid username");
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new CustomError.BadRequestError("Invalid email");
        }

        if (password != confirmPassword) {
            throw new CustomError.BadRequestError("Password and confirm password must match");
        }

        if (dob && !Date.parse(dob)) {
            throw new CustomError.BadRequestError("Date of birth is invalid");
        }

        const registeredCustomer = await Customer.findByEmail(email);
        if (registeredCustomer && registeredCustomer.length > 0) {
            throw new CustomError.BadRequestError("Email is already registered");
        }

        const {
            hashedPassword,
            salt
        } = await hashPassword(password);

        try {
            const customer = await Customer.create(username, email, hashedPassword, phone, gender, dob, salt);
            return this.ok({
                success: true,
                id: customer[0]["insertId"]
            });
        } catch (err) {
            throw err;
        }
    }

    async login() {
        const { email, password } = this.body;

        if (!email || !password) {
            throw new CustomError.BadRequestError("Not enough information provided");
        }
        
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new CustomError.BadRequestError("Invalid email");
        }

        const customers = await Customer.findByEmail(email);
        if (!customers || customers.length === 0) {
            throw new CustomError.BadRequestError("Invalid credentials");
        }

        const customer = customers[0];
        if (!(await comparePassword(password, customer["PASSWORD"]))) {
            throw new CustomError.BadRequestError("Invalid credentials");
        }

        const token = jwt.sign({
            id: customer["id"],
            name: customer["username"],
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME
        });

        return this.ok({
            success: true,
            accessToken: token
        });
    }
}

module.exports = AuthController;