const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    empCode: {
        type: String,
        required: true,
        max: 12
    },
    age: {
        type: Number
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    githubusername: {
        type: String
    }
});
EmployeeSchema.index({
    name: 1,
    type: -1
}); // schema level
EmployeeSchema.on('index', function (error) {
    console.log(error.message);
});

module.exports = Employee = mongoose.model('Employee', EmployeeSchema);