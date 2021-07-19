import './pageViews.css';
import { useState } from 'react';
import { changePassword, changeEmail, deleteAllPlansFromServer, deleteAccount } from '../../../functions/settingFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout, clearPlans, deleteSearchItems, deleteSelectedBook } from '../../../state/actions';


function Settings () {

  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [changeEmailMode, setChangeEmailMode] = useState(false);
  const [deletePlansMode, setDeletePlansMode] = useState(false);
  const [deleteAccountMode, setDeleteAccountMode] = useState(false);
  const [serverMessage,setServerMessage] = useState(null)
  const [errorMsg,setErrorMsg] = useState(null);
  const [inSubmitMode, setInSubmitMode] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch()
  const token = useSelector(state => state.loginReducer.token);
  const registerSucessPath = '/registersuccess';


  const handleToggleMode = (mode) => {
    setServerMessage(null);
    setErrorMsg(null);
    let password, email, deletePlans, deleteAccount = false;
    switch (mode) {
      case 'password':
        password = !changePasswordMode;
        break;
      case 'email':
        email = !changeEmailMode;
        break;
      case 'deletePlans':
        deletePlans = !deletePlansMode;
        break;
      case 'deleteAccount':
        deleteAccount = !deleteAccountMode;
        break;
      default:
        break;
    }
    setChangePasswordMode(password);
    setChangeEmailMode(email);
    setDeletePlansMode(deletePlans);
    setDeleteAccountMode(deleteAccount);
  }

  const handleChangePassword = async (e) => {
    try {
      e.preventDefault();
      setInSubmitMode(true)
      setErrorMsg(null);
      setServerMessage(null);
      const current_password = e.target.current_password.value;
      const password = e.target.new_password.value;
      const confirm_password = e.target.confirm_password.value;
      if(confirm_password !== password) {
        setErrorMsg('Passwords do not match!');
        setInSubmitMode(false);
        return;
      }
      const passwordChanged = await changePassword(token, password, current_password);
      if (passwordChanged) {
        setServerMessage('Your password was changed');
      } else {
        setErrorMsg('There was a problem changing your password.  Please logout and back in again and then try again!');
      }
      setInSubmitMode(false) 
    } catch (error) {
      setErrorMsg('There was a problem changing your password.  Please logout and back in again and then try again!');
      setInSubmitMode(false);
    }
  }

  const handleChangeEmail = async (e) => {
    try {
      e.preventDefault();
      setInSubmitMode(true)
      setErrorMsg(null);
      setServerMessage(null);
      const current_password = e.target.current_password.value;
      const email = e.target.email.value;
      const confirm_email = e.target.confirm_email.value;
      if(confirm_email !== email) {
        setErrorMsg('Email addresses do not match!');
        return;
      }
      const emailChanged = await changeEmail(token, email, current_password);
      if(emailChanged) {
        performLogout();
        history.push(registerSucessPath);
      } else {
        setErrorMsg('There was a problem changing your email.  Please logout and back in again and then try again!');
        setInSubmitMode(false);
      }
    } catch (error) {
      setErrorMsg('There was a problem changing your email.  Please logout and back in again and then try again!');
      setInSubmitMode(false);
    }
  }

  const handleDeletePlans = async (e) => {
    try {
      e.preventDefault();
      setInSubmitMode(true)
      setErrorMsg(null);
      setServerMessage(null);
      const current_password = e.target.current_password.value;
      const plansDeleted = await deleteAllPlansFromServer(token, current_password);
      if(plansDeleted) {
        dispatch(clearPlans());
        setInSubmitMode(false);
        setServerMessage('Your plans have been deleted');
        return;
      }
      throw Error;
    } catch (error) {
      setErrorMsg('There was a problem deleting your plans.  Please logout and back in again and then try again!');
      setInSubmitMode(false);
    }
  }

  const handleDeleteAccount = async (e) => {
    try {
      e.preventDefault();
      setInSubmitMode(true);
      setErrorMsg(null);
      setServerMessage(null);
      const current_password = e.target.current_password.value;
      const accountDeleted = await deleteAccount(token, current_password);
      if(accountDeleted) {
        performLogout();
        history.push('/')
      }
      throw Error;
    } catch (error) {
      setErrorMsg('There was a problem deleting your account.  Please logout and back in again and then try again!');
      setInSubmitMode(false);
    }
  }


  function performLogout () {
    dispatch(logout());
    dispatch(clearPlans());
    dispatch(deleteSearchItems());
    dispatch(deleteSelectedBook());
}

  return (
    <div className="currentView Page">
      <h1>Settings</h1>
      <div className="flexBoxByCols">
        <div className="btn setting-btn" onClick={()=>handleToggleMode('password')}>Change Password</div>
        {changePasswordMode?  
        <form className="flexBoxByCols" onSubmit={e=>handleChangePassword(e)}>
          {errorMsg?<h3 className="red-text">{errorMsg}</h3>:null}
          {serverMessage?<h3 >{serverMessage}</h3>:null}
          <div className="flexBoxByRows setting-container">
            <input type="password" className="setting-input" id="current_password" placeholder="Current Password" required/>
            <div className="flexBoxByCols">
              <input type="password" className="setting-input" id="new_password" placeholder="New Password" required/>
              <input type="password" className="setting-input" id="confirm_password" placeholder="Confirm new Password" required/>
            </div>
          </div>
          {inSubmitMode?
          <input type="submit" className="btn submit-btn btn-inSearchMode" disabled/>
          :
          <input type="submit" className="btn submit-btn"/>
          }
        </form>
        :
        null}


      </div>
      <div className="flexBoxByCols">
        <div className="btn setting-btn" onClick={()=>handleToggleMode('email')}>Change Email Address</div>
        {changeEmailMode?
        <form className="flexBoxByCols " onSubmit={e=>handleChangeEmail(e)}>
          {errorMsg?<h3 className="red-text">{errorMsg}</h3>:null}
          {serverMessage?<h3 >{serverMessage}</h3>:null}
          <div className="flexBoxByRows setting-container">
            <input type="password" className="setting-input" placeholder="Current Password" id="current_password"/>
            <div className="flexBoxByCols">
              <input type="email" className="setting-input" id="email" placeholder="New email"/>
              <input type="email"  className="setting-input" id="confirm_email" placeholder="Confirm new email"/>
            </div>
          </div>
          <input type="submit" className="btn submit-btn"/>
        </form>
        :
        null}
      </div>

      <div className="flexBoxByCols">
        <div className="btn btn-red setting-btn" onClick={()=>handleToggleMode('deletePlans')}>Delete All Plans</div>
        {deletePlansMode?
        <form className="flexBoxByCols " onSubmit={(e)=> handleDeletePlans(e)}>
          {errorMsg?<h3 className="red-text">{errorMsg}</h3>:null}
          {serverMessage?<h3 >{serverMessage}</h3>:null}
          <p className="setting-para">Deletion cannot be undone. If you wish to proceed, enter your password and then click the delete button.</p>
          <input type="password" className="setting-input" placeholder="Current Password" id="current_password"/>
          <div className="flexBoxByRows ">
              <div className="btn setting-delete-btn" onClick={()=>handleToggleMode('deletePlans')}>Cancel</div>
              {inSubmitMode?
                <input type="submit" className="btn btn-red setting-delete-btn btn-inSearchMode" disabled/>
                :
                <input type="submit" className="btn btn-red setting-delete-btn"/>
              }
          </div>
        </form>
        :
        null}
      </div>

      <div className="flexBoxByCols">
        <div className="btn btn-red setting-btn" onClick={()=>handleToggleMode('deleteAccount')}>Delete My Account</div>
        {deleteAccountMode?
        <form className="flexBoxByCols " onSubmit={e=>handleDeleteAccount(e)}>
          {errorMsg?<h3 className="red-text">{errorMsg}</h3>:null}
          {serverMessage?<h3 >{serverMessage}</h3>:null}
          <p className="setting-para">Deletion cannot be undone and all your data will be destroyed. If you wish to proceed, enter your password and then click the delete button.</p>
          <input type="password" className="setting-input" placeholder="Current Password" id="current_password"/>
          <div className="flexBoxByRows ">
              <div className="btn setting-delete-btn" onClick={()=>handleToggleMode('deleteAccount')}>Cancel</div>
              {inSubmitMode?
                <input type="submit" className="btn btn-red setting-delete-btn btn-inSearchMode" disabled/>
                :
                <input type="submit" className="btn btn-red setting-delete-btn"/>
              }
          </div>
        </form>
        :
        null}
      </div>
    </div>
  )
}

export default Settings