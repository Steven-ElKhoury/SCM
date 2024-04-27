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



warehouseRouter.get('/getWarehouses', (req, res) => {
    db.query('SELECT s.*, c.type FROM storage_unit s INNER JOIN component_type c ON s.component_type_id = c.component_type_id', (err, result) => {
        if (err) {
            console.error('Error fetching warehouses:', err);
            res.status(500).send('Error fetching warehouses');
            return;
        }
        console.log(result);
        res.send(result);
    });
});


warehouseRouter.post('/createUnits', (req, res) => {
    // Extract data from the request body
    const { name, capacity, size, component_type_id } = req.body;

    // Check if a warehouse with the same name already exists
    db.query('SELECT * FROM storage_unit WHERE name = ?', [name], (err, result) => {
        if (err) {
            console.error('Error checking warehouse name:', err);
            res.status(500).send('Error checking warehouse name');
            return;
        }

        if (result.length > 0) {
            console.error('A warehouse with this name already exists');
            res.status(400).send('A warehouse with this name already exists');
            return;
        }

        // Insert the new warehouse into the database
        db.query('INSERT INTO storage_unit(name, size, capacity, component_type_id) VALUES (?, ?, ?, ?)', [name, size, capacity, component_type_id], (err, result) => {
            if (err) {
                console.error('Error adding warehouse to database:', err);
                res.status(500).send('Error adding warehouse');
                return;
            }
            console.log('Warehouse added successfully');
            res.status(200).send('Warehouse added successfully');
        });
    });
});


warehouseRouter.put('/editUnit/:id', (req, res) => {
    console.log('editUnit');
    const { id } = req.params;
    const { name, size, capacity, component_type_id } = req.body;

    const query = 'UPDATE storage_unit SET name = ?, size = ?, capacity = ?, component_type_id = ? WHERE unit_id = ?';
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


warehouseRouter.delete('/deleteUnit/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM storage_unit WHERE unit_id = ?';
    const values = [id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error deleting warehouse:', err);
            res.status(500).send('Error deleting warehouse');
            return;
        }
        console.log('Warehouse deleted successfully');
        res.status(200).send('Warehouse deleted successfully');
    });
});

warehouseRouter.get('/warehouse/check/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM storage_unit WHERE unit_id = ?', [id], (err, result) => {
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