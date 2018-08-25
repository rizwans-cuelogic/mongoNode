const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const result = require('dotenv').config();
const employeeRoutes = require('./routes/EmployeeRoute');

const app = new express();
app.listen(process.env.PORT);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));

mongoose
    .connect(process.env.DBURI, {
        useNewUrlParser: true
    })
    .then(() => console.log("DB connected successfully."))
    .catch((err) => console.log(`ERROR : ${err}`));


app.use('/api/employee', employeeRoutes);

app.listen(5000,
    () => console.log("Running on Port:%s", process.env.PORT));