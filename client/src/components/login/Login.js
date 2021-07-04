import './login.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../state/actions';


const { registerUser } = require('../../functions/registrationFunctions');
const { loginUser } = require('../../functions/loginFunctions');

function Login () {

  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [loginErrorMessage, setloginErrorMessage] = useState("");

  const dispatch = useDispatch()
  const history = useHistory();
  const registerSucessPath = '/registersuccess';
  const emailNotVerifiedPath = "/notverified/?email=";
  const accountPath = "/account";

  const handleRegistration = async (e) => {
    setRegisterErrorMessage('');
    e.preventDefault();
    try {
      const registration = await registerUser(e);
      if(registration.data['outcome'] === 'success') {
        history.push(registerSucessPath);
      } else {
        throw new Error(`Something did not quite work with your registration.  Please contact us via the 'About' tab at the top of the page!  Apologies for the inconvenience`)
      }
    } catch (err) {
      setRegisterErrorMessage(err.message);
    }
  }

  const handleLoginAttempt = async (e) => {
    setloginErrorMessage('');
    e.preventDefault();
    try {
      const response = await loginUser(e.target.login_email.value, e.target.login_password.value);
      if(!response.data['is_verified']){
        history.push(emailNotVerifiedPath + response.data['email']);
      }
      dispatch(login(response.data));
      history.push(accountPath);
    } catch (err) {
      setloginErrorMessage(err.message)
    }
  }

  return (
    <div className="Page LoginPage">
      <div className="halfPage loginContainer">
        <h2>Login</h2>
        {loginErrorMessage !== "" ? <p className="errorParagraph">{loginErrorMessage}</p>: null}
        <div>
          <form className='form' onSubmit={(e)=> handleLoginAttempt(e)}>
            <label for="email">Email Address</label>
            <input className="input" name="email" id="login_email" placeholder="Enter email address" required/>
            <label for="password">Password</label>
            <input className="input" name="login_password" id="password" type="password" placeholder="Enter password" required/>
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
        {registerErrorMessage !== "" ? <p className="errorParagraph">{registerErrorMessage}</p>: null}
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