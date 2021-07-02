import './account.css'
import gear from '../../assets/images/gear.png';
import openBook from '../../assets/images/open-book.png';
import closedBooks from '../../assets/images/closed-books.png';
import addBook from '../../assets/images/add-book.png';

function Account() {
  return(
    <div className="Page account-page-grid">
      <div className="account-sidebar">
        <div className="btn account-page-btn"><img src={openBook} alt="open book icon" className="sidebar-icon"/>Currently Reading</div>
        <div className="btn account-page-btn"><img src={closedBooks} alt="closed books icon" className="sidebar-icon"/>Finished Reading</div>
        <div className="btn account-page-btn"><img src={addBook} alt="add book icon" className="sidebar-icon"/>Add a Book</div>
        <div className="btn account-page-btn"><img src={gear} alt="gear icon" className="sidebar-icon"/>  Settings</div>
      </div>

      <div className="account-book-container">
      
      </div>
    </div>
  )
}

export default Account;