const BaseModel = require('../framework').BaseModel;
const { AttributeType, Validators } = require('../framework/ModelHelpers');

function validateStartEndTime(_, model) {
    const startTime = (model['start'] instanceof Date) ? model['start'] : Date.parse(model['start']);
    const endTime = (model['end'] instanceof Date) ? model['end'] : Date.parse(model['end']);

    if (startTime >= endTime) {
        model.errors.push('Start time must be before end time');
        return false;
    }
    return true;
}

class Voucher extends BaseModel {
    setup() {
        this.setTablename('voucher');
        this.setAttribute('name', AttributeType.String, [Validators.Required, Validators.MaxLength(255), Validators.MinLength(1)]);
        this.setAttribute('start', AttributeType.DateTime, [Validators.Required, Validators.DateTime]);
        this.setAttribute('end', AttributeType.DateTime, [Validators.Required, Validators.DateTime, validateStartEndTime]);
        this.setAttribute('value', AttributeType.Integer, [Validators.InRange(1, Infinity)], 0);
        this.setAttribute('min_cart_total', AttributeType.Decimal, [Validators.Required, Validators.InRange(0, Infinity)], 0);
        this.setAttribute('stock', AttributeType.Integer, [Validators.InRange(0, Infinity)], 0);
        this.setAttribute('description', AttributeType.String, [Validators.Required, Validators.MaxLength(255)]);
    }
}

module.exports = Voucher;