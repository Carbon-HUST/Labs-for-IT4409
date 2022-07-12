const BaseController = require('../framework').BaseController;
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Book = require('../models/Book');
const Customer = require('../models/Customer');
const Voucher = require('../models/Voucher');
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

        if (order['status'] === 'APPROVED')
            throw new CustomError.BadRequestError('Can not change the status of this order');

        if (order['status'] === 'CANCELLED')
            throw new CustomError.BadRequestError('Order is already cancelled');

        if (order["status"] === status) {
            return this.noContent();
        }

        if (status === 'CANCELLED') {
            if (order['voucher_id']) {
                let voucher = await Voucher.findById(order['voucher_id']);
                if(voucher) {
                    voucher['stock'] += 1;
                    voucher['min_cart_total'] = Number(voucher['min_cart_total']);
                    await voucher.update();
                }
            }

            let orderItems = await OrderItem.where({order_id: orderId}).orderBy('book_id').all();
            let bookIds = orderItems.map(e => e['book_id']);
    
            let books = await Book.where({
                id: {
                    operator: 'IN',
                    value: bookIds
                }
            }).all();
            
            for(let i = 0; i < books.length; i++)
            {
               books[i]['stock'] += orderItems[i]['quantity'];
               await books[i].update();
            }
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

    async getRevenueByTimeRange() {
        let startTime = this.body.startTime;
        let endTime = this.body.endTime;
        
        let unixEnd = new Date(endTime);
        let unixStart = new Date(startTime);
        if(!startTime || !endTime || Number.isNaN(unixEnd) || Number.isNaN(unixStart) || (unixEnd < unixStart))
            throw new CustomError.BadRequestError("Invalid time range");
        
        let orders = await Order.where({
            time: {
                operator: 'BETWEEN',
                value: [startTime, endTime]
            }, 
            status: "APPROVED"
        }).orderBy('time').all();
        
        console.log(orders)
        console.log(orders[0]['time'].getMonth());
        let monthlyTotal = 0;
        let totalPerMonth = [];
        
        let iterDate = unixStart;
        for(let i = 0; i < orders.length; i++) {
            let orderTime = new Date(orders[i]['time']);

            if(iterDate.getMonth() === orderTime.getMonth()) {
                monthlyTotal += Number(orders[i]['total']);
            } else {
                totalPerMonth.push({
                    year: iterDate.getFullYear(),
                    month: iterDate.getMonth() + 1,
                    total: monthlyTotal
                });
                monthlyTotal = 0;
                iterDate.setMonth(iterDate.getMonth() + 1);
                i--;
            }
            
        }
        totalPerMonth.push({
            year: iterDate.getFullYear(),
            month: iterDate.getMonth() + 1,
            total: monthlyTotal
        });
        iterDate.setDate(1);
        while(iterDate <= unixEnd) {
            totalPerMonth.push({
                year: iterDate.getFullYear(),
                month: iterDate.getMonth() + 1,
                total: 0
            });
            iterDate.setMonth(iterDate.getMonth() + 1);
        }
        


        let total = orders.reduce((acc, curr) => acc + Number(curr['total']), 0)
        
        return this.ok({
            total,
            numberOfOrder: orders.length,
            monthlyTotal: totalPerMonth
        }); 
    }

    // get total revenue or yearly revenue
    async getRevenue() {
        let year = this.query.year;
        const orders = await Order.where({status: 'APPROVED'}).all();
        if(!year) {
            let totalRevenue = orders.reduce((acc, curr) => acc + Number(curr['total']), 0);
            return this.ok({
                totalRevenue
            });
        }

        let yearlyRevenue = orders.reduce(
            function(acc, curr) {
                if(curr['time'].getFullYear() === Number(year))
                    acc += Number(curr['total']);
                return acc;
            }, 0);
        
        return this.ok({
            year,
            revenue: yearlyRevenue
        })
        
    }

}

module.exports = OrderAdminController;