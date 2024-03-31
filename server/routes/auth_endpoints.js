const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mysqlPromise = require('mysql2/promise');

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '', // your SMTP username
        pass: ' '
    }
});

const dbPromise = mysqlPromise.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'supply_chain'
  });

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'supply_chain',
  })


// Sign in & Sign Up endpoints
authRouter.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    // Query to join the manager and employee tables and get the user
    db.query('SELECT * FROM manager LEFT JOIN employee ON manager.email = employee.email WHERE manager.email = ? OR employee.email = ?', [email, email], async (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send({ message: 'Database error' });
                return;
            }
            
        if (result.length > 0) {
            // Compare the provided password with the hashed password in the database
            console.log(result);
            const comparison = await bcrypt.compare(password, result[0].password);
  
            if (comparison) {
                // Assign the role based on the isManager attribute
                const role = result[0].isManager ? 'manager' : 'employee';
                res.send({ message: 'Logged in successfully', role: role });
            } else {
                res.send({ message: 'Wrong password' });
            }
        } else {
          res.send('values Inserted') 
        }
      }
    )
  })

// app.post('/registerAdd2', (req, res) => {
//     const governate2 = req.body.governate2
//     const city2 = req.body.city2
//     const floorNB2 = req.body.floorNB2
//     const phone2 = req.body.PhoneWork
//     const address_line12 = req.body.address_line12

//     db.query(
//       'INSERT INTO user_address (user_ID,governate,city,floorNB,phone,address_line1,type) VALUES ((select max(user_ID) from user),?,?,?,?,?,("Work"))',
//       [governate2, city2, floorNB2, phone2, address_line12],
//       (err, result) => {
//         if (err) {
//           //console.log(err)
//         } else {
//           res.send('values Inserted')
//         }
//       }
//     )
//   })


// app.get('/login', (req, res) => {
//     if (req.session.user) {
//       res.send({ loggedIn: true, user: req.session.user })
//     } else {
//       res.send({ loggedIn: false, user: req.session.user });
//     }
//   })
  


// app.post('/login', (req, res) => {
//     const email = req.body.email
//     const pass = req.body.pass
  
//     db.query('SELECT * from user where email = ? ', email, (err, result) => {
//       if (err) {
//         res.send({ err: err })
//       }
  
//       if (result.length > 0) {
//         bcrypt.compare(pass, result[0].password, (error, response) => {
//           if (response) {
//             req.session.user = result // creating a session
//             res.send(result)
//           } else {
//             res.send({ message: 'wrong email password combination' })
//           }
//         })
//       } else {
//         res.send({ message: 'User does not exist' })
//       }
//     })
//   })
  






















// app.listen(3002, () => {
//     console.log('your server is running on port 3002')
//   }) //start our app
  