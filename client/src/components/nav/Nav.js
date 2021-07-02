import bookImg from '../../assets/images/bookshelf.png'
import './nav.css';
import {useState} from 'react';
import { useHistory } from 'react-router-dom';

function Nav() {


  const [loggedIn, setloggedIn] = useState(true);

  //Links
  const history = useHistory();
  const landingPath = "/"
  const loginOrMyAccountPath = loggedIn? "/account" : "/login";

  //Need to add functionality to check whether logged in or not
  const accountButtonWording = loggedIn ? 'MY ACCOUNT': "LOGIN OR REGISTER"

  return (
    <div className="NavBar">
      <img className="bookImg" src={bookImg} alt="stack of books" onClick={()=> history.push(landingPath)}/>
      <h1 className="navTitle" onClick={()=> history.push(landingPath)}><span>M</span>Y <span>R</span>EADING <span>H</span>UB</h1>
      <div className="navButtonContainer">
        <div className="btn" onClick={()=> history.push(loginOrMyAccountPath)}>
          {accountButtonWording}
        </div>
        <div className="btn">
          ABOUT
        </div>
      </div>
    </div>
  )
}

export default Nav;