const express = require("express");
const Employee = require('../model/employee');
const validateEmployeeInput = require('../validators/employeeValidator');

exports.createUpdateEmployee = function (req, res) {
    const {
        errors,
        isValid
    } = validateEmployeeInput(req.body);
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }
    const employeeFields = {};
    employeeFields.name = req.body.name;
    employeeFields.empCode = req.body.empcode;
    employeeFields.age = req.body.age || '';
    employeeFields.department = req.body.department || '';
    employeeFields.designation = req.body.designation || '';
    employeeFields.githubusername = req.body.githubusername || '';

    Employee.findOne({
        name: employeeFields.name
    }).then(employee => {
        if (employee) {
            employee.findOneAndUpdate({
                name: employeeFields.name
            }, {
                $set: employeeFields
            }, {
                new: true
            }).then(employee => res.json(employee));
        } else {
            new Employee(employeeFields).save()
                .then(employee => res.json(employee));
        }
    });
}
exports.deleteEmployee = function (req, res) {
    let name = req.params.name;
    Employee.findOneAndRemove({
            name: name
        })
        .then(res.json("employee removed successfully..."))
        .catch(err => console.log(err));
}
exports.allEmployee = function (req, res) {
    Employee.find().then(employees => {
        if (!employees) {
            res.status(404).json("Employees not found");
        }
        res.json(employees);
    })
}