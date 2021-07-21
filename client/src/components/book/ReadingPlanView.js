import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './readingPlanView.css';
import furthestReadIcon from '../../assets/images/furthestRead.png'
import noReading from '../../assets/images/no-reading.png'
import editing from '../../assets/images/editing.png';
import { updateScheme, updateEndDate } from '../../state/actions';
import { extractItemFromObject, formatDate } from '../../functions/commonFunctions';
import { updateExistingPlan } from '../../functions/readingPlanFunctions';
import { recalculate_plan } from '../../functions/recalculatePlanFunction'
import { useHistory } from 'react-router-dom';


function ReadingPlanView () {
  
  const plansInState = useSelector(state => state.planReducer.plans);
  const [plan, setPlan] = useState({});
  const [book_data,setBook_data] = useState({});
  const [scheme, setScheme] = useState([]);
  const queryParams = window.location.search.substring(1);
  
  
  useEffect(()=> {
    //setting the plan from the plans in the state
    for(let i = 0; i < Object.keys(plansInState).length;i++) {
      if(plansInState[i].id === queryParams) {
        setPlan(plansInState[i]); 
        setBook_data(plansInState[i].book_data);
        setScheme(extractSchemeForArray(plansInState[i].plan_scheme));
      }
    }
  },[]);

  function extractSchemeForArray (schemeToExtract) {
    const schemeArray = []
    for(let i = 1; i <= Object.keys(schemeToExtract).length;i++) schemeArray.push(schemeToExtract[i]);
    return schemeArray;
  }

  function updateScheme(index, category, value) {
    const newScheme = [...scheme];
    newScheme[index][category] = value;
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

  function findPreviousDayTo(index) {

  }

  function noReadingForToday(index) {
    const newScheme = [...scheme];
    newScheme[index]['to'] = 'None';
    newScheme[index]['from'] = 'None';
    setScheme(newScheme);
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
          scheme.map((item, index) => {
            //Finding whether the scheme has been amended
            const day = item.day;
            const today = item.date;
            const from = item.from;
            const to = item.to;
            const status = item.completed? 'Read':'Unread';
            const previousDayTo = 0;
            
            return(
            <Fragment>
              <div className="RP-col1">{day}</div>
              <input type="date" className="RP-col2" value={formatDate(today)} onChange={(e)=>updateScheme(index,"date",e.target.value)}/>
              <input className="RP-col3" defaultValue={from} onChange={(e)=>updateScheme(index,"from",Number(e.target.value))}/>
              <input className="RP-col4" defaultValue={to} onChange={(e)=>updateScheme(index,"to",Number(e.target.value))}/>
              <div className="RP-col5">{status}</div>
              <img className="RP-col6 RP-icon" src={furthestReadIcon} alt="furthest read to"/>
              <img className="RP-col7 RP-icon" src={noReading} alt="no reading today" onClick={()=>noReadingForToday(index)}/>
            </Fragment>)
          })
        }
      </form>

    </div>
  )
}

export default ReadingPlanView;