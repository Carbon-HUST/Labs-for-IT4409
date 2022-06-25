const BaseController = require('../framework').BaseController;
const Order = require('../models/Order');
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
}

module.exports = OrderController;