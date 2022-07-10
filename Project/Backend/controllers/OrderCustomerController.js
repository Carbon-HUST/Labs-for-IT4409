const BaseController = require('../framework').BaseController;
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Book = require('../models/Book');
const CustomError = require('../framework').CustomError;

class OrderCustomerController extends BaseController {
    async getAll() {
        const id = this.body.id;
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const orders = await Order.where({ customer_id: id }).all();

        const count = orders.length;
        const totalPage = Math.floor(count / limit) + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnedOrders = orders.slice(skip, skip + limit);

        return this.ok({
            page,
            pageSize: limit,
            orders: returnedOrders,
            totalPage
        });
    }

    async get() {
        const id = this.body.id;
        const orderId = this.params.orderId;
        if (!orderId || orderId < 0) {
            throw new CustomError.BadRequestError("Order id is invalid");
        }

        const order = await Order.where({ id: orderId, customer_id: id }).first();
        if (order == null) {
            throw new CustomError.NotFoundError("Order not found");
        }

        const orderItems = await OrderItem.where({ order_id: orderId }).orderBy('book_id').all();
        const books = await Book.where({
            id: {
                operator: "IN",
                value: orderItems.map(item => item["book_id"])
            }
        }).orderBy('id').all();

        for (let i = 0; i < orderItems.length; ++i) {
            orderItems[i]["title"] = books[i]["title"];
            orderItems[i]["thumbnail"] = books[i]["thumbnail"];
            delete orderItems[i]["order_id"];
        }
        order.items = orderItems;

        if (order["voucher_id"] != null) {

        }

        if (order["payment_id"] != null) {

        }

        return this.ok(order);
    }

    async updateStatus() {
        const { id, orderId, status } = this.body;
        if (!orderId || !status) {
            throw new CustomError.BadRequestError("Order id or status is missing");
        }

        if (status === "APPROVED") {
            throw new CustomError.BadRequestError("You dont have right to change the order to this status");
        }
        const order = await Order.where({ customer_id: id, id: orderId }).first();
        if (order == null) {
            throw new CustomError.NotFoundError("Order not found");
        }

        if (order["status"] === "APPROVED") {
            throw new CustomError.BadRequestError("You cannot change status of this order");
        }
        if (order["status"] === status) {
            return this.noContent();
        }

        order["status"] = status;
        order["total"] = parseInt(order["total"]);
        const result = await order.update();
        if (result.success) {
            return this.noContent();
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }
}

module.exports = OrderCustomerController;