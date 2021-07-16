import emailImg from '../../assets/images/email.png';
import './verification.css';
import { useState } from 'react'
const { resendVerificationEmail } = require('../../functions/registrationFunctions');

const NotVerified = () => {

  const [emailSent, setEmailSent] = useState(false)

  const searchparams = new URLSearchParams(window.location.search);
  const email = searchparams.get('email');

  const handleSendNewEmail =()=> {
    resendVerificationEmail(email);
    setEmailSent(true);
  }

  return (
    <div className="verifyPage">
      <h1 className="success-title">Please verify your email address!</h1>
      <img className="verify-img" src={emailImg} alt="email"/>
      <h3>It looks like your email is not verified yet! Check your email inbox (... or your spam folder!) and click the link in the email we have sent you.  If you need us to re-send the email, click the link below.</h3>
      {emailSent?
      <h2>...Sent... Please check your email</h2> 
      :
      <div className="btn login-btn" onClick={()=>handleSendNewEmail()}>Resend Email</div>
      }
      
    </div>
  )
}

export default NotVerified;