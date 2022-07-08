const pool = require('../config/db.config');
const { BaseModel } = require('../framework');
const { AttributeType, Validators } = require('../framework/ModelHelpers');

class Customer extends BaseModel {
    
    setup() {
        this.setTablename('customer');
        this.setAttribute('name', AttributeType.String, [Validators.Required, Validators.MaxLength(255)]);
        this.setAttribute('email', AttributeType.String, [Validators.Required, Validators.MaxLength(255), Validators.Email]);
        this.setAttribute('password', AttributeType.String, [Validators.Required, Validators.MaxLength(1000)]);
        this.setAttribute('phone', AttributeType.String, [Validators.MaxLength(15)]);
        this.setAttribute('gender', AttributeType.String, [Validators.Enum(['MALE', 'FEMALE', 'OTHER'])], 'OTHER');
        this.setAttribute('dob', AttributeType.Date, [Validators.DateTime]);
        this.setAttribute('avatar', AttributeType.String);

    }
}

module.exports = Customer;