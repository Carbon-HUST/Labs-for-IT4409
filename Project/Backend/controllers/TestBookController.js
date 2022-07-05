const BaseController = require('../framework').BaseController;
const TestBook = require('../models/TestBook');

class TestBookController extends BaseController {
    async get()
    {
        const result = await TestBook.where({
            title: {
                operator: 'LIKE',
                value: "%potter%"
            }
        }).all();
        console.log(result);
        return this.ok({result});
    }
}


module.exports = TestBookController;