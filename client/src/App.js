import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Nav from './components/nav/Nav';
import LandingPage from './components/landing/LandingPage';
import Login from './components/login/Login';
import Account from './components/account/Account';
import VerificationSuccess from './components/verification/VerifticationSuccess';
import VerificationFail from './components/verification/VerifticationFail';
import NotVerified from './components/verification/NotVerified'
import FourOhFour from './components/404/FourOhFour';


function App() {


  return (
    <Router>
    <div className="AppPage">
      <Nav/>
      <Switch>
        <Route path="/" exact component={LandingPage}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/account" exact component={Account}/>
        <Route path="/verificationsuccess" exact component={VerificationSuccess}/>
        <Route path="/verificationfail" exact component={VerificationFail}/>
        <Route path="/404" exact component={FourOhFour}/>
        <Route path="/notverified" exact component={NotVerified}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
