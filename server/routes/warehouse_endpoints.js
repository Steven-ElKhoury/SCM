const express = require('express');
const warehouseRouter = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const crypto = require('crypto');

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'supply_chain',
});

// Endpoint for fetching warehouses from the first table
warehouseRouter.get('/getPartWarehouses', (req, res) => {
    db.query('SELECT s.*, c.category_name FROM component_storage s INNER JOIN part_category c ON s.part_category_id = c.part_category_id', (err, result) => {
        if (err) {
            console.error('Error fetching part warehouses:', err);
            res.status(500).send('Error fetching part warehouses');
            return;
        }
        console.log(result);
        res.send(result);
    });
});

// Endpoint for fetching warehouses from the second table
warehouseRouter.get('/getProductWarehouses', (req, res) => {
    db.query('SELECT s.*, c.category_name FROM byproduct_storage s INNER JOIN bike_category c ON s.bike_category_id = c.bike_category_id', (err, result) => {
        if (err) {
            console.error('Error fetching product warehouses:', err);
            res.status(500).send('Error fetching product warehouses');
            return;
        }
        console.log(result);
        res.send(result);
    });
});


warehouseRouter.post('/createWarehouse', (req, res) => {
    // Extract data from the request body
    const { name, capacity, size, part_category_id } = req.body;
  
    // Insert the new warehouse into the database
    db.query('INSERT INTO component_storage(component_storage_name, component_storage_size, component_storage_capacity, part_category_id, component_storage_current_stock) VALUES (?, ?, ?, ?, 0)', [name, size, capacity, part_category_id], (err, result) => {
      if (err) {
        console.error('Error adding warehouse to database:', err);
        res.status(500).send('Error adding warehouse');
        return;
      }
      console.log('Warehouse added successfully');
      res.status(200).send('Warehouse added successfully');
    });
  });
  
  warehouseRouter.post('/createByproductStorage', (req, res) => {
    // Extract data from the request body
    const { name, capacity, size, bike_category_id } = req.body;
  
    // Insert the new warehouse into the database
    db.query('INSERT INTO byproduct_storage(byproduct_storage_name, byproduct_storage_size, byproduct_storage_capacity, bike_category_id, byproduct_storage_current_stock) VALUES (?, ?, ?, ?, 0)', [name, size, capacity, bike_category_id], (err, result) => {
      if (err) {
        console.error('Error adding warehouse to database:', err);
        res.status(500).send('Error adding warehouse');
        return;
      }
      console.log('Warehouse added successfully');
      res.status(200).send('Warehouse added successfully');
    });
  });

  warehouseRouter.put('/editWarehouse/:id', (req, res) => {
    // Extract data from the request body
    const { name, capacity, size, part_category_id, current_stock } = req.body;
    const { id } = req.params;

    // Update the warehouse in the database
    db.query('UPDATE component_storage SET component_storage_name = ?, component_storage_size = ?, component_storage_capacity = ?, part_category_id = ?, component_storage_current_stock = ? WHERE component_storage_id = ?', [name, size, capacity, part_category_id, current_stock, id], (err, result) => {
        if (err) {
            console.error('Error updating warehouse in database:', err);
            res.status(500).send('Error updating warehouse');
            return;
        }
        console.log('Warehouse updated successfully');
        res.status(200).send('Warehouse updated successfully');       
    });
});

warehouseRouter.put('/editByproductStorage/:id', (req, res) => {
    // Extract data from the request body
    const { name, capacity, size, bike_category_id, current_stock } = req.body;
    const { id } = req.params;

    // Update the warehouse in the database
    db.query('UPDATE byproduct_storage SET byproduct_storage_name = ?, byproduct_storage_size = ?, byproduct_storage_capacity = ?, bike_category_id = ?, byproduct_storage_current_stock = ? WHERE byproduct_storage_id = ?', [name, size, capacity, bike_category_id, current_stock, id], (err, result) => {
        if (err) {
            console.error('Error updating warehouse in database:', err);
            res.status(500).send('Error updating warehouse');
            return;
        }
        console.log('Warehouse updated successfully');
        res.status(200).send('Warehouse updated successfully');
    });
});


