const express = require('express') //now we have an instance of the express libary
const app = express()
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const saltRounds = 10
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const cors = require('cors')
const authRouter = require('./routes/auth_endpoints.js');
const productRouter = require('./routes/product_endpoints.js');
const partRouter = require('./routes/part_endpoints.js');
const taskRouter = require('./routes/task_endpoints.js');
const warehouseRouter = require('./routes/warehouse_endpoints.js');

//app.use(cors()) //just a standard

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true,
  })
) 
app.use(
  session({
    key: 'employeeId',
    secret: 'Jude',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24, 
    },
  })
)

///////////3/31
app.options('*', cors());


app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json()) //probably standard too, just to parse json


const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'password',
  database: 'supply_chain',
  multipleStatements: true
})

//app.use(authRouter);

app.use(productRouter); 

app.use(partRouter);

app.use(taskRouter);

app.use(warehouseRouter);

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

app.post('/userexists', (req, res) => {
  const email = req.body.email
  db.query(
    'SELECT * from employee WHERE email = ? ',
    [email],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        if(result.length == 0){
          res.send('no user found')
        }else{
          res.send('user exists')  
          //console.log(result)
        }
      }
    }
  )
  //err,result are what we will be done once the statement is done
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
const query = `
    SELECT 
      cso.order_id,
      s.supplier_name,
      comp.type AS component_type,
      co.quantity,
      co.date_ordered,
      co.date_arrived,
      co.price,
      co.lead_time
    FROM 
      component_supplier_order cso
    JOIN 
      component_order co ON cso.order_id = co.order_id
    JOIN 
      supplier s ON cso.supplier_id = s.supplier_id
    JOIN 
      component comp ON cso.component_id = comp.component_id;
  `;

  app.get('/getOrders', (req, res) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log("success");
        res.send(result); 
      }
    });
  });



  app.get('/getSuppliers', (req, res) => {
    db.query("SELECT *FROM supplier", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log("successs");
        res.send(result); 
      }
    });
  });
  app.get('/getComponents', (req, res) => {
    db.query("SELECT *FROM component", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log("successs");
        res.send(result); 
      }
    });
  });

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
  
  async function sendacceptance(email,status) {     //DO NOTTTT DELETE COMMENTED CODEEEEEEEEEEEE
    // if (status == 'accept'){
    //   subject = 'Access Granted'
    //   msg = `We are pleased to inform you that your access request to Bike SCM has been approved! You now have full access to the application, and we are excited to have you on board.
              
    //   If you encounter any issues during the login process or while using the application, please don't hesitate to contact our support team. We are here to assist you every step of the way.
      
    //   Thank you for choosing Bike SCM.`
    // }else{
    //   subject = 'Access Denied'
    //   msg = `I hope this email finds you well. We wanted to reach out to inform you about the recent status of your access request.
      
    //   After careful consideration and review of your request, we regret to inform you that we are unable to grant access to the application at this time.
      
    //   We understand that this news may be disappointing, and we sincerely apologize for any inconvenience this may cause. Please know that our decision was made with careful consideration of various factors, and we remain committed to maintaining the security and integrity of our application.
      
    //   If you have any questions or would like further clarification regarding this decision, please don't hesitate to reach out to our support team 
      
    //   Thank you for your understanding.`
    // }
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com", 
    //   port: 465, 
    //   secure: true, 
    //   auth: {
    //     user: "judenetwork1@gmail.com",
    //     pass: "iepp cssl tcvq pxyd", 
    //   },
    // });
    
    // let info = await transporter.sendMail({
    //   from: 'judenetwork1@gmail.com',
    //   to: "vedroxplayz@gmail.com",
    //   subject: `${subject}`,
    //   html: `Greetings,
    //   ${msg}
      
    //   Best regards,
    //   Bike SCM Boarding Team.
      
    //   `,
    // });
  }



  app.get('/supplierofferings/:componentType', (req, res) => {
    console.log('hello')
    const { componentType } = req.params;

    db.query('SELECT supplier_id, supplier_name, price, lead_time FROM supplier_offerings NATURAL JOIN supplier WHERE component_type_id = ?', [componentType], (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
      console.log(results);
      res.json(results);
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////


  app.get('/blueprintCheck/:modelId', (req, res) => {
    const { modelId } = req.params;
  
    db.query('SELECT * FROM blueprint WHERE model_id = ?', [modelId], (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
  
      if (results.length > 0) {
        res.json({ hasBlueprint: true });
      } else {
        res.json({ hasBlueprint: false });
      }
    });
  });

  app.get('/blueprint/:modelId', (req, res) => {
    const { modelId } = req.params;
  
    const query = `
      SELECT * FROM blueprint INNER JOIN component_type ON blueprint.component_type_id = component_type.component_type_id
    `;
  
    db.query(query, [modelId], (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
  
      res.json(results);
    });
  });


// Fetch all parts
app.get('/parts', (req, res) => {
  db.query('SELECT * FROM parts', (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }

    res.json(results);
  });
});

app.post('/blueprint', (req, res) => {
  const { modelId, parts } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }

    // Insert the new blueprint
    const values = parts.map((part) => [modelId, part.id]);
    db.query('INSERT INTO blueprint (model_id, component_type_id) VALUES ?', [values], (err) => {
      if (err) {
        return db.rollback(() => {
          console.error(err.message);
          res.status(500).send('Server error');
        });
      }

      // Commit the transaction
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            console.error(err.message);
            res.status(500).send('Server error');
          });
        }

        res.json({ message: 'Blueprint created successfully' });
      });
    });
  });
});




