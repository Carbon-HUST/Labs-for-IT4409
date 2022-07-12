const BaseController = require('../framework').BaseController;
const CustomError = require('../framework').CustomError;
const Customer = require('../models/Customer');
const { hashPassword, comparePassword } = require('../utils/password.utils');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

class ProfileController extends BaseController {
    async getProfile() {
        const id = this.body.id;
        console.log(id);
        if (!id || id < 0) {
            throw new CustomError.BadRequestError("Id is invalid");
        }
        const customers = await Customer.findById(id);
        if (customers.length === 0) {
            return new CustomError.NotFoundError("Customer not found");
        }

        const customer = customers[0];
        return this.ok(customer);
    }

    async updateProfile() {
        try {
            const result = await Customer.update({ id: this.body.id }, this.body);
            if (result.success)
                return this.noContent();
            else
                throw new CustomError.BadRequestError(result.errors);
        } catch (err) {
            throw err;
        }
    }

    async changePassword() {
        const {
            currentPassword,
            newPassword,
            confirmNewPassword
        } = this.body;


        if (!currentPassword || !newPassword || !confirmNewPassword) {
            throw new CustomError.BadRequestError("Not enough information provded");
        }

        if (newPassword !== confirmNewPassword) {
            throw new CustomError.BadRequestError("New password and confirm password must match");
        }

        const customer = await Customer.where({ id: this.body.id }).first();
        if (!customer) {
            throw new CustomError.BadRequestError("Account not exist");
        }

        if (!(await comparePassword(currentPassword, customer["password"]))) {
            throw new CustomError.BadRequestError("Current password is incorrect");
        }


        const { hashedPassword } = await hashPassword(newPassword);
        customer['password'] = hashedPassword;
        try {
            const result = await customer.update();
            if (result.success)
                return this.noContent();
            else
                throw new CustomError.BadRequestError(result.errors);
        } catch (err) {
            throw err;
        }
    }

    async updateAvatar() {
        if (!this.files[0]) {
            const customer = await Customer.findById(this.body.id);
            const avatarUrl = customer["avatar"];
            if (avatarUrl == null) {
                return this.ok({});
            }
            const avatarPublicId = avatarUrl.slice(avatarUrl.indexOf('webtech'), avatarUrl.lastIndexOf('.'));
            const result = await cloudinary.uploader.destroy(avatarPublicId);
            if (result.result === "ok") {
                await Customer.update({ id: this.body.id }, { avatar: null });
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
            await Customer.update({ id: this.body.id }, { avatar: result.secure_url });
        } catch (err) {
            throw err;
        }

        return this.ok({
            avatarSrc: result.secure_url
        });
    }
}

module.exports = ProfileController;