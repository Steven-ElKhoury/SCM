import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import '../css/editWarehouse.css';

function EditStorageUnit() {
    const navigate = useNavigate();
    const location = useLocation();
    const unit = location.state.warehouse;
    console.log(unit);
    const [selectedStorageType, setSelectedStorageType] = useState(unit.type);
    const [selectedType, setSelectedType] = useState(unit.bike_category_id || unit.part_category_id);
    const [partTypes, setPartTypes] = useState([]);
    const [selectedPartType, setSelectedPartType] = useState('');
    const [name, setName] = useState(unit.component_storage_name || unit.byproduct_storage_name);
    const [size, setSize] = useState(unit.component_storage_size || unit.byproduct_storage_size);
    const [capacity, setCapacity] = useState(unit.component_storage_capacity || unit.byproduct_storage_capacity);
    const [currentStock, setCurrentStock] = useState(
        selectedStorageType === 'Part'
            ? (unit.component_storage_current_stock !== null && unit.component_storage_current_stock !== undefined 
                ? unit.component_storage_current_stock 
                : '')
            : (unit.byproduct_storage_current_stock !== null && unit.byproduct_storage_current_stock !== undefined 
                ? unit.byproduct_storage_current_stock 
                : '')
    );
    const [storageType, setStorageType] = useState('');
    const [partTypeError, setPartTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [sizeError, setSizeError] = useState(null);
    const [capacityError, setCapacityError] = useState(null);
    const [currentStockError, setCurrentStockError] = useState(null);
    const [error, setError] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const storageTypes = ['Part', 'Product'];
  
    const [storageTypeError, setStorageTypeError] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [types, setTypes] = useState([]);


    useEffect(() => {
        if (selectedStorageType === 'Part') {
            axios.get('http://localhost:3001/partTypes')
                .then(response => {
                    setTypes(response.data);
                })
                .catch(error => {
                    console.error('Error fetching part types:', error);
                });
        } else if (selectedStorageType === 'Product') {
            axios.get('http://localhost:3001/bikeTypes')
                .then(response => {
                    setTypes(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product types:', error);
                });
        }
    }, [selectedStorageType]);

    const handleEdit = (e) => {
        e.preventDefault();

        // Validate the form
        if (!name) {
            setNameError('Please enter the name');
        }

        if (!size) {
            setSizeError('Please enter the size');
        }

        if (!capacity) {
            setCapacityError('Please enter the capacity');
        }

        if (currentStock <0 && !currentStock) {
            setCurrentStockError('Please enter the current stock');
        }

        const endpoint = selectedStorageType === 'Part' ? `http://localhost:3001/editWarehouse/${unit.component_storage_id}` : `http://localhost:3001/editByproductStorage/${unit.byproduct_storage_id}`;

        console.log('Endpoint:', endpoint); // Add this line to log the endpoint

        const typeIdKey = selectedStorageType === 'Part' ? 'part_category_id' : 'bike_category_id';

        axios.put(endpoint, {
            [typeIdKey]: selectedType,
            name: name,
            size: size,
            capacity: capacity,
            current_stock: currentStock
        })
        .then(response => {
            console.log(response);
            navigate('/main/warehouses');
        })
        .catch(error => {
            console.error('Error updating warehouse:', error);
        });
    }


    function handleDelete() {
        // Determine the correct endpoint based on the storage type
        const endpoint = selectedStorageType === 'Part' ? `http://localhost:3001/deleteWarehouse/${unit.component_storage_id}` : `http://localhost:3001/deleteByproductStorage/${unit.byproduct_storage_id}`;
    
        axios.delete(endpoint)
        .then(response => {
            console.log(response);
            navigate('/main/warehouses');
        })
        .catch(error => {
            console.error('Error deleting warehouse:', error);
        });
    }
    
    return (
        <div className='edit-warehouse-container'>
            <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Storage Unit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this storage unit?
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
        <div className='edit-warehouse-header'>
            <h1>Edit Warehouse</h1>
        </div>
        <form className='edit-warehouse-form' onSubmit={handleEdit}>
            <div className='input-group'>
                <label>
                    Storage Type:
                    <select value={selectedStorageType} disabled onChange={(e) => {setSelectedStorageType(e.target.value); setStorageTypeError(null);}}>
                        <option value="">Select a storage type</option>
                        {storageTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {storageTypeError && <p className="error">{storageTypeError}</p>}
            <div className='input-group'>
                <label>
                    Type:
                    <select value={selectedType} onChange={(e) => {setSelectedType(e.target.value); setTypeError(null);}}>
                        <option value="">Select a type</option>
                        {selectedStorageType === 'Part' ? types.map((type) => (
                            <option key={type.part_category_id} value={type.part_category_id}>
                                {type.category_name}
                            </option>
                        )) : types.map((type) => (
                            <option key={type.bike_category_id} value={type.bike_category_id}>
                                {type.category_name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {typeError && <p className="error">{typeError}</p>}
            <div className='input-group'>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => {setName(e.target.value); setNameError(null);}} />
                </label>
            </div>
            {nameError && <p className="error">{nameError}</p>}
            <div className='input-group'>
                <label>
                    Size:
                    <input type="text" value={size} onChange={(e) => {setSize(e.target.value); setSizeError(null);}} />
                </label>
            </div>
            {sizeError && <p className="error">{sizeError}</p>}
            <div className='input-group'>
                <label>
                    Capacity:
                    <input type="text" value={capacity} onChange={(e) => {setCapacity(e.target.value); setCapacityError(null);}} />
                </label>
            </div>
            {capacityError && <p className="error">{capacityError}</p>}
            <div className='input-group'>
            <label>
                Current Stock:
                <input type="text" value={currentStock} onChange={(e) => {setCurrentStock(e.target.value); setCurrentStockError(null);}} />
            </label>
        </div>
        {currentStockError && <p className="error">{currentStockError}</p>}
        <button className='btn btn-primary' type="submit">Edit</button>
          <button className='btn btn-danger' type="button" onClick={() => setOpenDeleteDialog(true)}>Delete</button>
        </form>
    </div>
    );
}

export default EditStorageUnit;