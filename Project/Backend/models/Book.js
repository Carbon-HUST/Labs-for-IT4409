const pool = require('../config/db.config');
const { BaseModel } = require('../framework');
const { AttributeType, Validators } = require('../framework/ModelHelpers');

class Book extends BaseModel {
    setup() {
        this.setTablename('book');
        this.setAttribute('isbn', AttributeType.String, [Validators.Required, Validators.MaxLength(13)]);
        this.setAttribute('title', AttributeType.String, [Validators.Required, Validators.MaxLength(256)]);
        this.setAttribute('edition', AttributeType.Integer,[], 1);
        this.setAttribute('stock', AttributeType.Integer);
        this.setAttribute('price', AttributeType.Decimal);
        this.setAttribute('number_of_page', AttributeType.Integer);
        this.setAttribute('thumbnail', AttributeType.String);
        this.setAttribute('publisher_id', AttributeType.Integer, [Validators.Required]);
        this.setAttribute('description', AttributeType.String, [Validators.MaxLength(255)]);
    }


    async findById(id) {
        if(!id)
            return null;
        const [rows] = await pool.query("SELECT * FROM book WHERE ID = ?", [id]);

        const [authorRows] = await pool.query("SELECT author.NAME " + 
                                              "FROM author, book_author " +
                                              "WHERE book_author.AUTHOR_ID = author.ID AND book_author.BOOK_ID = ?", [id]);
        
        const [genreRows] = await pool.query("SELECT genre.NAME " +
                                             "FROM genre, book_genre " +
                                             "WHERE book_genre.GENRE_ID = genre.ID AND book_genre.BOOK_ID = ?", [id]);

        if(rows.length === 0)
            return null;

        let row = rows[0];
        row.authors = authorRows;
        row.genres = genreRows;

        return rows;
    }

    // Filter by Genre
    async filterByGenre(id, page, limit) {
        if(!id)
            return null;
        
        const skip = (page - 1) * limit;

        const [rows] = await pool.query('SELECT book.* FROM book, book_genre ' + 
                                        'WHERE book.ID = book_genre.BOOK_ID ' +
                                        'AND book_genre.GENRE_ID = ? ' +
                                        'LIMIT ? OFFSET ?', [id, parseInt(limit), parseInt(skip)]);
        
        return rows;
    }


    // Filter by author
    async filterByAuthor(id, page, limit) {
        if(!id)
            return null;
        
        const skip = (page - 1) * limit;

        const [rows] = await pool.query('SELECT book.* FROM book, book_author ' + 
                                        'WHERE book.ID = book_author.BOOK_ID ' +
                                        'AND book_author.AUTHOR_ID = ? ' +
                                        'LIMIT ? OFFSET ?', [id, parseInt(limit), parseInt(skip)]);
        
        return rows;
    }
}

module.exports = Book;