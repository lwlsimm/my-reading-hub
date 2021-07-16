function recalculate_plan (inputs) {
  //defining the variables
  const msPerDay = 24*60*60*1000;
  const {current_plan_scheme, measure_last_read_to, end_at, new_plan_start_date, per_day_type, end_date, per_day} = inputs;
  const total_measure = end_at - measure_last_read_to + 1;
  let plan_total_days, remainder, std_measure_per_day, remainder_interval, num_intervals_to_skip = 0
  if(per_day_type === 'end_date') {
    plan_total_days = ((end_date - new_plan_start_date)/msPerDay)+1;
    remainder = total_measure % plan_total_days;
    std_measure_per_day = (total_measure - remainder)/plan_total_days;
    remainder_interval = Math.floor(plan_total_days/remainder);
    num_intervals_to_skip = Math.floor(plan_total_days / remainder_interval) - remainder;
  } else {
    plan_total_days = Math.ceil(total_measure/per_day);
    std_measure_per_day = per_day;
  }
  //creating the new plan
  const new_plan_obj = {};
  current_plan_scheme.map(item => {
    if(item.completed) {
      new_plan_obj[item.day] = item
    }
  })
  const days_already_completed = Object.keys(new_plan_obj).length;
  let running_total = measure_last_read_to;
  for(let day = 1; day <= plan_total_days; day++) {
    const date_for_plan_day = new Date();
    date_for_plan_day.setDate(new_plan_start_date.getDate()+ day - 1);
    let amount_to_read = std_measure_per_day;
    if(remainder_interval > 0 && day % remainder_interval === 0) {
      amount_to_read++;
      if(num_intervals_to_skip > 0 && day <=(remainder_interval * num_intervals_to_skip)) {
        amount_to_read--;
      }
    }
    const toPage = (running_total + amount_to_read - 1) > end_at ? end_at : (running_total + amount_to_read - 1);
    new_plan_obj[day + days_already_completed] = {
      day: day + days_already_completed, date: date_for_plan_day, total_to_read: toPage - running_total + 1, from: running_total, to: toPage, completed: false};
    running_total += amount_to_read;
  }
  return new_plan_obj;
}

export {recalculate_plan}