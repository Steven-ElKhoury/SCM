import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const AcceptEmployee = () => {
    const [pendingUser, setPendingUser] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false);



    useEffect(() => {
        getPending();
      },[])
    useEffect(() => {
        getPending();
      },[buttonClicked])


    const getPending = () => {
        Axios.get('http://localhost:3001/getpendingemployees').then((response) => {
          setPendingUser(response.data) ;
          console.log(pendingUser);
    })
}
    const Accept = (employee_id,email) => {
      Axios.post('http://localhost:3001/accept', { employee_id, email })
      .then(response => {
        // Handle success, maybe show a success message
        setButtonClicked(true);
      })
                .catch(error => {
                    console.error('Error accepting employee:', error);
                });
      setButtonClicked(false);
    }
    const Deny = (employee_id,email) => {
      Axios.post('http://localhost:3001/deny', { employee_id })
      .then(response => {
                  setButtonClicked(true);
                    // Handle success, maybe show a success message
                })
                .catch(error => {
                    console.error('Error denying employee:', error);
                });
      setButtonClicked(false);
    }
      return (
        <div>
          <h2>Employee Information</h2>
          <ul>
            {pendingUser.map(employee => (
              <li key={employee.employee_id}>
                <strong>Employee ID:</strong> {employee.employee_id}<br />
                <strong>Email:</strong> {employee.email}<br />
                {/* <strong>Password:</strong> {employee.password}<br /> */}
                <strong>Pending:</strong> {employee.pending}<br />
                <strong>Manager ID:</strong> {employee.manager_id}<br />
                <strong>Name:</strong> {employee.name || 'N/A'}<br />
                <button onClick={() => Accept(employee.employee_id, employee.email)}>Accept</button>
                <button onClick={() => Deny(employee.employee_id, employee.email)}>Deny</button>
                <h1></h1>
              </li>
            ))}
          </ul>
        </div>
      );

}

export default AcceptEmployee