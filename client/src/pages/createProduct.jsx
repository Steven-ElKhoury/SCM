import React, { useState } from 'react';
import axios from 'axios';
import '../css/createProduct.css';

function CreateProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [bikeType, setBikeType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [nameError, setNameError] = useState(null);
    const [priceError, setPriceError] = useState(null);
    const [bikeTypeError, setBikeTypeError] = useState(null);
    const [quantityError, setQuantityError] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlError, setImageUrlError] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset validation messages
        setNameError('');
        setPriceError('');
        setBikeTypeError('');
        setQuantityError('');
        setImageUrlError('');

        // Validate name, price, bikeType, and quantity
        if (!name) {
            setNameError('Please enter the name');
        }

        if (!price) {
            setPriceError('Please enter the price');
        }

        if (!bikeType) {
            setBikeTypeError('Please enter the bike type');
        }

        if (!quantity) {
            setQuantityError('Please enter the quantity');
        }
        if (!imageUrl) {
            setImageUrlError('Please enter the image URL');
        }

        if (!nameError && !priceError && !bikeTypeError && !quantityError && !imageUrlError) {
            axios.post('http://localhost:3001/createProduct', {
                name: name,
                price: price,
                type: bikeType,
                quantity: quantity,
                image_url: imageUrl
            }).then((response) => {
                // Handle the response here
                console.log(response);
            }).catch((error) => {
                // Handle the error here
                console.log(error);
            });
        }
    };

    return (
        <div className="create-product-container">
            <h1 className="create-product-header">Create Product</h1>
            <form className="create-product-form" onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={handleNameChange} />
                    {nameError && <p className="error">{nameError}</p>}
                </label>
                <label>
                    Price:
                    <input type="number" value={price} onChange={handlePriceChange} />
                    {priceError && <p className="error">{priceError}</p>}
                </label>
                <label>
                    Bike Type:
                    <input type="text" value={bikeType} onChange={handleBikeTypeChange} />
                    {bikeTypeError && <p className="error">{bikeTypeError}</p>}
                </label>
                <label>
                    Quantity:
                    <input type="number" value={quantity} onChange={handleQuantityChange} />
                    {quantityError && <p className="error">{quantityError}</p>}
                </label>
                <label>
                    Image URL:
                    <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
                    {imageUrlError && <p className="error">{imageUrlError}</p>}
                </label>
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;