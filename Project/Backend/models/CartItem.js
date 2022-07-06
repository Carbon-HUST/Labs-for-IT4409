const { BaseModel } = require("../framework");
const { AttributeType, Validators } = require("../framework/ModelHelpers");

class CartItem extends BaseModel {
    setup() {
        this.setTablename('cart_item');
        this.setAttribute('cart_id', AttributeType.Integer, [Validators.Required]);
        this.setAttribute('book_id', AttributeType.Integer, [Validators.Required]);
        this.setAttribute('quantity', AttributeType.Integer, [Validators.Required, Validators.InRange(0, Infinity)]);
    }
}

module.exports = CartItem;
