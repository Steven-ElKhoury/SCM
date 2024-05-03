const express = require('express');
const productRouter = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const crypto = require('crypto');

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'supply_chain',
});

// Create a new product
productRouter.post('/createProduct', (req, res) => {
    // Extract data from the request body
    const { name, bike_category_id, model_number, description, price, image_url } = req.body;
    // Insert the new product into the database
    db.query('INSERT INTO model(name, bike_category_id, description, model_number, price, image_url) VALUES (?, ?, ?, ?, ?, ?)', [name, bike_category_id, description, model_number, price, image_url], (err, result) => {
        if (err) {
            console.error('Error adding product to database:', err);
            res.status(500).send('Error adding product');
            return;
        }
        console.log('Product added successfully');
        res.status(200).send('Product added successfully');
    });
});


productRouter.get('/getProducts', (req, res) => {
    const query = 'SELECT * FROM model LEFT JOIN bike_category ON model.bike_category_id = bike_category.bike_category_id';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Error fetching products');
            return;
        }
        res.status(200).json(result);
    });
});


// Update a product
productRouter.put('/editProduct/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { image_url, bike_category_id, name, model_number, description, price } = req.body;
    const query = 'UPDATE model SET image_url = ?, bike_category_id = ?, name = ?, model_number = ?, description = ?, price = ? WHERE model_id = ?';
    const values = [image_url, bike_category_id, name, model_number, description, price, id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).send('Error updating product');
            return;
        }
        console.log('Product updated successfully')
        res.status(200).send('Product updated successfully');
    });
});

productRouter.delete('/deleteProduct/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM model WHERE model_id = ?';
    const values = [id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).send('Error deleting product');
            return;
        }
        console.log('Product deleted successfully')
        res.status(200).send('Product deleted successfully');
    });
});

productRouter.get('/bikeTypes', (req, res) => {
    const query = 'SELECT * FROM bike_category';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching bike types:', err);
            res.status(500).send('Error fetching bike types');
            return;
        }
        res.status(200).json(result);
    });
});

productRouter.post('/createBikeType', (req, res) => {
    const { categoryName } = req.body;
    const query = 'INSERT INTO bike_category (category_name) VALUES (?)';
    const values = [categoryName];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error creating bike type:', err);
            res.status(500).send('Error creating bike type');
            return;
        }
        res.status(200).send('Bike type created successfully');
    });
});

productRouter.get('/getBikeType/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM bike_category WHERE bike_category_id = ?';
    const values = [id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error getting bike type:', err);
            res.status(500).send('Error getting bike type');
            return;
        }
        res.status(200).json(result);
    });
});

productRouter.put('/updateBikeType/:id', (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;
    const query = 'UPDATE bike_category SET category_name = ? WHERE bike_category_id = ?';
    const values = [categoryName, id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error editing bike type:', err);
            res.status(500).send('Error editing bike type');
            return;
        }
        res.status(200).send('Bike type edited successfully');
        console.log('Bike type edited successfully');
    });
});

productRouter.delete('/deleteBikeType/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM bike_category WHERE bike_category_id = ?';
    const values = [id];
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error deleting bike type:', err);
            res.status(500).send('Error deleting bike type');
            return;
        }
        res.status(200).send('Bike type deleted successfully');
        console.log('Bike type deleted successfully');
    });
});

module.exports = productRouter;