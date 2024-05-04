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
    const [partTypes, setPartTypes] = useState([]);
    const [selectedPartType, setSelectedPartType] = useState(unit.component_type_id);
    const [name, setName] = useState(unit.name);
    const [size, setSize] = useState(unit.size);
    const [capacity, setCapacity] = useState(unit.capacity);
    const [currentStock, setCurrentStock] = useState(unit.component_storage_current_stock || unit.byproduct_storage_current_stock);
    const [storageType, setStorageType] = useState(unit.component_type_id ? 'component' : 'byproduct');
    const [partTypeError, setPartTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [sizeError, setSizeError] = useState(null);
    const [capacityError, setCapacityError] = useState(null);
    const [currentStockError, setCurrentStockError] = useState(null);
    const [error, setError] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const storageTypes = ['Part', 'Product'];
    const [selectedStorageType, setSelectedStorageType] = useState('');
    const [selectedType, setSelectedType] = useState('');
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

        if (!currentStock) {
            setCurrentStockError('Please enter the current stock');
        }

        if (!partTypeError && !nameError && !sizeError && !capacityError && !currentStockError) {
            // Send a PUT request to the server to update the storage unit
            axios.put(`http://localhost:3001/editWarehouse/${unit.component_storage_id || unit.byproduct_storage_id}`, {
                name: name,
                size: size,
                capacity: capacity,
                current_stock: currentStock,
                component_type_id: storageType === 'component' ? selectedPartType : null,
                bike_category_id: storageType === 'byproduct' ? selectedPartType : null,
            })
            .then(response => {
                console.log(response);
                navigate('/main/warehouses');
            })
            .catch(error => {
                console.error('Error updating warehouse:', error);
            });
        }
    };

    const handleDelete = () => {
        // Send a DELETE request to the server
        axios.delete(`http://localhost:3001/deleteWarehouse/${unit.component_storage_id || unit.byproduct_storage_id}`)
            .then(response => {
                console.log(response);
                navigate('/main/warehouses');
            })
            .catch(error => {
                console.error('Error deleting warehouse:', error);
            });
    };

    return (
        <div className='edit-warehouse-container'>
        <div className='edit-warehouse-header'>
            <h1>Create Warehouse</h1>
        </div>
        <form className='edit-warehouse-form' onSubmit={handleEdit}>
            <div className='input-group'>
                <label>
                    Storage Type:
                    <select value={selectedStorageType} onChange={(e) => {setSelectedStorageType(e.target.value); setStorageTypeError(null);}}>
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
            <button type="submit">Create</button>
        </form>
    </div>
    );
}

export default EditStorageUnit;