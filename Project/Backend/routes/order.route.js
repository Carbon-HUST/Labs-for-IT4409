const Router = require('../framework').Router;
const AuthMiddleware = require('../middlewares/authentication');

Router.get('/order', 'OrderController#getAllOrders', [AuthMiddleware]);