import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSelectedBook } from '../../state/actions';
import bookImg from '../../assets/images/defaultSmallBook.png'
import './book.css'
import '../account/pageViews/addBook.css'
import { extractItemFromObject } from '../../functions/commonFunctions';

function BookSearchResult (props) {

  const history = useHistory();
  const dispatch = useDispatch();
  const selectedBookPath = '/selectedBook'

  const selectBook = () => {
    dispatch(addSelectedBook(props.item));
    history.push(selectedBookPath)
  }

  const thumbnail = extractItemFromObject([`imageLinks`,`smallThumbnail`],props.item,bookImg)
  

  return (
    <div key={props.item.key} className="BookSearchResult" onClick={()=>{selectBook()}}>
      {/* <div className="btn bookSearchBtn" onClick={()=>selectBook()}>Select Book</div> */}
      <img className="smallBookImg" src={thumbnail}/>
      <div className="searchResultText">
        <p>{props.item.title}</p>
        <p>{props.item.authors}</p>
      </div>
    </div>
  )
}

export default BookSearchResult;