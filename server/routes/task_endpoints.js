const express = require('express');
const taskRouter = express.Router();
const mysql = require('mysql2');


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'supply_chain',
});


taskRouter.get('/getemployees', (req, res) => {
    db.query("SELECT * FROM employee", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log("successs");
        res.send(result); 
      }
    });
  });

taskRouter.get('/gettasks', (req, res) => {
    db.query("select * from (select name as m_name,manager_id as m_id, email as m_email from manager) as mm,(select * from (select employee_id as e_id,name as e_name, email as e_email from employee) as emp,(SELECT * FROM task natural join task_assignment )as s where emp.e_id = s.employee_id) as f where mm.m_id=f.manager_id", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log("successs");
        res.send(result); 
      }
    });
  });

  taskRouter.post('/createtask', async (req, res) => {
    const message = req.body.message;
    const duration = req.body.duration;
    const employee_id = req.body.employee_id;
    const manager_id = req.body.manager_id;

    db.query('insert into task (task_type,estimated_duration) values (?,?);', [message, duration], (err, result) => {
      if (err) {
        console.log(err)
      } else {

        console.log("created task")
        db.query('INSERT INTO task_assignment (employee_id,manager_id,task_id) VALUES (?,?,(SELECT MAX(task_id) FROM task));', [employee_id, manager_id], (err, result) => {
          if (err) {
            console.log(err)
          } else {
            console.log("submitted task")
            res.send(result) 
          }
        })
        //res.send(result) 
      }
    })

    })
  taskRouter.post('/completetask', async (req, res) => {
    const task_id = req.body.task_id

    db.query('UPDATE task SET completed = 1 where task_id = ?;', [task_id], (err, result) => {
      if (err) {
        console.log(err)
      } else {

        console.log("completed task")

        //res.send(result) 
      }
    })

    })
    taskRouter.post('/makemanager', async (req, res) => {
      const employee_id = req.body.employee_id
      const email = req.body.email
      const password = req.body.password
      const name = req.body.name;

      x = [];
      db.query('select task_id from task_assignment where employee_id = ?;', [employee_id], (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(JSON.stringify(result))
          x = result.map(item => item.task_id)
          console.log("completed task")
          console.log(result.map(item => item.task_id))
          db.query('delete from task_assignment where employee_id = ?', [employee_id], (err, result) => {
            if (err) {
              //console.log(err)
            } else {
              //console.log(JSON.stringify(result))
              //console.log("deleted tasks")
              console.log('employee_id'+employee_id)
              db.query('delete from task where task_id in (?);', [x], (err, result) => {
                if (err) {
                  //console.log(err)
                } else {

                  console.log(JSON.stringify(result))
                  console.log("deleted task assignments")

                  //res.send(result) 
                }
              })
              //res.send(result) 
            }
          })
          db.query('delete from employee where employee_id=?;', [employee_id], (err, result) => {
            if (err) {
              console.log(err)
            } else {
              db.query('insert into manager(email,password,name) values (?,?,?);', [email,password,name], (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  
                  console.log(JSON.stringify(result))
                  console.log("deleted employee")
                  
                  //res.send(result) 
                }
              })
              console.log(JSON.stringify(result))
              console.log("deleted employee")
              
              //res.send(result) 
            }
          })
          
          
        }
      })
  
  
      })
 







module.exports = taskRouter;