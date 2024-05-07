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
        }
      }
    }
  )
})


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
const query1 = `
SELECT 
cso.*, 
so.supplier_id, 
so.component_type_id, 
so.lead_time,
s.supplier_name AS supplier_name, 
ct.name AS component_type_name
FROM 
component_supplier_order AS cso
JOIN 
supplier_offerings AS so ON cso.offering_id = so.offering_id
JOIN 
supplier AS s ON so.supplier_id = s.supplier_id
JOIN 
component_type AS ct ON so.component_type_id = ct.component_type_id

`;

app.get('/getAllOrders', (req, res) => {
  db.query(query1, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.send(result);
  });
});


const query = `
SELECT 
cso.*, 
so.supplier_id, 
so.component_type_id, 
so.lead_time,
s.supplier_name AS supplier_name, 
ct.name AS component_type_name
FROM 
component_supplier_order AS cso
JOIN 
supplier_offerings AS so ON cso.offering_id = so.offering_id
JOIN 
supplier AS s ON so.supplier_id = s.supplier_id
JOIN 
component_type AS ct ON so.component_type_id = ct.component_type_id where pending = 0
`;

app.get('/getOrders', (req, res) => {
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.send(result);
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
  db.query('select supplier_name,offering_id,price,lead_time,supplier_id, name from supplier_offerings natural join component_type natural join supplier', (err, result) => {
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
    //console.log(req.body)
    db.query("Select component_type_id from component_type where name = ?", [selectedType], (err, result) => {
      if (err) {
        console.error('Error getting component id:', err);
        res.status(500).send('Error getting component id');
        return;
      }
      //console.log(JSON.stringify(result))
      res.send(result) //to send the data that we got from our query
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
    //console.log(req.body)
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
    //console.log(req.body)
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
    //console.log(req.body)
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
const e = require('express')
  
  async function sendacceptance(email,status) {     //DO NOTTTT DELETE COMMENTED CODEEEEEEEEEEEE
    if (status == 'accept'){
      subject = 'Access Granted'
      msg = `We are pleased to inform you that your access request to Bike SCM has been approved! You now have full access to the application, and we are excited to have you on board.<br><br>
              
      If you encounter any issues during the login process or while using the application, please do not hesitate to contact our support team. We are here to assist you every step of the way.<br><br>
      
      Thank you for choosing Bike SCM.<br><br>`
    }else{
      subject = 'Access Denied'
      msg = `I hope this email finds you well. We wanted to reach out to inform you about the recent status of your access request.<br><br>
      
      After careful consideration and review of your request, we regret to inform you that we are unable to grant access to the application at this time.<br><br>
      
      We understand that this news may be disappointing, and we sincerely apologize for any inconvenience this may cause. Please know that our decision was made with careful consideration of various factors, and we remain committed to maintaining the security and integrity of our application.<br><br>
      
      If you have any questions or would like further clarification regarding this decision, please do not hesitate to reach out to our support team <br><br>
      
      Thank you for your understanding.<br><br>`
    }
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465, 
      secure: true, 
      auth: {
        user: "judenetwork1@gmail.com",
        pass: "iepp cssl tcvq pxyd", 
      },
    });
    console.log('ddd'+email)
    let info = await transporter.sendMail({
      from: 'judenetwork1@gmail.com',
      to: email,
      subject: `${subject}`,
      html: `Greetings,
      ${msg}
      
      Best regards,
      Bike SCM Boarding Team.
      
      `,
    });
  }



  app.get('/supplierofferings/:componentType', (req, res) => {
    const { componentType } = req.params;

    db.query('SELECT offering_id,supplier_id, supplier_name, price, lead_time FROM supplier_offerings NATURAL JOIN supplier WHERE component_type_id = ?', [componentType], (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
      //console.log(results);
      res.json(results);
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////



  app.get('/getParts', (req, res) => {
    db.query('SELECT *,category_name as type FROM component_type JOIN part_category ON part_category.part_category_id = component_type.part_category_id', (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
  
      res.json(results);
    }
    );
  });


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
    //console.log(modelId);
    const query = `
      SELECT blueprint.*, component_type.*, part_category.part_category_id, part_category.category_name as type
      FROM blueprint 
      JOIN component_type ON blueprint.component_type_id = component_type.component_type_id 
      JOIN part_category ON component_type.part_category_id = part_category.part_category_id 
      WHERE model_id = ?;
    `;
  
    db.query(query, [modelId], (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
      }
      //console.log(results);
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
          } else {
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
                req.session.user = result // creating a session
                console.log('manager is logged in')
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
            //console.log(JSON.stringify(result))
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
  db.query(`
    SELECT co.*, m.name, bc.category_name 
    FROM customer_order AS co 
    JOIN model AS m ON co.modelID = m.model_id 
    LEFT JOIN bike_category AS bc ON m.bike_category_id = bc.bike_category_id;
  `, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result) //to send the data that we got from our query
    }
  })
})


app.get('/gettingByproductList', (req, res) => {
  db.query('SELECT model_id, name FROM model;', (err, result) => {
    if (err) {
      console.log(err)
      console.log("gettingByproductList error")
    } else {
      res.send(result) //to send the data that we got from our query
    }
  })
})

app.get('/gettingByproductTypeList', (req, res) => {
  db.query('SELECT category_name FROM bike_category;', (err, result) => {
    if (err) {
      console.log(err)
      console.log("gettingByproductTypeList error")
    } else {
      res.send(result) //to send the data that we got from our query
    }
  })
})

 /////new purch: update tables
 app.get('/availableQuantityCheck', (req, res) => {
  const modelID = req.query.modelID;
  const query = `
  SELECT COUNT(*) as quantity 
  FROM produced_byproduct 
  WHERE model_id = ? AND sold = 0;
  `;

  db.query(query, [modelID], (err, result) => {
      if (err) {
          console.error("Error retrieving quantity from model id in model:", err);
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

app.post('/newPurchase', (req, res) => {
  const { modelID, ByproductQuantity, purchaseDate } = req.body;

  
  console.log(ByproductQuantity);
  console.log("Processing new purchase...");

  
  const query = `
  INSERT INTO customer_order (quantity, total_price, date, modelID)
  VALUES (?, 
          ? * (SELECT price FROM model WHERE model_id = ?),
          ?,
          ?);
  SELECT LAST_INSERT_ID() as cust_order_id;
`;
  
  db.query( 
    query,
    [ByproductQuantity,ByproductQuantity,modelID,purchaseDate,modelID], 
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

app.post('/update_model', (req, res) => {
  const {modelID,ByproductQuantity} = req.body;

  console.log("Reducing model quantity...");
  console.log(ByproductQuantity);
  console.log(modelID);
  
  const query = `
  UPDATE model
  SET quantity = quantity - ?
  WHERE model_id = ?
`;
  
  db.query( 
    query,
    [ByproductQuantity,modelID], 
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

app.get('/get_byproduct_stock', (req, res) => {
  const modelID = req.query.modelID; 
  const query = 'SELECT byproduct_storage_current_stock FROM byproduct_storage WHERE model_id = ? ORDER BY byproduct_storage_current_stock DESC LIMIT 1';

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
  const query = `
      SELECT byproduct_storage_id,COUNT(*) as stock 
      FROM produced_byproduct 
      WHERE model_id = ? AND sold = 0
      group by byproduct_storage_id
      order by stock desc
      limit 1;
`;

  db.query(query, [modelID], (err, result) => {
      if (err) {
          console.error("Error retrieving unit id of highest stock", err);
          res.status(500).send('Error retrieving id of highest stock');
          return;
      }

      if (result.length === 0) {
          res.status(404).send('id of highest stock not found');
          return;
      }

      const byproduct_storage_id = result[0].byproduct_storage_id;
      const stock = result[0].stock;
      res.send({ unit_id: byproduct_storage_id ,
        stock: stock
      });
  });
});

  app.post('/update_byproduct_storage', (req, res) => {
    const { unitId, ByproductQuantity  } = req.body;
  
    console.log("updating byproduct_storage...");
  
    const query = `
    UPDATE byproduct_storage
    SET byproduct_storage_current_stock = byproduct_storage_current_stock - ?
    WHERE byproduct_storage_id = ?
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
    const { ModelID, custOrderId, ByproductQuantity,unit_id } = req.body;
    //in order to get the sold products we can do a query where byproduct_storage_id=null
    //console.log("unit_id"+unit_id)
        const updateQuery = `
        UPDATE produced_byproduct
        SET cus_orderID = ?,  sold = 1 , byproduct_storage_id = null
        WHERE byproduct_id IN (
            SELECT byproduct_id FROM (
                SELECT byproduct_id FROM produced_byproduct
                WHERE sold = 0 AND cus_orderID IS NULL AND model_id = ? AND byproduct_storage_id = ?
                ORDER BY byproduct_id ASC
                LIMIT ?
            ) AS subquery 
        )
        `;

        db.query(updateQuery, [custOrderId, ModelID, unit_id, ByproductQuantity], (err, updateResults) => {
            if (err) {
                console.error("Error updating order by product:", err);
                res.status(500).send('Error updating order by product');
                return;
            }
            console.log('Updated order by product successfully');
            res.send({ message: 'Updated order by product successfully', affectedRows: updateResults.affectedRows });
        });
    });
//////////////////////////////////////////////////manufacture////////////////////////////////////////////////

app.get('/getAllModels', (req, res) => {
  const query = `
  SELECT m.model_id, m.name, m.quantity, bc.category_name
  FROM model m INNER JOIN bike_category bc ON m.bike_category_id = bc.bike_category_id;
`;
  db.query(query, (err, result) => {
      if (err) {
          console.error("Error retrieving models", err);
          res.status(500).send('Error retrieving models');
          return;
      }

      if (result.length === 0) {
          res.status(404).send('Error retrieving models: not found');
          return;
      }
      res.send(result);
  });
});

//update tables:
app.get('/availableStorage', (req, res) => {
  const model_id = req.query.model_id;
  const query = `
  SELECT SUM(byproduct_storage_capacity - byproduct_storage_current_stock) AS available_space
  FROM byproduct_storage
  WHERE bike_category_id = (
      SELECT bike_category_id
      FROM model
      WHERE model_id = ?
  );
  `;

  db.query(query, [model_id], (err, results) => {
      if (err) {
          console.error("Error retrieving available storage space", err);
          return res.status(500).send('Error retrieving available storage space');
      }
      res.send({ availableSpace: results[0].available_space || 0 });
  });
});


app.post('/updateModel', (req, res) => {
  const { modelID, quantity } = req.body;

  // Update model quantity
  const updateModelQuery = `
      UPDATE model
      SET quantity = quantity + ?
      WHERE model_id = ?;
  `;

  db.query(updateModelQuery, [quantity, modelID], (err, modelResults) => {
      if (err) {
          console.error("Error updating model quantity:", err);
          return res.status(500).send('Error updating model quantity');
      }
      res.send({ message: 'Updated model quantity successfully', affectedRows: modelResults.affectedRows });
      });
  });

    app.get('/highest_capacity_unit_ID', (req, res) => {
      const modelID = req.query.modelID; 
      const query = `
      SELECT 
      bs.byproduct_storage_id,
      (bs.byproduct_storage_capacity - bs.byproduct_storage_current_stock) AS available_space
  FROM 
      byproduct_storage bs
  JOIN 
      (SELECT bike_category_id FROM model WHERE model_id = ?) AS m
  ON 
      bs.bike_category_id = m.bike_category_id
  ORDER BY 
      available_space DESC
  LIMIT 1;
    `;
    
      db.query(query, [modelID], (err, result) => {
          if (err) {
              console.error("Error retrieving unit id of highest capacity", err);
              res.status(500).send('Error retrieving id of highest capacity');
              return;
          }
    
          if (result.length === 0) {
              res.status(404).send('id of highest capacity not found');
              return;
          }
    
          const byproduct_storage_id = result[0].byproduct_storage_id;
          const available_space = result[0].available_space;
          res.send({ unit_id: byproduct_storage_id ,
            available_space: available_space
          });
      });
    });

app.post('/manufactureByproduct', (req, res) => {
  const { ModelID,unit_id } = req.body;
      const updateQuery = `
      insert into produced_byproduct (model_id,sold,byproduct_storage_id)
      values(? , 0 , ?)
      `;
      db.query(updateQuery, [ModelID, unit_id], (err, updateResults) => {
          if (err) {
              console.error("Error adding by products:", err);
              res.status(500).send('Error adding by products');
              return;
          }
          res.send({ message: 'Updated Produced_byproduct successfully', affectedRows: updateResults.affectedRows });
      });
  });

  app.get('/getBlueprint', (req, res) => {
    const model_id = req.query.model_id;
    //console.log(model_id)
    const query = `
    SELECT 
    model_id,
    component_type_id,
    count(component_type_id) AS number_of_components
  FROM 
    blueprint
  WHERE 
    model_id = ?
  GROUP BY 
    model_id,component_type_id;
    `;
  
    db.query(query, [model_id], (err, results) => {
      
        if (err) {
            console.error("Error retrieving blueprint", err);
            return res.status(500).send('Error retrieving blueprint');
        }
      //console.log(results);
      res.send(results);
    });
  });

  app.get('/availableComponents', async (req, res) => {
    const model_id = req.query.model_id;
    const manufactureQuantity = parseInt(req.query.quantity, 10)
    try {
        const blueprintQuery = `
            SELECT component_type_id, COUNT(*) AS required_number
            FROM blueprint
            WHERE model_id = ?
            GROUP BY component_type_id;
        `;
        const [blueprintResults] = await db.promise().query(blueprintQuery, [model_id]);
        const componentChecks = blueprintResults.map(async (item) => {
            const totalRequired = item.required_number * manufactureQuantity;
            const availableQuery = `
                SELECT quantity
                FROM component_type
                WHERE component_type_id = ?;
            `;
            const [availableResults] = await db.promise().query(availableQuery, [item.component_type_id]);
            return {
                component_type_id: item.component_type_id,
                required: totalRequired,
                available: availableResults[0] ? availableResults[0].quantity : 0,
                isEnough: availableResults[0] && availableResults[0].quantity >= totalRequired
            };
        });

        const results = await Promise.all(componentChecks);
        res.json(results);
    } catch (error) {
        console.error("Error checking component availability:", error);
        res.status(500).send('Error checking component availability');
    }
});app.post('/updateComponentQuantity', async (req, res) => {
  const { component_type_id, decrement } = req.body;
  try {
      const updateQuery = `
          UPDATE component_type
          SET quantity = quantity - ?
          WHERE component_type_id = ?;
      `;
      await db.promise().query(updateQuery, [decrement, component_type_id]);
      res.send({ message: `Component stock for ${component_type_id} decreased by ${decrement}` });
  } catch (error) {
      console.error("Error updating component quantity:", error);
      res.status(500).send('Error updating component quantity');
  }
});

/*
//this is where things are wrong:
app.post('/updateComponentStorageStock', async (req, res) => {
  const { component_type_id, required_quantity } = req.body;
  try {
      const storageQuery = `
          SELECT cs.component_storage_id, cs.component_storage_current_stock
          FROM component_storage AS cs
          JOIN component_type AS ct ON cs.part_category_id = ct.part_category_id
          WHERE ct.component_type_id = ?
          ORDER BY cs.component_storage_current_stock DESC;
      `;
      const storages = await db.promise().query(storageQuery, [component_type_id]);
      console.log(component_type_id,required_quantity)
      console.log("Type of component_type_id: ", typeof component_type_id);
      console.log("Type of required_quantity: ", typeof required_quantity);
      console.log("splitttttttttttttttttttttttttttttttttttttttttttt")

      const results = await decrementStock(storages, required_quantity);

      if (results.unmetQuantity > 0) {
          res.status(400).send({ message: "Not enough stock available", details: results });
      } else {
          res.send({
              message: "Stock updated successfully",
              details: results
          });
      }
  } catch (error) {
      console.error("Error updating component storage stock:", error);
      res.status(500).send('Error updating component storage stock');
  }
});

async function decrementStock(storages, quantityNeeded, index = 0) {
  console.log("Received storages: ", storages);
  console.log("Type of storages: ", typeof storages);
  console.log("Received required_quantity: ", quantityNeeded);
  console.log("Type of required_quantity: ", typeof quantityNeeded);

    if (quantityNeeded <= 0 || index >= storages.length) {
        return { unmetQuantity: quantityNeeded, updates: [] };
    }

    const storage = storages[index][0];
    if (!storage || storage.component_storage_current_stock === undefined || storage.component_storage_id === undefined) {
        console.error("Storage data is missing or incorrect:", storage);
        return { unmetQuantity: quantityNeeded, updates: [] };
    }

console.log(quantityNeeded, storage.component_storage_current_stock)
console.log("Type of quantityNeeded: ", typeof quantityNeeded);
console.log("Type of storage.component_storage_current_stock: ", typeof storage.component_storage_current_stock);
    
const decrement = Math.min(quantityNeeded, storage.component_storage_current_stock);
console.log("decrement: ",decrement ," type of decrement: ",typeof decrement)

    const newStock = storage.component_storage_current_stock - decrement;
    console.log(`Attempting to update stock: newStock = ${newStock}, component_storage_id = ${storage.component_storage_id}`);

    if (isNaN(newStock) || newStock < 0) {
        console.error("Computed stock is NaN or negative:", newStock);
        return { unmetQuantity: quantityNeeded, updates: [] }; 
    }

    const updateQuery = `
        UPDATE component_storage
        SET component_storage_current_stock = ?
        WHERE component_storage_id = ?;
    `;

    await db.promise().query(updateQuery, [newStock, storage.component_storage_id]).catch(err => {
        console.error("Failed to update stock:", err);
        throw err;  
    });

    const updates = [{
        component_storage_id: storage.component_storage_id,
        decremented: decrement
    }];

    const remainingResult = await decrementStock(storages, quantityNeeded - decrement, index + 1);
    return {
        unmetQuantity: remainingResult.unmetQuantity,
        updates: [...updates, ...remainingResult.updates]
    };
}

app.post('/finalizeComponentUpdates', async (req, res) => {
  const { componentStorageId, numComponentsUpdated, componentTypeId } = req.body;
  try {
      const selectQuery = `
          SELECT component_id FROM component
          WHERE component_storage_id = ? AND component_type_id = ? AND sold = 0
          LIMIT ?;
      `;
      const [componentsToUpdate] = await db.promise().query(selectQuery, [componentStorageId, componentTypeId, numComponentsUpdated]);

console.log("componentsToUpdate: ",componentsToUpdate)
console.log("typeof componentsToUpdate: ", typeof componentsToUpdate)

      if (componentsToUpdate.length === 0) {
          res.status(404).send('No components found to update.');
          return;
      }

      const updateQuery = `
          UPDATE component
          SET sold = 1, component_storage_id = NULL
          WHERE component_id IN (?);
      `;
      const componentIds = componentsToUpdate.map(comp => comp.component_id);
      await db.promise().query(updateQuery, [componentIds]);

      res.send({ message: 'Components updated successfully', updatedCount: componentsToUpdate.length });
  } catch (error) {
      console.error("Error updating components:", error);
      res.status(500).send('Error updating components');
  }
});
*/
app.post('/startManufacturing', async (req, res) => {
  const { model_id, quantity } = req.body;

  try {
      // First, retrieve the blueprint to know how many of each component type are needed
      const blueprintResults = await db.promise().query(
          `SELECT component_type_id, COUNT(*) AS needed 
           FROM blueprint WHERE model_id = ? GROUP BY component_type_id`,
          [model_id]
      );

      for (let { component_type_id, needed } of blueprintResults[0]) {
          needed *= quantity; // Calculate total components needed based on the order quantity

          while (needed > 0) {
              // Fetch the storage location with the highest specific component count
              const availableComponents = await db.promise().query(
                  `SELECT c.component_storage_id, COUNT(*) AS component_count
                   FROM component c
                   WHERE c.component_type_id = ? AND c.sold = 0
                   GROUP BY c.component_storage_id
                   ORDER BY component_count DESC 
                   LIMIT 1;`,
                  [component_type_id]
              );

              if (availableComponents[0].length === 0) {
                  res.status(400).send({ message: "Insufficient component stock available for type: " + component_type_id });
                  return;
              }

              // Determine the number of components to mark as sold
              const { component_storage_id, component_count } = availableComponents[0][0];
              const updateCount = Math.min(needed, component_count);

              // Mark components as sold and remove them from storage
              await db.promise().query(
                  `UPDATE component 
                   SET sold = 1, component_storage_id = NULL 
                   WHERE component_type_id = ? AND component_storage_id = ? AND sold = 0
                   LIMIT ?`,
                  [component_type_id, component_storage_id, updateCount]
              );

              // Decrement the needed count
              needed -= updateCount;

              // Decrement the stock in the storage
              await db.promise().query(
                  `UPDATE component_storage 
                   SET component_storage_current_stock = component_storage_current_stock - ?
                   WHERE component_storage_id = ?`,
                  [updateCount, component_storage_id]
              );
          }
      }

      res.send({ message: "Manufacturing started successfully" });
  } catch (error) {
      console.error("Error in manufacturing process:", error);
      res.status(500).send({ message: "Failed to start manufacturing process", error });
  }
});



//////////////////////////////////////////END FADEL/////////////////////////////////////////////////////////////

app.post('/createOrder', (req, res) => {
  const { managerId, employeeId, dateOrdered, price, quantity, offering_id, userRole } = req.body;
  const pending = 1;

  //console.log(managerId);
  //console.log(employeeId);
  let query = 'INSERT INTO component_supplier_order(manager_id, employee_id, date_ordered, price, quantity, offering_id, pending) VALUES (?, ?, ?, ?, ?, ?, ?)';

   // Format the date
   const formattedDate = new Date(dateOrdered).toISOString().slice(0, 19).replace('T', ' ');

  let params = userRole === 'manager' 
    ? [managerId, null, formattedDate, price, quantity, offering_id, pending] 
    : [null, employeeId, formattedDate, price, quantity, offering_id, pending];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error creating order:", err);
      res.status(500).send('Error creating order');
      return;
    }
    console.log('Created order successfully');
    res.send({ message: 'Created order successfully', insertId: result.insertId });
  });
});



app.listen(3001, () => {
  console.log('your server is running on port 3001')
}) //start our app
