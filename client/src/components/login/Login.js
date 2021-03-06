import './login.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, deleteSearchItems, deleteSelectedBook, clearPlans, addReadingPlan } from '../../state/actions';
//import {ReadingPlanFromServer} from '../../classes/ReadingPlanFromServer'
import { ReadingPlan } from '../../classes/ReadingPlan';


const { registerUser } = require('../../functions/registrationFunctions');
const { loginUser, passwordResetRequest } = require('../../functions/loginFunctions');

function Login () {

  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [loginErrorMessage, setloginErrorMessage] = useState("");
  const [resetEmailRequestSent, setResetEmailRequestSent] = useState(false);
  const [inSubmitMode, setInSubmitMode] = useState(false);

  const dispatch = useDispatch()
  const history = useHistory();
  const registerSucessPath = '/registersuccess';
  const emailNotVerifiedPath = "/notverified/?email=";
  const accountPath = "/account";
  const resetPath = '/passwordreset/?code='

  function performClearState () {
    dispatch(clearPlans());
    dispatch(deleteSearchItems());
    dispatch(deleteSelectedBook());
}

  const handleRegistration = async (e) => {
    setInSubmitMode(true);
    setRegisterErrorMessage('');
    e.preventDefault();
    try {
      performClearState()
      const registration = await registerUser(e);
      if(registration.data['outcome'] === 'success') {
        history.push(registerSucessPath);
      } else {
        throw new Error(`Something did not quite work with your registration.  Please contact us via the 'About' tab at the top of the page!  Apologies for the inconvenience`);
      }
      setInSubmitMode(false);
    } catch (err) {
      setRegisterErrorMessage(err.message);
      setInSubmitMode(false);
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetEmailRequestSent(true);
    const email = e.target.email.value;
    passwordResetRequest(email);
  }

  const handleLoginAttempt = async (e) => {
    setInSubmitMode(true);
    setloginErrorMessage('');
    e.preventDefault();
    try {
      const response = await loginUser(e.target.login_email.value, e.target.login_password.value);
      if(response.data['is_verified'] === 'reset') {
        history.push(resetPath + response.data['code']);
        return;
      }
      if(!response.data['is_verified']){
        history.push(emailNotVerifiedPath + response.data['email']);
      }
      const plan_package = await response.data.plan_package;
      plan_package.map(plan => {
        const plan_details = JSON.parse(plan.plan_details);
        const plan_scheme = JSON.parse(plan.plan_scheme);
        // const newPlan = new ReadingPlanFromServer(plan_details, plan_scheme);
        const {id, plan_start_date, start_at, end_at, per_day, end_date, per_day_type, measure, book_data } = plan_details;
        const newPlan = new ReadingPlan(id, plan_start_date, start_at, end_at, per_day, end_date, per_day_type, measure, book_data, plan_scheme)
        dispatch(addReadingPlan(newPlan));
        return;
      })
      dispatch(login(response.data));
      setInSubmitMode(false);
      history.push(accountPath);
    } catch (err) {
      setloginErrorMessage(err.message);
      setInSubmitMode(false);
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
            {inSubmitMode ?
            <input type="submit" className="btn submit-btn btn-inSearchMode" value="...please wait..." disabled/>
            :
            <input type="submit" className="btn submit-btn"/>
            }
            
          </form>
        </div>
        <div className="sectionDivider flexBoxByCols"></div>
        <div className=" flexBoxByCols">
        <h2>Forgotten Password?</h2>
        <p className="login-para">Enter your email below.  If the email exists in our system, you will be sent a temporary password.</p>
        <form className='form' onSubmit={e=>handleResetPassword(e)}>
            {resetEmailRequestSent? <h4>Check your email for the reset password</h4>:null}
            <input className="input" name="email" id="login_email" placeholder="Enter email address" required/>
            <input type="submit" className="btn submit-btn"/>
          </form>
          </div>
        
        
        {
        /* 
        <div className="sectionDivider"></div>
        <div>
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
            <div>
            <h4>Terms</h4>
              <p className="terms">By accessing this website, you are agreeing to be bound by these website Terms, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.  Any claim or dispute relating to this website shall be governed solely by the laws of England & Wales.</p>
              <p className="terms">Use of this site is free of charge and permission to use it can be withdrawn by a site administrator at any time for any lawful reason.</p>
              <p className="terms">The only data that this site stores about you is the data you yourself input: i.e. your email address, your password, the books you are reading and the progress you have made in reading these books. All of the book data can be viewed by you from the 'My Account' section of this site. <span className="bold">Your data will never be sold and nor will it be used for any other purpose than allowing you to enjoy our website.</span> If you want to delete the data we hold about you then you can delete your account via the Settings page or you can delete individuals books via the 'My Account'. If you have any data concerns or questions, please use the contact form in the 'About' page.</p>
              <p className="terms">The data held on this site may be deleted without warning at any time by the administrator.</p>
            </div>  
            {inSubmitMode ?
            <input type="submit" className="btn submit-btn btn-inSearchMode"  value="...please wait..." disabled/>
            :
            <input type="submit" className="btn submit-btn register-btn" value="I consent to the above term and wish to register"/>
            }
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

export default Login;