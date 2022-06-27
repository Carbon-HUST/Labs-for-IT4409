const BaseController = require('../framework').BaseController;
const Voucher = require('../models/Voucher');
const CustomError = require('../framework').CustomError;

class VoucherController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const vouchers = await Voucher.getAll();

        const count = vouchers.length;
        const totalPage = Math.floor(count / limit) + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnVouchers = vouchers.slice(skip, skip + limit);
        return this.ok({
            page,
            pageSize: limit,
            vouchers: returnVouchers,
            totalPage
        });
    }

    async get() {
        const voucherId = this.params.voucherId;
        if (!voucherId ||voucherId < 0) {
            throw new CustomError.BadRequestError("Voucher id is invalid");
        }

        const voucher = await Voucher.findById(voucherId);
        if (voucher == null) {
            throw new CustomError.NotFoundError("Voucher not found");
        }

        return this.ok(voucher);
    }

    async create() {
        const {
            name: voucherName,
            start,
            end,
            value,
            stock,
            description,
        } = this.body;

        if (!voucherName || !start || !end || !value || (!stock && stock != 0) || !description) {
            throw new CustomError.BadRequestError("Not enough information provided");
        }

        const startDate = Date.parse(start);
        const endDate = Date.parse(end);
        if (!startDate || !endDate) {
            throw new CustomError.BadRequestError("Start time or end time is invalid");
        }

        if (startDate >= endDate) {
            throw new CustomError.BadRequestError("Start time must be before end time");
        }

        const minCartTotal = this.body["min_cart_total"] || 0;
        const usagePerCustomer = this.body["usage_per_customer"] || null;

        const insertedId = await Voucher.create(voucherName, start, end, value, stock, description, minCartTotal, usagePerCustomer);
        if (insertedId) {
            return this.created({ insertedId });
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async update() {
        const voucherId = this.body.voucherId;

        if (!voucherId) {
            throw new CustomError.BadRequestError("Voucher's id is missing");
        }

        const updatingVoucher = await Voucher.findById(voucherId);
        if (updatingVoucher == null) {
            throw new CustomError.BadRequestError("Voucher not found");
        }

        let startTime = null;
        if (this.body.start) {
            startTime = Date.parse(this.body.start);
            if (!startTime) {
                throw new CustomError.BadRequestError("Start time is invalid format");
            }
        }

        let endTime = null;
        if (this.body.end) {
            endTime = Date.parse(this.body.end);
            if (!endTime) {
                throw new CustomError.BadRequestError("End time is invalid format");
            }
        }

        if (startTime || endTime) {
            if (startTime == null) {
                startTime = Date.parse(updatingVoucher["START"]);
            } else {
                endTime = Date.parse(updatingVoucher["END"]);
            }

            if (startTime >= endTime) {
                throw new CustomError.BadRequestError("Start time must be before end time");
            }
        }

        let updatingProperties = {};
        for (let key in this.body) {
            if (key != "id" && key != "voucherId") {
                updatingProperties[key] = this.body[key];
            }
        }

        if (await Voucher.update(voucherId, updatingProperties)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async delete() {
        const voucherId = this.params.voucherId;
        if (!voucherId) {
            return new CustomError.BadRequestError("Voucher's name is missing");
        }

        if ((await Voucher.findById(voucherId)) == null) {
            throw new CustomError.BadRequestError("Voucher not found");
        }

        if (await Voucher.delete(voucherId)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }
}

module.exports = VoucherController;