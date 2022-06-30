const BaseModel = require('../framework/BaseModel');
const {AttributeType, Validators} = require('../framework/ModelHelpers');

class TestBook extends BaseModel {
    setup(){
        this._tableName = 'book';
        this.setAttribute('isbn');
        this.setAttribute('title');
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