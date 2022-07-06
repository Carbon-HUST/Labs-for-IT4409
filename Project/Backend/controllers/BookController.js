const Book = require('../models/Book');
const BaseController = require('../framework/BaseController');
const CustomError = require('../framework').CustomError;

class BookController extends BaseController {
    async getBook() {
        const id = this.params.id;
        if(!id)
            throw new CustomError.BadRequestError("Invalid Id");

        const results = await Book.findById(id);
        
        if(results == null)
            throw new CustomError.NotFoundError("Can not find this book");
        
        return this.ok({results});
    }


    async getBooks() {
        const page = this.query.page || 1;
        const limit = this.query.limit || 10;
        const offset = (page - 1) * limit;
        
        const results = await Book.where().limit(parseInt(limit)).skip(offset).all();
        
        

        if(results == null)
            throw new CustomError.NotFoundError("Can not get all books");
        

        return this.ok({results, nbHits: results.length});
    }

    async getBookByTitle() {
        const page = this.query.page || 1 ;
        const limit = this.query.limit || 10;
        const offset = (page - 1) * limit;
        let title = this.query.title || "";

        const results = await Book.where({title: {
            operator: "LIKE",
            value: `%${title}%`
        }}).limit(parseInt(limit)).skip(offset).all();
        
        return this.ok({results, nbHits: results.length});
    }


    async filterByGenre() {
        const id = this.params.id;
        const page = this.query.page || 1 ;
        const limit = this.query.limit || 10;

        const results = await Book.filterByGenre(id, page, limit);
        return this.ok({results, nbHits: results.length});
    }


    async filterByAuthor() {
        const id = this.params.id;
        const page = this.query.page || 1;
        const limit = this.query.limit || 10;

        const results = await Book.filterByAuthor(id, page, limit);
        return this.ok({results, nbHits: results.length});
    }
}

module.exports = BookController;