// Update the blueprint for a product
// Update the blueprint for a product
app.put('/updateBlueprint/:modelId', (req, res) => {
  const { modelId } = req.params;
  const newBlueprint = req.body;

  db.query('SELECT * FROM blueprint WHERE model_id = ?', [modelId], (err, currentBlueprint) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  
    // Find components to delete
    const componentsToDelete = currentBlueprint.filter(component => !newBlueprint.some(newComponent => newComponent.blueprint_id === component.blueprint_id));
    // Find components to add
    // Find components to add
    const componentsToAdd = newBlueprint.filter(newComponent => !currentBlueprint.some(component => component.component_type_id === newComponent.component_type_id));
    // Delete components
    componentsToDelete.forEach(component => {
      db.query('DELETE FROM blueprint WHERE blueprint_id = ?', [component.blueprint_id], (err, results) => {
        if (err) {
          console.error('delete error');
          return res.status(500).send('Server error');
        }
      });
    });

    // Add components
    componentsToAdd.forEach(newComponent => {
      db.query('INSERT INTO blueprint (model_id, component_type_id) VALUES (?, ?)', [modelId, newComponent.id], (err) => {
        if (err) {
          console.error('insert error');
          return res.status(500).send('Server error');
        }
      });
    });

    res.json({ message: 'Blueprint updated' });
  });
});



//logout section

app.post('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      // Session destroyed successfully
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.sendStatus(200);
      console.log('destroyed session')
    }
  });
});

//order endpoints


  app.post('/register', (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    const name= req.body.name


    //console.log('xx')
    bcrypt.hash(pass, saltRounds, (err, hash) => {
      if (err) {
        console.log(err)
      }
      db.query(
       // 'INSERT INTO manager (email,password) VALUES (?,?)',
       'INSERT INTO employee (email,password,pending,manager_id,name) VALUES (?,?,1,1,?)',
        [email, hash, name],
        (err, result) => {
          if (err) {
            console.log(err)
            console.log("he 1")
          } else {
            console.log('he 2')
            res.send('values Inserted') 
          }
        }
      )
    })
  })
 

  app.get('/login', (req, res) => {
    if (req.session.user) {
      console.log('there is a current session')
      res.send({ loggedIn: true, user: req.session.user, isadmin: req.session.isadmin })
    } else {
      console.log('no current session')
      res.send({ loggedIn: false});
    }
  })
  


