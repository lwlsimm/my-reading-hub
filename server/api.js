const express = require('express');
const apiRouter = express.Router();
const pool = require('./db')

//Routes
const customersRouter = require('./customers');
apiRouter.use('/customers',customersRouter)

module.exports = apiRouter;