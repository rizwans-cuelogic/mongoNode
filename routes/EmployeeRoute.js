const express = require('express');
const router = express.Router();
const emplyoee_controller = require('../controller/employeeController');

router.post('/createupdate',emplyoee_controller.createUpdateEmployee);
router.delete('/delete/:name',emplyoee_controller.deleteEmployee);
router.get('/all',emplyoee_controller.allEmployee);

module.exports = router