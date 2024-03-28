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



app.listen(3001, () => {
  console.log('your server is running on port 3001')
}) //start our app
