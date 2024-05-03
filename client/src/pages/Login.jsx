import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import Home from './Home'
import Main from './Main'
import '../css/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
//import '../css/signin.css'
import { Routes, Route, useNavigate } from 'react-router-dom';

export const Login = (props) => {
  const navigate = useNavigate()
  const [emailLog, setEmailLog] = useState('')
  const [passLog, setPassLog] = useState('')
  //const [LoginStatus, setLoginStatus] = useState('')
  const [user_ID, setUser_ID] = useState(0)
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setisPending] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const win = window.sessionStorage
  var sessionUser = 0;


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function refreshPage() {
    window.location.reload(false)
  }

  Axios.defaults.withCredentials = true // in order to make the session work in our front-end
  const navigateToHome = () => {
    navigate('/main')
  }
  const navigateAdmin = () => {
    navigate('/Admin')
  }

 const SignIn = () => {

   Axios.post('http://localhost:3001/login', {
     email: emailLog,
     pass: passLog,
   }).then((response) => {
     if (response.data.message) {
      // setLoginStatus(response.data.message)
      setErrorMessage(response.data.message)
      //console.log("ff"+response.data.message)
    } else {
        //setLoginStatus(response.data[0].username)
        console.log('no msg')
        console.log(response.data[0])
        localStorage.setItem('employee_id', response.data[0].employee_id)
        localStorage.setItem('isadmin', response.data[0].isadmin)
        //console.log(response.data[0].employee_id)
        if(response.data[0].isadmin==0){
          win.setItem('Employee_ID', response.data[0].employee_id)
          setisPending(response.data[0].pending)
          
        }
        else{
          win.setItem('Employee_ID', response.data[0].manager_id)
          console.log("im a manager")
          setisPending(0)
        }
        win.setItem('isadmin', response.data[0].isadmin)
       console.log('isadmin = '+ sessionStorage.isadmin)
       console.log(win)
      
       console.log('going to main')
       if(sessionStorage.isadmin==1 || response.data[0].pending==0){
        navigate('/main')
       }else if(response.data[0].pending==1){
        alert('please wait until your account is approved, you will receive an email once it is approved')
       }
       //navigate('/main')
      }
    })
    
    // Axios.get('http://localhost:3001/login').then((response) => {
    //   console.log('info'+JSON.stringify(response.data))
    //   if (response.data.loggedIn == true) {
    //     //setLoginStatus(response.data.user[0].username)
    //   }
    //   //console.log("session user: "+sessionUser)
    // })

  }
  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log(emailLog)
  }
 return (
  <div className='login-page'>
    <div className='left-container-login'></div>
   <div className='auth-form-container'>

     <h2 className='sign'>Login</h2>
     <form className='login-form' onSubmit={handleSubmit}>
       <label className='signlbl' for='email'>
         email:
       </label>
       <input
         className='signinput'
         onChange={(e) => {
           setEmailLog(e.target.value)
          }}
          type='email'
          id='email'
          required
          />
       <label className='signlbl' for='email'>
         password:
       </label>
       <div className="input-wrapper">
          <input
            className='signinput'
            onChange={(e) => {
              setPassLog(e.target.value)
            }}
            type={showPassword ? 'text' : 'password'}
            id='password'
            required
          />
          <button className="password-toggle-icon" onClick={togglePasswordVisibility} style={{ border: 'none', background: 'none' }}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
       <button className='sign-btn' onClick={SignIn}>
         Login
       </button>
       {errorMessage && <h3>{errorMessage}</h3>}
     </form>

     <button
       className='link-btn sign-btn'
       onClick={() =>     navigate('/register')}
       >
       Don't have an account? Register here
     </button>
   </div>
  </div>
 )
}
export default Login
