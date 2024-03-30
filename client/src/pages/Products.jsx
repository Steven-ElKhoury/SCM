import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Product.css';

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/getProducts')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div className="product-container">
            <button onClick={() => navigate('/main/createProduct')} style={{width:'200px'}}>
                add product 
            </button>
            <header className="product-header">
                <h2>Product Catalog</h2>
            </header>
            <div className="product-content">
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.model_id} className="product-card-container">
                            <div className="product-card">
                                <div className="product-card-content">
                                    <h2>{product.name}</h2>
                                    <img src={product.image_url} alt={product.name} className="product-image" />
                                    <p>{product.description}</p>
                                    <h3>${product.price}</h3>
                                    <button onClick={() => navigate(`/main/editProduct/${product.model_id}`, { state: { product } })}>Edit</button>
                                    <button onClick={() => navigate(`/main/viewParts/${product.model_id}`)}>View Parts</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products;