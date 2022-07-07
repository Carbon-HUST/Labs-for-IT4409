const pool = require('../config/db.config');
const { BaseModel } = require('../framework');
const { AttributeType, Validators } = require('../framework/ModelHelpers');

class Cart extends BaseModel {
    
    setup() {
        this.setTablename('cart');
        this.setAttribute('customer_id', AttributeType.Integer, [Validators.Required]);
    }
}

module.exports = Cart;

