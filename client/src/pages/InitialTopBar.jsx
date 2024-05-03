import React, { useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom'
import '../css/InitialTopBar.css'
import { faSignInAlt, faUserPlus, faInfoCircle, faHome } from '@fortawesome/free-solid-svg-icons';


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
                <Link className='initial-top-nav__listitem' to='/'>
                    <button>
                    <FontAwesomeIcon icon={faHome} /> Home
                    </button>
                </Link>
                <Link className='initial-top-nav__listitem'  to='/about'>
                    <button>
                        <FontAwesomeIcon icon={faInfoCircle} /> About Us
                    </button>
                </Link>
                <Link className='initial-top-nav__listitem'  to='/login'>
                    <button>
                        <FontAwesomeIcon icon={faSignInAlt} /> Login
                    </button>
                </Link>
                <Link className='initial-top-nav__listitem'  to='/register'>
                    <button>
                        <FontAwesomeIcon icon={faUserPlus} /> Register
                    </button>
                </Link>
            </div>
        </div>
    );
}
export default InitialTopBar;