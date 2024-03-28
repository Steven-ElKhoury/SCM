const express = require('express') //now we have an instance of the express libary
const app = express()
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const authRouter = require('./routes/auth_endpoints.js');

app.use(cors()) //just a standard

app.use(express.json()) //probably standard too, just to parse json



const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'password',
  database: 'supply_chain',
})
app.use(authRouter);



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


app.listen(3001, () => {
  console.log('your server is running on port 3001')
}) //start our app
