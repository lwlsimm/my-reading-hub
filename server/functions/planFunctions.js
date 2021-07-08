require('dotenv').config();
const pool = require('../database/db');

async function addNewPlan (customer_id, planObj) {
  try {
    const plan_id = planObj.plan_details.id;
    const scheme = planObj.plan_scheme;
    return {plan_id: plan_id, customer_id: customer_id, scheme: scheme}
  } catch (error) {
    return Error;
  }
}



module.exports = { addNewPlan }