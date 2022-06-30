const BaseModel = require('../framework/BaseModel');
const { AttributeType, Validators } = require('../framework/ModelHelpers');
class TestCustomer extends BaseModel {
    setup() {
        this.setAttribute("name");
        this.setAttribute("email");
        this.setAttribute("password");
        this.setAttribute("phone");
        this.setAttribute("gender");
        this.setAttribute("dob", AttributeType.Date);
        this._tableName = "customer";
    }
}

module.exports = TestCustomer;