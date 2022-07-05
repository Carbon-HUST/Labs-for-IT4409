const { AttributeType, Validators } = require('./ModelHelpers');
const ModelQueryBuilder = require('./ModelQueryBuilder');
const pool = require('../config/db.config');

class BaseModel {
    
    //Private
    #tableName;
    #attributes;

    constructor(attrs = {}) {
        //default value for table name is name of class; subclass can overwriting this value
        this.#tableName = this.constructor.name;
        //store model's atributes' properties
        this.#attributes = {};
        //store errors
        this.errors = [];

        //every objects of every models must have an id
        this.#attributes['id'] = {
            type: AttributeType.Integer,
            validators: [],
            defaultValue: null
        };
        this['id'] = null;

        //subclass will overwriting this method to define its own attributes, and make some changes if necessary
        this.setup();

        //initialize attributes
        this._setAttributeValues(attrs);
    }

    //subclass will overwriting this method to define its own attributes, and make some changes if necessary (e.g: table name)
    setup() { };

    //define an attribute (data type, validators (check email, is required, ...), default value)
    setAttribute(attribute, type = AttributeType.String, validators = [], defaultValue = null) {
        this.#attributes[attribute] = { type: type, validators, defaultValue };
        this[attribute] = defaultValue;
    }
   
/********************************/ 
    // Private attrs of the class is not shown in the JSON
    // Getter and setter serves the ModelQueryBuilder
    getAttributes() {
        return this.#attributes;
    }


    getTablename() {
        return this.#tableName
    }

    setTablename(tableName) {
        this.#tableName = tableName;
    }

