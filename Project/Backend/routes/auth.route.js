const Router = require('../framework').Router;

Router.post('/auth/register', 'AuthController#register');
Router.post('/auth/login', 'AuthController#login');
