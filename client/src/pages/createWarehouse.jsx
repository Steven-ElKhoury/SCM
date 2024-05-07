import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../css/createWarehouse.css';

function CreateStorageUnit() {
    const [storageTypes, setStorageTypes] = useState(['Part', 'Product']);
    const [selectedStorageType, setSelectedStorageType] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [capacity, setCapacity] = useState('');
    const [storageTypeError, setStorageTypeError] = useState(null); // Renamed to storageTypeError
    const [typeError, setTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [sizeError, setSizeError] = useState(null);
    const [capacityError, setCapacityError] = useState(null);
    const [types, setTypes] = useState([]);

    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if fields are empty and set error state
        if (!selectedStorageType) {
            setStorageTypeError('Please select a storage type'); // Use setStorageTypeError here
        } else {
            setStorageTypeError(null); // Clear the error if the field is not empty
        }
    
        if (!selectedType) {
            setTypeError('Please select a type');
        } else {
            setTypeError(null); // Clear the error if the field is not empty
        }
    
        if (!name) {
            setNameError('Please enter the name');
        } else {
            setNameError(null); // Clear the error if the field is not empty
        }
    
        if (!size) {
            setSizeError('Please enter the size');
        } else {
            setSizeError(null); // Clear the error if the field is not empty
        }
    
        if (!capacity) {
            setCapacityError('Please enter the capacity');
        } else {
            setCapacityError(null); // Clear the error if the field is not empty
        }
    
        // Only submit the form if no fields are empty
        if (selectedStorageType && selectedType && name && size && capacity) {
            const url = selectedStorageType === 'Part' ? 'http://localhost:3001/createWarehouse' : 'http://localhost:3001/createByproductStorage';
            const typeIdKey = selectedStorageType === 'Part' ? 'part_category_id' : 'bike_category_id';
           
            axios.post(url, {
                [typeIdKey]: selectedType,
                name: name,
                size: size,
                capacity: capacity,
            })
            .then(response => {
                console.log(response);
                navigate('/main/warehouses');
            })
            .catch(error => {
                console.error('Error creating storage:', error);
            });
        }
    };

    return (
                <div className='create-warehouse-container'>
                    <div className='create-warehouse-header'>
                    <h1>Create Warehouse</h1>
                    </div>
                    <form className='create-warehouse-form' onSubmit={handleSubmit}>
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
};

export default CreateStorageUnit;