const BaseModel = require('../framework').BaseModel;
const { AttributeType, Validators } = require('../framework/ModelHelpers');
class Genre extends BaseModel {
    setup() {
        this.setTablename('genre');
        this.setAttribute('name', AttributeType.String, [Validators.Required, Validators.MaxLength(255), Validators.MinLength(1)]);
    }
}

module.exports = Genre;