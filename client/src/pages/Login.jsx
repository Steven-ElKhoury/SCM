import React from "react";
import '../css/Login.css';
import { Link } from "react-router-dom";
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from '../pictures/bicycle.png'

function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const signIn = (e) => {
        e.preventDefault();
        //firebase login
        //navigate to home
        navigate('/');
    }

    const register = (e) => {
        e.preventDefault();
        //firebase register
        //navigate to home
        navigate('/');
    }

    return(
        <div className="login">
            <Link to ='/'>
            <img src={logo} alt="logo" className="login__logo"/>
            </Link>
            <div className = 'login__container'>
                <h1>Sign In</h1>
                <form>
                    <h5>Email</h5>
                    <input value={email} onChange={e => setEmail(e.target.value)} type='email'/>
                    <h5>Password</h5>
                    <input value={password} onChange={e => setPassword(e.target.value)} type='password'/>
                    <button onClick={signIn} type='submit' className='login__signInButton'>Sign In</button>
                </form>
            <p>
                By signing-in you agree to the SCM Conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
            </p>
        </div>
    </div>
    );
}


export default Login;
