import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './readingPlanView.css';
import furthestReadIcon from '../../assets/images/furthestRead.png'
import noReading from '../../assets/images/no-reading.png'
import editing from '../../assets/images/editing.png';
import { updateScheme, updateEndDate } from '../../state/actions';
import { formatDate } from '../../functions/commonFunctions';
import { updateExistingPlan } from '../../functions/readingPlanFunctions';
import { recalculate_plan } from '../../functions/recalculatePlanFunction'
import { useHistory } from 'react-router-dom';

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

function ReadingPlanView () {

  useEffect(()=> {
    getDataFromState();
  },[]);

  // State
  const plansInState = useSelector(state => state.planReducer.plans);
  const [plan, setPlan] = useState({});
  const [bookDetails, setBookDetails] = useState({});
  const [scheme, setScheme] = useState([]);
  const [furthestReadTo, setFurthestReadTo] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [currentChanges, setCurrentChanges] = useState({});
  const [editDay,setEditDay] = useState(0)
  const [modalVisible, setModalVisible] = useState(false);
  const [inSubmitMode,setInSubmitMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const forceUpdate = useForceUpdate();
  const [formSubmitError, setFormSubmitError] = useState({
    wasErrorReturned: false,
    errorMessage: ''
  })
  const [inputError, setInputError] = useState({
    wasErrorReturned: false,
    errorMessage: ''
  })
  const [modalError, setModalError] = useState({
    wasErrorReturned: false,
    errorMessage: ''
  })
  const queryParams = window.location.search.substring(1);
  const dispatch = useDispatch();
  const history = useHistory();

  //Variables
  const token = useSelector(state => state.loginReducer.token);
  const displayStartDate = new Date(plan.plan_start_date).toDateString();
  const displayEndDate = new Date(plan.plan_end_date).toDateString();
  const modalClassNames = modalVisible ? "Modal editSchemeModal" : "Modal hideModal";
  const modal_bg_ClassNames = modalVisible ? "modalbackground" : "modalbackground hideModal";
  const modalDateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  let readToDateForModal;
  let endDateForModal;
  try {
    endDateForModal = formatDate(displayEndDate)
    readToDateForModal = new Date(scheme[furthestReadTo-1].date).toLocaleDateString('en-UK', modalDateOptions);
  } catch {}
  
  //This function gets the relevant plan from redux state and populates the local react state.
  function getDataFromState () {
    plansInState.map(item => {
      if(item.id === queryParams) {
        setPlan(item);
        const detailsFromState = {
          title: item.book_data.title,
          author: item.book_data.author[0],
          thumbnail: item.book_data.thumbnail
        }
        setBookDetails(detailsFromState);
        const schemeArray = [];
        let furthest = 0;
        for(let i = 1; i <= Object.keys(item.plan_scheme).length; i++) {
          schemeArray.push(item.plan_scheme[i]);
          if(item.plan_scheme[i].completed && item.plan_scheme[i].day > furthest) {
            furthest = item.plan_scheme[i].day;
          }
        }
        if(plan.per_day_type === 'end_date') {
        }
        setFurthestReadTo(furthest);
        setScheme(schemeArray);
        setNumberOfDays(Object.keys(item.plan_scheme).length);
        setCurrentPage(lastReadPage());
      }
    return;
    })
  }



  //Find last read page 
  function lastReadPage () {
    let lastRead = plan.start_at;
    scheme.map(item => {
      if(item.completed && item.to !== 'None') {
        lastRead = item.to;
      };
      return
    })
    return lastRead;
  }

  function updateSchemeUsingCurrentChanges() {
    const newScheme = scheme;
    let furthest = 0;
    for(let i = 1; i <= numberOfDays; i++) {
      const changeArray = ['to','from','date']
      for(let a = 0; a < changeArray.length; a++) {
        try {
          if(currentChanges[i][changeArray[a]] || currentChanges[i][changeArray[a]] === 0) {
            newScheme[i-1][changeArray[a]] = currentChanges[i][changeArray[a]];
            if(newScheme[i-1][changeArray['to']]==='completed' && newScheme[i-1][changeArray['to']]==='completed' > furthest){
              furthest = newScheme[i-1][changeArray['to']];
            }
          } else {throw Error}} catch {}}
      if(i > 1) {
       if(formatDate(newScheme[i-1]['date']) <= formatDate(newScheme[i-2]['date'])) {
         const newDate = new Date(newScheme[i-2]['date']);
         newDate.setDate(newDate.getDate() + 1);
         newScheme[i-1]['date'] = newDate}
      }
      newScheme[i-1]['day'] > furthestReadTo ? newScheme[i-1]['completed'] = false : newScheme[i-1]['completed'] = true;
      let total_to_read = 0
      if(newScheme[i-1]['to']-newScheme[i-1]['from'] > 0) {
        total_to_read = newScheme[i-1]['to']-newScheme[i-1]['from']} 
      newScheme[i-1]['total_to_read'] = total_to_read;
      newScheme[i-1]['completed'] = newScheme[i-1]['day'] <= furthestReadTo ? true : false;
    }
    setScheme(newScheme);
    setCurrentPage(lastReadPage());
    setEditDay(0)
    return newScheme;
  }
  

  const handleInputChange = (num, day, type) => {
    let valueFromInput
    if(type !== 'date') {
    valueFromInput = num !== 'None'? Number(num) : num;
    } else {valueFromInput = num}

    const changes = currentChanges;
    if(!changes[day]) {changes[day] = {}}
    changes[day][type] = valueFromInput;
    setCurrentChanges(changes);
  }

  const handleAddNewDay = () => {
    const dayNumber = numberOfDays + 1;
    const lastDate = new Date(scheme[scheme.length-1].date)
    lastDate.setDate(lastDate.getDate() + 1)
    const newDay = {
      day: dayNumber,
      date: lastDate,
      from: 0,
      to: 0,
      completed: false,
      total_to_read: 0,
    }  
    const newScheme = scheme;
    newScheme.push(newDay);
    setScheme(newScheme);
    setNumberOfDays(dayNumber);
  }

  const handleFurthestRead = (day) => {
    setFurthestReadTo(day);
  };

  const handleReset = () => {
    history.push(`/?redir=plan/?${plan.id}`)
  }

  const handleNoReadingToday = (day) => {
    handleInputChange("None",day,'to');
    handleInputChange("None",day,'from');
    handleFinishEditingDay(day);
    forceUpdate();
  }


  const removeTodaysChangesFromCurrentChanges = (day) => {
    const updatedChanges = currentChanges;
    delete currentChanges[day];
    setCurrentChanges(updatedChanges);
  }  

  const findPageOfThePreviousDay = (day) => {
    if(day > 1) {
      for(let i = day -2; i >= 0; i--) {
        if(scheme[i]['to'] !== 'None') {
          return scheme[i]['to'];
        }
      }
    }
    return plan.start_at;
  }

  const handleFinishEditingDay = (dayToEdit = editDay) => { 
    //validation
    let to = scheme[dayToEdit-1]['to'];
    let from = scheme[dayToEdit-1]['from'];
    let date = scheme[dayToEdit-1]['date'];
    if(currentChanges[dayToEdit] !== undefined) {
      if(currentChanges[dayToEdit]['to'] !== undefined) {
        to = currentChanges[dayToEdit]['to'];
      }
      if(currentChanges[dayToEdit]['from'] !== undefined) {
        from = currentChanges[dayToEdit]['from'];
      }
      if(currentChanges[dayToEdit]['date'] !== undefined) {
        date = currentChanges[dayToEdit]['date'];
      }
    }
    
    let errorMsg = '';
    if(from > to) {
      errorMsg = `The 'to' value cannot be less than the 'from' value! `
    }
    if(from < plan.start_at) {
      errorMsg = errorMsg + `The start page for this plan is ${plan.start_at}.`
    }
    if(editDay > 1 && from < findPageOfThePreviousDay(editDay)) {
      errorMsg = errorMsg + `The 'from' value of the day you are editing cannot be less than the 'to' value of the previous reading day.  Change the previous reading day first.`
    }
    if((to === 'None' || from === 'None') && (to !== 'None' || from !== 'None')) {
      //Overrides previous error messages
      errorMsg = `Either both 'to' and 'from' must be 'None' or neither! `
    }
    if(editDay > 1) {
      const today = new Date(formatDate(date));
      const yesterday = new Date(formatDate(scheme[editDay-2]['date']));
      if(today <= yesterday) {
        errorMsg = errorMsg + `The date of the day that you are editing must be later than the date of the previous day!`
      }
    }
    if(errorMsg) {
      removeTodaysChangesFromCurrentChanges(editDay);
      setInputError({wasErrorReturned: true, errorMessage: errorMsg})
    } else {
      updateSchemeUsingCurrentChanges();
    }
    setEditDay(0);
  }

  const handleSetEditDay = (day) => {
    setInputError({wasErrorReturned: false, errorMessage: ''});
    setEditDay(day)
  }

  async function handleUpdateSubmit () {
    setInSubmitMode(true)
    try {
      const updatedScheme = updateSchemeUsingCurrentChanges();
      const data_for_state = {};
      for(let i = 0; i < updatedScheme.length; i++) {
        data_for_state[i+1] = updatedScheme[i]
      }
      dispatch(updateScheme(plan.id, data_for_state));
      const sendNewPlanToServer = await updateExistingPlan(plan.id,data_for_state,token);
      if(!sendNewPlanToServer) {throw Error}
      setInSubmitMode(false);
      setCurrentChanges({})
      return
    } catch (error) {
      setFormSubmitError({wasErrorReturned: true, errorMessage: `There was an error in saving your progress to the server.  We apologise for the inconvenience.  Please logout and login again.  If the problem persists, please contact us via the 'About' section.`})
      setInSubmitMode(false)
    }
  }

  const handleMakeModalVisible = () => {
    handleUpdateSubmit();
    setModalVisible(true);
  }

  const handleRecalculatePlan = (e) => {
    e.preventDefault();
    setModalError({wasErrorReturned: false, errorMessage: ``})
    const lastReadTo = Number(e.target.lastReadTo.value);
    const startDate = new Date(e.target.startDate.value);
    const endAt = Number(e.target.readTo.value);
    const per_day = Number(e.target.modal_per_day.value);
    let end_date = e.target.modal_end_date.value;
    const per_day_type = per_day? 'per_day':'end_date';
    if(end_date) {
      if(per_day) {
            setModalError({wasErrorReturned: true, errorMessage: `You cannot input a value for both an 'end date' and a '${plan.measure}s per day'.  Please delete one`})
            return;
          }
          if(end_date && end_date < startDate) {
            setModalError({wasErrorReturned: true, errorMessage: `The end date cannot be before the start date.`})
            return;
          }
    }
    if(!end_date && !per_day) {
      setModalError({wasErrorReturned: true, errorMessage: `Either an 'end date' or '${plan.measure} per day' must be supplied`})
            return;
    }
    end_date = new Date(e.target.modal_end_date.value);
    if(startDate <= readToDateForModal) {
      setModalError({wasErrorReturned: true, errorMessage:`The start date of the revised plan must be after the date that you marked as being 'Read' - either set the start after ${readToDateForModal} or update 'Your Plan Scheme'`});
      return;
    }
    if(endAt < lastReadTo) {
      setModalError({wasErrorReturned: true, errorMessage: `The ${plan.measure} that you are reading upto cannot be less than the last page that you read up to.`})
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
    const newPlan = recalculate_plan(data_for_new_plan); 
    dispatch(updateScheme(plan.id, newPlan));
    dispatch(updateEndDate(plan.id, newPlan[Object.keys(newPlan).length]['date']))
    getDataFromState();
    setModalVisible(false);
  }

  const instructions = `To change your plan enter the ${plan.measure} you have read from and to each day - click on the date to confirm you have read that day's readings.  Once you have done that, you can save your plan or you can recalculate a new end date/number of ${plan.measure}s per day based on your actual progress.`

  return (
    <div className="Page RP-page">
      <div className="RP-top-row">
        <div className="flexBoxByCols">
          <h2>{bookDetails.title}</h2>
          <br/>
          <h2>{bookDetails.author}</h2>
        </div>
        <img src={bookDetails.thumbnail} alt="book cover"/>
      </div>
      {/* Instructions */}
      <div className="RP-paragrpah-container">
        <p className="RP-para">{instructions}</p>
        <p className="RP-para">Your plan has a current start date of: <span className="bold">{displayStartDate}</span></p>
        <p className="RP-para">Your plan has a current end date of: <span className="bold">{displayEndDate}</span></p>
        <div className="flexBoxByRows RP-flex">
          {/* <div className="btn" onClick={()=>handleAddNewDay()}>Add New Day</div> */}
          
          {/* <div className="btn btn-red" onClick={()=>handleReset()}>Reset</div> */}
          <div className="key-box">
            <p className="bold">Key:</p>
            <p>Mark as furthest read {plan.measure} <img className="RP-icon" src={furthestReadIcon} alt="furthest read to"/></p>
            <p>No reading for today <img className="RP-icon" src={noReading} alt="no reading today"/></p>
            <p>Edit Day <img className="RP-icon" src={editing} alt="edit book"/></p>
            <p>Duplicate reading with previous day&nbsp;<span className="bg-red">&nbsp;5&nbsp;</span></p>
            <p>Gap in plan from previous day&nbsp;<span className="bg-yellow">&nbsp;5&nbsp;</span></p>
          </div>
        </div>
        
      </div>
      {/* Table */}
      
      <h2>Your Plan Scheme</h2>
      {inputError.wasErrorReturned? <h3 className="red-text">{inputError.errorMessage}</h3>:null}
      {formSubmitError.wasErrorReturned? <h3 className="red-text">{formSubmitError.errorMessage}</h3>: null}
      <form className="RP-form">
        <div className="RP-col1 bold RP-top-row">Day</div>
        <div className="RP-col2 bold RP-top-row">Date</div>
        <div className="RP-col3 bold RP-top-row">From</div>
        <div className="RP-col4 bold RP-top-row">To</div>
        <div className="RP-col5 bold RP-top-row">Status</div>
        <div className="RP-col6 bold RP-top-row"></div>
        <div className="RP-col7 bold RP-top-row"></div>
        <div className="RP-col8 bold RP-top-row"></div>
        {
            scheme.map((item, index) => {

            const editingToday = item.day === editDay ? true : false;
            const options = { weekday: 'short',day: 'numeric' , month: 'short'};
            const displayDate = new Date(item.date).toLocaleDateString('en-UK', options);
            const inputDate = formatDate(new Date(item.date))
            const completed = item.day <= furthestReadTo ? 'Read':'Unread';
            const yesterdayToValue = findPageOfThePreviousDay(item.day);
            let fromClassNames = 'RP-col3 ';
            if(item.day > 1 && item.from < yesterdayToValue ) {
              fromClassNames = fromClassNames +'bg-red';
            }
            if(item.day > 1 && item.from - yesterdayToValue >= 2) {
              fromClassNames = fromClassNames +' bg-yellow';
            }
            if(item.day > 1 && yesterdayToValue === plan.start_at && item.to !== 'None' && scheme[index-1]['to'] === 'None' && item.from !== plan.start_at) {
              fromClassNames = fromClassNames +' bg-yellow';
            }
                return (
                  <Fragment>
                    <div className="RP-col1">{item.day}</div>
                    
                    {editingToday?
                    <Fragment>
                      <input className="RP-col2" type="date" defaultValue={inputDate} onChange={(e)=>handleInputChange(e.target.value,item.day,'date')}/>
                      <input className="RP-col3" id={`RP-row-${item.day}-from`} defaultValue={item.from} onChange={(e)=>handleInputChange(e.target.value,item.day,'from')}/>
                      <input className="RP-col4" id={`RP-row-${item.day}-to`}defaultValue={item.to} onChange={(e)=>handleInputChange(e.target.value,item.day,'to')}/>
                    </Fragment>
                    :
                    <Fragment>
                      <div className="RP-col2">{displayDate}</div>
                      <div className={fromClassNames} id={`RP-row-${item.day}-from`} defaultValue={item.from}>{item.from}</div>
                      <div className="RP-col4" id={`RP-row-${item.day}-to`}>{item.to}</div>
                    </Fragment>
                    }
                    <div className="RP-col5">{completed}</div>
                    {editingToday?
                    <Fragment>
                      <div className="RP-edit-doneBtn btn" onClick={()=>handleFinishEditingDay()}>Done</div>
                    </Fragment>
                    :
                     <Fragment>
                      <img className="RP-col6 RP-icon" src={furthestReadIcon} onClick={()=>handleFurthestRead(item.day)} alt="furthest read to"/>
                      <img className="RP-col7 RP-icon" src={noReading} onClick={()=>handleNoReadingToday(item.day)} alt="no reading today"/>
                      <img className="RP-col8 RP-icon" src={editing} onClick={()=>handleSetEditDay(item.day)} alt="edit book"/>
                    </Fragment>
                    }
                    
                  </Fragment>
                )
            })
        }
        {/* <div className={inSubmitMode? "btn submit-btn RP-submit btn-inSearchMode":"btn submit-btn RP-submit"} onClick={()=>handleUpdateSubmit()}>{inSubmitMode?'... SUBMITTING ...':'Submit Changes'}</div> */}
        
        
        <div></div>
        <div className="btn submit-btn RP-submit" onClick={()=>handleMakeModalVisible()}>Recalculate Plan</div>
        {/* Div below ensures the submit button does not sit at the bottowm of the page */}
        <div></div>
      </form>


      {/* Modal */}
      <div className={modal_bg_ClassNames} onClick={()=>setModalVisible(false)}></div>

        <form className={modalClassNames} onSubmit={(e)=>handleRecalculatePlan(e)}>
          
            
              <h3>{bookDetails.title}</h3>
              <h4>Edit Your Reading Plan</h4>
              <p className="modal-para">{furthestReadTo === 0?
              `You have yet to start this plan.  If this is not correct, please record the details of it in the 'Your Plan Scheme' section, otherwise your new plan will not reflect any progress that you have made.`
              :
              `According to 'Your Plan Scheme, you have read to ${plan.measure} ${currentPage} as at ${readToDateForModal}.  If this is not correct then you can update your progressin the 'Your Plan Scheme' section.`
              }</p>
              {modalError.wasErrorReturned? <h4 className="red-text">{modalError.errorMessage}</h4>:null}
              <div className="flexBoxByRows RPM-row">
                <label className="RPM-label" for="lastReadTo">I want the scheme to start from {plan.measure}:</label><input type="text" className="RPM-input" id="lastReadTo" required/>
              </div>
              <p className="RPM-para">The above value must be {currentPage} or greater.</p>
              <div className="flexBoxByRows RPM-row">
                <label className="RPM-label" for="lastReadTo">I want my new plan to start from:</label><input type="date" className="RPM-input" id="startDate" placeholder="dd/mm/yyyy" required/>
              </div>
              {readToDateForModal? 
              <p className="RPM-para">The above date must be <span className="bold">after</span> {readToDateForModal}.</p>
              : null}
              <div className="flexBoxByRows RPM-row">
                <label className="RPM-label" for="lastReadTo">You will be reading to {plan.measure}:</label><input type="text" className="RPM-input" id="readTo" defaultValue={plan.end_at}/>
              </div>
              <div className="or">Enter either:</div>
            <div className="flexBoxByRows RPM-row">
              <label  className="makeFirstLetterUpper RPM-label" for="modal_per_day">{`${plan.measure}s per day`}</label>
              <input className="RPM-input" type="text" id="modal_per_day" name="per_day"/>
            </div>
            <div className="or">OR</div>
            <div className="flexBoxByRows RPM-row">
              <label className="RPM-label" for="modal_end_date">End Date</label>
              <input className="RPM-input" type="date" id="modal_end_date" name="modal_end_date" placeholder="dd/mm/yyyy"/>
            </div>
            <input className="btn submit-btn modal-submit" type="submit"/>
            <div className="btn submit-btn btn-yellow modal-exit" onClick={()=>setModalVisible(false)}>Exit</div>
        </form>

    </div>
  )
}

export default ReadingPlanView;