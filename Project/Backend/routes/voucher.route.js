const Router = require('../framework').Router;
const AdminAuthMiddleware = require('../middlewares/adminAuthentication');
const CustomerAuthMiddleWare = require('../middlewares/authentication');

Router.get('/admin/voucher', 'VoucherController#getAll', [AdminAuthMiddleware]);
Router.get('/admin/voucher/:voucherId', 'VoucherController#get', [AdminAuthMiddleware]);
Router.post('/admin/voucher', 'VoucherController#create', [AdminAuthMiddleware]);
Router.put('/admin/voucher', 'VoucherController#update', [AdminAuthMiddleware]);
Router.delete('/admin/voucher/:voucherId', 'VoucherController#delete', [AdminAuthMiddleware]);

Router.get('/vouchers', 'VoucherController#getVouchers', [CustomerAuthMiddleWare]);