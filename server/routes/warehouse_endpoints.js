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
    db.query('SELECT s.*, c.type FROM component_storage s INNER JOIN component_type c ON s.component_type_id = c.component_type_id', (err, result) => {
        if (err) {
            console.error('Error fetching warehouses:', err);
            res.status(500).send('Error fetching warehouses');
            return;
        }
        console.log(result);
        res.send(result);
    });
});


warehouseRouter.post('/create_component_storage', (req, res) => {
    // Extract data from the request body
    const { name, capacity, size, selectedPartType } = req.body;

    // Check if a warehouse with the same name already exists
    db.query('SELECT * FROM component_storage WHERE name = ?', [name], (err, result) => {
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

        db.query('SELECT component_type_id FROM component_type WHERE type = ?', [selectedPartType], (err, result) => {
            if (err) {
                console.error('Error finding component type:', err);
                res.status(500).send('Error finding component type');
                return;
            }

            if (result.length === 0) {
                console.error('Component type does not exist');
                res.status(400).send('Component type does not exist');
                return;
            }
        const componentTypeId = result[0].component_type_id;
        // Insert the new warehouse into the database
        db.query('INSERT INTO component_storage(name, size, capacity, component_type_id) VALUES (?, ?, ?,?)', [name, size, capacity,componentTypeId], (err, result) => {
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