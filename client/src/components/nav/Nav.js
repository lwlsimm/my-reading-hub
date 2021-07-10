import bookImg from '../../assets/images/bookshelf.png'
import './nav.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {

  const history = useHistory();
  const landingPath = "/";
  const aboutPath = "/about";

  const loggedIn = useSelector(state => state.loginReducer.loggedIn);

  const loginOrMyAccountPath = loggedIn? "/account" : "/login";
  const accountButtonWording = loggedIn ? 'MY ACCOUNT': "LOGIN OR REGISTER";

  return (
    <div className="NavBar">
      <img className="bookImg" src={bookImg} alt="stack of books" onClick={()=> history.push(landingPath)}/>
      <h1 className="navTitle" onClick={()=> history.push(landingPath)}><span>M</span>Y <span>R</span>EADING <span>H</span>UB</h1>
      <div className="navButtonContainer">
        <div className="btn nav-btn" onClick={()=> history.push(loginOrMyAccountPath)}>
          {accountButtonWording}
        </div>
        <div className="btn nav-btn" onClick={()=> history.push(aboutPath)}>
          ABOUT
        </div>
      </div>
    </div>
  )
}

export default Nav;