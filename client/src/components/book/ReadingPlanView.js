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
  
  const plansInState = useSelector(state => state.planReducer.plans);
  const [plan, setPlan] = useState({});
  const [book_data,setBook_data] = useState({});
  const [scheme, setScheme] = useState([]);
  const [editedScheme,setEditedScheme] = useState({});
  const queryParams = window.location.search.substring(1);
  const forceUpdate = useForceUpdate();
  
  useEffect(()=> {
    //setting the plan from the plans in the state
    for(let i = 0; i < Object.keys(plansInState).length;i++) {
      if(plansInState[i].id === queryParams) {
        setPlan(plansInState[i]); 
        setBook_data(plansInState[i].book_data);
        setScheme(extractSchemeForArray(plansInState[i].plan_scheme));
        setEditedScheme(plansInState[i].plan_scheme);
      }
    }
  },[]);

  function extractSchemeForArray (schemeToExtract) {
    const schemeArray = []
    for(let i = 1; i <= Object.keys(schemeToExtract).length;i++) schemeArray.push(schemeToExtract[i]);
    return schemeArray;
  }

  function updateScheme(day, item, value) {
    const newScheme = editedScheme;
    newScheme[day][item] = value;
    if(item === "date") {
      //all subsequent days may need to changed to ensure days are chronological.
      for(let i = day+1; i <= Object.keys(newScheme).length; i++) {
        const yesterdayDate = formatDate(newScheme[i-1]['date']);
        const todayDate = formatDate(newScheme[i]['date']);
        if(todayDate <= todayDate) {
          const newDate = new Date(yesterdayDate );
          newDate.setDate(newDate.getDate() + 1)
          newScheme[i]['date'] = newDate;
        }
      }
    }
    setEditedScheme(newScheme);
    console.log(editedScheme)
    forceUpdate();
  }

  
  return(
    <div className="Page RP-page">
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
            <p>Duplicate reading with previous day&nbsp;<span className="bg-red">&nbsp;5&nbsp;</span></p>
            <p>Gap in plan from previous day&nbsp;<span className="bg-yellow">&nbsp;5&nbsp;</span></p>
          </div>
        </div>
      </div>
      
      <form className="RP-form">
        <div className="RP-col1 bold RP-top-row">Day</div>
        <div className="RP-col2 bold RP-top-row">Date</div>
        <div className="RP-col3 bold RP-top-row">From</div>
        <div className="RP-col4 bold RP-top-row">To</div>
        <div className="RP-col5 bold RP-top-row">Status</div>

        {
          scheme.map(item => {
            //Finding whether the scheme has been amended
            const day = item.day;
            let today = editedScheme[day]['date'];
            const from = editedScheme[day]['from'];
            const to = editedScheme[day]['to'];
            const status = editedScheme[day]['completed']? 'Read':'Unread';
            
            return(
            <Fragment>
              <div className="RP-col1">{item.day}</div>
              <input type="date" className="RP-col2" defaultValue={today} onChange={(e)=>updateScheme(day,"date",e.target.value)}/>
              <input className="RP-col3" defaultValue={from} onChange={(e)=>updateScheme(day,"from",Number(e.target.value))}/>
              <input className="RP-col4" defaultValue={to} onChange={(e)=>updateScheme(day,"to",Number(e.target.value))}/>
              <div className="RP-col5">{status}</div>
              <img className="RP-col6 RP-icon" src={furthestReadIcon} alt="furthest read to"/>
              <img className="RP-col7 RP-icon" src={noReading} alt="no reading today"/>
            </Fragment>)
          })
        }
      </form>

    </div>
  )
}

export default ReadingPlanView;