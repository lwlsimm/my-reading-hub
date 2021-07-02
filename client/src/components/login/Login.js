import './login.css'
import google from '../../assets/images/google-plus.png';

function Login () {
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
        <div>
          <h3>or login with Google+</h3>
          <img class="googleIcon" alt="google" src={google}/>
        </div>
      </div>
      <div className="halfPage">
        <div className="regDivider"></div>
        <h2>Register</h2>
        <div>
          <form className='form'>
            <label for="email">Email Address</label>
            <input className="input" name="email" id="email" placeholder="Enter email address"/>
            <label for="password">Password</label>
            <div className="registrationPasswordContainer">
              <input className="input input-registration-pw" name="password" id="password" type="password" placeholder="Enter password"/>
              <input className="input input-registration-pw" name="re-password" id="re-password" type="password" placeholder="Re-enter password"/>
            </div>
            <input type="submit" className="btn submit-btn"/>
          </form>
        </div>
        <div className="sectionDivider"></div>
        <div>
          <h3>or register using Google+</h3>
          <img alt="google" class="googleIcon regIcon" src={google}/>
        </div>
      </div>
    </div>
  )
};

export default Login;