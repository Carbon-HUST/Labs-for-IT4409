const BaseController = require('../framework').BaseController;
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Book = require('../models/Book');
const Customer = require('../models/Customer');
const CustomError = require('../framework').CustomError;

class OrderAdminController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const orders = await Order.where().all();

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
        const orderId = this.params.orderId;
        if (!orderId || orderId < 0) {
            throw new CustomError.BadRequestError("Author id is invalid");
        }

        const order = await Order.findById(orderId);
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

        const customer = await Customer.findById(order["customer_id"]);
        if (customer == null) {
            throw new Error("Something went wrong. Please try again");
        }

        order.customer = customer;
        delete order["customer_id"];

        return this.ok(order);
    }

    async updateStatus() {
        const { orderId, status } = this.body;
        if (!orderId || !status) {
            throw new CustomError.BadRequestError("Order id or status is missing");
        }

        const order = await Order.findById(orderId);
        if (order == null) {
            throw new CustomError.NotFoundError("Order not found");
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

module.exports = OrderAdminController;