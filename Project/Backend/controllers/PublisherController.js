const BaseController = require('../framework').BaseController;
const pool = require('../config/db.config');

class PublisherController extends BaseController {
    
    async getAllPublisher() {
        console.log('PublisherController#getAllPublisher');
        const [rows] = pool.query('SELECT * FROM PUBLISHER');
        return this.ok({
            rows
        });
    }
}

module.exports = PublisherController;