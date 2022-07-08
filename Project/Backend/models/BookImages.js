const { BaseModel } = require("../framework");
const { AttributeType, Validators } = require("../framework/ModelHelpers");

class BookImages extends BaseModel {
    setup() {
        this.setTablename('image');
        this.setAttribute('book_id', AttributeType.Integer, [Validators.Required]);
        this.setAttribute('image_url', AttributeType.String, [Validators.MaxLength(1000)]);
    }
}

module.exports = BookImages;