const Router = require('../framework').Router;
const AdminAuthenticationMiddleware = require('../middlewares/adminAuthentication');

Router.get('/admin/author', 'AuthorController#getAll');
Router.get('/admin/author/:authorId', 'AuthorController#get');
Router.post('/admin/author', 'AuthorController#create', [AdminAuthenticationMiddleware]);
Router.put('/admin/author', 'AuthorController#update', AdminAuthenticationMiddleware);
Router.delete('/admin/author/:authorId', 'AuthorController#delete', AdminAuthenticationMiddleware);