import success from '../../assets/images/success.png';
import './verification.css'
import { useHistory } from 'react-router-dom';

const VerificationSuccess = () => {
  
  const history = useHistory();
  const loginPath = "/login";

  return (
    <div className="verifyPage">
      <h1 className="success-title">Success!</h1>
      <img className="verify-img" src={success} alt="success flag"/>
      <h2>You are all set!  Please login below to get started on your next book journey!</h2>
      <div className="btn login-btn" onClick={()=> history.push(loginPath)}>Login</div>
    </div>
  )
}

export default VerificationSuccess;