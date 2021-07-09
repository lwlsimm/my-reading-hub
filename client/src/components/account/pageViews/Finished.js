import './pageViews.css';
import { useSelector, useDispatch } from 'react-redux';
import PageViewBook from '../../book/PageViewBook';


function Finished () {

  const books = useSelector(state => state.planReducer.plans);

  function getNextItemInScheme (book) {
    for(let i = 1; i <= Object.keys(book.plan_scheme).length; i++) {
      if(book.plan_scheme[i].completed === false) {
        return 'unfinished'
      }
    }
    return 'finished'
  }

  return (
    <div className="currentView">
      <h1>Finished Reading</h1>
      {books.map(book =>{ 
        if(getNextItemInScheme(book)==='finished'){
          return(<PageViewBook book={book}/>)
        } 
        return null;
      }
      )}
    </div>
  )
}

export default Finished