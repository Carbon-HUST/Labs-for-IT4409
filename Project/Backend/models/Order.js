const BaseModel = require('../framework').BaseModel;
const { AttributeType, Validators } = require('../framework/ModelHelpers');

class Order extends BaseModel {
    setup() {
        this.setTablename("order_");
        this.setAttribute("time", AttributeType.DateTime, [Validators.Required, Validators.DateTime]);
        this.setAttribute("status", AttributeType.String, [
            Validators.Required,
            Validators.Enum(["PENDING", "APPROVED", "CANCELLED"])
        ], "PENDING");
        this.setAttribute("total", AttributeType.Decimal, [Validators.Required, Validators.InRange(0, Infinity)]);
        this.setAttribute("voucher_id", AttributeType.Integer);
        this.setAttribute("address", AttributeType.String, [Validators.Required, Validators.MaxLength(255)]);
        this.setAttribute("customer_id", AttributeType.Integer, [Validators.Required]);
    }
}

module.exports = Order;