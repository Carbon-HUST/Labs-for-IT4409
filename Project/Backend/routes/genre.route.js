const Router = require('../framework').Router;
const AdminAuthMiddleware = require('../middlewares/adminAuthentication');

Router.get('/admin/genre', 'GenreController#getAll');
Router.get('/admin/genre/:genreId', 'GenreController#get');
Router.post('/admin/genre', 'GenreController#create', [AdminAuthMiddleware]);
Router.put('/admin/genre', 'GenreController#update', [AdminAuthMiddleware]);
Router.delete('/admin/genre/:genreId', 'GenreController#delete', [AdminAuthMiddleware]);