/*************************************/
    // validate after updating
    save(atributes = []) {
        this.errors = [];
        this._checkValidation(atributes);

        if (this.errors.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    static async findById(id) {
        if (!id || !Number(id) || id < 0) {
            throw new Error("Id is invalid");
        }

        const obj = new this();
        const [rows] = await pool.query(`SELECT * FROM ${obj.#tableName} WHERE id = ? LIMIT 1`, [id]);
        if (rows.length === 0) {
            return null;
        }
        obj._setAttributeValues(rows[0]);
        return obj;
    }

    //select static version
    static select(fields = []) {
        //fields must be an array
        if (!Array.isArray(fields))
            return this;

        const ref = new this();
        ref._projections = [];
        //check if each field in fields is a model's attribute. If yes, save it into _projections
        fields.forEach(field => {
            if (ref.#attributes[field]) {
                ref._projections.push(field);
            }
        });
        return ref;
    }

    //select non-static version
    select(fields = []) {
        if (!Array.isArray(fields))
            return this;
        if (!this._projections) {
            this._projections = [];
        }

        fields.forEach(field => {
            if (this.#attributes[field]) {
                this._projections.push(field);
            }
        });
        return this;
    }

    static where(conditions = {}) {
        const ref = new this();
        if (conditions.constructor !== Object)
            return ref;
        ref._conditions = [];
        this._addConditions(ref, conditions);
        return ref;
    }

    where(conditions = {}) {
        if (conditions.constructor !== Object)
            return this;
        if (!this._conditions) {
            this._conditions = [];
        }
        BaseModel._addConditions(this, conditions);
        return this;
    }

    limit(amount) {
        if (typeof amount === "number")
            this._limit = amount;
        return this;
    }

    skip(amount) {
        if (typeof amount === "number")
            this._skip = amount;
        return this;
    }

    orderBy(fields) {
        if (!fields)
            return this;

        if (typeof fields === "string") {
            this._orderBy = {};
            this._orderBy[fields] = 1;
        }
        else if (fields.constructor === Object)
            this._orderBy = fields;
        return this;
    }

    async first() {
        const { query, args } = ModelQueryBuilder.buildSelectQuery(this);

        console.log(args);
        const [rows] = await pool.query(query, args);
        if (rows.length === 0)
            return null;
        this._setAttributeValues(rows[0]);
        return this;
    }

    async all() {
        const { query, args } = ModelQueryBuilder.buildSelectQuery(this);

        const [rows] = await pool.query(query, args);
        //console.log(rows);
        const result = [];
        rows.forEach(row => {
            result.push(new this.constructor(row));
        });
        return result;
    }

    static async create(attrs = {}) {
        const newObj = new this(attrs);
        const isValid = newObj.save();
        if (!isValid) {
            return {
                success: false,
                errors: newObj.errors
            }
        }

        const { query, args } = ModelQueryBuilder.buildInsertQuery(newObj);
        const [rows] = await pool.query(query, args);
        if (rows.affectedRows === 1) {
            return {
                success: true,
                insertedId: rows.insertId
            }
        };

        return {
            success: false,
            errors: rows.info
        }
    }

    static async update(conditions = {}, attrs = {}) {
        if (conditions.constructor !== Object || attrs.constructor !== Object) {
            return {
                success: false,
                errors: "Parameters are invalid"
            }
        }

        const obj = new this(attrs);
        const attrsKey = Object.keys(attrs);
        if (attrsKey.length === 0) {
            return {
                success: true,
                affectedRows: 0
            }
        }

        if (!obj.save(attrsKey)) {
            return {
                success: false,
                errors: obj.errors
            }
        }

        obj.where(conditions);
        const {
            query,
            args
        } = ModelQueryBuilder.buildUpdateQuery(obj, attrs);

        const [rows] = await pool.query(query, args);
        if (rows.affectedRows === 0) {
            return {
                success: false,
                errors: "Not found"
            }
        }

        return {
            success: true,
            affectedRows: rows.affectedRows
        }
    }

    static async delete(conditions = {}) {
        if (conditions.constructor !== Object) {
            return {
                success: false,
                errors: "Parameters are invalid"
            }
        }
        const obj = new this();
        obj.where(conditions);
        const {
            query,
            args
        } = ModelQueryBuilder.buildDeleteQuery(obj);

        const [rows] = await pool.query(query, args);
        if (rows.affectedRows === 0) {
            return {
                success: false,
                errors: "Not found"
            }
        }

        return {
            success: true,
            affectedRows: rows.affectedRows
        }

    }

    async update() {
        if (!this.save()) {
            return {
                success: false,
                errors: this.errors
            }
        }

        this._conditions = [{
            attribute: 'id',
            operator: '=',
            value: this['id']
        }];

        const attrs = {};
        const keys = Object.keys(this.#attributes);
        for (let key of keys) {
            attrs[key] = this[key];
        }

        const {
            query,
            args
        } = ModelQueryBuilder.buildUpdateQuery(this, attrs);

        const [rows] = await pool.query(query, args);
        if (rows.affectedRows === 0) {
            return {
                success: false,
                errors: "Not found"
            }
        }

        return {
            success: true,
            affectedRows: rows.affectedRows
        }
    }

    async delete() {
        this._conditions = [{
            attribute: 'id',
            operator: '=',
            value: this['id']
        }];

        const {
            query,
            args
        } = ModelQueryBuilder.buildDeleteQuery(this);

        const [rows] = await pool.query(query, args);
        if (rows.affectedRows === 0) {
            return {
                success: false,
                errors: "Not found"
            }
        }

        return {
            success: true,
            affectedRows: rows.affectedRows
        }
    }


    static _addConditions(obj, conditions) {
        //check if conditions is object
        if (conditions.constructor !== Object)
            return;
        //traverse keys of conditions
        const keys = Object.keys(conditions);
        keys.forEach((key) => {
            //if key is not an attributes --> ignore
            if (!obj.#attributes[key]) {
                return;
            }
            //otherwise, check if value is object
            //if not, use operator =
            //if yes, use opertor and value inside value
            //if operator is null/undefined --> ignore
            if (conditions[key].constructor === Object) {
                if (!conditions[key].operator || !conditions[key].value)
                    return;
                obj._conditions.push({
                    attribute: key,
                    operator: conditions[key].operator,
                    value: conditions[key].value
                });
            } else {
                obj._conditions.push({
                    attribute: key,
                    operator: '=',
                    value: conditions[key]
                });
            }
        });
    }

    //initialize attributes
    _setAttributeValues(attrs = {}) {
        if (attrs.constructor !== Object) {
            return;
        }
        const properties = Object.keys(this.#attributes);
        properties.forEach((property) => {
            if (attrs[property]) {
                this[property] = attrs[property]
            } else {
                const namePropertyUpperCase = property.toUpperCase();
                if (attrs[namePropertyUpperCase]) {
                    this[property] = attrs[namePropertyUpperCase];
                }
            }
        });
    }

    //validate each attribute
    _checkValidation(attributes = []) {
        if (!Array.isArray(attributes) || attributes.length == 0)
            attributes = Object.keys(this.#attributes);
        attributes.forEach((attribute) => {
            if (!this.#attributes[attribute])
                return;
            for (let validator of this.#attributes[attribute].validators) {
                if (!validator(attribute, this)) {
                    break;
                }
            }
        });
    }
}

module.exports = BaseModel;