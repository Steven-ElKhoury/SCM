import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/createProduct.css';

function CreateProduct() {
    const navigate = useNavigate();
    const [selectedProductType, setSelectedProductType] = useState('');
    const [name, setName] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [productTypeError, setProductTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [modelNumberError, setModelNumberError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [priceError, setPriceError] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlError, setImageUrlError] = useState(null);
    const [productTypes, setProductTypes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/bikeTypes')
            .then((response) => {
                setProductTypes(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching product types:', error);
            });
    }, []);

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        if (e.target.value) {
            setImageUrlError(''); // clear error if input is not empty
        } else {
            setImageUrlError('Please enter the image URL'); // set error if input is empty
        }
    };

    const handleProductTypeChange = (e) => {
        setSelectedProductType(e.target.value);
        if (e.target.value) {
            setProductTypeError(''); // clear error if input is not empty
        } else {
            setProductTypeError('Please select a product type'); // set error if input is empty
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (e.target.value) {
            setNameError(''); // clear error if input is not empty
        } else {
            setNameError('Please enter the name'); // set error if input is empty
        }
    };

    const handleModelNumberChange = (e) => {
        setModelNumber(e.target.value);
        if (e.target.value) {
            setModelNumberError(''); // clear error if input is not empty
        } else {
            setModelNumberError('Please enter the model number'); // set error if input is empty
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        if (e.target.value) {
            setDescriptionError(''); // clear error if input is not empty
        } else {
            setDescriptionError('Please enter the description'); // set error if input is empty
        }
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
        if (e.target.value) {
            setPriceError(''); // clear error if input is not empty
        } else {
            setPriceError('Please enter the price'); // set error if input is empty
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if fields are empty and set error state
        if (!imageUrl) {
            setImageUrlError('Please enter the image URL');
        }

        if (!selectedProductType) {
            setProductTypeError('Please select a product type');
        }

        if (!name) {
            setNameError('Please enter the name');
        }

        if (!modelNumber) {
            setModelNumberError('Please enter the model number');
        }

        if (!description) {
            setDescriptionError('Please enter the description');
        }

        if (!price) {
            setPriceError('Please enter the price');
        }

        // Only submit the form if no fields are empty
        if (imageUrl && selectedProductType && name && modelNumber && description && price) {
            axios.post('http://localhost:3001/createProduct', {
                bike_category_id: selectedProductType,
                name: name,
                model_number: modelNumber,
                description: description,
                price: price,
                image_url: imageUrl,
            })
            .then(response => {
                console.log(response);
                navigate('/main/products');
            })
            .catch(error => {
                console.error('Error creating product:', error);
            });
        }
    };

    return (
        <div className='create-product-container'>
            <div className='create-product-header'>
            <h1>Create Product</h1>
            </div>
            <div style={{ textAlign: "left" }}>
                <button style={{
                    backgroundColor: "#007BFF", /* Blue */
                    border: "none",
                    color: "white",
                    padding: "10px 20px", /* Smaller */
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "14px", /* Smaller */
                    margin: "10px 2px",
                    cursor: "pointer",
                    borderRadius: "4px"
                }} onClick={() => navigate('/main/createBikeType')}>Create Product Type</button>
            </div>

            <form className='create-product-form' onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label>
                        Product Type:
                        <select value={selectedProductType} onChange={handleProductTypeChange}>
                            <option value="">Select a product type</option>
                            {productTypes.map(productType => (
                                <option key={productType.bike_category_id} value={productType.bike_category_id}>
                                    {productType.category_name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                    {productTypeError && <p className="error">{productTypeError}</p>}

                <div className='input-group'>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={handleNameChange} />
                    </label>
                </div>
                    {nameError && <p className="error">{nameError}</p>}

                <div className='input-group'>
                    <label>
                        Model Number:
                        <input type="text" value={modelNumber} onChange={handleModelNumberChange} />
                    </label>
                </div>
                    {modelNumberError && <p className="error">{modelNumberError}</p>}

                <div className='input-group'>
                    <label>
                        Description:
                        <textarea value={description} onChange={handleDescriptionChange} />
                    </label>
                </div>
                    {descriptionError && <p className="error">{descriptionError}</p>}

                <div className='input-group'>
                    <label>
                        Price:
                        <input type="text" value={price} onChange={handlePriceChange} />
                    </label>
                </div>
                    {priceError && <p className="error">{priceError}</p>}

                <div className='input-group'>
                    <label>
                        Image URL:
                        <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
                    </label>
                </div>
                    {imageUrlError && <p className="error">{imageUrlError}</p>}

                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateProduct;