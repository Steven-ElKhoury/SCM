import React from 'react';
import { Link } from 'react-router-dom';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
                        <a className="nav-link" href="/Car/CarEntry.aspx">إدخال سيارة</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/AssignmentEntry.aspx">إدخال تكليف</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/InvoiceEntry.aspx">إدخال فاتورة</a>
                    </li>
                    {/* {this.props.role === "Admin" && */}
                        <li className="dropdown">
                            <a className="nav-link" href="#">جداول</a>
                            <ul className="dropdown-list">
                                <li className="dropdown-car">
                                    <a className="nav-link" href="/Car/Car.aspx">السيارات</a>
                                    <ul className="dropdownlist-car">
                                        <li className="dropdown-item"><a className="nav-link" href="/Car/CarType.aspx">نوع السيارة</a></li>
                                        <li className="dropdown-item"><a className="nav-link" href="/Car/CarCategory.aspx">فئة السيارة</a></li>
                                        <li className="dropdown-item"><a className="nav-link" href="/Car/CarStatus.aspx">حالة السيارة</a></li>
                                        <li className="dropdown-item"><a className="nav-link" href="/Car/CarsInsurance.aspx">تأمين السيارة</a></li>
                                        <li className="dropdown-item"><a className="nav-link" href="/Car/PlateNumber.aspx">رقم لوحة السيارة</a></li>
                                        <li className="dropdown-item"><a className="nav-link" href="/Car/CarHistory.aspx">تاريخ السيارة</a></li>
                                    </ul>
                                </li>
                                <li className="dropdown-item"><a className="nav-link" href="/EmployeeOfficer.aspx">السائقين</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Grade.aspx">الرتبة</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/EmployeeOfficerType.aspx">نوع الموظف</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Assignment/AssignmentType.aspx">نوع التكليف</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Assignment/AssignmentCategory.aspx">فئة التكليف</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Assignment/AssignmentStatus.aspx">حالة التكليف</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Invoice/InvoiceStatus.aspx">حالة الفاتورة</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/InsuranceType.aspx">نوع التأمين</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Insurance.aspx">التأمين</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/PaymentType.aspx">طريقة الدفع</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Area.aspx">المنطقة</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Company.aspx">الشركة</a></li>
                                <li className="dropdown-item"><a className="nav-link" href="/Users.aspx">المستخدمين</a></li>
                            </ul>
                        </li>
                    {/* } */}
                </ul>
            </nav>
          
        </div>
    );
}

export default Sidebar;





