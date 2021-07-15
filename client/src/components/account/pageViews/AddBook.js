import './pageViews.css';
import './addBook.css';
import BookSearchResult from '../../book/BookSearchResult';
import { returnSearchResults } from '../../../functions/externalApiFunctions';
import { covertSearchString } from '../../../functions/commonFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { loadSearchItems, deleteSearchItems } from '../../../state/actions';
import { useState } from 'react';
import { addSelectedBook } from '../../../state/actions';
import { useHistory } from 'react-router-dom';

function AddBook () {

  const [inSearchMode, setInSearchMode] = useState(false)

  const history = useHistory();
  const dispatch = useDispatch();
  const selectedBookPath = '/selectedBook'

  const searchResults = useSelector(state => state.searchReducer);

  const handleOpenLibrarySearch = async (e) => {
    e.preventDefault();
    setInSearchMode(true)
    dispatch(deleteSearchItems());
    try {
      const title = covertSearchString(e.target.search_title.value);
      const author = covertSearchString(e.target.search_author.value);
      const results = await returnSearchResults(title, author);
      dispatch(loadSearchItems(await results));
    } catch (error) {
      return;
    }
    setInSearchMode(false)
  }

  const handleClearSearch = () => {
    dispatch(deleteSearchItems());
  }

  const handleAddManualBook = (e) => {
    e.preventDefault()
    const title = e.target.manual_title.value;
    const author = [e.target.manual_author.value];
    dispatch(addSelectedBook({title: title, authors: author, industryIdentifiers: {0: null, 1: null}}));
    history.push(selectedBookPath)
  }

  return (
    <div>
      <h2 className="pv-pageTitle">Add a book</h2>
      <div className="addBookPage">
        <div className="manualAddView addBookSection">
          <h3>Manual Add</h3>
          <form className="addBookForm" onSubmit={e => handleAddManualBook(e)}>
            <label for="manual_title">Book Title</label>
            <input className="input ab-search-input" name="manual_title" id="manual_title" placeholder="Enter book title" required/>
            <label for="manual_author">Author Name</label>
            <input className="input ab-search-input" name="manual_author" id="manual_author" placeholder="Enter book author" required/>
            <input type="submit" className="btn submit-btn add-book-submit-btn"/>
          </form>
        </div>
        <div className="openLibraryAddView addBookSection">
        <h3>From Google Books</h3>
          <form className="addBookForm" onSubmit={e=>handleOpenLibrarySearch(e)}>
            <label for="search_title">Book Title</label>
            <input className="input ab-search-input" name="search_title" id="search_title" placeholder="Enter book title" required/>
            <label for="search_author">Author Name</label>
            <input className="input ab-search-input" name="search_author" id="search_author" placeholder="Enter book author" required/>
            {inSearchMode?
            <input type="submit" className="btn submit-btn add-book-submit-btn btn-inSearchMode" value="---SEARCHING---" disabled/>
            :
            <input type="submit" className="btn submit-btn add-book-submit-btn" value="Search"/>
            }
            
            
          </form>
          <div className="searchResultsBox">
            <div className="btn submit-btn add-book-submit-btn clear-btn" onClick={()=>handleClearSearch()}>Clear Search Results</div>
            <h4 className="search-title">Search Results:</h4>
            <div className="searchResultsInnerBox">
              {searchResults.length > 1? 
                searchResults.map(item => <BookSearchResult item={item.volumeInfo}/> )
              :null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBook