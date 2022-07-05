const pool = require('../config/db.config');

class Cart {
    
    async create(id) {

        const row = await pool.query("SELECT * FROM cart WHERE cart.CUSTOMER_ID = ?", [id]);
        if(!row)
        {
            const cart = pool.query("INSERT INTO cart(CUSTOMER_ID) VALUES (?)", [id]);
            return cart;
        }
        return;
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

module.exports = new Cart();