warehouseRouter.put('/edit_component_storage/:id', (req, res) => {
    console.log('edit_component_storage');
    const { id } = req.params;
    const { name, size, capacity, component_type_id } = req.body;

    const query = 'UPDATE component_storage SET name = ?, size = ?, capacity = ?, component_type_id = ? WHERE unit_id = ?';
    const values = [name, size, capacity, component_type_id, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating warehouse:', err);
            res.status(500).send('Error updating warehouse');
            return;
        }
        console.log('Warehouse updated successfully');
        res.status(200).send('Warehouse updated successfully');
    });
});


warehouseRouter.delete('/deleteWarehouse/:id', (req, res) => {
  // Extract the ID from the request parameters
  const { id } = req.params;

  // Delete the warehouse from the database
  db.query('DELETE FROM component_storage WHERE component_storage_id = ?', [id], (err, result) => {
      if (err) {
          console.error('Error deleting warehouse from database:', err);
          res.status(500).send('Error deleting warehouse');
          return;
      }
      console.log('Warehouse deleted successfully');
      res.status(200).send('Warehouse deleted successfully');
  });
});

warehouseRouter.delete('/deleteByproductStorage/:id', (req, res) => {
  // Extract the ID from the request parameters
  const { id } = req.params;

  // Delete the warehouse from the database
  db.query('DELETE FROM byproduct_storage WHERE byproduct_storage_id = ?', [id], (err, result) => {
      if (err) {
          console.error('Error deleting warehouse from database:', err);
          res.status(500).send('Error deleting warehouse');
          return;
      }
      console.log('Warehouse deleted successfully');
      res.status(200).send('Warehouse deleted successfully');
  });
});


warehouseRouter.get('/warehouse/check/:component_type_id', (req, res) => {
  const { component_type_id } = req.params;

  // First, get the part_category_id from the component_type_id
  const partCategoryQuery = 'SELECT part_category_id FROM component_type WHERE component_type_id = ?';
  db.query(partCategoryQuery, [component_type_id], (err, result) => {
    if (err) {
      console.error('Error fetching part category:', err);
      res.status(500).send('Error fetching part category');
      return;
    }

    const part_category_id = result[0].part_category_id;
    console.log(part_category_id);
    // Then, find all warehouses that store this part_category_id
    const warehouseQuery = `
      SELECT cs.component_storage_id, cs.component_storage_capacity, cs.component_storage_current_stock
      FROM component_storage AS cs
      WHERE cs.part_category_id = ?
    `;

    db.query(warehouseQuery, [part_category_id], (err, result) => {
      if (err) {
        console.error('Error fetching warehouses:', err);
        res.status(500).send('Error fetching warehouses');
        return;
      }

      const availableWarehouses = result.map(warehouse => ({
        ...warehouse,
        remaining_capacity: warehouse.component_storage_capacity - warehouse.component_storage_current_stock
      }));
      console.log(availableWarehouses);

      // Compute the total available storage
      let totalAvailableStorage = availableWarehouses.reduce((total, warehouse) => total + warehouse.remaining_capacity, 0);


      console.log(totalAvailableStorage);
      // Then, find all pending orders for this component_type_id
      const pendingOrdersQuery = `
        SELECT SUM(cso.quantity) AS total_pending
        FROM component_supplier_order AS cso
        JOIN supplier_offerings AS so ON cso.offering_id = so.offering_id
        WHERE so.component_type_id = ? AND cso.pending = 1
      `;

      db.query(pendingOrdersQuery, [component_type_id], (err, result) => {
        if (err) {
          console.error('Error fetching pending orders:', err);
          res.status(500).send('Error fetching pending orders');
          return;
        }

        const totalPending = result[0].total_pending || 0;

        console.log(totalPending);
        // Subtract the total pending from the total available storage
        totalAvailableStorage -= totalPending;

        console.log(totalAvailableStorage);
        res.status(200).json({ availableWarehouses, totalAvailableStorage });
      });
    });
  });
});


