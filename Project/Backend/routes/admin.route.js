const authmiddleware = require('../middlewares/adminAuthentication')

const Router = require('../framework').Router;

Router.post('/admin/auth/login', 'AdminController#login');
Router.put('/admin/auth/changepassword', 'AdminController#changePassword', [authmiddleware]);
