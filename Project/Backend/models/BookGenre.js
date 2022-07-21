const { BaseModel } = require("../framework");
const { AttributeType, Validators } = require("../framework/ModelHelpers");

class BookGenre extends BaseModel {
    setup() {
        this.setTablename('book_genre');
        this.setAttribute('book_id', AttributeType.Integer, [Validators.Required]);
        this.setAttribute('genre_id', AttributeType.Integer, [Validators.Required]);
    }
}

module.exports = BookGenre;