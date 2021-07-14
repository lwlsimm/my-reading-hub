import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './readingPlanView.css';
import furthestReadIcon from '../../assets/images/furthestRead.png'
import noReading from '../../assets/images/no-reading.png'
import editing from '../../assets/images/editing.png';
import { updateScheme } from '../../state/actions';

function ReadingPlanView () {

  useEffect(()=> {
    getDataFromState();
  },[]);

  const plansInState = useSelector(state => state.planReducer.plans);
  const [plan, setPlan] = useState({});
  const [bookDetails, setBookDetails] = useState({});
  const [scheme, setScheme] = useState([]);
  const [furthestReadTo, setFurthestReadTo] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [currentChanges, setCurrentChanges] = useState({});
  const [editDay,setEditDay] = useState(0)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEndDate, setModalEndDate] = useState('');
  const [modalPerDay, setModalPerDay] = useState('');
  const [modalStartDate, setModalStartDate] = useState();
  const queryParams = window.location.search.substring(1);
  const dispatch = useDispatch();

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
          setModalEndDate(formatDate(plan.plan_end_date))
        } else {
          setModalPerDay(plan.per_day)
        }
        setModalStartDate(formatDate(new Date()))
        setFurthestReadTo(furthest);
        setScheme(schemeArray);
        setNumberOfDays(Object.keys(item.plan_scheme).length);
      }
    })
  }

  function updateSchemeUsingCurrentChanges() {
    const newScheme = [...scheme];
    for(let i = 1; i <= numberOfDays; i++) {
      const changeArray = ['to','from','date']
      for(let a = 0; a < changeArray.length; a++) {
        try {
          if(currentChanges[i][changeArray[a]]) {
            newScheme[i-1][changeArray[a]] = currentChanges[i][changeArray[a]]
          } else {throw Error}} catch {};
      }
      if(i > 1) {
       if(formatDate(newScheme[i-1]['date']) <= formatDate(newScheme[i-2]['date'])) {
         const newDate = new Date(newScheme[i-2]['date']);
         newDate.setDate(newDate.getDate() + 1);
         newScheme[i-1]['date'] = newDate;
       }
      }
      newScheme[i-1]['day'] > furthestReadTo ? newScheme[i-1]['completed'] = false : newScheme[i-1]['completed'] = true;
      let total_to_read = 0
      if(newScheme[i-1]['to']-newScheme[i-1]['from'] > 0) {
        total_to_read = newScheme[i-1]['to']-newScheme[i-1]['from']
      } 
      newScheme[i-1]['total_to_read'] = total_to_read;
      newScheme[i-1]['completed'] = newScheme[i-1]['day'] <= furthestReadTo ? true : false;
    }
    setScheme(newScheme);
    return newScheme;
  }

  console.log(scheme)

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

  const handleFurthestRead = (day) => {
    setFurthestReadTo(day);
  };

  const handleReset = () => {
    window.location.reload();
  }

  const handleNoReadingToday = (day) => {
    handleInputChange("None",day,'to');
    handleInputChange("None",day,'from');
    updateSchemeUsingCurrentChanges();
  }

  const handleFinishEditingDay = () => {
    updateSchemeUsingCurrentChanges();
    setEditDay(0)
  }

  const displayStartDate = new Date(plan.plan_start_date).toDateString();
  const displayEndDate = new Date(plan.plan_end_date).toDateString();
  const modalClassNames = modalVisible ? "Modal editSchemeModal" : "Modal hideModal";
  const modal_bg_ClassNames = modalVisible ? "modalbackground" : "modalbackground hideModal";
  const modalDateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  let readToDateForModal;
  let currentPage;
  let endDateForModal;
  try {
    endDateForModal = formatDate(displayEndDate)
    readToDateForModal = new Date(scheme[furthestReadTo-1].date).toLocaleDateString('en-UK', modalDateOptions);
    currentPage = scheme[furthestReadTo-1]['to']
  } catch {}
  
  function formatDate(date) {
  const options = {year: 'numeric', month: 'numeric', day: 'numeric'};
  const reformedDate = new Date(date).toLocaleDateString('en-UK', options).toString();
  return String(`${reformedDate.slice(6,10)}-${reformedDate.slice(3,5)}-${reformedDate.slice(0,2)}`)
  }

  function handleModalEndData (value,type) {
    if(type === 'end_date') {
        setModalEndDate(value);
        setModalPerDay('')
    } else {
      setModalEndDate('');
        setModalPerDay(value)
    }
  }

  function handleUpdateSubmit () {
    const updatedScheme = updateSchemeUsingCurrentChanges();
    const data_for_state = {};
    for(let i = 0; i < updatedScheme.length; i++) {
      data_for_state[i+1] = updatedScheme[i]
    }
    console.log(data_for_state)
    dispatch(updateScheme(plan.id, data_for_state));
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
        <img src={bookDetails.thumbnail}/>
      </div>
      {/* Instructions */}
      <div className="RP-paragrpah-container">
        <p className="RP-para">{instructions}</p>
        <p className="RP-para">Your plan has a current start date of: <span className="bold">{displayStartDate}</span></p>
        <p className="RP-para">Your plan has a current end date of: <span className="bold">{displayEndDate}</span></p>
        <div className="flexBoxByRows RP-flex">
          <div className="btn" onClick={()=>handleAddNewDay()}>Add New Day</div>
          <div className="btn" onClick={()=>setModalVisible(true)}>Recalculate Plan</div>
          <div className="btn btn-red" onClick={()=>handleReset()}>Reset</div>
          <div>
            <p className="bold">Key:</p>
            <p>Mark as furthest read {plan.measure} <img className="RP-icon" src={furthestReadIcon}/></p>
            <p>No reading for today <img className="RP-icon" src={noReading} /></p>
            <p>Edit Day <img className="RP-icon" src={editing} /></p>
          </div>
        </div>
        
      </div>
      {/* Table */}
      
      <h2>Your Plan Scheme</h2>
      
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
                      <div className="RP-col3" id={`RP-row-${item.day}-from`} defaultValue={item.from}>{item.from}</div>
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
                      <img className="RP-col6 RP-icon" src={furthestReadIcon} onClick={()=>handleFurthestRead(item.day)}/>
                      <img className="RP-col7 RP-icon" src={noReading} onClick={()=>handleNoReadingToday(item.day)}/>
                      <img className="RP-col8 RP-icon" src={editing} onClick={()=>setEditDay(item.day)}/>
                    </Fragment>
                    }
                    
                  </Fragment>
                )
            })
        }
        <div className="btn submit-btn RP-submit" onClick={()=>handleUpdateSubmit()}>Submit Changes</div>
        {/* Div below ensures the submit button does not sit at the bottowm of the page */}
        <div></div>
      </form>


      {/* Modal */}
      <div className={modal_bg_ClassNames} onClick={()=>setModalVisible(false)}></div>

        <form className={modalClassNames}>
          
            
              <h3>{bookDetails.title}</h3>
              <h4>Edit Your Reading Plan</h4>
              <p className="modal-para">{furthestReadTo === 0?
              `You have yet to start this plan.  If this is not correct, please record the details of it in the 'Your Plan Scheme' section, otherwise your new plan will not reflect any progress that you have made.`
              :
              `According to 'Your Plan Scheme, you have read to ${plan.measure} ${currentPage} as at ${readToDateForModal}.  If this is not correct then you can update your progressin the 'Your Plan Scheme' section.`
              }</p>
              <div className="flexBoxByRows RPM-row">
                <label className="RPM-label" for="lastReadTo">The last {plan.measure} that I read was:</label><input type="text" className="RPM-input" id="lastReadTo" defaultValue={currentPage}/>
              </div>
              <div className="flexBoxByRows RPM-row">
                <label className="RPM-label" for="lastReadTo">I want my new plan to start from:</label><input type="date" className="RPM-input" id="startDate" onChange={(e)=>setModalStartDate(e.target.value)}value={modalStartDate}/>
              </div>
              <div className="or">Enter either:</div>
            <div className="flexBoxByRows RPM-row">
              <label  className="makeFirstLetterUpper RPM-label" for="per_day">{`${plan.measure}s per day`}</label>
              <input className="RPM-input" type="text" id="per_day" name="per_day" value={modalPerDay} onChange={(e)=>handleModalEndData(e.target.value, 'per_day')}/>
            </div>
            <div className="or">OR</div>
            <div className="flexBoxByRows RPM-row">
              <label className="RPM-label" for="end_date RPM-label">End Date</label>
              <input className="RPM-input" type="date" id="end_date" name="end_date" placeholder="Enter the end date" value={modalEndDate} onChange={(e)=>handleModalEndData(e.target.value, 'end_date')}/>
            </div>
            <input className="btn submit-btn modal-submit" type="submit"/>
            <div className="btn submit-btn btn-yellow modal-exit" onClick={()=>setModalVisible(false)}>Exit</div>
        </form>

    </div>
  )
}

export default ReadingPlanView;