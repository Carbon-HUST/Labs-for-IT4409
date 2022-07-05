const Cart = require('../models/Cart');
const Book = require('../models/Book');
const BaseController = require('../framework/BaseController');
const CustomError = require('../framework').CustomError;

class CartController extends BaseController {
    async addProduct() {
        const customerId = this.body.id;
        const productId = this.query.productId;
        const quantity = this.query.productId || 1;

    }

    async getProductInCart() {
        const customerId = this.body.id;
        const page = this.query.page || 1;
        const limit = this.query.limit || 10;
        
        if(!customerId)
            return new CustomError.BadRequestError("Can't access cart");
        
        let results = await Cart.getProductsInCart(customerId, page, limit);
        return this.ok({results});
    }
}

module.exports = CartController;