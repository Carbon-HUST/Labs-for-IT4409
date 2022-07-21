const AttributeType = {
    String: "string",
    Integer: "integer",
    Double: "double",
    Date: "date",
    DateTime: "datetime",
    Decimal: "decimal",
    Boolean: "boolean"
}

const Validators = {
    Required(attribute, model) {
        if (model[attribute] == null || model[attribute] == undefined) {
            model.errors.push(`${attribute} should be present`);
            return false;
        }
        return true;
    },

    IsString(attribute, model) {
        if (typeof (model[attribute]) != "string") {
            model.errors.push(`${attribute} should be a string`);
            return false;
        }
        return true;
    },

    Email(attribute, model) {
        if(!model[attribute])
            return true;

        if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(model[attribute])) {
            return true;
        }
       
        model.errors.push(`Invalid email`);
        
        return false;
    },

    InRange(start, end) {
        return (attribute, model) => {
            if (!model[attribute]) {
                return true;
            }
            if (typeof (model[attribute]) != "number") {
                model.errors.push(`${attribute} should be a number`);
                return false;
            }

            if (model[attribute] >= start && model[attribute] <= end) {
                return true;
            }

            model.errors.push(`${attribute} should be in range [${start}, ${end}]`);
            return false;
        }
    },

    Enum(enumValues = []) {
        if (enumValues.length == 0) {
            return () => true;
        }

        return (attribute, model) => {
            if (!model[attribute]) {
                return true;
            }

            if (enumValues.indexOf(model[attribute]) != -1) {
                return true;
            }

            model.errors.push(`${attribute} should be one of those values: ${enumValues}`);
            return false;
        }
    },

    DateTime(attribute, model) {
        const value = model[attribute];
        if (!value) {
            return true;
        }

        if (value instanceof Date) {
            return true;
        }

        const date = Date.parse(value);
        if (date) {
            return true;
        }

        model.errors.push(`${attribute} is in invalid format`);
        return false;
    },

    MinLength(minLength) {
        return (attribute, model) => {
            if(!model[attribute]) 
                return true;
            if(model[attribute].length < minLength) {
                model.errors.push(`${attribute} must be longer than ${minLength} character`);
                return false;
            }
            return true;
        }
    },

    MaxLength(maxLength) {
        return (attribute, model) => {
            if(!model[attribute]) 
                return true;
            if(model[attribute].length > maxLength) {
                model.errors.push(`${attribute} must not be longer than ${maxLength} character`);
                return false;
            }
            return true;
        }
    }
    

}

module.exports = {
    AttributeType,
    Validators
}