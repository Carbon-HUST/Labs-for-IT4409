const Auth = require('../models/Auth');
const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;

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

        try {
            const customer = await Auth.register(username, email, password, phone, gender, dob);
            return this.ok(customer);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = AuthController;