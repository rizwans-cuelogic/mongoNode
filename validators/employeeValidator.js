const validator = require('validator');
const isEmpty = require('./is-Empty');


module.exports = function validateEmployeeInput(data) {

    let errors = {};
    data.name = (data.name) ? data.name : '';
    data.empcode = (data.empcode) ? data.empcode : '';

    if (validator.isEmpty(data.name)) {
        errors.name = "name is required";
    }
    if (validator.isEmpty(data.empcode)) {
        errors.empcode = "empCode is required";
    }
    if (!validator.isLength(data.empcode, {
            max: 12
        })) {
        errors.empcode = "empCode length must be less than 12 chars";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}