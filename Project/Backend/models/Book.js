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

}

module.exports = Book;