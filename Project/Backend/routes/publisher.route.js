const Router = require('../framework').Router;
const AdminAuthMiddleware = require('../middlewares/adminAuthentication');

Router.get('/admin/publisher', 'PublisherController#getAll');
Router.get('/admin/publisher/:publisherId', 'PublisherController#get');
Router.post('/admin/publisher', 'PublisherController#create', [AdminAuthMiddleware]);
Router.put('/admin/publisher', 'PublisherController#update', [AdminAuthMiddleware]);
Router.delete('/admin/publisher/:publisherId', 'PublisherController#delete', [AdminAuthMiddleware]);