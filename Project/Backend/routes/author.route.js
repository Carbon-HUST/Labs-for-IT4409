const Router = require('../framework').Router;

Router.get('/admin/author', 'AuthorController#getAll');
Router.get('/admin/author/:authorId', 'AuthorController#get');
Router.post('/admin/author', 'AuthorController#create');
Router.put('/admin/author', 'AuthorController#update');
Router.delete('/admin/author/:authorId', 'AuthorController#delete');