app.post('/login', (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    db.query('SELECT * from employee where email = ? ', email, (err, result) => {
      if (err) {
        res.send({ err: err })
      }
      if(result.length == 0){
        db.query('SELECT * from manager where email = ? ', email, (err, result) => {
          if (err) {
            res.send({ err: err })
          }else if(result.length == 0){
            //no email found
            res.send({ message: 'User does not exist' })

          }
          
          else{
            
            //manager query
            bcrypt.compare(pass, result[0].password, (error, response) => {
              if (response) {
                result[0].isadmin = 1;
                //console.log('jaweb'+result)
                req.session.user = result // creating a session
                console.log('manager in house')
                res.send(result)
              } else {
                res.send({ message: 'wrong email password combination' })
              }
            })
          }  
        })  


      }
      else if (result.length > 0) {
        bcrypt.compare(pass, result[0].password, (error, response) => {
          if (response) {
            result[0].isadmin = 0;
            console.log('jaweb'+JSON.stringify(result))
            req.session.user = result // creating a session
            req.session.isadmin = 0

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
  
////////////////////////////////////Fadel//////////////////////////////////////////////


app.get('/getbyProducts', (req, res) => {
  db.query('SELECT co.*, m.name, m.type FROM customer_order AS co JOIN model AS m ON co.modelID = m.model_id group by co.cust_order_id;', (err, result) => {
    if (err) {
      console.log(err)
      console.log("fi error")
    } else {
      res.send(result) //to send the data that we got from our query
    }
  })
})


app.get('/gettingByproductList', (req, res) => {
  db.query('SELECT name FROM model;', (err, result) => {
    if (err) {
      console.log(err)
      console.log("gettingByproductList error")
    } else {
      res.send(result) //to send the data that we got from our query
    }
  })
})

app.get('/gettingByproductTypeList', (req, res) => {
  db.query('SELECT type FROM model;', (err, result) => {
    if (err) {
      console.log(err)
      console.log("gettingByproductTypeList error")
    } else {
      res.send(result) //to send the data that we got from our query
    }
  })
})

 /////////////////////////////////////////// //new purch:
 app.get('/availableQuantityCheck', (req, res) => {
  byProductName = req.query.byProductName;
  const query = 'SELECT quantity FROM model WHERE name = ?';

  db.query(query, [byProductName], (err, result) => {
      if (err) {
          console.error("Error retrieving quantity from name in model:", err);
          res.status(500).send('Error retrieving quantity');
          return;
      }
      if (result.length > 0) {
        res.send({ quantity: result[0].quantity });
      } else {
        res.status(404).send('No data found');
      }
  });
});
app.post('/update_model', (req, res) => {
  const {byProductName,ByproductQuantity} = req.body;

  console.log("Reducing model quantity...");
  console.log(ByproductQuantity);
  console.log(byProductName);
  
  const query = `
  UPDATE model
  SET quantity = quantity - ?
  WHERE name = ?
`;
  
  db.query( 
    query,
    [ByproductQuantity,byProductName], 
    (err, result) => {
      if (err) {
        console.error("Error updating product quantity:", err);
        res.status(500).send('Error updating product quantity');
        return;
    }
    
    if (result.affectedRows === 0) {
        // If no rows were affected, the product name might not exist (not gonna happen since name come from selecting an available name)
        res.status(404).send('Product not found');
    } else {
        // Successfully updated the quantity
        res.send('Product quantity updated successfully');
    }
    }
  );
});


app.get('/getModelIdByName', (req, res) => {
  const modelName = req.query.name;  // Get the model name from query parameters
  const query = 'SELECT model_id FROM model WHERE name = ?';

  db.query(query, [modelName], (err, result) => {
      if (err) {
          console.error("Error retrieving model ID:", err);
          res.status(500).send('Error retrieving model ID');
          return;
      }

      if (result.length === 0) {
          res.status(404).send('Model not found');
          return;
      }

      const modelId = result[0].model_id;
      res.send({ modelId: modelId });
  });
});
app.get('/get_byproduct_stock', (req, res) => {
  const modelID = req.query.modelID; 
  const query = 'SELECT current_stock FROM byproduct_storage WHERE model_id = ? ORDER BY current_stock DESC LIMIT 1';

  db.query(query, [modelID], (err, result) => {
      if (err) {
          console.error("Error retrieving stock", err);
          res.status(500).send('Error retrieving stock');
          return;
      }

      if (result.length === 0) {
          res.status(404).send('stock number not found');
          return;
      }

      const stock = result[0].current_stock;
      res.send({ stock: stock });
  });
});
app.get('/highest_stock_unit_ID', (req, res) => {
  const modelID = req.query.modelID; 
  const query = 'SELECT unit_id FROM byproduct_storage WHERE model_id = ? ORDER BY current_stock DESC LIMIT 1';

  db.query(query, [modelID], (err, result) => {
      if (err) {
          console.error("Error retrieving unit_id of highest stock", err);
          res.status(500).send('Error retrieving unit_id of highest stock');
          return;
      }

      if (result.length === 0) {
          res.status(404).send('unit_id of highest stock not found');
          return;
      }

      const unit_id = result[0].unit_id;
      res.send({ unit_id: unit_id });
  });
});

app.post('/newPurchase', (req, res) => {
    const { byProductName, ByproductQuantity, purchaseDate } = req.body;
  
    
    console.log(ByproductQuantity);
    console.log("Processing new purchase...");
  
    
    const query = `
    INSERT INTO customer_order (quantity, total_price, date, modelID)
    VALUES (?, 
            ? * (SELECT price FROM model WHERE name = ?),
            ?,
            (SELECT model_id FROM model WHERE name = ?));
    SELECT LAST_INSERT_ID() as cust_order_id;
  `;
    
    db.query( 
      query,
      [ByproductQuantity,ByproductQuantity,byProductName,purchaseDate,byProductName], 
      (err, result) => {
        if (err) {
          console.error("Error inserting new purchase: ", err);
          res.status(500).send('Error inserting values');
        } else {
        const custOrderId = result[1][0].cust_order_id; 
        console.log('New Customer Order ID:', custOrderId);
        res.send({ custOrderId: custOrderId, message: 'Values Inserted Successfully' });
        }
      }
    );
  });
  

  
  app.post('/update_byproduct_storage', (req, res) => {
    const { unitId, ByproductQuantity  } = req.body;
  
    console.log("updating byproduct_storage...");
  
    const query = `
    UPDATE byproduct_storage
SET current_stock = current_stock - ?
WHERE unit_id = ?
  `;
  
    db.query(
      query,
      [ByproductQuantity,unitId], 
      (err, result) => {
        if (err) {
          console.error("Error reducing byproduct stock: ", err);
          
        } else {
          res.send('Stock reduction success');
        }
      }
    );
  });



  app.post('/update_produced_byproduct', (req, res) => {
    const { ModelID, custOrderId, ByproductQuantity } = req.body;
        const updateQuery = `
        UPDATE produced_byproduct
        SET cus_orderID = ?,  sold = 1
        WHERE byproduct_id IN (
            SELECT byproduct_id FROM (
                SELECT byproduct_id FROM produced_byproduct
                WHERE sold = 0 AND cus_orderID IS NULL AND model_id = ?
                ORDER BY byproduct_id ASC
                LIMIT ?
            ) AS subquery
        )
        `;

        db.query(updateQuery, [custOrderId, ModelID, ByproductQuantity], (err, updateResults) => {
            if (err) {
                console.error("Error updating order by product:", err);
                res.status(500).send('Error updating order by product');
                return;
            }
            console.log('Updated order by product successfully');
            res.send({ message: 'Updated order by product successfully', affectedRows: updateResults.affectedRows });
        });
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////


app.listen(3001, () => {
  console.log('your server is running on port 3001')
}) //start our app
