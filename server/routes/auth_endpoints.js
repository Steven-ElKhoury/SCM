const express = require('express') 
const app = express()
const mysql = require('mysql')

const bcrypt = require('bcrypt')
const saltRounds = 10

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

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
app.post('/register', (req, res) => {
  const email = req.body.email
  const pass = req.body.pass
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const userName = req.body.userName
  const Phone = req.body.Phone
  bcrypt.hash(pass, saltRounds, (err, hash) => {
    if (err) {
      //console.log(err)
    }
    db.query(
      'INSERT INTO user (email,passcode,first_name,last_name,phone,username,created_AT) VALUES (?,?,?,?,?,?,CURRENT_DATE())',
      [email, hash, first_name, last_name, Phone, userName],
      (err, result) => {
        if (err) {
          //console.log(err)
        } else {
          res.send('values Inserted') 
        }
      }
    )
  })
})


app.post('/registerAdd', (req, res) => {
    const governate = req.body.governate
    const city = req.body.city
    const floorNB = req.body.floorNB
    const phone = req.body.PhoneHome
    const address_line1 = req.body.address_line1
  
    db.query(
      'INSERT INTO user_address (user_ID,governate,city,floorNB,phone,address_line1,type) VALUES ((select max(user_ID) from user),?,?,?,?,?,("Home"))',
      [governate, city, floorNB, phone, address_line1],
      (err, result) => {
        if (err) {
          //console.log(err)
        } else {
          res.send('values Inserted') 
        }
      }
    )
  })

app.post('/registerAdd2', (req, res) => {
    const governate2 = req.body.governate2
    const city2 = req.body.city2
    const floorNB2 = req.body.floorNB2
    const phone2 = req.body.PhoneWork
    const address_line12 = req.body.address_line12

    db.query(
      'INSERT INTO user_address (user_ID,governate,city,floorNB,phone,address_line1,type) VALUES ((select max(user_ID) from user),?,?,?,?,?,("Work"))',
      [governate2, city2, floorNB2, phone2, address_line12],
      (err, result) => {
        if (err) {
          //console.log(err)
        } else {
          res.send('values Inserted')
        }
      }
    )
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
  
    db.query('SELECT * from user where email = ? ', email, (err, result) => {
      if (err) {
        res.send({ err: err })
      }
  
      if (result.length > 0) {
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
  






















app.listen(3002, () => {
    console.log('your server is running on port 3002')
  }) //start our app
  