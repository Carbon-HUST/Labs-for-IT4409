const BaseController = require('../framework').BaseController;
const Cart = require('../models/Cart');
const Voucher = require('../models/Voucher');
const CustomError = require('../framework').CustomError;

class VoucherController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const vouchers = await Voucher.where().all();

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
        if (!voucherId) {
            throw new CustomError.BadRequestError("Voucher id is invalid");
        }

        const voucher = await Voucher.findById(voucherId);
        if (voucher == null) {
            throw new CustomError.NotFoundError("Voucher not found");
        }

        return this.ok(voucher);
    }

    async create() {
        const result = await Voucher.create(this.body);
        if (result.success) {
            return this.created({ insertedId: result.insertedId });
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
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

        delete this.body['id'];
        updatingVoucher._setAttributeValues(this.body);
        updatingVoucher['min_cart_total'] = parseInt(updatingVoucher['min_cart_total']);

        const result = await updatingVoucher.update();
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Voucher not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    async delete() {
        const voucherId = this.params.voucherId;
        if (!voucherId) {
            return new CustomError.BadRequestError("Voucher's name is missing");
        }

        const result = await Voucher.delete({ id: voucherId });
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Voucher not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    // Get valid voucher (for client)
    async getVouchers() {
        const cart = await Cart.where({customer_id: this.body.id}).first();
        if(!cart)
            throw new CustomError.BadRequestError('Cant access cart');
        let total = await cart.getCartTotal();
        console.log(total);
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const now = new Date();

        const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

        const vouchers = await Voucher.where({
            min_cart_total: {
                operator: '<=',
                value: total
            },
            start: {
                operator: '<',
                value: date
            },
            end: {
                operator: '>',
                value: date
            },
            stock: {
                operator: '>',
                value: 0
            }
        }).all();

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



}

module.exports = VoucherController;