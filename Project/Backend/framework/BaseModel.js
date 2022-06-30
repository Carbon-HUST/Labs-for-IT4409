const { AttributeType, Validators } = require('./ModelHelper');
const pool = require('./config');

class BaseModel {
    _tableName;
    _attributes;

    constructor(attrs = {}) {
        //default value for table name is name of class; subclass can overwriting this value
        this._tableName = this.constructor.name;
        //store model's atributes' properties
        this._attributes = {};
        //store errors
        this.errors = [];

        //every objects of every models must have an id
        this._attributes['id'] = {
            type: AttributeType.Integer,
        };
        this['id'] = null;

        //subclass will overwriting this method to define its own attributes, and make some changes if necessary
        this.setup();

        //initialize attributes
        this._setInitialAttributes(attrs);
    }

    //subclass will overwriting this method to define its own attributes, and make some changes if necessary (e.g: table name)
    setup() { };

    //define an attribute (data type, validators (check email, is required, ...), default value)
    setAttribute(attribute, type = AttributeType.String, validators = []) {
        this._attributes[attribute] = { type: type, validators: validators };
        this[attribute] = null;
    }

    // validate after updating
    save() {
        this.errors = [];
        this._checkValidations();

        if (this.errors.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    //initialize attributes
    _setInitialAttributes(attrs = {}) {
        const properties = Object.keys(this._attributes);
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
    _checkValidation() {
        const attributes = Object.keys(this._attributes);
        attributes.forEach((attribute) => {
            for (let validator of this._attributes[attribute].validators) {
                if (!validator(this[attribute], this)) {
                    break;
                }
            }
        });
    }

    static async findById(id) {
        if (!id || !Number(id) || id < 0) {
            throw new Error("Id is invalid");
        }

        const obj = new this();
        const [rows] = await pool.query(`SELECT * FROM ${obj._tableName} WHERE id = ? LIMIT 1`, [id]);
        if (rows.length === 0) {
            return null;
        }
        obj._setInitialAttributes(rows[0]);
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
            if (ref._attributes[field]) {
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
            if (this._attributes[field]) {
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
        this._whereBuilder(ref, conditions);
        return ref;
    }

    where(conditions = {}) {
        if (conditions.constructor !== Object)
            return this;
        if (!this._conditions) {
            this._conditions = [];
        }
        BaseModel._whereBuilder(this, conditions);
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
        const { query, args } = BaseModel._buildQuery(this);

        const [rows] = await pool.query(query, args);
        if (rows.length === 0)
            return null;
        this._setInitialAttributes(rows[0]);
        return this;
    }


    async all() {
        const { query, args } = BaseModel._buildQuery(this);

        const [rows] = await pool.query(query, args);
        //console.log(rows);
        const result = [];
        rows.forEach(row => {
            result.push(new this.constructor(row));
        });
        return result;
    }

    static _buildQuery(obj) {
        const args = [];
        const projectionQuery = (obj._projections) ? obj._projections.map(field => `${obj._tableName}.${field}`).join(', ') : "*";
        let whereQuery = "1";
        if (obj._conditions && obj._conditions.length > 0) {
            const conditionExpressions = [];
            for (let condition of obj._conditions) {
                if (condition.operator === "BETWEEN" || condition.operator === "between") {
                    conditionExpressions.push(`${condition.attribute} ${condition.operator} ? AND ?`);
                    args.push(condition.value[0]);
                    args.push(condition.value[1]);
                } else {
                    conditionExpressions.push(`${condition.attribute} ${condition.operator} ?`);
                    args.push(condition.value);
                }
            }
            whereQuery = conditionExpressions.join(' AND ');
        }
        let query = `SELECT ${projectionQuery} FROM ${obj._tableName} WHERE ${whereQuery} `;
        if (obj._orderBy && Object.keys(obj._orderBy).length > 0) {
            const orderByExpression = [];
            for (let field in obj._orderBy) {
                if (obj._orderBy[field] === 1) {
                    orderByExpression.push(`${field} ASC`);
                } else if (obj._orderBy[field] === -1) {
                    orderByExpression.push(`${field} DESC`);
                } else {
                    continue;
                }
            }
            query += `ORDER BY ${orderByExpression.join(', ')} `;
        }
        if (obj._limit) {
            query += `LIMIT ? `;
            args.push(obj._limit);
        }
        if (obj._skip) {
            query += `OFFSET ? `;
            args.push(obj._skip);
        }

        console.log(query);

        return {
            query,
            args
        }
    }

    static _whereBuilder(obj, conditions) {
        //check if conditions is object
        if (conditions.constructor !== Object)
            return;
        //traverse keys of conditions
        const keys = Object.keys(conditions);
        keys.forEach((key) => {
            //if key is not an attributes --> ignore
            if (!obj._attributes[key]) {
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

}

module.exports = BaseModel;