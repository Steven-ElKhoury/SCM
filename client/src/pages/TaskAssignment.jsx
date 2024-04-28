import {React,useState,useEffect} from 'react'
import Axios from 'axios';


const TaskAssignment = () => {
  const [EmployeesList, setEmployeesList] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [selectedEmployeetable, setSelectedEmployeetable] = useState('');
  const [selectedEmployeeID, setSelectedEmployeeID] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // State to track whether section is expanded
  const [taskMessage,setTaskMessage] = useState('')
  const [taskDuration,setTaskDuration] = useState(0)
  const [tasksList,setTasksList] = useState([])
  const [selectedCompletion,setSelectedCompletion] = useState();

  var sessionUser = sessionStorage.getItem('Employee_ID');
  var isAdmin = sessionStorage.getItem('isadmin');


  const submitTask = () => {
    if (!selectedEmployee || !taskMessage || !taskDuration) {
      alert('Please fill in all fields.');
    }else{ 
              
      Axios.post('http://localhost:3001/createtask', {employee:selectedEmployee,message:taskMessage,duration:taskDuration, employee_id:selectedEmployeeID, manager_id: sessionUser})
      .then(response => {
          console.log("submitted task")
          gettasks();

        })
        .catch(error => {
          console.error('Error adding task:', error);
        });
  
    }
  };

  const completetask = (task_id) => {
 
    Axios.post('http://localhost:3001/completetask', {task_id:task_id})
    .then(response => {
      console.log("completed task")
      gettasks();
      
      
    })
    .catch(error => {
      console.error('Error completing task:', error);
    });
    window.location.reload();
  
  };

  const gettasks = () => {
    Axios.get('http://localhost:3001/gettasks').then((response) => {
        setTasksList(response.data);
        if(isAdmin==0){
          console.log("alo"+sessionUser)
        }
      }).catch(error => {
        console.error('Error fetching tasks:', error);
      });
    }
    
    const getemployees = () => {
      Axios.get('http://localhost:3001/getemployees').then((response) => {
        setEmployeesList(response.data);
        if(isAdmin==0)setSelectedEmployeetable(response.data.find(employee => employee.employee_id == sessionUser).name)//////////////////////
    }).catch(error => {
        console.error('Error fetching employees:', error);
    });
}



useEffect(() => {
  getemployees();
  gettasks();
  
}, []);



console.log("jude"+sessionUser)
var filteredTasks = selectedEmployeetable ? tasksList.filter(task => task.e_name === selectedEmployeetable) : tasksList;
    filteredTasks = selectedCompletion ? filteredTasks.filter(task => task.completed == selectedCompletion) : filteredTasks;



  return (
    <>
    {isAdmin==1 &&(     
      <h2 className="section-header" id="task-page"  onClick={() => setIsExpanded(!isExpanded)}>Add New Task {isExpanded ? '-' : '+'}</h2>)}
    {isExpanded && (
      <div>
      <select value={selectedEmployee}
      onChange={(e) => {
        setSelectedEmployee(e.target.value)
                  console.log("chou ejit"+EmployeesList.find(employee => employee.name == e.target.value).employee_id)
                  setSelectedEmployeeID(EmployeesList.find(employee => employee.name == e.target.value).employee_id)
                  console.log("IDDDD"+selectedEmployeeID)
                  console.log("IDDDD"+selectedEmployee)
                }}>
                <option value="">Select an employee</option>
                {EmployeesList.map(employee => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
        
        </select>
        <div>


      <label>Task Message:</label>
        <input
          type="text"
          value={taskMessage}
          onChange={(e) => {
            setTaskMessage(e.target.value)
          }}
          placeholder="Enter task message"
          />
      </div>
      <div>
        <label>Task Duration:</label>
        <input
          type="text"
          value={taskDuration}
          onChange={(e) => {
            setTaskDuration(e.target.value)
          }}
          placeholder="Enter task duration"
          />
      </div>
      <button onClick={submitTask} >Add Task</button>
      
      {/* {selectedEmployee && <p>Selected Employee: {selectedEmployee}</p>} */}
      </div>
      )}



      {/* <h1>Tasks List</h1>
      {tasksList.map(task => (
        <>
        <ul>
        {console.log(tasksList)}
        <li>
          <h3>
            Task: {task.task_type}
          </h3>
          </li>
        <li>
          <h3>
            Duration: {task.estimated_duration}
          </h3>
          </li>
        <li >Task Assignment ID: {task.task_assignment_id}</li>
        <li >Employee Name: {task.e_name}</li>
        <li >Employee Email: {task.e_email}</li>
        <li>Manager Name: {task.m_name}</li>
        <li>Manager Email: {task.m_email}</li>
        </ul>
        <br />
        <br />
        </>
      ))} */}

<h1>Tasks List</h1>
<div>
        {isAdmin==1 &&(
          <>
        <label>Select Employee:</label>
          <select value={selectedEmployeetable} onChange={(e) => setSelectedEmployeetable(e.target.value)}>
      
          <option value="">All Employees</option>
          {[...new Set(tasksList.map(task => task.e_name))].map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        
        </>
      )}
        <label>Completed:</label>
          <select value={selectedCompletion} onChange={(e) => setSelectedCompletion(e.target.value)}>
          <option value="">all tasks</option>
            <option key={1} value={1}>1</option>
            <option key={0} value={0}>0</option>
        </select>
      </div>
      <br />
<table style={{ borderCollapse: 'collapse', width: '100%' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Task</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Duration</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Task Assignment ID</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Employee Name</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Employee Email</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Manager Name</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Manager Email</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Completed</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Remove Task</th>
    </tr>
  </thead>
  <tbody>
    {filteredTasks.map(task => (
      <tr key={task.task_assignment_id}>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.task_type}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.estimated_duration}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.task_assignment_id}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.e_name}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.e_email}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.m_name}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.m_email}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{task.completed}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}><button onClick={()=>completetask(task.task_id)}>complete task</button></td>

      </tr>
    ))}
  </tbody>
</table>

    </>
  )
}

export default TaskAssignment