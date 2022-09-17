import { useRef, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();


  const authCtx  = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;
    setIsLoading(true);

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCttzTwptqMH4giQPhhPoswpAUF4f8ohdI',{
      method: 'POST',
      body: JSON.stringify({
        password: enteredNewPassword,
        idToken: authCtx.token,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res)=> { 
      setIsLoading(false);
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          let errorMessage = 'Password change failed!';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          alert(errorMessage);
          throw new Error(errorMessage);
        });
      }
    }).then((data) => {
      history.replace('/');

    }).catch(err => {
      alert(err.message);
    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        {isLoading && <p> Loading...</p>}
        <input type='password' id='new-password' ref={newPasswordInputRef} minLength="7" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
