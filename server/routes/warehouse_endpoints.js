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


warehouseRouter.post('/createComponentStorage', (req, res) => {
    // Extract data from the request body
    const { name, capacity, size, part_category_id } = req.body;

        // Insert the new warehouse into the database
        db.query('INSERT INTO component_storage(component_storage_name, component_storage_size, component_storage_capacity, part_category_id) VALUES (?, ?, ?,?)', [name, size, capacity, part_category_id], (err, result) => {
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
            db.query('INSERT INTO byproduct_storage(byproduct_storage_name, byproduct_storage_size, byproduct_storage_capacity, bike_category_id) VALUES (?, ?, ?,?)', [name, size, capacity, bike_category_id], (err, result) => {
                if (err) {
                    console.error('Error adding warehouse to database:', err);
                    res.status(500).send('Error adding warehouse');
                    return;
                }
                console.log('Warehouse added successfully');
                res.status(200).send('Warehouse added successfully');
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


warehouseRouter.delete('/delete_component_storage/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM component_storage WHERE unit_id = ?';
    const values = [id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error deleting component warehouse:', err);
            res.status(500).send('Error deleting component warehouse');
            return;
        }
        console.log('Warehouse deleted successfully');
        res.status(200).send('Warehouse deleted successfully');
    });
});

warehouseRouter.get('/warehouse/check/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM component_storage WHERE unit_id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error fetching warehouse:', err);
        res.status(500).send('Error fetching warehouse');
        return;
      }
      if (result.length === 0) {
        res.status(404).send('Warehouse not found');
        return;
      }
      const storageUnit = result[0];
      res.status(200).json({ capacity: storageUnit.capacity });
    });
  });

  

module.exports = warehouseRouter;