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
        user: 'steven.elkhoury@hotmail.com', // your SMTP username
        pass: 'Q11_H36o17ER' // your SMTP password
    }
});

const dbPromise = mysqlPromise.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'supply_chain'
  });

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'root',
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
            res.send({ message: 'User does not exist' });
        }
    });
  });
  
 
  const getEmailNumber = async (baseEmail) => {
    const [rows] = await dbPromise.query(`
        SELECT email FROM manager WHERE email LIKE ?
        UNION ALL
        SELECT email FROM employee WHERE email LIKE ?
    `, [`${baseEmail}%`, `${baseEmail}%`]);

    let maxNumber = 0;
    rows.forEach(row => {
        const number = parseInt(row.email.slice(baseEmail.length));
        if (!isNaN(number)) {
            maxNumber = Math.max(maxNumber, number);
        }
    });

    return maxNumber;
};

authRouter.post('/signup', async (req, res) => {
    const { name, dob, position, role, personalEmail } = req.body;

    console.log(role);
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ').replace(/\s/g, '');
    let baseEmail = `${firstName}.${lastName}@bike.com`.toLowerCase();

    const maxEmailNumber = await getEmailNumber(baseEmail);
    let email;
    if (maxEmailNumber === 0) {
        email = baseEmail;
    } else {
        const newEmailNumber = String(maxEmailNumber + 1).padStart(2, '0');
        email = `${baseEmail}${newEmailNumber}`;
    }

    const password = crypto.randomBytes(10).toString('hex'); // generates a random hex string

    const hashedPassword = await bcrypt.hash(password, 10); // hash the password

    const isManager = role === 'manager' ? 1 : 0;

    if(isManager){
        db.query('INSERT INTO manager (name, dob, email, position, password) VALUES (?, ?, ?, ?, ?)', 
        [name, dob, email, position, hashedPassword], 
        async (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Database error' });
                return;
            }

            const mailOptions = {
                from: 'steven.elkhoury01@lau.edu',
                to: personalEmail,
                subject: 'Your new account',
                text: `Welcome to our company! Your email is ${email} and your password is ${password}.`
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (err) {
                console.log(err);
                res.status(500).send({ message: 'Failed to send email' });
                return;
            }

            res.send({ message: 'User created successfully', email: email, password: password });
        }
    );
    }else{
        db.query('INSERT INTO employee (name, dob, email, position, password) VALUES (?, ?, ?, ?, ?)', 
        [name, dob, email, position, password], 
        async (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: 'Database error' });
                return;
            }
            console.log(personalEmail)
            const mailOptions = {
                from: 'steven.elkhoury@hotmail,com',
                to: personalEmail,
                subject: 'Your new account',
                text: `Welcome to our company! Your email is ${email} and your password is ${password}.`
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (err) {
                console.log(err);
                res.status(500).send({ message: 'Failed to send email' });
                return;
            }

            res.send({ message: 'User created successfully', email: email, password: password });
        }
    );
    }
    
});

  module.exports = authRouter;