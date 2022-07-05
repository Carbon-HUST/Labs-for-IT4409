const Router = require('../framework').Router;
const AuthMiddleware = require('../middlewares/authentication');


// all routes need authmiddleware 
Router.get('/cart','CartController#getProductInCart',[AuthMiddleware]);
Router.post('/cart/')