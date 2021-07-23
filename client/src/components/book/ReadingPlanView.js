import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './readingPlanView.css';
import furthestReadIcon from '../../assets/images/furthestRead.png'
import noReading from '../../assets/images/no-reading.png'
import { updateScheme } from '../../state/actions';
import { formatDate } from '../../functions/commonFunctions';
import { updateExistingPlan, getPlanFromServer } from '../../functions/readingPlanFunctions';
import { recalculate_plan } from '../../functions/recalculatePlanFunction'
import { useHistory } from 'react-router-dom';

function TopRow(props) {
  const {book_data, plan} = props
  return(
    <Fragment>
      <div className="RP-top-row">
        <div className="flexBoxByCols">
          <h2>{book_data.title}</h2>
          <br/>
          <h2>{book_data.author}</h2>
        </div>
        <img src={book_data.thumbnail} alt="book cover"/>
        <div className="flexBoxByRows RP-flex">
        <div className="key-box">
            <p className="bold">Key:</p>
            <p>Mark as furthest read {plan.measure} <img className="RP-icon" src={furthestReadIcon} alt="furthest read to"/></p>
            <p>No reading for today <img className="RP-icon" src={noReading} alt="no reading today"/></p>
            <p>Error that must be amended&nbsp;<span className="bg-red">&nbsp;5&nbsp;</span></p>
            <p>Gap/duplication in plan from previous day&nbsp;<span className="bg-yellow">&nbsp;5&nbsp;</span></p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}


function ReadingPlanView () {
  
  const dispatch = useDispatch();
  const history = useHistory();
  const plansInState = useSelector(state => state.planReducer.plans);
  const token = useSelector(state => state.loginReducer.token);

  const [plan, setPlan] = useState({});
  const [book_data,setBook_data] = useState({});
  const [scheme, setScheme] = useState([]);
  const [inSubmitMode, setInSubmitMode] = useState(false);
  const [typing,setTyping] = useState({index: 0, category: '', value: ''});
  const [errorMessage,setErrorMessage] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState([]);
  const [recalcErrors, setRecalcErrors] = useState([]);
  const [recalcFromDate, setRecalcFromDate] = useState(plan.start_date);
  const queryParams = window.location.search.substring(1);
  
  
  useEffect(()=> {
    //setting the plan from the plans in the state
    getPlanDataFromState();
  },[]);

  function getPlanDataFromState () {
    for(let i = 0; i < Object.keys(plansInState).length;i++) {
      if(plansInState[i].id === queryParams) {
        setPlan(plansInState[i]); 
        setBook_data(plansInState[i].book_data);
        const schemeArray = extractSchemeForArray(plansInState[i].plan_scheme)
        setScheme(schemeArray);
        const nextFreeDay = findNextFreeDate(schemeArray);
        setRecalcFromDate(nextFreeDay)
      }
    }
  }
  //The use effect below is to allow users to type without the scheme updating after each keystroke
  useEffect(()=> {
    if(typing['category']) {
      const timeoutId = setTimeout(() => updateSchemeLocally(), 1500)
      return () => clearTimeout(timeoutId);
    }
  },[typing])

  
  //The scheme is converted to an array to allow it to be manipulated more easily
  function extractSchemeForArray (schemeToExtract) {
    const schemeArray = []
    for(let i = 1; i <= Object.keys(schemeToExtract).length;i++) schemeArray.push(schemeToExtract[i]);
    //ensures dates are in correct format to render
    const schemeArrayDatesAmended = schemeArray.filter(item => {
      item.date = new Date(formatDate(item.date));
      return item;
    })
    return schemeArrayDatesAmended;
  }

  function findNextFreeDate (schemeToSearch) {
    try {
      let furthestReadSoFar = schemeToSearch[0]['date'];
      for(let i = 0; i < schemeToSearch.length; i++) {
        if(schemeToSearch[i]['completed']) {
          furthestReadSoFar = new Date(schemeToSearch[i]['date']);
          furthestReadSoFar.setDate(furthestReadSoFar.getDate()+1)
        } 
      } 
      return furthestReadSoFar 
    } catch (error) {
      return null;
    }
  }

  function handleTypingUpdate(index, category, value) {
    setTyping({index: index, category: category, value: value})
  }

  function updateSchemeLocally() {
    setErrorMessage('');
    let {index, category, value} = typing;
    //Validation of inputs
    if((category === 'to' || category === 'from')) {
      let otherCategory = category === 'to'? 'from':'to';
      if(!Number.isInteger(Number(value)) && value !== 'None') {
        value = "Error";
      } else if((scheme[index][otherCategory] !== "None" && value === "None")|| ( value !== 'None' && scheme[index][otherCategory] === "None")) {
        value = Number(value)
      } else if(Number(value)) {
        value = Number(value)
      }
    }
    //updating state
    const newScheme = [...scheme];
    newScheme[index][category] = value;
    const totalToRead = newScheme[index]['to'] + 1 - newScheme[index]['from'] 
    newScheme[index]['total_to_read'] = totalToRead;
    //check subsequent dates are still chronological
    for(let i = index + 1; i < newScheme.length;i++){
      const today = new Date(newScheme[i]['date']);
      const yesterday = new Date(newScheme[i-1]['date']);
      if(today <= yesterday) {
        const newDateForToday = new Date(newScheme[i-1]['date']);
        newDateForToday.setDate(newDateForToday.getDate() + 1);
        newScheme[i]['date'] = newDateForToday;
      }
    }
    setScheme(newScheme);
  }

  //This function sets the day which was last read to
  function setLastReadToDay (index) {
    const newScheme = [...scheme];
    let lastReadDay = newScheme[index]['day'];
    //the if below allows the user to toggle the day from read/unread
    if(index < newScheme.length-1) {
      if(newScheme[index]['completed'] && !newScheme[index+1]['completed']) {
        lastReadDay = index;
      }
    } else {
      if(newScheme[index]['completed']) {
        lastReadDay = index;
      }
    }
    //sets the days before and after to read and unread
    for(let i = newScheme.length-1; i >= 0; i--) {
        if(newScheme[i]['day'] <= lastReadDay) {
          newScheme[i]['completed'] = true;
        } else {
          newScheme[i]['completed'] = false;
        }
    }
    setScheme(newScheme);
    const nextFreeDay = findNextFreeDate(newScheme);
    setRecalcFromDate(nextFreeDay)
  }

  function findLastReadMeasure () {
    let furthestReadSoFar = plan.start_at;
    for(let i = 0; i < scheme.length; i++) {
      if(scheme[i]['completed']) {
        furthestReadSoFar = scheme[i]['to']
      } 
    }
    return furthestReadSoFar 
  }

  //for any given day (index), this returns the page read to on the previous day
  function findPreviousDayTo(index) {
    for(let i = index - 1; i >= 0; i--) {
      if(scheme[i]['to'] !== "None") {
        return scheme[i]['to'];
      }
    }
    return plan.start_at;
  }

  function noReadingForToday(index) {
    setErrorMessage('')
    const newScheme = [...scheme];
    newScheme[index]['to'] = 'None';
    newScheme[index]['from'] = 'None';
    newScheme[index]['total_to_read'] = 0;
    setScheme(newScheme);
  }

  function updateSubmitValidation () {
    const errorArray = [];
    scheme.map((item, index) => {
      if((item['to'] === 'None' && item['from'] !== 'None') ||(item['to'] !== 'None' && item['from'] === 'None')) {
        errorArray.push(`The 'To' and 'From' values for day ${item['day']} must both be 'None' or be whole numbers`)
      }
      if(!Number.isInteger(item['to']) && item['to'] !== 'None') {
        errorArray.push(`The 'To' value for day ${item['day']} is not a valid entry`)
      }
      if(!Number.isInteger(item['from']) && item['from'] !== 'None') {
        errorArray.push(`The 'From' value for day ${item['day']} is not a valid entry`)
      }
    });
    return errorArray;
  }

  function recalculationValidation (lastReadTo, startDate, endAt, per_day, end_date) {
    setRecalcErrors([]);
    const errorsFound = [];
    const schemelastReadDate = findNextFreeDate(scheme);
    const options = { weekday: 'short',day: 'numeric' , month: 'short'};
    const displayDate = new Date(schemelastReadDate).toLocaleDateString('en-UK', options);
    if(per_day && end_date) errorsFound.push(`You cannot supply values for both the end date and ${plan.measure} per day.  Please choose only one.`);
    if(!per_day && !end_date) errorsFound.push(`You must supply a value for either the end date and ${plan.measure} per day.`);
    if(end_date && end_date < startDate) errorsFound.push(`The new plans recalculation start date cannot be before the plan end date.`);
    if(lastReadTo > endAt) errorsFound.push(`You are reading from ${lastReadTo} to ${endAt}!  This app only allows you to read forwards!`);
    if(startDate < schemelastReadDate) errorsFound.push(`The reclaculated start date must be after the last date that you marked as 'Read' above (i.e. it must begin or ${displayDate} or later).`)
    return errorsFound;
  }

  async function handleRecalculatePlan (e) {
    e.preventDefault();
    setInSubmitMode(true);
    setErrorMessage('');
    setUpdateErrorMessage('');
    let errorReport = updateSubmitValidation();
    if(errorReport.length > 0) {
      setUpdateErrorMessage(errorReport);
      setInSubmitMode(false);
      return;
    }
    const lastReadTo = Number(e.target.lastReadTo.value);
    const startDate = new Date(recalcFromDate);
    const endAt = Number(e.target.endAt.value);
    const per_day = Number(e.target.per_day.value);
    const end_date = e.target.end_date.value ? new Date(e.target.end_date.value) : null;
    const per_day_type = per_day? 'per_day':'end_date';
    const recalculationErrorMsgs = recalculationValidation(lastReadTo, startDate, endAt, per_day, end_date);
    if(recalculationErrorMsgs.length > 0) {
      setRecalcErrors(recalculationErrorMsgs);
      setInSubmitMode(false);
      return;
    }
    const data_for_new_plan = {
      current_plan_scheme: scheme,
      measure_last_read_to: lastReadTo,
      end_at: endAt,
      new_plan_start_date: startDate,
      per_day_type: per_day_type,
      end_date: end_date,
      per_day: per_day,
    }
    const newScheme = recalculate_plan(data_for_new_plan); 
    const newSchemeArray = extractSchemeForArray(newScheme);
    setInSubmitMode(false);
    setErrorMessage(`You must click 'Submit Changes' for your new plan to be saved!`)
    setScheme(newSchemeArray);
  }

  async function handleUpdateSubmit() {
    setInSubmitMode(true);
    setErrorMessage('');
    setUpdateErrorMessage([]);
    let errorReport = updateSubmitValidation();
    if(errorReport.length > 0) {
      setUpdateErrorMessage(errorReport);
      setInSubmitMode(false);
      return;
    }
    try {
    const data_for_state = {};
    for(let i = 0; i < scheme.length; i++) {
      data_for_state[i+1] = scheme[i]
    }
    dispatch(updateScheme(plan.id, data_for_state));
    const sendNewPlanToServer = await updateExistingPlan(plan.id,data_for_state,token);
    if(!sendNewPlanToServer) {
      throw new Error;
    }
    setInSubmitMode(false);
  } catch (error) {
    setErrorMessage('There was a problem updating your plan on the server');
    setInSubmitMode(false);
  }
 }
  
 async function handleCancelChanges () {
    setInSubmitMode(true);
    setErrorMessage('');
    try {
      const schemeFromServer = getPlanFromServer(plan.id, token);
      setScheme(extractSchemeForArray(await schemeFromServer));
      if(!schemeFromServer) {
        throw new Error
      }
      dispatch(updateScheme(plan.id, await schemeFromServer));
      setInSubmitMode(false);
    } catch (error) {
      setErrorMessage('There was retrieving the original plan.  Please logout and login again.');
      setInSubmitMode(false);
      return null
    }
 }

 
  
  return(
    <div className="Page RP-page">
      <TopRow book_data={book_data} plan={plan}/>
      
      {errorMessage? <h3 className="red-text bold">{errorMessage}</h3>:null}
      {updateErrorMessage.length > 0? 
      <ul>
        <li className="RP-listItem bold red-text">The following critical errors were detected:</li>
        {updateErrorMessage.map((item, index) => {
          return(<li className="RP-listItem">{`${index+1}: ${item}`}</li>)
        })} 
        <li className="RP-listItem bold red-text">{`${updateErrorMessage.length===1? 'This error ':'These errors '}must be resolved to Submit your changes or recalculate your plan!`}</li>
      </ul>
      :null}
      <form className="RP-form">
        <div className="RP-col1 bold RP-top-row">Day</div>
        <div className="RP-col2 bold RP-top-row">Date</div>
        <div className="RP-col3 bold RP-top-row">From</div>
        <div className="RP-col4 bold RP-top-row">To</div>
        <div className="RP-col5 bold RP-top-row">Status</div>

        {
          scheme.map((item, index) => {
            //variables for the plan table
            const day = item.day;
            const today = item.date;
            const from = item.from;
            const to = item.to;
            const status = item.completed? 'Read':'Unread';
            const statusClassName = item.completed? "RP-col5 bg-green" : "RP-col5";
            //details of the previous day are obtained to determine any gaps in the plan
            const previousDayTo = findPreviousDayTo(index);
            let fromClassName = 'RP-col3';
            let toClassName = 'RP-col4'
            if(from - previousDayTo >= 2 || previousDayTo > from) {
              fromClassName += ' bg-yellow';
            }
            if(from === "Error") {
              fromClassName += ' bg-red';
            }
            if(to === "Error") {
              toClassName += ' bg-red';
            }
            if((to === "None" && from !== "None")||(to !== "None" && from === "None")) {
              toClassName += ' bg-red';
              fromClassName += ' bg-red';
            }
            
            //plan table
            return(
            <Fragment key={`${day}:${from}:${to}`}>
              <div className="RP-col1">{day}</div>
              <input type="date" className="RP-col2" value={formatDate(today)} onChange={(e)=>handleTypingUpdate(index,"date",e.target.value)}/>
              <input className={fromClassName} defaultValue={from} onChange={(e)=>handleTypingUpdate(index,"from",e.target.value)}/>
              <input className={toClassName} defaultValue={to} onChange={(e)=>handleTypingUpdate(index,"to",e.target.value)}/>
              <div className={statusClassName}>{status}</div>
              <img className="RP-col6 RP-icon" src={furthestReadIcon} alt="furthest read to" onClick={()=> setLastReadToDay(index)}/>
              <img className="RP-col7 RP-icon" src={noReading} alt="no reading today" onClick={()=>noReadingForToday(index)}/>
            </Fragment>)
          })
        }
         <div className={inSubmitMode? "btn submit-btn RP-submit btn-inSearchMode":"btn submit-btn RP-submit"} onClick={()=>handleUpdateSubmit()}>{inSubmitMode?'... SUBMITTING ...':'Submit Changes'}
         </div>
         <div className="btn btn-red RP-submit" onClick={()=>handleCancelChanges()}>Cancel Changes</div>
      </form>

      <form className="recalcBox" onSubmit={e => handleRecalculatePlan(e)}>
        <h3>Recalculate Your Plan</h3>
          {recalcErrors.length > 0? 
            <ul>
              <li className="RP-listItem bold red-text">The following critical errors were detected:</li>
              {recalcErrors.map((item, index) => {
                return(<li className="RP-listItem">{`${index+1}: ${item}`}</li>)
              })} 
              <li className="RP-listItem bold red-text">{`${updateErrorMessage.length===1? 'This error ':'These errors '}must be resolved to recalculate your plan!`}</li>
            </ul>
          :null}
        <p>{`In order to calculate a new plan, please fully update your plan progress in the table above.  You should ensure that the table reflects the ${plan.measure} that you last read to.  Currently, `}{findLastReadMeasure()===plan.start_at? `you have yet to start the plan. `: `you have this set to ${plan.measure} ${findLastReadMeasure()}.`}</p>
        <div className="recalcRow">
        <label className="RPM-recalc-label" for="lastReadTo">I want the scheme to start from {plan.measure}:</label><input type="text" className="RPM-recalc-input" id="lastReadTo" defaultValue={findLastReadMeasure()} required/>
        </div>
        <div div className="recalcRow">
        <label className="RPM-recalc-label" for="lastReadTo">I want my new plan to be recalculated from:</label><input type="date" className="RPM-recalc-input" id="startDate" value={formatDate(recalcFromDate)} onChange={(e)=>setRecalcFromDate(e.target.value)}required/>
        </div>
        <div div className="recalcRow">
        <label className="RPM-recalc-label" for="endAt">I will be reading up to and including {plan.measure}:</label><input type="text" className="RPM-recalc-input" id="endAt" defaultValue={scheme[scheme.length-1]? scheme[scheme.length-1]['to']:null}/>
        </div>
        <h3>Select one of the following options:</h3>
        <div div className="recalcRow">
          <label className="RPM-recalc-label" for="end_date">I want to complete the plan by:</label>
          <input className="RPM-recalc-input" type="date" id="end_date" name="end_date" placeholder="dd/mm/yyyy"/>
        </div>
        <div div className="recalcRow">
          {plan.measure === "percentage"?
            <label  className="RPM-recalc-label" for="per_day">{`I want to read the following percentage per day:`}</label>
            :
            <label  className="RPM-recalc-label" for="per_day">{`I want to read the following number of ${plan.measure}s per day:`}</label>
          }
          <input className="RPM-recalc-input" type="text" id="modal_per_day" name="per_day"/>
        </div>
        <div div className="recalcRow">
        <input className="btn submit-btn modal-submit" type="submit" value="Recalculate"/>
        </div>
      </form>


    </div>
  )
}

export default ReadingPlanView;