const pool = require('../config/db.config')

class Book {

    async getAllBook(page, limit) {
        const skip = (page-1) * limit;
        const [rows] = await pool.query("SELECT * FROM book LIMIT ? OFFSET ? ", [parseInt(limit), parseInt(skip)]);
        return rows;
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

    async findByTitle(title, page, limit) {
        const skip = (page - 1) * limit;
        const [rows] = await pool.query('SELECT * FROM book ' +
                                        'WHERE TITLE LIKE ? ' +
                                        'LIMIT ? OFFSET ?', ['%'+title+'%', parseInt(limit), parseInt(skip)]);
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

module.exports = new Book();