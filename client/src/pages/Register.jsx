import React, { useState } from 'react'
import Axios from 'axios'
import '../css/Register.css'

import { Routes, Route, useNavigate } from 'react-router-dom'

export const Register = (props) => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')


  const navigate = useNavigate()

  const navigateToSignIn = () => {
    props.onFormSwitch('Login')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  const register = () => {
    console.log('vvv')
    Axios.post('http://localhost:3001/register', {
      email: email,
      pass: pass,
      name: name,
    }).then((response) => {
      console.log(response)
      console.log('ggg123')

    console.log('ahla')

      
    })

    console.log('f')
  }
  return (
    <div id='register' clasName='auth-form-container'>
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
        <input

          className='signinput'
          onChange={(e) => {
            setPass(e.target.value)
          }}
          value={pass}
          id='password'
          required
        />

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
  )
}
export default Register