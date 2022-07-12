const pool = require('../config/db.config');
const { BaseModel } = require('../framework');
const {AttributeType, Validators} = require('../framework/ModelHelpers');

class Admin extends BaseModel{
    
    setup() {
        this.setTablename('admin');
        this.setAttribute('email', AttributeType.String, [Validators.Required, Validators.MaxLength(255), Validators.Email]);
        this.setAttribute('password', AttributeType.String, [Validators.Required, Validators.MaxLength(1000)]);
    }
    
    
}

module.exports = Admin;