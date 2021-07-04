import success from '../../../assets/images/success.png';
import  '../../verification/verification.css'
import { useHistory } from 'react-router-dom';

const RegisterSuccess = () => {
  
  const history = useHistory();
  const loginPath = "/login";

  return (
    <div className="verifyPage">
      <h1 className="success-title">Success!</h1>
      <img className="verify-img" src={success} alt="success flag"/>
      <h2>Thank you for registering!  You will shortly recieve an email asking you to confirm your email address.  Click the link in that email to get started.</h2>
    </div>
  )
}

export default RegisterSuccess;