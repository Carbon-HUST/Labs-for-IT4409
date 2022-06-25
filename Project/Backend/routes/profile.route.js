const Router = require('../framework').Router;
const AuthMiddleware = require('../middlewares/authentication');

Router.get('/profile', 'ProfileController#getProfile', [AuthMiddleware]);
Router.put('/profile/update', 'ProfileController#updateProfile', [AuthMiddleware]);
Router.put('/profile/changepassword', 'ProfileController#changePassword', [AuthMiddleware]);
Router.put('/profile/avatar', 'ProfileController#updateAvatar', [AuthMiddleware]);