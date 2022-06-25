const Router = require('../framework').Router;
const AuthMiddleware = require('../middlewares/authentication');

Router.get('/order', 'OrderController#getAllOrders', [AuthMiddleware]);
Router.get('/order/:orderId', 'OrderController#getOrder', [AuthMiddleware]);
Router.post('/order/:orderId/updatestatus', 'OrderController#updateStatus', [AuthMiddleware]);