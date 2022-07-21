const { BaseController } = require("../framework");
const Admin = require('../models/Admin');
const CustomError = require('../framework').CustomError;
const { hashPassword, comparePassword } = require('../utils/password.utils');
const jwt = require('jsonwebtoken');


class AdminController extends BaseController {
    async login() {
        const { email, password } = this.body;

        if (!email || !password) {
            throw new CustomError.BadRequestError("Not enough information provided");
        }
        
        const admin = await Admin.where({email}).first();
        if (!admin) {
            throw new CustomError.BadRequestError("Invalid credentials");
        }

        if (!(await comparePassword(password, admin["password"]))) {
            throw new CustomError.BadRequestError("Invalid credentials");
        }

        const token = jwt.sign({
            id: admin["id"],
            role: "admin"
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME
        });

        return this.ok({
            success: true,
            accessToken: token
        });
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

        const admin = await Admin.where({id: this.body.id}).first();
        console.log(admin);
        if (!admin) {
            throw new CustomError.BadRequestError("Account not exist");
        }

        if (!(await comparePassword(currentPassword, admin["password"]))) {
            throw new CustomError.BadRequestError("Current password is incorrect");
        }

        const { hashedPassword } = await hashPassword(newPassword);
        admin['password'] = hashedPassword;
        try {
            const result = await admin.update();
            if(result.success)
                return this.noContent();
            else 
                throw new CustomError.BadRequestError(result.errors);
        } catch (err) {
            throw err;
        }
    
    }
}

module.exports = AdminController;