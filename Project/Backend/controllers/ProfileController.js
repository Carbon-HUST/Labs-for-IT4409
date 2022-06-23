const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;
const Customer = require('../models/Customer');
const { hashPassword, comparePassword } = require('../utils/password.utils');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

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

    async updateAvatar() {
        if (!this.files[0]) {
            const customer = (await Customer.findById(this.body.id))[0];
            const avatarUrl = customer["AVATAR"];
            const avatarPublicId = avatarUrl.slice(avatarUrl.indexOf('webtech'), avatarUrl.lastIndexOf('.'));
            const result = await cloudinary.uploader.destroy(avatarPublicId);
            if (result.result === "ok") {
                await Customer.updateAvatar(this.body.id, null);
                return this.ok(result);
            }
            throw new Error("Something went wrong with your avatar. Try again!");
        }

        const avatar = this.files[0];
        if (!avatar.file.mimetype.startsWith("image")) {
            throw new CustomError.BadRequestError("Avatar must be an image");
        }
        
        const newFilePath = path.join(__dirname, '..', 'framework', 'upload', avatar.file.newFilename);
        console.log(newFilePath);
        let result = null;
        try {

            result = await cloudinary.uploader.upload(
                newFilePath,
                {
                    use_filename: true,
                    folder: 'webtech',
                }
                );
        } catch (err) {
            console.log(err);
            throw err;
        }
        
        fs.unlink(newFilePath, (err) => {
            if (err)
                throw err;
        });

        try {
            await Customer.updateAvatar(this.body.id, result.secure_url);
        } catch (err) {
            throw err;
        }

        return this.ok({
            avatarSrc: result.secure_url
        });
    }
}

module.exports = ProfileController;