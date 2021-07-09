import './account.css'
import gear from '../../assets/images/gear.png';
import openBook from '../../assets/images/open-book.png';
import closedBooks from '../../assets/images/closed-books.png';
import addBook from '../../assets/images/add-book.png';
import logout_icon from '../../assets/images/logout.png';
import { useDispatch } from 'react-redux';
import { logout, clearPlans, deleteSearchItems, deleteSelectedBook } from '../../state/actions';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Current from './pageViews/Current';
import Finished from './pageViews/Finished';
import AddBook from './pageViews/AddBook';
import Settings from './pageViews/Settings';


function Account() {

  const [pageView,setPageView] = useState('Current')

  const dispatch = useDispatch();
  const history = useHistory();
  const landingPath = "/"

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(clearPlans());
    dispatch(deleteSearchItems());
    dispatch(deleteSelectedBook());
    history.push(landingPath)
  }

  let pageDisplay;

  switch(pageView) {
    case 'Current':
      pageDisplay = <Current />;
      break;
    case 'Finished':
      pageDisplay = <Finished />;  
      break;
    case 'AddBook':
      pageDisplay = <AddBook />;  
      break;
    case 'Settings':
      pageDisplay = <Settings />;  
      break;
    default:
      pageDisplay = <Current />;
  }

  return(
    <div className="Page account-page-grid">
      <div className="account-sidebar">
        <div className="btn account-page-btn" onClick={()=>setPageView('Current')}><img src={openBook} alt="open book icon" className="sidebar-icon" /><span className="account-btn-wording">Current</span></div>
        <div className="btn account-page-btn" onClick={()=>setPageView('Finished')}><img src={closedBooks} alt="closed books icon" className="sidebar-icon" /><span className="account-btn-wording">Finished</span></div>
        <div className="btn account-page-btn" onClick={()=>setPageView('AddBook')}><img src={addBook} alt="add book icon" className="sidebar-icon"/><span className="account-btn-wording">Add</span></div>
        <div className="btn account-page-btn" onClick={()=>setPageView('Settings')}><img src={gear} alt="gear icon" className="sidebar-icon"/> <span className="account-btn-wording">Settings</span></div>
        <div className="btn account-page-btn" onClick={()=>handleLogOut()}><img src={logout_icon} alt="door icon" className="sidebar-icon"/>  <span className="account-btn-wording">Logout</span></div>
      </div>

      <div className="account-book-container">
        {pageDisplay}
      </div>
    </div>
  )
}

export default Account;