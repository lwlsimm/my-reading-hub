import fail from '../../assets/images/oops.png';
import './verification.css';

const VerificationFail = () => {
  

  return (
    <div className="verifyPage">
      <h1 className="success-title">Hmmm...</h1>
      <img className="verify-img" src={fail} alt="oops face"/>
      <h3>It looks like we couldn't verify your email address.  Perhaps the link you clicked was more than 2 hours old - don't worry, we've just sent you another! If the problem persists then please contact us through the 'About' button at the top of the page.  We are sorry for the inconvenience! </h3>
    </div>
  )
}

export default VerificationFail;