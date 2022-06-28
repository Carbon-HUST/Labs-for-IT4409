const BaseController = require('../framework').BaseController;
const Order = require('../models/Order');
const Voucher = require('../models/Voucher');
const CustomError = require('../framework').CustomError;

class OrderController extends BaseController {
    async getAllOrders() {
        const id = this.body.orderId;

        if (id <= 0) {
            return new CustomError.BadRequestError("Order id is invalid");
        }

        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const orders = await Order.getAll(id);
        const count = orders.length;
        const totalPage = count / limit + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnOrders = orders.slice(skip, skip + limit);
        return this.ok({
            page,
            pageSize: limit,
            orders: returnOrders,
            totalPage
        });
    }

    async getOrder() {
        const customerId = this.body.id;
        const orderId = this.params.orderId;

        if (!customerId || customerId < 0) {
            return new CustomError.BadRequestError("Customer id is invalid");
        }

        if (!orderId || orderId < 0) {
            return new CustomError.BadRequestError("Order id is invalid");
        }
        
        const orders = await Order.getOrderById(orderId);
        if (orders.length === 0) {
            return new CustomError.NotFoundError("Order not found");
        }

        let order = orders[0];
        if (order["CUSTOMER_ID"] !== customerId) {
            return new CustomError.BadRequestError("You're not the owner of this order");
        }

        const itemsInOrder = await Order.getItemInOrder(orderId);
        order["ITEMS"] = itemsInOrder;

        if (order["VOUCHER_ID"] == "null") {
            order["VOUCHER"] = "null";
            return this.ok(order);
        }

        const voucher = (await Voucher.findById(order["VOUCHER_ID"]))[0];
        order["VOUCHER"] = {
            ID: voucher["ID"],
            NAME: voucher["NAME"],
            VALUE: voucher["VALUE"]
        }

        return this.ok(order);
    }

    async updateStatus() {
        const customerId = this.body.id;
        const orderId = this.params.orderId;

        if (!customerId || customerId < 0) {
            return new CustomError.BadRequestError("Customer id is invalid");
        }

        if (!orderId || orderId < 0) {
            return new CustomError.BadRequestError("Order id is invalid");
        }

        const order = await Order.getOrderById(orderId);
        if (order == null) {
            return new CustomError.NotFoundError("Order not found");
        }

        if (order["CUSTOMER_ID"] !== customerId) {
            return new CustomError.BadRequestError("You're not the owner of this order");
        }

        if (order["STATUS"] === "APPROVED" || order["STATUS"] === "CANCELLED") {
            return new CustomError.BadRequestError("This order's status cannot be changed");
        }

        const newStatus = this.body.status;
        if (!newStatus) {
            return new CustomError.BadRequestError("New status is missing");
        }

        if (newStatus != 1 && newStatus != 2 && newStatus != 3) {
            return new CustomError.BadRequestError("New status is invalid");
        }

        await Order.updateStatus(orderId, newStatus);
        return this.noContent();
    }
}

module.exports = OrderController;