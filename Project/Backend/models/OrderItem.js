const BaseModel = require('../framework').BaseModel;
const { AttributeType, Validators } = require('../framework/ModelHelpers');

class OrderItem extends BaseModel {
    setup() {
        this.setTablename("order_item");
        this.setAttribute("order_id", AttributeType.Integer, [Validators.Required]);
        this.setAttribute("book_id", AttributeType.Integer, [Validators.Required]);
        this.setAttribute("quantity", AttributeType.Integer, [Validators.Required, Validators.InRange(0, Infinity)]);
        this.setAttribute("unit_price", AttributeType.Decimal, [Validators.Required, Validators.InRange(0, Infinity)]);
    }
}

module.exports = OrderItem;