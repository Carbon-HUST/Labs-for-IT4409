const BaseController = require('../framework').BaseController;
const Order = require('../models/Order');
const Voucher = require('../models/Voucher');
const CustomError = require('../framework').CustomError;

class OrderController extends BaseController {
    async getAllOrders() {
        const id = this.body.id;

        if (id <= 0) {
            return new CustomError.BadRequestError("ID is invalid");
        }

        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const orders = await Order.getAll(id);
        const count = orders.length;
        const totalPage = count / limit + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnOrders = orders.slice(skip, skip + limit);
        return this.ok(returnOrders);
    }

    async getOrder() {
        const customerId = this.body.id;
        const orderId = this.params.orderId;
        
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
}

module.exports = OrderController;