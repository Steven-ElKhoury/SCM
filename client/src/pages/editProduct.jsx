import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { contentSecurityPolicy } from 'helmet';


function EditProduct() {
    const location = useLocation();
    const product = location.state.product;
    const navigate = useNavigate();
    const id = product.model_id;
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [bikeType, setBikeType] = useState(product.type);
    const [quantity, setQuantity] = useState(product.quantity);
    const [nameError, setNameError] = useState(null);
    const [priceError, setPriceError] = useState(null);
    const [bikeTypeError, setBikeTypeError] = useState(null);
    const [quantityError, setQuantityError] = useState(null);
    const [imageUrl, setImageUrl] = useState(product.image_url);
    const [imageUrlError, setImageUrlError] = useState(null);
    const [error, setError] = useState(null);

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleBikeTypeChange = (e) => {
        setBikeType(e.target.value);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    function handleEdit(e) {
        e.preventDefault();
    
        // Validate name, price, bikeType, and quantity
        if (!name) {
            setNameError('Please enter the name');
        }
    
        if (price === null || price === '') {
            setPriceError('Please enter the price');
        }
    
        if (!bikeType) {
            setBikeTypeError('Please enter the bike type');
        }
    
        if (quantity === null || quantity === '') {
            setQuantityError('Please enter the quantity');
        }
    
        if (!imageUrl) {
            setImageUrlError('Please enter the image URL');
        }

          // Check if the values have actually changed
    if (name === product.name && price === product.price && bikeType === product.type && quantity === product.quantity && imageUrl === product.image_url) {
        setError('No changes were made');
        return;
    }
    
    if(!nameError && !priceError && !bikeTypeError && !quantityError && !imageUrlError){
        // Send the updated product details to the server
        axios.put(`http://localhost:3001/editProduct/${id}`, {
            name: name,
            price: price,
            type: bikeType,
            quantity: quantity,
            image_url: imageUrl
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error('Error updating product:', error);
        });
    }
}
    
    function handleDelete() {
        // Send a delete request to the server
        axios.delete(`http://localhost:3001/deleteProduct/${id}`)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
        navigate('/main/products');
    }

    
    return (
        <div>
            <h1>Edit Product</h1>
            <form onSubmit={handleEdit}>
            <label>
                Name:
                <input type="text" value={name} onChange={handleNameChange} />
                {nameError && <p className="error">{nameError}</p>}
            </label>
            <br />
            <label>
                Price:
                <input type="number" value={price} onChange={handlePriceChange} />
                {priceError && <p className="error">{priceError}</p>}
            </label>
            <br />
            <label>
                Bike Type:
                <input type="text" value={bikeType} onChange={handleBikeTypeChange} />
                {bikeTypeError && <p className="error">{bikeTypeError}</p>}
            </label>
            <br />
            <label>
                Quantity:
                <input type="number" value={quantity} onChange={handleQuantityChange} />
                {quantityError && <p className="error">{quantityError}</p>}
            </label>
            <br />
            <label>
                Image URL:
                <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
                {imageUrlError && <p className="error">{imageUrlError}</p>}
            </label>
            <br />
            <button className='btn btn-primary' type="submit">Edit</button>
            <button className='btn btn-danger' type="button" onClick={handleDelete}>Delete</button>
        </form>
        </div>
    );
};

export default EditProduct;