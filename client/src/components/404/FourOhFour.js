import fail from '../../assets/images/no-entry.png';
import '../verification/verification.css';

const FourOhFour = () => {

  return (
    <div className="verifyPage">
      <h1 className="success-title stop-title">!!! STOP !!!</h1>
      <img className="verify-img" src={fail} alt="success flag"/>
      <h3>Sorry, but only members of staff are allowed behind the counter - we respectfull ask you to return to main part of the site.  </h3>
    </div>
  )
}

export default FourOhFour;