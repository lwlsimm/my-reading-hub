import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Nav from './components/nav/Nav';
import LandingPage from './components/landing/LandingPage';
import Login from './components/login/Login';
import Account from './components/account/Account';

function App() {


  return (
    <Router>
    <div className="AppPage">
      <Nav/>
      <Switch>
        <Route path="/" exact component={LandingPage}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/account" exact component={Account}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
