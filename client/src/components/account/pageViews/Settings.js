import './pageViews.css';
import { useState } from 'react'

function Settings () {

  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [changeEmailMode, setChangeEmailMode] = useState(false);
  const [deletePlansMode, setDeletePlansMode] = useState(false);
  const [deleteAccountMode, setDeleteAccountMode] = useState(false);

  const handleToggleMode = (mode) => {
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

  return (
    <div className="currentView Page">
      <h1>Settings</h1>
      <div className="flexBoxByCols">
        <div className="btn setting-btn" onClick={()=>handleToggleMode('password')}>Change Password</div>
        {changePasswordMode?
        <form className="flexBoxByCols ">
          <div className="flexBoxByRows setting-container">
            <input type="password" className="setting-input" id="current_password" placeholder="Current Password"/>
            <div className="flexBoxByCols">
              <input type="password" className="setting-input" id="new_password" placeholder="New Password"/>
              <input type="password" className="setting-input" id="confirm_password" placeholder="Confirm new Password"/>
            </div>
          </div>
          <input type="submit" className="btn submit-btn"/>
        </form>
        :
        null}


      </div>
      <div className="flexBoxByCols">
        <div className="btn setting-btn" onClick={()=>handleToggleMode('email')}>Change Email Address</div>
        {changeEmailMode?
        <form className="flexBoxByCols ">
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
        <div className="btn setting-btn">Retrieve My Data</div>
      </div>
      <div className="flexBoxByCols">
        <div className="btn btn-red setting-btn" onClick={()=>handleToggleMode('deletePlans')}>Delete All Plans</div>
        {deletePlansMode?
        <form className="flexBoxByCols ">
          <p className="setting-para">Deletion cannot be undone. If you wish to proceed, enter your password and then click the delete button.</p>
          <input type="password" className="setting-input" placeholder="Current Password" id="current_password"/>
          <div className="flexBoxByRows ">
              <div className="btn setting-delete-btn" onClick={()=>handleToggleMode('deletePlans')}>Cancel</div>
              <div className="btn btn-red setting-delete-btn">Delete all my plans</div>
          </div>
        </form>
        :
        null}
      </div>

      <div className="flexBoxByCols">
        <div className="btn btn-red setting-btn" onClick={()=>handleToggleMode('deleteAccount')}>Delete My Account</div>
        {deleteAccountMode?
        <form className="flexBoxByCols ">
          <p className="setting-para">Deletion cannot be undone. If you wish to proceed, enter your password and then click the delete button.</p>
          <input type="password" className="setting-input" placeholder="Current Password" id="current_password"/>
          <div className="flexBoxByRows ">
              <div className="btn setting-delete-btn" onClick={()=>handleToggleMode('deleteAccount')}>Cancel</div>
              <div className="btn btn-red setting-delete-btn">Delete my account</div>
          </div>
        </form>
        :
        null}
      </div>
    </div>
  )
}

export default Settings