import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCog, faUser } from '@fortawesome/free-solid-svg-icons';

function TopBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current?.contains(e.target)) {
            setDropdownOpen(false);
        }
    };

    document.addEventListener('mousedown', closeDropdown);

    return (
        <div className="top-bar">
            <div className="User">
                <h2 id="welcomeMessage" style={{ color: 'white' }}>Welcome, </h2>
            </div>
            <div className="top-bar-buttons">
                <button><FontAwesomeIcon icon={faBell} /></button>
                <button><FontAwesomeIcon icon={faCog} /></button>
                <div className="profile-dropdown" ref={dropdownRef}>
                <button className="profile-button" onClick={toggleDropdown}><FontAwesomeIcon icon={faUser} /></button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <button>Logout</button>
                            <button>View Account Info</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;