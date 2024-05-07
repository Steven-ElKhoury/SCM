import React, {useState, useEffect} from 'react';
import '../css/warehouse.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import axios from 'axios'; 

const Warehouses = () => {
    // Define an array of warehouses with their details
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [partWarehouses, setPartWarehouses] = useState([]);
    const [productWarehouses, setProductWarehouses] = useState([]);

    useEffect(() => {
        // Fetch part warehouses
        axios.get('http://localhost:3001/getPartWarehouses')
            .then(response => {
                const partWarehouses = response.data.map(warehouse => ({...warehouse, warehouseType: 'Part'}));
                setPartWarehouses(partWarehouses);
                console.log(partWarehouses)
            })
            .catch(error => {
                console.error('Error fetching part warehouses:', error);
            });

        // Fetch product warehouses
        axios.get('http://localhost:3001/getProductWarehouses')
            .then(response => {
                const productWarehouses = response.data.map(warehouse => ({...warehouse, warehouseType: 'Product'}));
                setProductWarehouses(productWarehouses);
                console.log(productWarehouses)
            })
            .catch(error => {
                console.error('Error fetching product warehouses:', error);
            });
    }, []);


 // Combine the partWarehouses and productWarehouses arrays
 // Add a 'type' property to each warehouse
const partWarehousesWithType = partWarehouses.map(warehouse => ({ ...warehouse, type: 'Part' }));
const productWarehousesWithType = productWarehouses.map(warehouse => ({ ...warehouse, type: 'Product' }));

// Combine the partWarehouses and productWarehouses arrays
const allWarehouses = [...partWarehousesWithType, ...productWarehousesWithType];

const filteredWarehouses = allWarehouses.filter(warehouse =>
  (warehouse.component_storage_name || warehouse.byproduct_storage_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
  warehouse.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (warehouse.component_storage_size || warehouse.byproduct_storage_size).toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
  (warehouse.component_storage_capacity || warehouse.byproduct_storage_capacity).toString().toLowerCase().includes(searchTerm.toLowerCase())||
  warehouse.type.toString().toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <div className="warehouses-page">
    <h1 className="warehouse-header">Warehouses</h1>
    <div className="warehouse-search-container">
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search warehouses by name, type, or size" />
      <button id='create-warehouse-btn' type="button" className="btn btn-primary" onClick={() => navigate('/main/createUnit')}>Create Warehouse</button>
    </div>
    <div className="warehouse-item-container">
      {filteredWarehouses.map((warehouse, index) => (
        <div className='item' key={index}>
          <h2 className="item-name">Storage Unit: {warehouse.component_storage_name || warehouse.byproduct_storage_name}</h2>
          <p>{warehouse.type}: {warehouse.category_name}</p>
          <p>Size: {warehouse.component_storage_size || warehouse.byproduct_storage_size} sqm</p>
          <p>Capacity: {warehouse.component_storage_capacity || warehouse.byproduct_storage_capacity}</p>
          <p>Current Stock: {warehouse.byproduct_storage_current_stock !== undefined ? warehouse.byproduct_storage_current_stock : warehouse.component_storage_current_stock}</p>
          <button 
            type="button" 
            onClick={() => navigate(`/main/editUnit/${warehouse.component_storage_id || warehouse.byproduct_storage_id}`, { state: { warehouse } })}
            style={{
              backgroundColor: 'skyblue',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              textAlign: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  </div>
);
};

export default Warehouses;