warehouseRouter.put('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;

  // Get the order details
  db.query('SELECT * FROM component_supplier_order WHERE component_order_id = ?', [orderId], (error, orders) => {
    if (error) {
      console.error('Error getting order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const order = orders[0];
    console.log(order);
    const { offering_id, quantity } = order;
    console.log(offering_id, quantity);

    db.query('SELECT component_type_id FROM supplier_offerings WHERE offering_id = ?', [offering_id], (error, rows) => {
      if (error) {
        console.error('Error getting component type:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      const component_type_id = rows[0].component_type_id;

      console.log(component_type_id);
      // Get the part category
      db.query('SELECT part_category_id FROM component_type WHERE component_type_id = ?', [component_type_id], (error, rows) => {
        if (error) {
          console.error('Error getting part category:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log(rows);

      const partCategory = rows[0].part_category_id;
        console.log(partCategory);

      // Get the warehouses that can store the part category
      db.query('SELECT * FROM component_storage WHERE part_category_id = ?', [partCategory], (error, warehouses) => {
        if (error) {
          console.error('Error getting warehouses:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('warehouses', warehouses)

        // Distribute the components across the warehouses
        let remainingQuantity = quantity;
        console.log(remainingQuantity);
    for (const warehouse of warehouses) {
        console.log('entered');
;        if (remainingQuantity === 0) {
          break;
        }
        console.log(warehouse);
        console.log(remainingQuantity);
        const storageCapacity = warehouse.component_storage_capacity;
        const currentStock = warehouse.component_storage_current_stock;

        let remainingCapacity = storageCapacity - currentStock;
        console.log(remainingCapacity);
        const quantityToStore = Math.min(remainingCapacity, remainingQuantity);
        console.log(quantityToStore);
        remainingQuantity -= quantityToStore;
        
    // Create the components
const componentPromises = [];
for (let i = 0; i < quantityToStore; i++) {
  console.log('Creating component');
  const componentPromise = new Promise((resolve, reject) => {
    db.query('INSERT INTO component (component_type_id, component_storage_id, component_order_id) VALUES (?, ?, ?)', [component_type_id, warehouse.component_storage_id, orderId], error => {
      if (error) {
        console.error('Error creating component:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });

  componentPromises.push(componentPromise);
}

Promise.all(componentPromises)
  .then(() => {
    // Update the stock in the warehouses table
    db.query('UPDATE component_storage SET component_storage_current_stock = component_storage_current_stock + ? WHERE component_storage_id = ?', [quantityToStore, warehouse.component_storage_id], error => {
      if (error) {
        console.error('Error updating warehouse stock:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    console.log(remainingQuantity);
  })
  .catch(error => {
    return res.status(500).json({ error: 'Internal server error' });
  });
}
        // Update the pending status of the order and set the date_arrived
        const dateArrived = new Date().toISOString().slice(0, 19).replace('T', ' ');
        db.query('UPDATE component_supplier_order SET pending = 0, date_arrived = ? WHERE component_order_id = ?', [dateArrived, orderId], error => {
          if (error) {
            console.error('Error updating order status:', error);
            return res.status(500).json({ error: 'Internal server error' });
          }

          res.status(200).json({ message: 'Order status updated successfully' });
        });

        // Update the quantity in the component_type table
        db.query('UPDATE component_type SET quantity = quantity + ? WHERE component_type_id = ?', [quantity, component_type_id], error => {
          if (error) {
            console.error('Error updating component type quantity:', error);
            return res.status(500).json({ error: 'Internal server error' });
          }
        });
      });
    });
  });
});
});
  

module.exports = warehouseRouter;