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

productRouter.post('/createProduct', (req, res) => {
    // Extract data from the request body
    const { name, type, price, quantity, image_url } = req.body;

    // Insert the new supplier into the database
    db.query('INSERT INTO model(name, type, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)', [name, type, price, quantity, image_url], (err, result) => {
        if (err) {
            console.error('Error adding model to database:', err);
            res.status(500).send('Error adding model');
            return;
        }
        console.log('Model added successfully');
        res.status(200).send('Model added successfully');
    });
});

productRouter.get('/getProducts', (req, res) => {
    db.query('SELECT * FROM model', (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Error fetching products');
            return;
        }
        console.log(result);
        res.send(result);
    });
});

productRouter.put('/editProduct/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, type, quantity, image_url } = req.body;

    const query = 'UPDATE model SET name = ?, price = ?, type = ?, quantity = ?, image_url = ? WHERE model_id = ?';
    const values = [name, price, type, quantity, image_url, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).send('Error updating product');
            return;
        }
        console.log('Product updated successfully');
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
        console.log('Product deleted successfully');
        res.status(200).send('Product deleted successfully');
    });
});




module.exports = productRouter;