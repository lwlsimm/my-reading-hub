import './login.css';
import google from '../../assets/images/google-plus.png';
import { useState } from 'react'


const { registerUser } = require('../../functions/registrationFunctions');

function Login () {

  const [registerErrorMessage, setRegisterErrorMessage] = useState("")

  const handleRegistration = async (e) => {
    setRegisterErrorMessage('')
    e.preventDefault();
    try {
      const registration = await registerUser(e)
    } catch (err) {
      setRegisterErrorMessage(err.message);
    }
  }

  return (
    <div className="Page LoginPage">
      <div className="halfPage loginContainer">
        <h2>Login</h2>
        <div>
          <form className='form'>
            <label for="email">Email Address</label>
            <input className="input" name="email" id="email" placeholder="Enter email address"/>
            <label for="password">Password</label>
            <input className="input" name="password" id="password" type="password" placeholder="Enter password"/>
            <input type="submit" className="btn submit-btn"/>
          </form>
          
        </div>
        <div className="sectionDivider"></div>
        {/* <div>
          <h3>or login with Google+</h3>
          <img class="googleIcon" alt="google" src={google}/>
        </div> */}
      </div>
      <div className="halfPage">
        <div className="regDivider"></div>
        <h2>Register</h2>
        {registerErrorMessage != "" ? <p className="errorParagraph">{registerErrorMessage}</p>: null}
        <div>
          <form className='form' onSubmit={(e)=> handleRegistration(e)}>
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
        <div className="sectionDivider"></div>
        {/* <div>
          <h3>or register using Google+</h3>
          <img alt="google" class="googleIcon regIcon" src={google}/>
        </div> */}
      </div>
    </div>
  )
};

export default Login;