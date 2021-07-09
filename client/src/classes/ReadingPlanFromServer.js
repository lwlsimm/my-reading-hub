
export class ReadingPlanFromServer {

  constructor(plan_details, plan_scheme) {
    this.id = plan_details.id;
    this.measure = plan_details.measure;
    this.plan_start_date = new Date(plan_details.plan_start_date);
    this.start_at = Number(plan_details.start_at);
    this.end_at = Number(plan_details.end_at);
    this.per_day_type = plan_details.per_day_type;
    this.per_day = Number(plan_details.per_day);
    this.msPerDay = 24*60*60*1000;
    this.book_data = plan_details.book_data;
    this.plan_end_date = new Date(plan_details.plan_end_date);
    this.plan_scheme = plan_scheme;
  }
  
}