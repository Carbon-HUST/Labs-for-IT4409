const Router = require('../framework').Router;
const AuthMiddleware = require('../middlewares/authentication');
const AdminAuthMiddleware = require('../middlewares/adminAuthentication');

Router.get("/orders", "OrderCustomerController#getAll", [AuthMiddleware]);
Router.get("/orders/:orderId", "OrderCustomerController#get", [AuthMiddleware]);
Router.put("/orders/status", "OrderCustomerController#updateStatus", [AuthMiddleware]);

Router.get("/admin/orders", "OrderAdminController#getAll", [AdminAuthMiddleware]);
Router.get("/admin/orders/:orderId", "OrderAdminController#get", [AdminAuthMiddleware]);
Router.put("/admin/orders/status", "OrderAdminController#updateStatus", [AdminAuthMiddleware]);