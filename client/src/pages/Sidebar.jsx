import React from 'react';
import { Link } from 'react-router-dom';
import { faArrowRight,faArrowLeft, faUsers, faTasks, faClipboardList, faShoppingCart, faTruckLoading, faWarehouse, faHome, faBoxOpen, faCogs, faDashboard, faIndustry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';






function Sidebar({sidebarOpen, setSidebarOpen}){
    var isAdmin = sessionStorage.getItem('isadmin');
    console.log("sidebar admin: " + isAdmin)

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
                    {isAdmin == 1 && (
                    <li className="nav-item">
                        <Link className="nav-link" to="employees"><FontAwesomeIcon icon={faUsers} /> Employees</Link>
                    </li>
                    )}
                    <li className="nav-item">
                        <Link className="nav-link" to="tasks"><FontAwesomeIcon icon={faTasks} /> Tasks</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="orders"><FontAwesomeIcon icon={faClipboardList} /> Orders</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="manufacture"><FontAwesomeIcon icon={faIndustry} /> Manufacture</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="purchases"><FontAwesomeIcon icon={faShoppingCart} /> Purchases</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="suppliers"><FontAwesomeIcon icon={faTruckLoading} /> Suppliers</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="warehouses"><FontAwesomeIcon icon={faWarehouse} /> Warehouse</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="products"><FontAwesomeIcon icon={faBoxOpen} /> Products</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="parts"><FontAwesomeIcon icon={faCogs} /> Parts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="Dashboard"><FontAwesomeIcon icon={faDashboard} /> Dashboard</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;