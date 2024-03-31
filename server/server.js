const express = require('express') //now we have an instance of the express libary
const app = express()
const mysql = require('mysql')

const bcrypt = require('bcrypt')
const saltRounds = 10

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')





//const authRouter = require('./routes/auth_endpoints.js');
const cors = require('cors')

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  })
) 
app.use(
  session({
    key: 'userId',
    secret: 'Jude',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24, 
    },
  })
)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json()) //probably standard too, just to parse json








const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'password',
  database: 'supply_chain',
})
//app.use(authRouter);



app.get('/gettinglibrary', (req, res) => {
  db.query('SELECT * FROM publisher', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("success")
      result.forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row);
      });
      res.send(result) //to send the data that we got from our query
    }
  })
})


app.post('/getpublisheraddress', (req, res) => {
  const book_id = req.body.Book_ID
  console.log("booooooooooooooooook id == "+book_id)
  db.query(
    //'INSERT INTO employees (name,age,country,position,wage) VALUES (?,?,?,?,?)',
    'SELECT address from BOOK B, PUBLISHER P WHERE B.publisher_name = P.publisher_name and B.book_id = ? ',
    [book_id],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send('values Inserted') //sending a message to our request to know that things worked
         console.log(result)
      }
    }
  )
  //err,result are what we will be done once the statement is done
})
/*
app.get('/gettingproducts', (req, res) => {
  db.query('SELECT * FROM product', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log('greeaat sucess');
      console.log("result:::::::::::::::"+result);
      res.send(result) //to send the data that we got from our query
    }
  })
})
*/

/*
app.post('/create', (req, res) => {
  const name = req.body.name
  const age = req.body.age
  const country = req.body.country
  const position = req.body.position
  const wage = req.body.wage

  db.query(
    'INSERT INTO employees (name,age,country,position,wage) VALUES (?,?,?,?,?)',
    [name, age, country, position, wage],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send('values Inserted') //sending a message to our request to know that things worked
      }
    }
  )
  //err,result are what we will be done once the statement is done
})
*/

app.get('/getpendingemployees', (req, res) => {
  db.query('SELECT * FROM EMPLOYEE WHERE pending = 1', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("success")
      res.send(result) 
    }
  })
})



app.get('/gettingsuppliers', (req, res) => {
  db.query('select supplier_name,offering_id,price,lead_time,supplier_id,type from supplier_offerings natural join component_type natural join supplier', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log("SUPPLIERS ARE:"+JSON.stringify(result));
      res.send(result) //to send the data that we got from our query
    }
  })
})

