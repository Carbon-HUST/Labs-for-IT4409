const pool = require('../config/db.config');
const { BaseModel } = require('../framework');
const { AttributeType, Validators } = require('../framework/ModelHelpers');

class Cart extends BaseModel {
    
    setup() {
        this.setTablename('cart');
        this.setAttribute('customer_id', AttributeType.Integer, [Validators.Required]);
    }

    async getCartTotal() {
        let cartId = this.id;
        const [rows] = await pool.query('SELECT SUM(book.PRICE * cart_item.QUANTITY) AS total ' +
                                'FROM book, cart_item ' + 
                                'WHERE cart_item.BOOK_ID = book.ID ' + 
                                'AND cart_item.CART_ID = ?', [cartId]);
        
        let total = Number(rows[0].total);
        return total;
    }

}

module.exports = Cart;

