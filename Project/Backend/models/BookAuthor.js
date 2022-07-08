const { BaseModel } = require("../framework");
const { AttributeType, Validators } = require("../framework/ModelHelpers");

class BookAuthor extends BaseModel {
    setup() {
        this.setTablename('book_author');
        this.setAttribute('book_id', AttributeType.Integer, [Validators.Required]);
        this.setAttribute('author_id', AttributeType.Integer, [Validators.Required]);
    }
}

module.exports = BookAuthor;