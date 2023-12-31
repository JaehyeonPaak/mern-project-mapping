import React, {useState, useRef, useContext, useEffect} from 'react';
import './Login.css';
import Footprint from '../assets/footprint.png';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import axios from 'axios';
import ReactDom from 'react-dom';
import { UserContext } from '../context/UserContext';
import Loading from './Loading';

const Login = (props) => {
  const localStorage = window.localStorage;
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();
  const {updateUser} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    const loginUser = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    };

    try {
      setIsLoading(true);
      const res = await axios.post('/api/users/login', loginUser);
      if (res.data.profileImageURL) {
        props.setProfileImage(res.data.profileImageURL);
      }
      else {
        props.setProfileImage(null);
      }
      setError(false);
      updateUser(res.data.username, res.data._id);
      localStorage.setItem('userId', res.data._id);
      props.setUserIdList([res.data._id]);
      props.setColor(res.data.color);
      localStorage.setItem('color', res.data.color);
      setIsLoading(false);
      props.showWelcomeHandler(true);
      setTimeout(() => {
        props.showWelcomeHandler(false);
      }, 3000);
    }
    catch (error) {
      console.log(error);
      console.log('Error message: ' + error.response.data);
      setError(true);
      setIsLoading(false);
    }
  };

  const registerClickHandler = () => {
    props.setShowRegister(true);
  }

  return (
    <React.Fragment>
      {ReactDom.createPortal(
        <div className='backdrop'></div>,
        document.getElementById('backdrop-root')
      )}
      {ReactDom.createPortal(
        <div className='login-container'>
          <div className='loading-container'>
            {isLoading && <Loading></Loading>}
          </div>
          <div className='login-title'>
            <img src={Footprint}></img>
            <span>Footprint</span>
          </div>
          <h1>Login</h1>
          <form className='login-form' onSubmit={submitHandler}>
            <div>
              <label for='username'>Username</label>
              <div className='input-container'>
                <SupervisedUserCircleIcon style={{transform: 'scale(0.8)', marginLeft: '5px', color: 'rgb(126, 125, 125)'}}></SupervisedUserCircleIcon>
                <input id='username' type='text' minLength={4} placeholder='Type your ID' ref={nameRef}></input>
              </div>
            </div>
            <div>
              <label for='password'>Password</label>
              <div className='input-container'>
                <LockOpenIcon style={{transform: 'scale(0.8)', marginLeft: '5px', color: 'rgb(126, 125, 125)'}}></LockOpenIcon>
                <input id='password' type='password' placeholder='Type your password' ref={passwordRef}></input>
              </div>
            </div>
            {/* <div className='login-rememberme'>
              <input type='checkbox'></input>
              <span>Remember me</span>
            </div> */}
            <button className='login-button'>Login</button>
          </form>
          <div className='login-register'>
            <span>Not a member? </span>
            <span onClick={registerClickHandler}><b>Register here!</b></span>
          </div>
          <div className='login-result'>
            {error && <span className='failure'>Something went wrong! Contact to administrator</span>}
          </div>
        </div>,
        document.getElementById('overlay-root')
      )}
    </React.Fragment>
  );
}

export default Login;