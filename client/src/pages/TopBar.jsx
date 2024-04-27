import React, { useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom'


function TopBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);


    //logout
    function refreshPage() {
       // window.location.reload(false)
      }
    const logout = () => {
        localStorage.clear()
        sessionStorage.clear()
        refreshPage();
      }
    

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current?.contains(e.target)) {
            setDropdownOpen(false);
        }
    };

    document.addEventListener('mousedown', closeDropdown);

    const handleLogout = async () => {
        try {
          // Send a request to your server to logout
          const response = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
          });
    
          if (response.ok) {
            // Successfully logged out
            // You may want to redirect the user or perform any other action here
            //sessionStorage.clear();
            console.log('Logged out successfully');
          } else {
            // Handle error response from server
            console.error('Logout failed');
          }
        } catch (error) {
          // Handle network errors
          console.error('Network error:', error);
        }
      };



    return (
        <div className="top-bar">
            <div className="User">
                <h2 id="welcomeMessage" style={{ color: 'white' }}>Welcome, </h2>
            </div>
            <div className="top-bar-buttons">
                <button className='topbutton'><FontAwesomeIcon icon={faBell} /></button>
                <button className = 'topbutton'><FontAwesomeIcon icon={faCog} /></button>
                <div className="profile-dropdown" ref={dropdownRef}>
                <button className="profilebutton" onClick={toggleDropdown}><FontAwesomeIcon icon={faUser} /></button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {/* <button onClick={handleLogout}>Logout</button> */}
                            <Link className='nav__listitem' onClick={logout} to='/login'>
                            <button>
                                Logout
                                
                                </button>
                            </Link>
                            <button>View Account Info</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;