import React, { useState } from 'react'
import Axios from 'axios'
import '../css/Register.css'
import InitialTopBar from './InitialTopBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Routes, Route, useNavigate } from 'react-router-dom'

export const Register = (props) => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')
  //const [exists, setExists] = useState()
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate()

  const navigateToSignIn = () => {
    props.onFormSwitch('Login')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  const register = () => {

    if (!name || !email || !pass) {
      alert('Please fill in all fields.');
    }else{
      Axios.post('http://localhost:3001/userexists', {
        email: email,
      }).then((response) => {
        console.log("hi"+JSON.stringify(response.data))
        if(JSON.stringify(response.data) ==`"user exists"`){

          alert('email already used')

        }else{
          console.log('vvv')
          Axios.post('http://localhost:3001/register', {
            email: email,
            pass: pass,
            name: name,
          }).then((response) => {
            console.log(response)
            console.log('ahla')
            navigate('/login')
          
          })
        }
        
      })


    }      
  }
  return (
    <>
              {/* <InitialTopBar /> */}
    <div id='register' className='auth-form-container'>

      <h2>Register</h2>
      <form id='register' className='register-form' onSubmit={handleSubmit}>
        <label id='register' className='signlbl' htmlfor='name'>
          Name:
        </label>
        <input
          className='signinput'
          
          onChange={(e) => {
            setName(e.target.value)
          }}
          value={name}
          type='text'
          id='name'
          required
        />
        <label id='register' className='signlbl' htmlfor='email'>
          email:
        </label>
        <input
          className='signinput'
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          value={email}
          type='email'
          id='email'
          required
          />
        <label id='register' className='signlbl' htmlfor='pass'>
          password:
        </label>
        <div className="input-wrapper">
        <input
          className='signinput'
          onChange={(e) => {
            setPass(e.target.value)
          }}
          type={showPassword ? 'text' : 'password'}
          id='password'
          required
        />
        <button className="password-toggle-icon" onClick={togglePasswordVisibility} style={{ border: 'none', background: 'none' }}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>

        <button id='register' className='sign-btn' onClick={register} type='submit'>
          Register
        </button>
      </form>

      <button
      id='register' 
        className='link-btn sign-btn'
        onClick={() =>  navigate('/login')}
      >
        Already have an accoount? Login here
      </button>
    </div>
      </>
  )
}
export default Register
