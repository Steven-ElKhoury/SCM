import React from 'react';
import { Link } from 'react-router-dom';
import { faArrowRight, faArrowLeft, faUsers, faTasks, faClipboardList, faShoppingCart, faTruckLoading, faWarehouse, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sidebar({sidebarOpen, setSidebarOpen}){
    return (
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
           <button className='sidebar-toggle' onClick={() => setSidebarOpen(!sidebarOpen)}>
                <FontAwesomeIcon icon={sidebarOpen ? faArrowLeft : faArrowRight} />
                </button>
            <nav>
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link className="nav-link" to="/main"><FontAwesomeIcon icon={faHome} /> Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="employees"><FontAwesomeIcon icon={faUsers} /> Employees</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/tasks"><FontAwesomeIcon icon={faTasks} /> Tasks</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/orders"><FontAwesomeIcon icon={faClipboardList} /> Orders</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/purchases"><FontAwesomeIcon icon={faShoppingCart} /> Purchases</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/suppliers"><FontAwesomeIcon icon={faTruckLoading} /> Suppliers</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/warehouse"><FontAwesomeIcon icon={faWarehouse} /> Warehouse</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;