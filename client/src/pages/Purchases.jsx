import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer'; 
import OrderReceipt from '../Components/OrderReceipt';
import '../css/Purchases.css';

function Purchases() {
    const navigate = useNavigate();
    const [byProducts, setbyProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/getbyProducts')
            .then((response) => {
                setbyProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching byproducts:', error);
            });
    }, []);
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };
    return (
        <>
        <div className="byProduct-container">
            <header className="byProduct-header">
                <h2>byProducts</h2>
            </header>
            <div className="byProduct-content">
                <div className="byProduct-grid">
                    {byProducts.map((byProducts) => (
                        <div key={byProducts.model_id} className="byProduct-card-container">
                            <div className="byProduct-card">
                                <div className="byProduct-card-content">
                                    <h2>customer order ID: {byProducts.cust_order_id}</h2>
                                    <h3>byProduct ID: {byProducts.byproduct_id}</h3>
                                    <img src={byProducts.image_url} alt={byProducts.name} className="byProduct-image" />
                                    <p>Type: {byProducts.type}</p>
                                    <p>Model: {byProducts.model_id}</p>
                                    <h3>quantity: {byProducts.quantity}</h3>
                                    <h3>total price: ${byProducts.total_price}</h3>
                                    <p>Date ordered: {formatDate(byProducts.date)}</p>
                                    <BlobProvider document={<OrderReceipt order={byProducts} />}>
                                            {({ blob, url, loading, error }) => {
                                                if (loading) {
                                                    return <div>Loading...</div>;
                                                } else if (error) {
                                                    return <div>An error occurred while generating the PDF.</div>;
                                                } else {
                                                    return <a href={url} target="_blank" rel="noopener noreferrer">View receipt</a>;
                                                }
                                            }}
                                        </BlobProvider>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
        </>
    );
}

export default Purchases;