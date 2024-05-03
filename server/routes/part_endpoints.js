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
    const query = 'SELECT * FROM component_type LEFT JOIN part_category ON component_type.part_category_id = part_category.part_category_id';
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
    const { name, part_category_id, model_number, description, image_url } = req.body;
    console.log(part_category_id)
    // Insert the new part into the database
    db.query('INSERT INTO component_type(name, part_category_id, description, model_number, image_url) VALUES (?, ?, ?, ?, ?)', [name, part_category_id, description, model_number, image_url], (err, result) => {
        if (err) {
            console.error('Error adding component to database:', err);
            res.status(500).send('Error adding component');
            return;
        }
        console.log('Component added successfully');
        res.status(200).send('Component added successfully');
    });
});


// Update a part
partRouter.put('/editPart/:id', (req, res) => {
    const id = req.params.id;
    const { image_url, part_category_id, name, model_number, description } = req.body;
    console.log(part_category_id)
    const query = 'UPDATE component_type SET image_url = ?, part_category_id = ?, name = ?, model_number = ?, description = ? WHERE component_type_id = ?';
    const values = [image_url, part_category_id, name, model_number, description, id];
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
        console.log('Part deleted successfully')
        res.status(200).send('Part deleted successfully');
    });
});


partRouter.get('/partTypes', (req, res) => {
    const query = 'SELECT * FROM part_category';
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

// Create a part type
partRouter.post('/createPartType', (req, res) => {
    const { categoryName } = req.body;
    const query = 'INSERT INTO part_category (category_name) VALUES (?)';
    const values = [categoryName];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error creating part type:', err);
            res.status(500).send('Error creating part type');
            return;
        }
        res.status(200).send('Part type created successfully');
    });
});

// Get a part type
partRouter.get('/getPartType/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM part_category WHERE part_category_id = ?';
    const values = [id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error getting part type:', err);
            res.status(500).send('Error getting part type');
            return;
        }
        res.status(200).json(result);
    });
});

// Edit a part type
partRouter.put('/updatePartType/:id', (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;
    const query = 'UPDATE part_category SET category_name = ? WHERE part_category_id = ?';
    const values = [categoryName, id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error editing part type:', err);
            res.status(500).send('Error editing part type');
            return;
        }
        res.status(200).send('Part type edited successfully');
        console.log('Part type edited successfully');
    });
});

// Delete a part type
partRouter.delete('/deletePartType/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM part_category WHERE part_category_id = ?';
    const values = [id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error deleting part type:', err);
            res.status(500).send('Error deleting part type');
            return;
        }
        res.status(200).send('Part type deleted successfully');
        console.log('Part type deleted successfully');
    });
});


module.exports = partRouter;
