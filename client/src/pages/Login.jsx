import React from "react";
import '../css/Login.css';
import { Link } from "react-router-dom";
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import logo from '../pictures/bicycle.png'
import axios from 'axios';

function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);  
    const [signInError, setSignInError] = useState(null);
    const signIn = async (e) => {
        e.preventDefault();
    
        // Reset validation messages
        setEmailError('');
        setPasswordError('');
    
        // Validate email and password
        if (!email) {
            setEmailError('Please enter your email'); 
        }else{   
            if (!/\S+@\S+\.\S+/.test(email)) {
                setEmailError('Please enter a valid email address');   
            }
        }
    
    
        if (!password) {
            setPasswordError('Please enter your password');       
        }else{
        }

        if(emailError || passwordError){
            return;
        }else{
            axios.post('http://localhost:3001/signin',{
                email: email,
                password: password
            }).then((response)=>{
                if(response.data.error()){
                    setSignInError('Invalid email or password. Please try again.');
                }else{
                    navigate('/main');
                }
            })
        }
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
                    {emailError && <p className="error">{emailError}</p>}
                    <h5>Password</h5>
                    <input value={password} onChange={e => setPassword(e.target.value)} type='password'/>
                    {passwordError && <p className="error">{passwordError}</p>}
                    <button onClick={signIn} type='submit' className='login__signInButton'>Sign In</button>
                </form>
                {signInError && <p className="error">{signInError}</p>}
            <p>
                By signing-in you agree to the SCM Conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
            </p>
        </div>
    </div>
    );
}


export default Login;
