const BaseController = require('../framework').BaseController;
const TestCustomer = require('../models/TestCustomer');

class TestCustomerController extends BaseController {
    async get() {
        const customer =
            await TestCustomer.select(['id', 'name', 'email'])
                .where({ id: 1 })
                .first();
        console.log(customer);
        return this.ok({});
    }
}

module.exports = TestCustomerController;