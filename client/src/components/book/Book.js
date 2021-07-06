import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './book.css';
import { useHistory } from 'react-router-dom';
import bookImg from '../../assets/images/defaultSmallBook.png';
import { extractItemFromObject, covertSearchString } from '../../functions/commonFunctions';
import { OLAdditionalCoverArtFinder } from '../../functions/externalApiFunctions';
import backArrow from '../../assets/images/back.png'

function Book() {

  const [additionalCovers, setAdditionalCovers] = useState([])

  const history = useHistory();
  const dispatch = useDispatch();
  const book = useSelector(state => state.selectedBookReducer);
  const backPath = '/account';
 

  const thumbnail = extractItemFromObject(['thumbnail'],book.imageLinks, bookImg);
  const isbn10 = extractItemFromObject(['identifier'],book.industryIdentifiers[0], 'Not supplied');
  const isbn13 = extractItemFromObject(['identifier'],book.industryIdentifiers[1], 'Not supplied');
  const canonicalVolumeLink = extractItemFromObject(['canonicalVolumeLink'], book, null)

  const [selectedArtwork, setSelectedArtwork] = useState(thumbnail)
  
  const getAdditionalCoverArtwork = async () => {
    let i = 0
    while (i < 8) {
      const titleForOL = covertSearchString(String(book.title));
      const authorForOL = covertSearchString(String(book.authors));
      const additionalArtLinks = await OLAdditionalCoverArtFinder(titleForOL, authorForOL);
      setAdditionalCovers(additionalArtLinks);
      i++;
      if(additionalArtLinks.length > 25) {
        break;
      }
    }
  } 

  return (
    <div>
      <div className="btn backToResults" onClick={()=>history.push('/account')}><img src={backArrow} className="backArrow" alt="back arrow"/>Back to Results</div>
    <div className="flexBoxByCols">
      <div className="flexBoxByRows bookPage-row1">
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
      <div className="flexBoxByCols rp-Container">
        <h2>Reading Plan Details</h2>
        <div className="flexBoxByRows rp-Row">
          <div className="flexBoxByCols rp-Col">
            <p>Measure progress by:</p>
          </div>
          <div className="flexBoxByCols rp-Col">
            <form>
              <label>Start</label>
            </form>
          </div>
        </div>
      </div>
      <div className="flexBoxByCols additionalArtContainer">
        <h2 className="additionalCoverText">Additional Cover Artwork</h2>
        <h4 className="additionalCoverText">from Open Library</h4>
        <div className="btn submit-btn" onClick={()=>getAdditionalCoverArtwork()}>Get More Artwork</div>
        <div>
          {additionalCovers.map(cover=><img key={cover} className="additionalCover" alt="additional cover" src={cover} onClick={()=>setSelectedArtwork(cover)}/>)}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Book;