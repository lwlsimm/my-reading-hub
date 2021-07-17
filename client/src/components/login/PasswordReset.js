import './login.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';



const { updatePasswordAfterReset } = require('../../functions/loginFunctions');

function PasswordReset () {

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const searchparams = new URLSearchParams(window.location.search);
  const code = searchparams.get('code');

  const handlePasswordUpdateFromReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const password = e.target.password.value;
      const reenteredpassword = e.target.reenteredpassword.value;
      const email = e.target.email.value;
      if(password !== reenteredpassword) {
        setErrorMessage("Passwords must match!");
        return
      }
      const passwordUpdated = await updatePasswordAfterReset (email, password, code);
      if(passwordUpdated) {
        setSuccessMessage('Your password was updated.  You can now login as normal');
        return
      } else {
        throw Error;
      }
    } catch (error) {
      setErrorMessage("Something went wrong!  Please try again!");
    }
  }
  
  return (
    <div className="Page LoginPage">
     <div className="fullPage">
        <div className="regDivider"></div>
        <h2>Reset Your Password</h2>
        <p>Eneter your email address and new password below.</p>
        {successMessage !== "" ? <p className="green-text">{successMessage}</p>: null}
        {errorMessage !== "" ? <p className="errorParagraph red-text">{errorMessage}</p>: null}
        <div>
          <form className='form' onSubmit={e=>handlePasswordUpdateFromReset(e)}>
            <label for="email">Email Address</label>
            <input className="input" name="email" id="email" placeholder="Enter email address" required/>
            <label for="password">Password</label>
            <div className="registrationPasswordContainer">
              <input className="input input-registration-pw" name="password" id="password" type="password" placeholder="Enter password" required minlength="8"/>
              <input className="input input-registration-pw" name="reenteredpassword" id="reenteredpassword" type="password" placeholder="Re-enter password" required minlength="8"/>
            </div>
            <input type="submit" className="btn submit-btn"/>
          </form>
        </div>
        
        {/* 
        <div className="sectionDivider"></div>
        <div>
          <h3>or register using Google+</h3>
          <img alt="google" class="googleIcon regIcon" src={google}/>
        </div> */}
      </div>
    </div>
  )
};

export default PasswordReset;