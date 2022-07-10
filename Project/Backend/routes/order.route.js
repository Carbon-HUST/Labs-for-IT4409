const Router = require('../framework').Router;
const AuthMiddleware = require('../middlewares/authentication');

Router.get("/orders", "OrderCustomerController#getAll", [AuthMiddleware]);
Router.get("/orders/:orderId", "OrderCustomerController#get", [AuthMiddleware]);
Router.put("/orders/status", "OrderCustomerController#updateStatus", [AuthMiddleware]);