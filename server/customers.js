const customersRouter = require('express').Router();
const pool = require('./db')

module.exports = customersRouter;

customersRouter.get('/', async (req, res, next) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.json(customerData.rows)
  } catch (err) {
    console.error(err.message)
  }
})