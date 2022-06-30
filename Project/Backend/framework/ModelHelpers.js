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
    PresenceOf(attribute, model) {
        if (model._attributes[attribute].value == null || model._attributes[attribute].value == undefined) {
            model.errors.push(`${attribute} should be present`);
            return false;
        }
        return true;
    },

    IsString(attribute, model) {
        if (typeof (model._attributes[attribute].value) != "string") {
            model.errors.push(`${attribute} should be a string`);
            return false;
        }
        return true;
    }
}

module.exports = {
    AttributeType,
    Validators
}