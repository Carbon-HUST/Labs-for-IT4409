const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;
const Customer = require('../models/Customer');

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
}

module.exports = ProfileController;