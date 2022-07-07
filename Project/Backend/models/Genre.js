const BaseModel = require('../framework').BaseModel;
const { AttributeType, Validators } = require('../framework/ModelHelpers');
const pool = require('../config/db.config');

class Genre extends BaseModel {
    setup() {
        this.setTablename('genre');
        this.setAttribute('name', AttributeType.String, [Validators.Required, Validators.MaxLength(255), Validators.MinLength(1)]);
    }
    async getAll() {
        const [rows] = await pool.query("SELECT * FROM genre");
        return rows;
    }
}

module.exports = Genre;