const BaseController = require('../framework').BaseController;
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Book = require('../models/Book');
const Cart = require('../models/Cart');
const Voucher = require('../models/Voucher');
const CartItem = require('../models/CartItem');
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
            results: returnedOrders,
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
            let voucher = await Voucher.findById(order['voucher_id']);
            if (voucher) {
                order['voucher_name'] = voucher['name'];
                order['voucher_value'] = voucher['value'];
            }
        }

        return this.ok({ result: order });
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

        if (order['status'] === 'CANCELLED')
            throw new CustomError.BadRequestError('Order is already cancelled');

        if (order['voucher_id']) {
            let voucher = await Voucher.findById(order['voucher_id']);
            if (voucher) {
                voucher['stock'] += 1;
                voucher['min_cart_total'] = Number(voucher['min_cart_total']);
                await voucher.update();
            }
        }

        let orderItems = await OrderItem.where({ order_id: orderId, customer_id: id }).orderBy('book_id').all();
        let bookIds = orderItems.map(e => e['book_id']);

        let books = await Book.where({
            id: {
                operator: 'IN',
                value: bookIds
            }
        }).all();

        for (let i = 0; i < books.length; i++) {
            books[i]['stock'] += orderItems[i]['quantity'];
            await books[i].update();
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

    async createOrder() {
        let voucherId = this.body.voucherId || null;
        let address = this.body.address;
        const cart = await Cart.where({ customer_id: this.body.id }).first();
        if (!cart)
            throw new CustomError.BadRequestError('Cant access cart');

        let total = await cart.getCartTotal();
        if (total === 0)
            throw new CustomError.BadRequestError("Cart empty");

        if (!address)
            throw new CustomError.BadRequestError("Please provide address");

        if (voucherId) {
            const voucher = await Voucher.findById(voucherId);
            if (!voucher)
                throw new CustomError.BadRequestError("Invalid Voucher");

            if (voucher.applicable(total, Date.now())) {
                total -= total * voucher['value'] / 100;
                voucher['stock'] -= 1;
                voucher['min_cart_total'] = Number(voucher['min_cart_total']);

                const voucherUpdateResult = await voucher.update();
                if (!voucherUpdateResult.success)
                    throw new Error(voucherUpdateResult);
            } else {
                throw new CustomError.BadRequestError("Invalid Voucher");
            }
        }

        let cartItems = await CartItem.where({ cart_id: cart['id'] }).orderBy('book_id').all();

        let books = await Book.where({
            id: {
                operator: 'IN',
                value: cartItems.map(e => e['book_id'])
            }
        }).all();
        let now = new Date();
        let orderCreate = await Order.create({
            time: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
            total: total,
            voucher_id: voucherId,
            address,
            customer_id: this.body.id
        });
        if (!orderCreate.success)
            throw new Error(orderCreate.errors);

        let orderId = orderCreate.insertedId;
        for (let i = 0; i < books.length; i++) {
            orderCreate = await OrderItem.create({
                order_id: orderId,
                book_id: books[i]['id'],
                quantity: cartItems[i]['quantity'],
                unit_price: Number(books[i]['price'])
            });
            if (!orderCreate.success)
                throw new Error(orderCreate.errors);
        }
        orderCreate = await CartItem.delete({ cart_id: cart['id'] });
        if (!orderCreate.success)
            throw new Error(orderCreate.errors);

        return this.created({ insertedId: orderCreate.insertedId });
    }

}

module.exports = OrderCustomerController;