const Router = require('../framework').Router;

Router.get('/posts', 'PostsController#index');
Router.get('/posts/:id', 'PostsController#show');
Router.post('/posts', 'PostsController#create');
Router.post('/posts/upload', 'PostsController#upload');