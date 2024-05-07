import {React,useState,useEffect} from 'react'
import Axios from 'axios';
import { useTable,usePagination, useGlobalFilter } from 'react-table';
import "../css/Employee.css";
import Table from '../Components/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function Employees() {

    
    const [EmployeesList, setEmployeesList] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [selectedEmployeetable, setSelectedEmployeetable] = useState('');  
    
    var sessionUser = sessionStorage.getItem('Employee_ID');
    var isAdmin = sessionStorage.getItem('isadmin');

    const navigate = useNavigate();


    const handleMakeManager = (employeeId, email, password,name) => {
        Axios.post('http://localhost:3001/makemanager', {
          employee_id: employeeId,
          email: email,
          password: password,
          name: name
        })
        .then(response => {
          console.log(response.data);
            getemployees();
            
        })
        .catch(error => {
            console.error('Error promoting to  manager:', error);
        });
        window.location.reload(); // Refresh the page
      };

    const getemployees = () => {
        Axios.get('http://localhost:3001/getemployees').then((response) => {
          setEmployeesList(response.data);
          if(isAdmin==0)setSelectedEmployeetable(response.data.find(employee => employee.employee_id == sessionUser).name)//////////////////////
          //console.log(response.data)

      }).catch(error => {
          console.error('Error fetching employees:', error);
      });
  }
  useEffect(() => {
    console.log('f')
    getemployees();
    
},[]);


    return (
        <> 
            <div  className = 'createEmployees'>
                <button onClick={()=>navigate('/main/acceptemployee')}><FontAwesomeIcon icon = {faPlus}></FontAwesomeIcon>   Manage Pending Employees</button>
            </div>
        {/* <Table  columns={columns} data={employees} filterColumn={'Email'}/> */}
        <div className="employee-table-container">
      <h2>Employee List</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            {/* <th>Password</th> */}
            <th>Make Manager</th> {/* New column header */}
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {EmployeesList.map(employee => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              {/* <td>{employee.password}</td> */}
              <td>
                <button onClick={() => handleMakeManager(employee.employee_id, employee.email, employee.password,employee.name)}>
                  Make Manager
                </button>
              </td>
              {/* Render more columns if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </>
    );
}

export default Employees;