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
            const productPromises = response.data.map((product) => 
              axios.get(`http://localhost:3001/blueprintCheck/${product.model_id}`)
                .then((res) => ({ ...product, hasBlueprint: res.data.hasBlueprint }))
            );
      
            Promise.all(productPromises)
              .then((productsWithBlueprintInfo) => {
                setProducts(productsWithBlueprintInfo);
              });
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
          });
      }, []);


    return (
        <div className="product-container">
            <header className="product-header">
                <h2>Product Catalog</h2>
            </header>
            <div className="product-content">
            <button className="add-product-button" onClick={() => navigate('/main/createProduct')}>
                Add Product
            </button>
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.model_id} className="product-card-container">
                            <div className="product-card">
                                <div className="product-card-content">
                                    <h2>{product.name}</h2>
                                    <img src={product.image_url} alt={product.name} className="product-image" />
                                    <p>{product.description}</p>
                                    <h3>${product.price}</h3>
                                    <h4>Quantity: {product.quantity}</h4>
                                    <button onClick={() => navigate(`/main/editProduct/${product.model_id}`, { state: { product } })}>Edit</button>
                                    {product.hasBlueprint ? (
                                        <button onClick={() => navigate(`/main/viewParts/${product.model_id}`)}>View Parts</button>
                                    ) : (
                                      <button onClick={() => navigate(`/main/addParts/${product.model_id}`)}>Add Parts</button>
                                        )}
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