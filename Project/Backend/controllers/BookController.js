const Book = require('../models/Book');
const BaseController = require('../framework/BaseController');
const BookAuthor = require('../models/BookAuthor');
const Author = require('../models/Author');
const BookGenre = require('../models/BookGenre');
const Genre = require('../models/Genre');
const Publisher = require('../models/Publisher');
const CustomError = require('../framework').CustomError;

class BookController extends BaseController {
    async getBook() {
        const id = this.params.id;
        if(!id)
            throw new CustomError.BadRequestError("Invalid Id");

        const book = await Book.findById(id);
        if(!book)
            throw new CustomError.NotFoundError("Can not find this book");

        const bookauthors = await BookAuthor.where({book_id: id}).all();
        let authorIds = [];
        bookauthors.forEach(e => {
            authorIds.push(e['author_id']);
        })
        const authors = await Author.where({
            id: {
                operator: 'IN',
                value: authorIds
            }
        }).all();

        const bookgenres = await BookGenre.where({book_id: id}).all();
        let genreIds = [];
        bookgenres.forEach(e => {
            genreIds.push(e['genre_id']);
        });
        const genres = await Genre.where({
            id: {
                operator: 'IN',
                value: genreIds
            }
        }).all();

        const publisher = await Publisher.findById(book['publisher_id']);        
        
        let result = {
            id: id,
            isbn: book['isbn'],
            title: book['title'],
            description: book['description'],
            edition: book['edition'],
            authors: authors.map(elem => { return elem['name']}),
            genres: genres.map(elem => { return elem['name']}),
            publisher: publisher['name'],
            stock: book['stock'],
            price: book['price'],
            number_of_page: book['number_of_page'],
            thumbnail: book['thumbnail']
        }

        return this.ok({result});
    }


    async getBooks() {
        let page = this.query.page || 1;
        const limit = parseInt(this.query.limit) || 10;
        
        const books = await Book.where().all();
        if(books == null)
            throw new CustomError.NotFoundError("Can not get all books");
        
        const totalPage = Math.floor(books.length / limit) + ((books.length % limit == 0) ? 0 : 1);
        if(page < 0||page > totalPage) page = 1;
        const offset = (page - 1) * limit;

        let results = books.slice(offset, offset + limit).map(e => {
            return {
                id: e['id'],
                title: e['title'],
                description: e['description'],
                thumbnail: e['thumbnail'],
                price: e['price']
            };
        });

        return this.ok({
            page,
            pageSize: limit,
            totalPage,
            results
        });
    }


    async filterBook() {
        const searchText = this.query.searchText || "";
        let page = this.query.page || 1;
        const limit = parseInt(this.query.limit) || 10;

        const genreIds = this.body.genres || [];
        const authorIds = this.body.authors || [];

        let filterByTitle = await Book.where({title: {
            operator: 'LIKE',
            value: `%${searchText}%`
        }}).all();
        
        let filterByAuthor = [];
        if(authorIds.length > 0) {
            filterByAuthor = await BookAuthor.where({author_id: {
                operator: 'IN',
                value: authorIds
            }}).all();
        }

        let filterByGenre = [];
        if(genreIds.length > 0) {
            filterByGenre = await BookGenre.where({genre_id: {
                operator: 'IN',
                value: genreIds
            }}).all();
        }

        if(filterByTitle.length === 0)
            return this.ok({result: filterByTitle});
        
        let results = [];
        
        let filterIds = [];
        filterIds = filterIds.concat(filterByAuthor.map(e => {return e['book_id'];}));
        filterIds = filterIds.concat(filterByGenre.map(e => {return e['book_id'];}));
        filterIds = new Set(filterIds);
        console.log(filterIds);
        
        for(let i = 0; i < filterByTitle.length; i++)
        {
            if(filterIds.has(filterByTitle[i]['id'])) {
                results.push({
                    id: filterByTitle[i]['id'],
                    title: filterByTitle[i]['title'],
                    description: filterByTitle[i]['description'],
                    thumbnail: filterByTitle[i]['thumbnail']
                })
            }
        }
         
        if(authorIds.length === 0 && genreIds.length === 0) {
            results = filterByTitle.map(e => { return {
                id: e['id'],
                title: e['title'],
                description: e['description'],
                thumbnail: e['thumbnail']
            }});
        }
        
        const totalPage = Math.floor(results.length / limit) + ((results.length % limit == 0) ? 0 : 1);
        if(page <= 0 ||page > totalPage) page = 1;
        let offset = (page - 1) * limit;
        
        const returnResults = results.slice(offset, offset + limit);
        
        return this.ok({
            page: page,
            pageSize: limit,
            totalPage: totalPage,
            returnResults
        });
    }

}

module.exports = BookController;