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
        //console.log(id);
        if (!id || id < 0) {
            throw new CustomError.BadRequestError("Id is invalid");
        }
        const customer = await Customer.findById(id);
        if (!customer) {
            throw new CustomError.NotFoundError("Customer not found");
        }
        return this.ok({ result: customer });
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
        if (this.body.secure_url) {
            return this.ok({
                avatarSrc: this.body.secure_url
            });
        }

        const customer = await Customer.findById(this.body.id);
        const avatarUrl = customer["avatar"];

        if (avatarUrl != null) {
            const avatarPublicId = avatarUrl.slice(avatarUrl.indexOf('webtech'), avatarUrl.lastIndexOf('.'));
            await cloudinary.uploader.destroy(avatarPublicId);
        }

        if (!this.files[0])
            return this.noContent();

        const avatar = this.files[0];
        if (!avatar.file.mimetype.startsWith("image")) {
            throw new CustomError.BadRequestError("Avatar must be an image");
        }

        const newFilePath = path.join(__dirname, '..', '..', '..', '..', 'tmp', avatar.file.newFilename);
        //console.log(newFilePath);
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
            //console.log(err);
            throw err;
        }

        this.body.secure_url = result.secure_url;

        // fs.unlink(newFilePath, (err) => {
        //     if (err)
        //         throw err;
        // });

        fs.unlinkSync(newFilePath);

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