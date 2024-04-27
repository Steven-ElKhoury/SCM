const express = require('express');
const partRouter = express.Router();
const mysql = require('mysql2');


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'supply_chain',
});


// Get all parts
partRouter.get('/parts', (req, res) => {
    const query = 'SELECT * FROM component_type';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching parts:', err);
            res.status(500).send('Error fetching parts');
            return;
        }
        res.status(200).json(result);
    });
});


// Get a part by ID
partRouter.get('/parts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM component_type WHERE component_type_id = ?';
    const values = [id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error fetching part:', err);
            res.status(500).send('Error fetching part');
            return;
        }
        res.status(200).json(result);
    });
});

// Create a new part
partRouter.post('/createPart', (req, res) => {
    // Extract data from the request body
    const { name, type, model_number, description, image_url } = req.body;

    // Insert the new supplier into the database
    db.query('INSERT INTO component_type(name, type, description, model_number, image_url) VALUES (?, ?, ?, ?, ?)', [name, type, description, model_number, image_url], (err, result) => {
        if (err) {
            console.error('Error adding component type to database:', err);
            res.status(500).send('Error adding component type');
            return;
        }
        console.log('Component type added successfully');
        res.status(200).send('Component type added successfully');
    });
});


// Select part types

partRouter.get('/partTypes', (req, res) => {
    const query = 'SELECT component_type_id, type from component_type';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching part types:', err);
            res.status(500).send('Error fetching part types');
            return;
        }
        res.status(200).json(result);
    });
}
);

// Update a part
partRouter.put('/editPart/:id', (req, res) => {
    const id = req.params.id;
    const {  image_url, type, name, model_number, description } = req.body;
    const query = 'UPDATE component_type SET image_url = ?, type = ?, name = ?, model_number = ?, description = ? WHERE component_type_id = ?';
    const values = [image_url, type, name, model_number, description, id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating part:', err);
            res.status(500).send('Error updating part');
            return;
        }
        console.log('Part updated successfully')
        res.status(200).send('Part updated successfully');
    });
});

// Delete a part
partRouter.delete('/parts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM component_type WHERE component_type_id = ?';
    const values = [id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error deleting part:', err);
            res.status(500).send('Error deleting part');
            return;
        }
        res.status(200).send('Part deleted successfully');
    });
});

module.exports = partRouter;
