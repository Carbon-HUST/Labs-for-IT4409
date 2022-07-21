const Customer = require('../models/Customer');
const Admin = require('../models/Admin');
const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;
const { hashPassword, comparePassword } = require('../utils/password.utils');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');

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

        if (password != confirmPassword) {
            throw new CustomError.BadRequestError("Password and confirm password must match");
        }

        const registeredCustomer = await Customer.where({ email }).all();
        if (registeredCustomer.length > 0) {
            throw new CustomError.BadRequestError("Email is already registered");
        }

        const {
            hashedPassword,
            salt
        } = await hashPassword(password);

        try {
            const customer = await Customer.create({ name: username, email, password: hashedPassword, phone, gender, dob });

            if (customer.success && customer.insertedId) {
                const cart = await Cart.create({ customer_id: customer.insertedId });
                if (!cart.success)
                    throw new Error("Register failed!");
            } else {
                if (customer.success === false)
                    throw new CustomError.BadRequestError(customer.errors);
            }

            return this.ok({
                success: true,
                id: customer.insertedId,
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


        const customer = await Customer.where({ email }).first();
        if (!customer) {
            throw new CustomError.BadRequestError("Invalid credentials");
        }

        if (!(await comparePassword(password, customer["password"]))) {
            throw new CustomError.BadRequestError("Invalid credentials");
        }

        const token = jwt.sign({
            id: customer["id"],
            name: customer["name"],
            role: "customer"
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