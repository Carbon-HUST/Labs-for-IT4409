const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;
const Customer = require('../models/Customer');
const { hashPassword, comparePassword } = require('../utils/password.utils');

class ProfileController extends BaseController {
    async updateProfile() {
        const {
            id,
            username,
            phone,
            dob,
            gender
        } = this.body;

        if (!id || id < 0) {
            throw new CustomError.BadRequestError("Id is invalid");
        }

        if (!username && !phone && !dob && !gender) {
            return this.noContent();
        }

        console.log(username);
        if (username === '' || (username && (username.length > 255))) {
            throw new CustomError.BadRequestError("Username is invalid");
        }

        if (dob && !Date.parse(dob)) {
            throw new CustomError.BadRequestError("Date of birth is invalid");
        }

        if (gender && (gender != '1' && gender != '2' && gender != '3')) {
            throw new CustomError.BadRequestError("Gender is invalid");
        }

        try {
            const result = await Customer.updateProfile(id, username, phone, dob, gender);
            return this.noContent();
        } catch (err) {
            throw err;
        }
    }

    async changePassword() {
        const {
            id,
            currentPassword,
            newPassword,
            confirmNewPassword
        } = this.body;

        if (!id || id < 0) {
            throw new CustomError.BadRequestError("Id is invalid");
        }

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            throw new CustomError.BadRequestError("Not enough information provded");
        }

        const customers = await Customer.findById(id);
        if (!customers || customers.length <= 0) {
            throw new CustomError.BadRequestError("Account not exist");
        }

        const customer = customers[0];
        console.log(customer);

        if (!(await comparePassword(currentPassword, customer["PASSWORD"]))) {
            throw new CustomError.BadRequestError("Current password is incorrect");
        }

        if (newPassword !== confirmNewPassword) {
            throw new CustomError.BadRequestError("New password and confirm password must match");
        }

        const { hashedPassword, salt } = await hashPassword(newPassword);

        try {
            const result = await Customer.changePassword(id, hashedPassword, salt);
            return this.ok(result);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ProfileController;