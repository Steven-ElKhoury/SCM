import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Product.css';

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [showDescription, setShowDescription] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDescription = (model_id) => {
        // Toggle the value for the specific model_id
        setShowDescription(prevState => ({ ...prevState, [model_id]: !prevState[model_id] }));
      };
    
    const navigateToCreateProduct = () => {
        navigate('/main/createProduct'); // Navigate to the add product page
    };

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
              console.log(response.data);
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
          });
      }, []);
      return (
        <div className="products-page">
            <header className="products-header">
                <h1>Product Catalog</h1>
            </header>
            <div className="product-search-container">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products by name, type, or model number" />
                <button type="button" className="create-product-button" onClick={navigateToCreateProduct}>Create Product</button>
            </div>
            <div className="product-grid">
            {products
                .filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    product.category_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    product.model_number.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                    <div key={product.model_id} className="product-card">
                        <div className="product-card-content">
                            <div className="product-header">
                            <h2>{product.name}</h2>
                            </div>
                            <div className="product-image-container">
                            <img src={product.image_url} alt={product.name} className="product-image" />
                            </div>
                            <p>Type: {product.category_name}</p>
                            <p>Model: {product.model_number}</p>
                            {showDescription[product.model_id] ? (
                                <>
                                    <p>{product.description}</p>
                                    <a href="#" onClick={()=> toggleDescription(product.model_id)} className="toggle-description">Read Less</a>
                                </>
                            ) : (
                                <a href="#" onClick={() => toggleDescription(product.model_id)}  className="toggle-description">Read More</a>
                            )}
                            <h3>Price: ${product.price}</h3>
                                </div>
                            <div className="buttons-container">
                                <button onClick={() => navigate(`/main/editProduct/${product.model_id}`, { state: { product } })}>Edit</button>
                                {product.hasBlueprint ? (
                                    <button onClick={() => navigate(`/main/viewParts/${product.model_id}`)}>View Parts</button>
                                ) : (
                                    <button onClick={() => navigate(`/main/addParts/${product.model_id}`)}>Add Parts</button>
                                )}
                            </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;