import {React,useState,useEffect} from 'react'
import Axios from 'axios';
import { Table,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, TablePagination } from '@mui/material';
import { styled } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


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
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const SortableTableCell = styled(TableCell)({
    cursor: 'pointer',
    '&:hover': {
        color: 'blue',
    },
})




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

// Apply search filter after existing filters
filteredTasks = filteredTasks.filter(task => task.e_name.toLowerCase().includes(search.toLowerCase()));


const handleSort = (field) => {
  setSortField(field);
  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
};

const sortedAndFilteredTasks = [...filteredTasks].sort((a, b) => {
  if (a[sortField] < b[sortField]) {
    return sortDirection === 'asc' ? -1 : 1;
  }
  if (a[sortField] > b[sortField]) {
    return sortDirection === 'asc' ? 1 : -1;
  }
  return 0;
});

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
      <TableContainer style={{ width: '97%', marginRight: '20px' }} component={Paper}>
      <TextField
          placeholder="Search"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Table>
        <TableHead>
          <TableRow>
            <SortableTableCell onClick={() => handleSort('task_type')}>
              Task
              {sortField === 'task_type' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <SortableTableCell onClick={() => handleSort('estimated_duration')}>
              Duration
              {sortField === 'estimated_duration' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <SortableTableCell onClick={() => handleSort('task_assignment_id')}>
              Task Assignment ID
              {sortField === 'task_assignment_id' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <SortableTableCell onClick={() => handleSort('e_name')}>
              Employee Name
              {sortField === 'e_name' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <SortableTableCell onClick={() => handleSort('e_email')}>
              Employee Email
              {sortField === 'e_email' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <SortableTableCell onClick={() => handleSort('m_name')}>
              Manager Name
              {sortField === 'm_name' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <SortableTableCell onClick={() => handleSort('m_email')}>
              Manager Email
              {sortField === 'm_email' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <SortableTableCell onClick={() => handleSort('completed')}>
              Completed
              {sortField === 'completed' && (sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            </SortableTableCell>
            <TableCell>Remove Task</TableCell>
          </TableRow>
        </TableHead>
<TableBody>
  {sortedAndFilteredTasks
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map(task => (
      <TableRow key={task.task_assignment_id}>
        <TableCell>{task.task_type}</TableCell>
        <TableCell>{task.estimated_duration}</TableCell>
        <TableCell>{task.task_assignment_id}</TableCell>
        <TableCell>{task.e_name}</TableCell>
        <TableCell>{task.e_email}</TableCell>
        <TableCell>{task.m_name}</TableCell>
        <TableCell>{task.m_email}</TableCell>
        <TableCell>{task.completed}</TableCell>
        <TableCell>
          <Button variant="contained" color="primary" onClick={() => completetask(task.task_id)}>
            Complete task
          </Button>
        </TableCell>
      </TableRow>
    ))}
</TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

    </>
  )
}

export default TaskAssignment