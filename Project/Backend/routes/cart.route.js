const Router = require('../framework').Router;
const AuthMiddleware = require('../middlewares/authentication');


// all routes need authmiddleware 
Router.get('/cart/products','CartController#getProductInCart',[AuthMiddleware]);
Router.delete('/cart/products/remove/:id','CartController#removeProduct', [AuthMiddleware]);
Router.put('/cart/quantity/product/:id', 'CartController#changeProductQuantity', [AuthMiddleware]);
Router.post('/cart/add/product/:id', 'CartController#addProduct', [AuthMiddleware]);