// Endpoint to handle updating the price
app.post('/updatePrice', async (req, res) => {
  const offeringId = req.body.offeringId;
  const newPrice = req.body.newPrice;

  try {
      db.query('UPDATE supplier_offerings SET price = ? WHERE offering_id = ?', [newPrice, offeringId], (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("SUPPLIERS ARE:"+JSON.stringify(result));
          res.send(result) //to send the data that we got from our query
        }
      })
    } catch (error) {
      console.error('Error updating price:', error);
      res.status(500).json({ error: 'Internal server error' });}
  } )

  app.post('/addSupplier', (req, res) => {
    // Extract data from the request body
    const { supplierName,supplierEmail} = req.body;
  
    // Insert the new supplier into the database
    db.query('INSERT INTO supplier(email,supplier_name) VALUES (?, ?)', [supplierEmail, supplierName], (err, result) => {
      if (err) {
        console.error('Error adding supplier to database:', err);
        res.status(500).send('Error adding supplier');
        return;
      }
      console.log('Supplier added successfully');
      res.status(200).send('Supplier added successfully');
    });
  });
  app.post('/getcomponentid', (req, res) => {
    const  selectedType  = req.body.selectedType;
    console.log(req.body)
    db.query("Select component_type_id from component_type where type = ?", [selectedType], (err, result) => {
      if (err) {
        console.error('Error getting component id:', err);
        res.status(500).send('Error getting component id');
        return;
      }
      console.log('get component id');
      console.log(JSON.stringify(result))
      res.send(result) //to send the data that we got from our query
      //res.status(200).send('got component id');
    });
  });
  app.get('/getsupplierid', (req, res) => {
    db.query('SELECT * FROM supplier ORDER BY supplier_id DESC LIMIT 1;', (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result) //to send the data that we got from our query
      }
    })
  })


  app.post('/addsupplieroffering', (req, res) => {
    console.log(req.body)
    const selectedPrice = req.body.selectedPrice;
    const selectedLeadTime = req.body.leadTime;
    const supplierId = req.body.supplier_id;
    const component_type_id = req.body.component_id;

    
    db.query('INSERT INTO supplier_offerings (price, lead_time,supplier_id,component_type_id) VALUES (?, ?, ?, ?)', [selectedPrice, selectedLeadTime, supplierId,component_type_id], (err, result) => {
      if (err) {
        console.error('Error adding supplier to database:', err);
        res.status(500).send('Error adding supplier');
        return;
      }
      console.log('Supplier added successfully');
      res.status(200).send('Supplier added successfully');
    });
  });
  app.post('/accept', (req, res) => {
    console.log(req.body)
    const employee_id = req.body.employee_id;
    const email = req.body.email;
    db.query('Update employee set pending =0 where employee_id = ?', [ employee_id], (err, result) => {
      if (err) {
        res.status(500).send('Error accepting');
        return;
      }


      sendacceptance(email,'accept');
      
      res.status(200).send('accepted successfully');
    });
  });
  app.post('/deny', (req, res) => {
    console.log(req.body)
    const employee_id = req.body.employee_id;
    const email = req.body.email;
    db.query('delete from employee where employee_id = ?', [ employee_id], (err, result) => {
      if (err) {
        res.status(500).send('delete error');
        return;
      }
      sendacceptance(email,'deny');
      res.status(200).send('deleted successfully');
    });
  });

  const nodemailer = require("nodemailer");
  // Import NodeMailer (after npm install)
  
  async function sendacceptance(email,status) {
  // Async function enables allows handling of promises with await
    if (status == 'accept'){
      subject = 'Access Granted'
      msg = `We are pleased to inform you that your access request to Bike SCM has been approved! You now have full access to the application, and we are excited to have you on board.
              
      If you encounter any issues during the login process or while using the application, please don't hesitate to contact our support team. We are here to assist you every step of the way.
      
      Thank you for choosing Bike SCM.`
    }else{
      subject = 'Access Denied'
      msg = `I hope this email finds you well. We wanted to reach out to inform you about the recent status of your access request.
      
      After careful consideration and review of your request, we regret to inform you that we are unable to grant access to the application at this time.
      
      We understand that this news may be disappointing, and we sincerely apologize for any inconvenience this may cause. Please know that our decision was made with careful consideration of various factors, and we remain committed to maintaining the security and integrity of our application.
      
      If you have any questions or would like further clarification regarding this decision, please don't hesitate to reach out to our support team 
      
      Thank you for your understanding.`
    }
    // First, define send settings by creating a new transporter: 
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
      port: 465, // Port for SMTP (usually 465)
      secure: true, // Usually true if connecting to port 465
      auth: {
        user: "judenetwork1@gmail.com", // Your email address
        pass: "iepp cssl tcvq pxyd", // Password (for gmail, your app password)
        // ⚠️ For better security, use environment variables set on the server for these values when deploying
      },
    });
    
    // Define and send message inside transporter.sendEmail() and await info about send from promise:
    let info = await transporter.sendMail({
      from: 'judenetwork1@gmail.com',
      to: "vedroxplayz@gmail.com",
      subject: `${subject}`,
      html: `Greetings,
      ${msg}
      
      Best regards,
      Bike SCM Boarding Team.
      
      `,
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////



  app.post('/register', (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    const name= req.body.name


    console.log('xx')
    bcrypt.hash(pass, saltRounds, (err, hash) => {
      if (err) {
        //console.log(err)
      }
      db.query(//fix manager id and pending
        'INSERT INTO employee (email,password,pending,manager_id,name) VALUES (?,?,1,0,?)',
        [email, hash, name],
        (err, result) => {
          if (err) {
            console.log(err)
          } else {
            console.log('no error')
            res.send('values Inserted') 
          }
        }
      )
    })
  })
 

  app.get('/login', (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user })
    } else {
      res.send({ loggedIn: false, user: req.session.user });
    }
  })
  


app.post('/login', (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    db.query('SELECT * from employee where email = ? ', email, (err, result) => {
      if (err) {
        res.send({ err: err })
      }
      if (result.length > 0) {
        // console.log(result)
        // console.log(result[0].password)
        // console.log(pass)
        bcrypt.compare(pass, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result // creating a session
            res.send(result)
          } else {
            res.send({ message: 'wrong email password combination' })
          }
        })
      } else {
        res.send({ message: 'User does not exist' })
      }
    })
  })
  












///////////////////////////////////////////////////////////////////////////////////////////////////////


app.listen(3001, () => {
  console.log('your server is running on port 3001')
}) //start our app
