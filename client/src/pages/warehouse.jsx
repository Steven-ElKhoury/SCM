import React, {useState, useEffect} from 'react';
import '../css/warehouse.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import axios from 'axios'; 

const Warehouses = () => {
    // Define an array of warehouses with their details
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3001/getWarehouses')
            .then(response => {
                setWarehouses(response.data);
            })
            .catch(error => {
                console.error('Error fetching warehouses:', error);
            });
    }, []);


    return (
        <div className="container">
            <h1 className="header">Warehouses</h1>
            <button id = 'create-warehouse-btn' type="button" className="btn btn-primary" onClick={() => navigate('/main/createUnit')}>Create Warehouse</button>
            {warehouses.map((warehouse, index) => (
                <div className='item' key={index}>
                    <h2 className="item-name">Storage Unit: {warehouse.name}</h2>
                    <p>Part: {warehouse.type}</p>
                    <p>Size: {warehouse.size} sqm</p>
                    <p>Capacity: {warehouse.capacity}</p>
                    <button 
                        type="button" 
                        onClick={() => navigate(`/main/editUnit/${warehouse.component_type_id}`, { state: { warehouse } })}
                        style={{
                            backgroundColor: 'skyblue',
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px', // Reduced padding
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontSize: '14px', // Reduced font size
                            margin: '4px 2px',
                            cursor: 'pointer',
                            width: '100px',
                        }}
                    >
        Edit
    </button>
                </div>
            ))}
        </div>
    );
};

export default Warehouses;