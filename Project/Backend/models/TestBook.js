const BaseModel = require('../framework').BaseModel;
const { AttributeType, Validators } = require('../framework').ModelHelpers;

class TestBook extends BaseModel {
    setup() {
        this.setTablename('book');
        this.setAttribute('isbn', AttributeType.String, [Validators.Required]);
        this.setAttribute('title', AttributeType.String, [Validators.Required]);
        this.setAttribute('edition', AttributeType.Integer);
        this.setAttribute('stock', AttributeType.Integer);
        this.setAttribute('price', AttributeType.Decimal);
        this.setAttribute('numberOfPage', AttributeType.Integer);
        this.setAttribute('thumbnail');
        this.setAttribute('publisherId', AttributeType.Integer);
        this.setAttribute('description');
    }
}

module.exports = TestBook;