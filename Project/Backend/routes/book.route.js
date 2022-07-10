const Router = require('../framework').Router;
const AdminAuthMiddleWare = require('../middlewares/adminAuthentication')

Router.get('/books', 'BookController#getBooks');
Router.get('/book/:id', 'BookController#getBook');
Router.get('/books/filter', 'BookController#filterBook');

Router.post('/admin/book', 'BookController#createBook',[AdminAuthMiddleWare]);
Router.put('/admin/book/:id', 'BookController#updateBook',[AdminAuthMiddleWare]);
Router.put('/admin/book/:id/thumbnail', 'BookController#updateBookThumbnail', [AdminAuthMiddleWare]);
Router.delete('/admin/book/:id', 'BookController#deleteBook', [AdminAuthMiddleWare]);