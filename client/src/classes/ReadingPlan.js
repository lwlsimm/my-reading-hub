
export class ReadingPlan {

  constructor(id, startDate, startAt, endAt, per_day = 0, end_date, perDayType, measure, bookData) {
    this.id = id;
    this.measure = measure;
    this.plan_start_date = new Date(startDate);
    this.start_at = Number(startAt);
    this.end_at = Number(endAt);
    this.per_day_type = perDayType;
    this.per_day = Number(per_day);
    this.msPerDay = 24*60*60*1000;
    this.book_data = bookData;
    if(end_date) {
          this.plan_end_date = new Date(end_date);
   } else {
          const new_end_date = new Date();
          new_end_date.setDate(this.plan_start_date.getDate() + this.plan_total_days - 1);
          this.plan_end_date = new Date();
    }
  }
  get obtain_basic_details() {
    return {
      id: this.id, measure: this.measure, plan_start_date: this.plan_start_date, start_at: this.start_at, end_at: this.end_at, per_day_type: this.per_day_type, per_day: this.per_day, book_data: this.book_data, plan_end_date: this.plan_end_date
    }
  }
  //This calculates the variables required for creating a brand new reading plan
  get plan_variables() {
    const total_measure = this.end_at - this.start_at + 1;
    if(this.per_day_type === 'end_date') {
      const plan_total_days = Math.round((this.plan_end_date.getTime() - this.plan_start_date.getTime()) / this.msPerDay)+1;
      const remainder = total_measure % plan_total_days;
      const std_measure_per_day = (total_measure - remainder)/plan_total_days;
      const remainder_interval = Math.floor(plan_total_days / remainder);
      const num_intervals_to_skip = Math.floor(plan_total_days / remainder_interval) - remainder;
      return {
        plan_total_days: plan_total_days,
        total_measure: total_measure,
        remainder: remainder,
        std_measure_per_day: std_measure_per_day,
        remainder_interval: remainder_interval,
        num_intervals_to_skip: num_intervals_to_skip
      }
    } else {
        return {
          plan_total_days: Math.ceil(total_measure / this.per_day),
          total_measure: total_measure,
          remainder: 0,
          std_measure_per_day: this.per_day,
          remainder_interval: 0,
          num_intervals_to_skip: 0
        }
    }
  }

  //this creates a new plan
  get create_new_plan () {
    const { std_measure_per_day, plan_total_days, remainder_interval, num_intervals_to_skip} = this.plan_variables;
    const planObject = {};
    let running_total = this.start_at;
    for(let day = 1; day <= plan_total_days; day++) {
      const date_for_plan_day = new Date();
      date_for_plan_day.setDate(this.plan_start_date.getDate() + day - 1);
      let amount_to_read = std_measure_per_day;
      if(remainder_interval > 0 && day % remainder_interval === 0) {
        amount_to_read++;
        if(num_intervals_to_skip > 0 && day <=(remainder_interval * num_intervals_to_skip)) {
          amount_to_read--;
        }
      }
      const toPage = (running_total + amount_to_read - 1) > this.end_at ? this.end_at : (running_total + amount_to_read - 1);
      planObject[day] = { day: day, date: date_for_plan_day, total_to_read: toPage - running_total + 1, from: running_total, to: toPage, completed: false};
      running_total += amount_to_read
    }
    return planObject;
  }
}