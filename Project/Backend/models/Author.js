const BaseModel = require('../framework').BaseModel;
const { AttributeType, Validators } = require('../framework/ModelHelpers');
class Author extends BaseModel {
    setup() {
        this.setTablename("author");
        this.setAttribute("name", AttributeType.String, [Validators.Required, Validators.MaxLength(255), Validators.MinLength(1)]);
    }
}

module.exports = Author;