import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function EditProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state.product;
    const id = product.model_id;
    const [selectedProductType, setSelectedProductType] = useState(product.bike_category_id);
    const [name, setName] = useState(product.name);
    const [modelNumber, setModelNumber] = useState(product.model_number);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [productTypeError, setProductTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [modelNumberError, setModelNumberError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [priceError, setPriceError] = useState(null);
    const [imageUrl, setImageUrl] = useState(product.image_url);
    const [imageUrlError, setImageUrlError] = useState(null);
    const [error, setError] = useState(null);
    const [productTypes, setProductTypes] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        if (e.target.value) {
            setImageUrlError(''); // clear error if input is not empty
        } else {
            setImageUrlError('Please enter the image URL'); // set error if input is empty
        }
    };

    useEffect(() => {
        axios.get('http://localhost:3001/bikeTypes')
          .then((response) => {
            setProductTypes(response.data);
          })
          .catch((error) => {
            console.error('Error fetching product types:', error);
          });
      }, []);
    
    const handleNameChange = (e) => {
        setName(e.target.value);
        if (e.target.value) {
            setNameError(''); // clear error if input is not empty
        } else {
            setNameError('Please enter the name'); // set error if input is empty
        }
    };
    
    const handleProductTypeChange = (e) => {
        const newProductType = e.target.value;
        setSelectedProductType(newProductType);
    
        // Validate the new product type
        if (newProductType === '') {
            setProductTypeError('Product type is required');
        } else {
            setProductTypeError('');  // Clear the error message
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

    function handleEdit(e) {
        e.preventDefault();
    
        if (!imageUrl) {
            setImageUrlError('Please enter the image URL');
        }
        
        if (!selectedProductType) {
            setProductTypeError('Please enter the product type');
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

        if (name === product.name && selectedProductType === product.type && modelNumber === product.modelNumber && imageUrl === product.image && description === product.description && price === product.price) {
            setError('No changes were made');
            console.log('No changes were made');
            return;
        }

        if (!productTypeError && !nameError && !modelNumberError && !descriptionError && !priceError && !imageUrlError) {
            axios.put(`http://localhost:3001/editProduct/${id}`, {
                name: name,
                bike_category_id: selectedProductType,
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
                console.error('Error updating product:', error);
            });
        }

    }
    
    function handleDelete() {
        // Send a delete request to the server
        axios.delete(`http://localhost:3001/deleteProduct/${id}`)
        .then(response => {
            console.log(response);
            navigate('/main/products');
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
    }

    return (
        <div className="create-product-container">
             <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            >
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Are you sure you want to delete this product?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} style={{ backgroundColor: 'gray', color: 'white' }}>
                Cancel
            </Button>
            <Button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }} autoFocus>
                Delete
            </Button>
            </DialogActions>
            </Dialog>
            <div className="create-product-header">
            <h1 style={{ 'textAlign': 'center'}} >Edit Product</h1>
            </div>
            <div className="create-product-form-container">   
                <form className="create-product-form" onSubmit={handleEdit}>
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
                            <input type="number" value={price} onChange={handlePriceChange} />
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
                    <br />
                    <button className='btn btn-primary' type="submit">Edit</button>
                    <button className='btn btn-danger' type="button" onClick={()=> setOpenDeleteDialog(true)}>Delete</button>
                </form>
            </div>
        </div> 
    );
};

export default EditProduct;