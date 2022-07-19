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
        if (!id)
            throw new CustomError.BadRequestError("Invalid Id");

        const book = await Book.findById(id);
        if (!book)
            throw new CustomError.NotFoundError("Can not find this book");

        let bookauthors = await BookAuthor.where({ book_id: id }).all();
        bookauthors = bookauthors.map(e => e['author_id']);

        let authors = []
        if (bookauthors.length > 0) {
            authors = await Author.where({
                id: {
                    operator: 'IN',
                    value: bookauthors
                }
            }).all();
        }

        let bookgenres = await BookGenre.where({ book_id: id }).all();

        bookgenres = bookgenres.map(e => e['genre_id']);

        let genres = [];
        if (bookgenres.length > 0) {
            genres = await Genre.where({
                id: {
                    operator: 'IN',
                    value: bookgenres
                }
            }).all();
        }

        const publisher = await Publisher.findById(book['publisher_id']);

        const images = await BookImages.where({ book_id: id }).all();


        let result = {
            id: id,
            isbn: book['isbn'],
            title: book['title'],
            description: book['description'],
            edition: book['edition'],
            authors: authors.map(elem => {
                return {
                    id: elem['id'],
                    name: elem['name']
                }
            }),
            genres: genres.map(elem => {
                return {
                    id: elem['id'],
                    name: elem['name']
                }
            }),
            publisher: {
                id: publisher['id'],
                name: publisher['name']
            },
            stock: book['stock'],
            price: book['price'],
            number_of_page: book['number_of_page'],
            thumbnail: book['thumbnail'],
            images: images.map(elem => { return { id: elem['id'], url: elem['image_url'] } })
        }

        return this.ok({ result });
    }


    async getBooks() {
        let page = this.query.page || 1;
        const limit = parseInt(this.query.limit) || 10;

        const books = await Book.where().all();
        if (books == null)
            throw new CustomError.NotFoundError("Can not get all books");

        const totalPage = Math.floor(books.length / limit) + ((books.length % limit == 0) ? 0 : 1);
        if (page < 0 || page > totalPage) page = 1;
        const offset = (page - 1) * limit;

        let bookResults = books.slice(offset, offset + limit);

        // let bookIds = bookResults.map(e => e['id']);
        // let bookauthors = await BookAuthor.where({
        //     book_id: {
        //         operator: 'IN',
        //         value: bookIds
        //     }
        // }).orderBy('book_id').all();



        for (let i = 0; i < bookResults.length; i++) {
            let bookauthors = await BookAuthor.where({ book_id: bookResults[i]['id'] }).all();
            let authorIds = bookauthors.map(e => e['author_id']);
            let authors = [];
            if (bookauthors.length > 0) {
                authors = await Author.where({
                    id: {
                        operator: 'IN',
                        value: authorIds
                    }
                }).all();

                authors = authors.map(e => e['name']);
            }
            bookResults[i].authors = authors;

            let bookgenres = await BookGenre.where({ book_id: bookResults[i]['id'] }).all();
            bookgenres = bookgenres.map(e => e['genre_id']);
            let genres = [];
            if (bookgenres.length > 0) {
                genres = await Genre.where({
                    id: {
                        operator: 'IN',
                        value: bookgenres
                    }
                }).all();

                genres = genres.map(e => e['name']);
            }
            bookResults[i].genres = genres;

        }

        let results = bookResults.map(e => {
            return {
                id: e['id'],
                title: e['title'],
                description: e['description'],
                thumbnail: e['thumbnail'],
                price: e['price'],
                authors: e['authors'],
                genres: e['genres']
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

        const genreIds = this.body.genres || null;
        const authorIds = this.body.authors || null;

        let filterByAuthor = [];
        if (authorIds != null) {
            console.log('book_author');
            filterByAuthor = await BookAuthor.where({ author_id: authorIds }).all();
        }

        let filterByGenre = [];
        if (genreIds != null) {
            console.log('book_genre');
            filterByGenre = await BookGenre.where({ genre_id: genreIds }).all();
        }

        let filterIds = [];
        filterIds = filterIds.concat(filterByAuthor.map(e => { return e['book_id']; }));
        filterIds = filterIds.concat(filterByGenre.map(e => { return e['book_id']; }));
        if (authorIds != null && genreIds != null) {
            filterIds = filterIds.filter((e, i, filterIds) => filterIds.indexOf(e) !== i);
        }

        if (filterIds.length === 0) {
            return this.ok({
                page,
                pageSize: limit,
                totalPage: 0,
                results: []
            });
        }

        let filterBooks = [];
        filterBooks = await Book.where({
            id: {
                operator: 'IN',
                value: filterIds
            },
            title: {
                operator: 'LIKE',
                value: `%${searchText}%`
            }
        }).all();

        if (filterBooks.length === 0) {
            return {
                page,
                pageSize: limit,
                totalPage: 0,
                results: []
            }
        }

        let results = [];

        let author = null;
        if (authorIds != null) {
            author = await Author.findById(authorIds);
        }
        if (author != null) {
            filterBooks.forEach(e => {
                results.push({
                    id: e['id'],
                    title: e['title'],
                    thumbnail: e['thumbnail'],
                    price: e['price'],
                    authors: author['name']
                })
            });
        } else {
            for (let book of filterBooks) {
                let bookauthors = await BookAuthor.where({ book_id: book['id'] }).first();
                let authors = null;
                if (bookauthors != null) {
                    authors = await Author.findById(bookauthors['author_id']);
                }
                results.push({
                    id: book['id'],
                    title: book['title'],
                    thumbnail: book['thumbnail'],
                    price: book['price'],
                    authors: (authors != null) ? authors['name'] : null
                })
            }
        }

        const totalPage = Math.floor(results.length / limit) + ((results.length % limit == 0) ? 0 : 1);
        if (page <= 0 || page > totalPage) page = 1;
        let offset = (page - 1) * limit;

        const returnResults = results.slice(offset, offset + limit);

        return this.ok({
            page,
            pageSize: limit,
            totalPage,
            results: returnResults
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

        const book = await Book.create({ isbn, title, edition, stock, price, number_of_page, publisher_id, description });

        if (!book.success)
            throw Error(book.errors);

        let bookId = book.insertedId;

        let authorIds = [];
        if (authors.length > 0) {
            authorIds = await Author.where({
                id: {
                    operator: 'IN',
                    value: authors
                }
            }).all();
            authorIds = authorIds.map(e => { return e['id'] });
        }

        let genreIds = [];
        if (genres.length > 0) {
            genreIds = await Genre.where({
                id: {
                    operator: 'IN',
                    value: genres
                }
            }).all();
            genreIds = genreIds.map(e => { return e['id'] });
        }

        for (let i = 0; i < authorIds.length; i++) {
            let addAuthor = await BookAuthor.create({ book_id: bookId, author_id: authorIds[i] });
            if (!addAuthor.success)
                throw new Error(addAuthor.errors);
        }

        for (let i = 0; i < genreIds.length; i++) {
            let addGrenres = await BookGenre.create({ book_id: bookId, genre_id: genreIds[i] });
            if (!addGrenres.success)
                throw new Error(addGrenres.errors);
        }

        return this.ok({
            success: true,
            insertedId: book.insertedId
        });
    }

    async updateBookThumbnail() {

        if (this.body.secure_url)
            return this.ok({
                thumbnailSrc: this.body.secure_url
            });

        const book = await Book.findById(this.params.id);
        const thumbnailUrl = book['thumbnail'];

        const thumbnailPublicId = thumbnailUrl.slice(thumbnailUrl.indexOf('webtech'), thumbnailUrl.lastIndexOf('.'));
        await cloudinary.uploader.destroy(thumbnailPublicId);

        if (!this.files[0]) {
            const thumbnailUpdate = await Book.update({ id: this.params.id }, { thumbnail: null });
            if (!thumbnailUpdate.success)
                throw new Error(thumbnailUpdate.errors);
            return this.noContent();
        }

        const thumbnail = this.files[0];
        if (!thumbnail.file.mimetype.startsWith("image")) {
            throw new CustomError.BadRequestError("Thumbnail must be an image");
        }

        const newFilePath = path.join(__dirname, '..', '..', '..', 'tmp', thumbnail.file.newFilename);
        let result = null;


        result = await cloudinary.uploader.upload(
            newFilePath,
            {
                use_filename: true,
                folder: 'webtech/thumbnails',
            }
        );
        this.body.secure_url = result.secure_url;
        // fs.unlink(newFilePath, (err) => {
        //     if (err)
        //         throw err;
        // });
        fs.unlinkSync(newFilePath);

        await Book.update({ id: this.body.id }, { thumbnail: result.secure_url });

        return this.ok({
            thumbnailSrc: result.secure_url
        });

    }

    async updateBook() {
        let authors = this.body.authors || [];
        let genres = this.body.genres || [];

        //console.log(authors);

        const book = await Book.findById(this.params.id);
        if (!book)
            throw new CustomError.NotFoundError("Cant find this book");

        delete this.body.id;
        delete this.body.authors;
        delete this.body.genres;
        //console.log(this.body);

        let bookUpdateResult = await Book.update({ id: this.params.id }, this.body);
        if (bookUpdateResult.success) {
            if (authors.length > 0) {
                authors = new Set(authors);
                authors = [...authors];
                //console.log(authors);
                bookUpdateResult = await BookAuthor.delete({ book_id: this.params.id });
                if (bookUpdateResult.success || typeof (bookUpdateResult.errors) === 'string') {
                    for (let i = 0; i < authors.length; i++) {
                        bookUpdateResult = await BookAuthor.create({ book_id: this.params.id, author_id: authors[i] });
                        if (!bookUpdateResult.success)
                            throw new Error(bookUpdateResult.errors);
                    }
                }
                else
                    throw new Error(bookUpdateResult.errors);
            }

            if (genres.length > 0) {
                genres = new Set(genres);
                genres = [...genres];
                bookUpdateResult = await BookGenre.delete({ book_id: this.params.id });
                if (bookUpdateResult.success || typeof (bookUpdateResult.errors) === 'string') {
                    for (let i = 0; i < genres.length; i++) {
                        bookUpdateResult = await BookGenre.create({ book_id: this.params.id, genre_id: genres[i] });
                        if (!bookUpdateResult.success)
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
        let bookDeleteResult = await Book.update({ id: this.params.id }, { stock: 0 });
        if (!bookDeleteResult.success)
            throw Error(bookDeleteResult.errors);
        else
            return this.noContent();
    }

    async updateImages() {
        const bookId = this.params.id;

        let deletingId = this.query["delete"];
        const deletedId = [];
        const images = await BookImages.where({ book_id: bookId }).all();
        if (deletingId) {
            if (images.length === 0) {
                throw new CustomError.BadRequestError("No image to delete");
            }

            deletingId = deletingId.split(' ').map(id => Number(id));
            if (deletingId.includes(NaN)) {
                throw new CustomError.BadRequestError("Deleting id is invalid");
            }

            for (let image of images) {
                if (!deletingId.includes(image["id"])) {
                    continue;
                }

                const imageUrl = image['image_url'];
                if (!imageUrl) {
                    deletedId.push(image["id"]);
                    continue;
                }

                const imagePublicId = imageUrl.slice(imageUrl.indexOf('webtech'), imageUrl.lastIndexOf('.'));
                const result = await cloudinary.uploader.destroy(imagePublicId);
                if (result.result === 'ok') {
                    deletedId.push(image["id"]);
                }
            }

            if (deletedId.length === 0) {
                throw new Error("Something went wrong. No image deleted. Please check id of images again");
            }

            const deleteImageResult = await BookImages.delete({
                id: {
                    operator: "IN",
                    value: deletedId
                }
            });

            if (!deleteImageResult.success) {
                throw new Error(deleteImageResult.errors);
            }

        }

        if (!this.files[0]) {
            return this.ok({});
        }

        for (let file of this.files) {
            if (!file.file.mimetype.startsWith("image")) {
                throw new CustomError.BadRequestError("Only accept images");
            }
        }

        const newImageNumberAllow = 4 - (images.length - deletedId.length);
        const newImageNumber = Math.min(newImageNumberAllow, this.files.length);
        const newImage = [];
        for (let i = 0; i < newImageNumber; ++i) {
            const newFilePath = path.join(__dirname, '..', '..', '..', 'tmp', this.files[i].file.newFilename);
            const result = await cloudinary.uploader.upload(
                newFilePath,
                {
                    use_filename: true,
                    folder: 'webtech/bookimages',
                }
            );

            fs.unlink(newFilePath, (err) => {
                if (err)
                    throw err;
            });

            const addImageResult = await BookImages.create({
                book_id: bookId,
                image_url: result.secure_url
            });

            if (addImageResult.success) {
                newImage.push({
                    insertedId: addImageResult.insertedId,
                    url: result.secure_url
                })
            } else {
                throw new Error(addImageResult.errors);
            }
        }

        return this.ok({
            inserted: newImage,
            deleted: deletedId.map(id => {
                return { id }
            })
        });
    }
}

module.exports = BookController;