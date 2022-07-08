const Router = require('../framework').Router;

Router.get('/books', 'BookController#getBooks');
Router.get('/book/:id', 'BookController#getBook');
Router.get('/books/filter', 'BookController#filterBook');
