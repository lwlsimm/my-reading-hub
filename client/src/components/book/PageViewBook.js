import '../account/pageViews/pageViews.css';
import { useSelector, useDispatch } from 'react-redux';
import { removeReadingPlan, readingCompleted } from '../../state/actions';
import { updateExistingPlan, deletePlanFromServer } from '../../functions/readingPlanFunctions';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';


function PageViewBook (props) {

  const history = useHistory();
  const token = useSelector(state => state.loginReducer.token);
  const dispatch = useDispatch();
  const [updatingInProgress, setUpdatingInProgress] = useState(false)
  const [deleteBookMode, setDeleteBookMode] = useState(false);

  try {
  
  const {book} = props;
  const bookInfo = book.book_data;
  const scheme = book.plan_scheme;
  const viewBookPath = `/plan/?${book.id}`;

  function calculatePercentageComplete () {
    let totalComplete = 0;
    for(let i = 1; i <= Object.keys(scheme).length; i++) {
      if(scheme[i].completed === true) {
        totalComplete++
      }
    }
    return totalComplete / Object.keys(scheme).length * 100;
  }

  function getNextItemInScheme () {
    for(let i = 1; i <= Object.keys(scheme).length; i++) {
      if(scheme[i].completed === false) {
        return scheme[i]
      }
    }
    return {to: 'finished'}
  }

  function updateThePlanScheme (update_day) {
    const updatedScheme = {};
    for(let i = 1; i <= Object.keys(scheme).length; i++) {
      updatedScheme[i] = scheme[i];
      if(scheme[i].day === update_day) {
        updatedScheme[i].completed = true;
      }
    }
    return updatedScheme;
  }

  async function completeReading (update_planId, update_day) {
    setUpdatingInProgress(true)
    try {
      const updatedScheme = updateThePlanScheme(update_day);
      const updatePlanOnServer = await updateExistingPlan(update_planId, updatedScheme ,token);
      if(await updatePlanOnServer) {
        dispatch(readingCompleted(update_planId, update_day));
        setUpdatingInProgress(false);
        return;
      }
      throw Error
    } catch (error) {
      setUpdatingInProgress(false);
      window.alert(`It looks like there was an error that occured when trying to update your plan.  Please logout and try again.  If the problem persists, please contact us via the 'About' button at the top of the page.`);
      console.log(error.message)
    }
  }

  const handleView = () => {
    history.push(viewBookPath);
  }

  const percetage = calculatePercentageComplete();
  const {day, date, from, to} = getNextItemInScheme();
  const displayDate = new Date(date).toDateString();
  const modalClassNames = deleteBookMode ? "Modal" : "Modal hideModal";
  const modal_bg_ClassNames = deleteBookMode ? "modalbackground" : "modalbackground hideModal";

  const handleDeleteBook = async () => {
    try {
      const book_id = book.id;
      const isPlanDeletedFromServer = await deletePlanFromServer(book_id, token);
      if(isPlanDeletedFromServer) {
        dispatch(removeReadingPlan(book_id));
        return
      }
      throw Error;
    } catch (error) {
      window.alert(`It looks like there was an error that occured when trying to delete your plan.  Please logout and try again.  If the problem persists, please contact us via the 'About' button at the top of the page.`);
    }
  } 

  return (
    <div className="CurrentBook" key={book.id}>
      <div className="cb-column cb-img-col"><img className="cb-thumbnail" src={bookInfo.thumbnail} alt="book cover"/></div>
      <div className="cb-column cb-details-col">
        <img className="cb-mini-thumbnail" src={bookInfo.thumbnail} alt="book cover"/>
        <div className="cb--details-container">
          <h4>{bookInfo.title}</h4>
          <h5>{bookInfo.author}</h5>
          <p className="cb-para">Completed: {percetage.toFixed(1)}%</p>
        </div>
      </div>
      {to === 'finished'? 
          <div className="cb-column cb-comp-col">
            <p className="cb-para bold">Next Up:</p>
            <p className="cb-para">Good job! <br/>You have finished this book</p>
          </div>
            :
          <div className="cb-column cb-comp-col">
            <p className="cb-para bold">Next Up:</p>
            <p className="cb-para">{displayDate}</p>
            <p className="cb-para">Read from {book.measure}: <span className="bold">{from}</span> <br/>to the end of: <span className="bold">{to}</span></p>
            {updatingInProgress ?
              <div className="btn cb-btn submit-btn cb-complete-btn btn-inSearchMode" disabled>MARK COMPLETE</div>
              :
              <div className="btn cb-btn submit-btn cb-complete-btn" onClick={()=>completeReading(book.id, day, book)}>MARK COMPLETE</div>
            }
          </div>
      }
      <div className="cb-column cb-btn-col">
        <div className="btn cb-btn submit-btn" onClick={()=>handleView()}>View/Edit</div>
        <div className="btn btn-red cb-btn" onClick={()=>setDeleteBookMode(true)}>Delete Book</div>
      </div>
      
      {/* Delete Modal */}
      <div className={modal_bg_ClassNames}onClick={()=>setDeleteBookMode(false)}></div>

      <div className={modalClassNames}>
        <h2 className="red-text">Delete '{bookInfo.title}'?</h2>
        <div className="deleteModal-row2">
          <img className="" src={bookInfo.thumbnail} alt="book cover"/>
          <div className="deleteModal-row2-col2">
            <p className="deleteModal-para">Are you sure you want to delete '{bookInfo.title}'?</p>
            <br/>
            <p className="deleteModal-para">Once you delete a title, the book and any progress will be permanently deleted.  You can of course add the title back at any time.</p>
            
          </div>
        </div>
        <div className="btn btn-red modal-btn" onClick={()=>handleDeleteBook()}>I understand and want to delete</div>
        <div className="btn submit-btn modal-btn" onClick={()=>setDeleteBookMode(false)}>Take me back!</div>
      </div>
      
    </div>
  )
  } catch (error) {
      return null
  }
}

export default PageViewBook