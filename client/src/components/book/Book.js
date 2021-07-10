import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './book.css';
import { useHistory } from 'react-router-dom';
import bookImg from '../../assets/images/defaultSmallBook.png';
import { extractItemFromObject, covertSearchString } from '../../functions/commonFunctions';
import { OLAdditionalCoverArtFinder } from '../../functions/externalApiFunctions';
import backArrow from '../../assets/images/back.png';
import '../../App.css';
import { readingPlanValidateInputs, constructReadingPlan, sendNewPlanToServer } from '../../functions/readingPlanFunctions';
import { addReadingPlan } from '../../state/actions';

function Book() {

  const [additionalCovers, setAdditionalCovers] = useState([]);
  const [measure, setMeasure] = useState('page');
  const [inSearchMode, setInSearchMode] = useState(false);
  const [inSubmitMode, setInSubmitMode] = useState(false);
  const [readingPlanError, setReadingPlanError] = useState('');
  const [formProblemAreas, setFormProblemAreas] = useState([])
  const [formSubmitError, setFormSubmitError] = useState({
    wasErrorReturned: false,
    errorMessage: ''
  })

  const history = useHistory();
  const dispatch = useDispatch();
  const book = useSelector(state => state.selectedBookReducer);
  const backPath = '/account/?search';
  const token = useSelector(state => state.loginReducer.token);

  const thumbnail = extractItemFromObject(['thumbnail'],book.imageLinks, bookImg);
  const isbn10 = extractItemFromObject(['identifier'],book.industryIdentifiers[0], 'Not supplied');
  const isbn13 = extractItemFromObject(['identifier'],book.industryIdentifiers[1], 'Not supplied');
  const canonicalVolumeLink = extractItemFromObject(['canonicalVolumeLink'], book, null)

  const [selectedArtwork, setSelectedArtwork] = useState(thumbnail)
  
  const getAdditionalCoverArtwork = async () => {
    setInSearchMode(true)
    let i = 0
    while (i < 10) {
      const titleForOL = covertSearchString(String(book.title));
      const additionalArtLinks = await OLAdditionalCoverArtFinder(titleForOL);
      setAdditionalCovers(additionalArtLinks);
      i++;
      if(additionalArtLinks.length > 25) {
        break;
      }
    }
    setInSearchMode(false);
  } 

  const handleReadingPlanError = (msg) => {
    setReadingPlanError(msg);
    setInSubmitMode(false);
  } 

  const handlePlanConstruction = async (e) => {
    try {
      setFormSubmitError({wasErrorReturned: false, errorMessage:''})
      setReadingPlanError('')
      setFormProblemAreas([])
      e.preventDefault();
      setInSubmitMode(true);
      const {validated, errorMessage, problemAreas} = readingPlanValidateInputs(e, measure);
      if(!validated) {
        handleReadingPlanError(errorMessage);
        setFormProblemAreas(problemAreas)
        return;
      }
      const bookData = {
        title: book.title,
        author: book.authors,
        thumbnail: selectedArtwork,
        isbn10: isbn10,
        isbn13: isbn13
      }
      const newPlan = constructReadingPlan(e, measure, bookData);
      //dispatch(addReadingPlan(newPlan));
      const newPlanToServer = await sendNewPlanToServer(newPlan, token);
      if(newPlanToServer) {
        dispatch(addReadingPlan(newPlan))
        history.push('/account');
      }
      setInSubmitMode(false);
      throw Error
    } catch (err) {
      setInSubmitMode(false);
      setFormSubmitError({wasErrorReturned: true, errorMessage:err.message})
    }
  }

  return (
    <div>
      <div className="btn backToResults" onClick={()=>history.push(backPath)}><img src={backArrow} className="backArrow" alt="back arrow"/>Back to Results</div>
    <div className="flexBoxByCols ">
      <div className="flexBoxByRows bookPage-row1 book-details-col">
        <div>
          <img alt="selected cover" className="selectedCover" src={selectedArtwork}/>
          <div className="btn" onClick={()=>setSelectedArtwork(thumbnail)}>Reset</div>
        </div>
        <div className="flexBoxByCols">
          <h2 className="book-main-details-text">{book.title}</h2>
          <h3 className="book-main-details-text">by {book.authors}</h3>
          <h4 className="book-main-details-text">ISBN (10 digit) {isbn10}</h4>
          <h4 className="book-main-details-text">ISBN (13 digit) {isbn13}</h4>
          {canonicalVolumeLink ? <a href={canonicalVolumeLink} target="_blank" className="btn btn-smaller-text">More Info at Google Books</a>: null}
        </div>
      </div>



      

      <form className="rp-form" onSubmit={e=>handlePlanConstruction(e)}>
      <h2 className="book-main-details-text">Reading Plan</h2>
        {readingPlanError?
        <ul className="problem-list">
        <li className="listItem-problem">Please address the following issues:</li>
        {readingPlanError.map(item => <li className="listItem-problem">{item}</li>)}
        </ul>
        :
        null}
        {formSubmitError.wasErrorReturned?
        <ul className="problem-list">
          <li className="listItem-problem">We are sorry but it looks like an unexpected error occurred whilst submitting your reading plan.  Please make sure the details enetered are correct and try again.  If the problem persists, please use the 'About' tab to let us know and quote the following:</li>
          <li className="listItem-problem">Error Message: {formSubmitError.errorMessage}</li>
        </ul>
        :
        null
        }
      <p className="reading-plan-explanation">In the boxes below, first choose whether you want to read a set number of chapters or pages per day (ebooks can also help you track locations and percentage).  You also need to specify which page/chapter/etc you are currently at or intend to start reading from as well as the last page/chapter/etc in the book.  Then let us know how many pages/chapters/etc you'll be reading each day or when you'd like to have finished reading by.  We'll then generate a plan for you to track your progress.</p>
      <div className="flexBoxByRows form-section">
        <div className="flexBoxByCols radio-column">
          <div className="radio-row">
            <p className="radio-title or">Measure your progress using:</p>
          </div>
          <div className="radio-row">
            <input type="radio" id="Pages" name="meausurement" value="Pages" onChange={()=>setMeasure('page')} checked/>
            <label for="Pages">Pages</label>
          </div>
          <div className="radio-row">
            <input type="radio" id="Chapters" name="meausurement" value="Chapters"  onChange={()=>setMeasure('chapter')}/>
            <label for="Chapters">Chapters</label>
          </div>
          
          <div className="radio-row">
            <input type="radio" id="Location" name="meausurement" value="Location" onChange={()=>setMeasure('location')}/>
            <label for="Location">Location</label>
          </div>
          <div className="radio-row">
            <input type="radio" id="Percentage" name="meausurement" value="Percentage" onChange={()=>setMeasure('percentage')}/>
            <label for="Percentage">Percentage</label>
          </div>
          <div className="breakLine"></div>
          <div className="or">When do you want to start?</div>
          <div className="radio-row">
              <label className="book-page-label" for="start">Start date</label>
              <input className={formProblemAreas.includes('startDate')?"input book-page-input red-border": "input book-page-input"} type="date" id="startDate" name="startDate" placeholder="Enter start date" required/>
            </div>
        </div>
        
        <div className="flexBoxByCols radio-column">
            <div className="mediaOnly breakLine"></div>
            <div className="or">Enter both:</div>
            <div className="radio-row">
              <label className="book-page-label" for="startAt">Starting {measure}</label>
              <input className={formProblemAreas.includes('startAt')?"input book-page-input red-border":"input book-page-input"} type="text" id="startAt" name="startAt" required/>
            </div>
            <div className="radio-row">
              <label className="book-page-label" for="endAt">End {measure}</label>
              <input className={formProblemAreas.includes('endAt')?"input book-page-input red-border":"input book-page-input"} type="text" id="endAt" name="endAt" required/>
            </div>
            <div className="breakLine"></div>
            <div className="or">Enter either:</div>
            <div className="radio-row">
              <label className="book-page-label makeFirstLetterUpper" for="per_day">{measure}s per day</label>
              <input className={formProblemAreas.includes('per_day')?"input book-page-input red-border":"input book-page-input"} type="text" id="per_day" name="per_day" />
            </div>
            <div className="or">OR</div>
            <div className="radio-row">
              <label className="book-page-label" for="end_date">End Date</label>
              <input className={formProblemAreas.includes('end_date')?"input book-page-input red-border":"input book-page-input"} type="date" id="end_date" name="end_date" placeholder="Enter the end date"/>
            </div>
        </div>
      </div>
      {inSubmitMode?
      <input type="submit" className="btn submit-btn book-page-submit btn-inSearchMode" value="---PLEASE WAIT---" disabled/>
      :
      <input type="submit" className="btn submit-btn book-page-submit" value="Create Reading Plan"/>
      }
      </form> 

      <div className="flexBoxByCols additionalArtContainer">
        <h2 className="additionalCoverText">Additional Cover Artwork</h2>
        <h4 className="additionalCoverText">from Open Library</h4>
        <p>Click the button below to find other covers form  <a href="https://openlibrary.org/" target="_blank">Open Libary</a>.  Simply click on the cover to make it the cover for your book.<br/>It can sometimes take upto 45 seconds to retrieve all the artwork so please be patient!</p>
        {inSearchMode? 
         <div className="btn submit-btn btn-inSearchMode" disbaled>---SEARCHING---</div>
        : 
        <div className="btn submit-btn" onClick={()=>getAdditionalCoverArtwork()}>Get More Artwork</div>
        }
        <div>
          {additionalCovers.map(cover=><img key={cover} className="additionalCover" alt="additional cover" src={cover} onClick={()=>setSelectedArtwork(cover)}/>)}
        </div>
      </div>
    
    </div>
    </div>
  )
}

export default Book;