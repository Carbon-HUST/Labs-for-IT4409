const Book = require('../models/Book');
const BaseController = require('../framework/BaseController');
const BookAuthor = require('../models/BookAuthor');
const Author = require('../models/Author');
const BookGenre = require('../models/BookGenre');
const Genre = require('../models/Genre');
const Publisher = require('../models/Publisher');
const BookImages = require('../models/BookImages');
const CustomError = require('../framework').CustomError;
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

class BookController extends BaseController {
    async getBook() {
        // add author, publisher.
        const id = this.params.id;
        if(!id)
            throw new CustomError.BadRequestError("Invalid Id");

        const book = await Book.findById(id);
        if(!book)
            throw new CustomError.NotFoundError("Can not find this book");

        let bookauthors = await BookAuthor.where({book_id: id}).all();
        bookauthors = bookauthors.map(e => e['author_id']);

        let authors = []
        if(bookauthors.length > 0) {
            authors = await Author.where({
                id: {
                    operator: 'IN',
                    value: bookauthors
                }
            }).all();
        }
        

        let bookgenres = await BookGenre.where({book_id: id}).all();
        
        bookgenres = bookgenres.map(e => e['genre_id']);
        
        let genres = [];
        if(bookgenres.length > 0) {
            genres = await Genre.where({
                id: {
                    operator: 'IN',
                    value: bookgenres
                }
            }).all();
        }

        const publisher = await Publisher.findById(book['publisher_id']);   
        
        const images = await BookImages.where({book_id: id}).all();

        
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
            thumbnail: book['thumbnail'],
            images: images.map(elem => {return elem['image_url']})
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


    async createBook() {
        const {
            title,
            isbn,
            edition,
            stock,
            price,
            number_of_page,
            publisher_id,
            description,
        } = this.body;
        const authors = this.body.authors || [];
        const genres = this.body.genres || [];

        const book = await Book.create({isbn, title, edition, stock, price, number_of_page, publisher_id, description});
        
        if(!book.success)
            throw Error(book.errors);

        let bookId = book.insertedId;
        
        let authorIds = [];
        if(authors.length > 0) {
            authorIds = await Author.where({id: {
                operator: 'IN',
                value: authors
            }}).all();
            authorIds = authorIds.map(e => {return e['id']});
        }
        
        let genreIds = [];
        if(genres.length > 0) {
            genreIds = await Genre.where({id: {
                operator: 'IN',
                value: genres
            }}).all();
            genreIds = genreIds.map(e => {return e['id']});
        }

        for(let i = 0; i < authorIds.length; i++) {
            let addAuthor = await BookAuthor.create({book_id: bookId, author_id: authorIds[i]});
            if(!addAuthor.success) 
                throw new Error(addAuthor.errors);
        }

        for(let i = 0; i < genreIds.length; i++) {
            let addGrenres = await BookGenre.create({book_id: bookId, genre_id: genreIds[i]});
            if(!addGrenres.success)
                throw new Error(addGrenres.errors);
        }
        
        return this.ok({
            success: true,
            id: book.insertedId
        });
    }

    async updateThumbnail() {
        if(!this.files[0]) {
            const book = await Book.findById(this.params.id);
            const thumbnailUrl = book['thumbnail'];
            if(!thumbnailUrl)
                return this.ok({});

            const thumbnailPublicId = thumbnailUrl.slice(thumbnailUrl.indexOf('thumbnails'), thumbnailUrl.lastIndexOf('.'));
            const result = await cloudinary.uploader.destroy({thumbnailPublicId});
            if(result.result === 'ok') {
                const thumbnailUpdate = await Book.update({id: this.params.id}, {thumbnail: null});
                if(!thumbnailUpdate.success)
                    throw new Error(thumbnailUpdate.errors);
                return this.ok({result});
            }
            throw new Error("Something went wrong with the thumbnail");
        }

        const thumbnail = this.files[0];
        if (!thumbnail.file.mimetype.startsWith("image")) {
            throw new CustomError.BadRequestError("Thumbnail must be an image");
        }

        const newFilePath = path.join(__dirname, '..', 'framework', 'upload', thumbnail.file.newFilename);
        console.log(newFilePath);
        let result = null;
        try {

            result = await cloudinary.uploader.upload(
                newFilePath,
                {
                    use_filename: true,
                    folder: 'webtech/thumbnails',
                }
            );
        } catch (err) {
            console.log(err);
            throw err;
        }
        console.log(newFilePath);
        // fs.unlink(newFilePath, (err) => {
        //     if (err)
        //         throw err;
        // });


        try {
            await Book.update({ id: this.body.id }, { thumbnail: result.secure_url });
        } catch (err) {
            throw err;
        }

        return this.ok({
            thumbnailSrc: result.secure_url
        });

    }

    async updateBook() {
        let authors = this.body.authors || [];
        let genres = this.body.genres || [];

        console.log(authors);

        const book = await Book.findById(this.params.id);
        if(!book)
            throw new CustomError.NotFoundError("Cant find this book");
        
        delete this.body.id;
        delete this.body.authors;
        delete this.body.genres;
        console.log(this.body);

        let bookUpdateResult = await Book.update({id: this.params.id}, this.body);
        if(bookUpdateResult.success) {
            if(authors.length > 0) {
                authors = new Set(authors);
                authors = [...authors];
                console.log(authors);
                bookUpdateResult = await BookAuthor.delete({book_id: this.params.id});
                if(bookUpdateResult.success || typeof(bookUpdateResult.errors) === 'string') {
                    for(let i = 0; i < authors.length; i++) {
                        bookUpdateResult = await BookAuthor.create({book_id: this.params.id, author_id: authors[i]});
                        if(!bookUpdateResult.success)
                            throw new Error(bookUpdateResult.errors);
                    }
                }
                else 
                    throw new Error(bookUpdateResult.errors);
            }
            
            if(genres.length > 0) {
                genres = new Set(genres);
                genres = [...genres];
                bookUpdateResult = await BookGenre.delete({book_id: this.params.id});
                if(bookUpdateResult.success || typeof(bookUpdateResult.errors) === 'string') {
                    for(let i = 0; i < genres.length; i++) {
                        bookUpdateResult = await BookGenre.create({book_id: this.params.id, genre_id: genres[i]});
                        if(!bookUpdateResult.success)
                            throw new Error(bookUpdateResult.errors);
                    }
                } 
                else
                    throw new Error(bookUpdateResult.errors);
            }
        } else {
            throw new Error(bookUpdateResult.errors);
        }

        return this.noContent();
    }

    async deleteBook() {
        
    }

}

module.exports = BookController;