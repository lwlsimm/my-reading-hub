require('dotenv').config();
const pool = require('../database/db');

async function addNewPlan (customer_id, planObj, plan_id) {
  try {
    const plan_id = planObj.plan_id;
    const scheme = planObj.plan_scheme;
    const plan_details = planObj.plan_details;
    const serverQuery = await pool.query("INSERT INTO reading_plans (id, customer_id, plan_details, plan_scheme) VALUES($1, $2, $3, $4) RETURNING customer_id", [plan_id, customer_id, plan_details, scheme]);
    const data = await serverQuery.rows[0]['customer_id'];
    if(await data) {
      return true;
    }
    return Error;
  } catch (error) {
    console.log(error.message)
    return Error;
  }
}

async function deletePlan (plan_id) {
  try {
    const serverQuery = await pool.query("DELETE FROM reading_plans WHERE id = $1 RETURNING customer_id", [plan_id])
    const data = await serverQuery.rows[0]['customer_id'];
    if(data) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error.message)
    return false;
  }
}

async function updatePlan (plan_id, scheme) {
  try {
    const serverQuery = await pool.query("UPDATE reading_plans SET plan_scheme = $1 WHERE id = $2 RETURNING id", [scheme, plan_id]);
    const data = await serverQuery.rows[0]['id'];
    if(data) {
      return true
    }
    throw Error;
  } catch (error) {
    console.log(error.message)
    return Error
  }
}



module.exports = { addNewPlan, updatePlan, deletePlan }