const Router = require('../framework').Router;

Router.get('/books', 'BookController#getBooks');
Router.get('/book/:id', 'BookController#getBook');
Router.get('/books/filter', 'BookController#filterBook');

// Router.get('/books/search', 'BookController#getBookByTitle');
// Router.get('/books/genre/:id','BookController#filterByGenre');
// Router.get('/books/author/:id', 'BookController#filterByAuthor');