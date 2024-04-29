import React, { useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom'
import '../css/InitialTopBar.css'

function InitialTopBar() {

    //logout
    function refreshPage() {
       // window.location.reload(false)
      }
    const logout = () => {
        localStorage.clear()
        sessionStorage.clear()
        refreshPage();
      }
    
    return (
        <div className="initial-top-top-bar">
            <div className="initial-top-User">
                            <Link className='initial-top-nav__listitem'  to='/login'>
                            <button>Login</button>
                            </Link>
                            <Link className='initial-top-nav__listitem'  to='/register'>
                            <button>Register</button>
                            </Link>
                            <Link className='initial-top-nav__listitem'  to='/about'>
                            <button>About</button>
                            </Link>
            </div>
        </div>
    );
}

export default InitialTopBar;