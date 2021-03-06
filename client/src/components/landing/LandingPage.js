import './landingPage.css'
import landingbg from '../../assets/images/landing-bg.jpg';
import books from '../../assets/images/book-pile.png';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { authenticateSession } from '../../functions/loginFunctions';
import { logout, clearPlans, deleteSearchItems, deleteSelectedBook } from '../../state/actions';

function LandingPage () {

  const loggedIn = useSelector(state => state.loginReducer.loggedIn);
  const token = useSelector(state => state.loginReducer.token);
  const dispatch = useDispatch();
  const searchparams = new URLSearchParams(window.location.search);
  const redir = searchparams.get('redir');

  const history = useHistory();
  const loginOrMyAccountPath = loggedIn? "/account" : "/login";
  if(redir) history.push(`/${redir}`);

  function performLogout () {
      dispatch(logout());
      dispatch(clearPlans());
      dispatch(deleteSearchItems());
      dispatch(deleteSelectedBook());
  }

  useEffect(async ()=> {
    try {
      const isSessionVald = await authenticateSession(token);
      if(await isSessionVald === false) {
      performLogout();
      return;
      }
      return;
    } catch (error) {
      performLogout();
    }
  },[])

  return (
    <div className="Page">
      <div className="landingPage-container">
        <div className="landing-box landing-text">
          <h1 className="landing-title">Read Smarter...</h1>
          <p>Setting goals works!  Whether you have one novel that you want to make sure you get to the end of or whether you are preparing for exams and want to organise your reading schedule, we can help.</p>
          <p>Create an account, select your book(s) and set your goals.  Goals can be changed at any time so feel free to experiment.</p>
          <p>Please check out the about page, especially if you want to leave feedback about functionality we could include to improve the user experience.  This app is provided completely free of charge and free of advertising and is therefore staffed by volunteers ... so please be patient!  If you happen to be a programmer, we are always looking for an extra pair of hands so that we can improve!</p>
          <div className="started" onClick={()=> history.push(loginOrMyAccountPath)}>
            <img className="bookPileImg" alt="pile of books" src={books}/>
            <h2>Let's get started!</h2>
          </div>
          <p className="credit">Credit for landing page photo: <a href="https://unsplash.com/@mrrrk_smith" target="_blank" rel="noreferrer">John-Mark Smith</a> </p>
        </div>
        <div className="landing-pic-conatiner landing-box">
          <img className="landing-image" src={landingbg} alt="books on a windowsil"/>
        </div>
      </div>
    </div>
  )
}

export default LandingPage;