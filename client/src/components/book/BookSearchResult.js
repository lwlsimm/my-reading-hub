import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSelectedBook } from '../../state/actions';

function BookSearchResult (props) {

  const history = useHistory();
  const dispatch = useDispatch();
  const selectedBookPath = '/selectedBook'

  const selectBook = () => {
    dispatch(addSelectedBook(props.item))
    history.push(selectedBookPath)
  }

  
  let thumbnail
  try {
    thumbnail = props.item.imageLinks['smallThumbnail']
  } catch {
    thumbnail = null
  }

  return (
    <div key={props.item.key} className="BookSearchResult">
      {/* <div className="btn bookSearchBtn" onClick={()=>selectBook()}>Select Book</div> */}
      <img src={thumbnail}/>
      <div className="searchResultText">
        <p>{props.item.title}</p>
        <p>{props.item.authors}</p>
      </div>
    </div>
  )
}

export default BookSearchResult;