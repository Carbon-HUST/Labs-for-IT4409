const pool = require('../config/db.config');
const { BaseModel } = require('../framework');
const { AttributeType, Validators } = require('../framework/ModelHelpers');

class Cart extends BaseModel {
    
    setup() {
        this.setTablename('cart');
        this.setAttribute('customer_id', AttributeType.Integer, [Validators.Required]);
    }


    async addProduct(customerId, productId, quantity) {
       // if cart has product --> find and update
       // else insert
    }
    
    async getProductsInCart(customerId, page, limit) {
        const skip = (page -1) * limit;

        const [rows] = await pool.query("SELECT book.*, cart_item.QUANTITY " + 
                                        "FROM book, cart_item, cart " +
                                        "WHERE cart.CUSTOMER_ID = ? AND " +
                                        "cart.ID = cart_item.CART_ID AND " +
                                        "cart_item.BOOK_ID = book.ID " +
                                        "LIMIT ? OFFSET ?", [customerId, parseInt(limit), parseInt(skip)]);
        
        return rows;
    }

    async changeProductQuantity() {
        // find and update
    }

    async removeProduct() {
        //delete
    }
}

module.exports = Cart;

