const BaseController = require('../framework').BaseController;

class HomeController extends BaseController {
    async index() {
        console.log('HomeController#index called from the controller');
        return this.ok({
            msg: 'HomeController#index called from the controller'
        });
    }
}

module.exports = HomeController;