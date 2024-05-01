import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useLocation} from 'react-router-dom';

function EditStorageUnit() {
    const navigate = useNavigate();
    const location = useLocation();
    const unit = location.state.warehouse;
    const [partTypes, setPartTypes] = useState([]);
    const [selectedPartType, setSelectedPartType] = useState(unit.component_type_id);
    const [name, setName] = useState(unit.name);
    const [size, setSize] = useState(unit.size);
    const [capacity, setCapacity] = useState(unit.capacity);
    const [partTypeError, setPartTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [sizeError, setSizeError] = useState(null);
    const [capacityError, setCapacityError] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/partTypes')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setPartTypes(response.data);
                } else {
                    console.error('Error: expected an array but received', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching part types:', error);
            });
    }, []);

    function handleEdit(e) {
        e.preventDefault();
    
        if (!selectedPartType) {
            setPartTypeError('Please select a part type');
        }
    
        if (!name) {
            setNameError('Please enter the warehouse name');
        }
    
        if (!size) {
            setSizeError('Please enter the size');
        }
    
        if (!capacity) {
            setCapacityError('Please enter the capacity');
        }

        if (name === unit.name &&  size === unit.size && selectedPartType === unit.component_type_id && capacity === unit.capacity) {
            setError('No changes were made');
            return;
        }

        e.preventDefault();

        if (selectedPartType && name && size && capacity) {
            axios.put(`http://localhost:3001/edit_component_storage/${unit.unit_id}`, {
                name: name,
                size: size,
                capacity: capacity,
                component_type_id: selectedPartType,
            })
            .then(response => {
                console.log(response.data);
                navigate('/main/warehouses');
            })
            .catch(error => {
                console.error(error);
                // Handle the error
            });
        }
    }
    
    function handleDelete() {
        // Send a delete request to the server
        axios.delete(`http://localhost:3001/delete_component_storage/${unit.unit_id}`)
        .then(response => {
            console.log(response);
            navigate('/main/warehouses');
        })
        .catch(error => {
            console.error('Error deleting warehouse:', error);
        });
    }
    return (
        <div id='edit-warehouse-container'>
            <h1 id='header'>Edit Storage Unit</h1>
            <form id = 'form' onSubmit={handleEdit}>
                <label>
                    Part Type:
                    <select id='part-type-select' value={selectedPartType} onChange={e => setSelectedPartType(e.target.value)}>
                        {partTypes.map(partType => (
                            <option key={partType.component_type_id} value={partType.component_type_id}>{partType.type}</option>
                        ))}
                    </select>
                    {partTypeError && <p className="error">{partTypeError}</p>}
                </label>
                <br />
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    {nameError && <p className="error">{nameError}</p>}
                </label>
                <br />
                <label>
                    Size (in sqm):
                    <input type="number" value={size} onChange={e => setSize(e.target.value)} />
                    {sizeError && <p className="error">{sizeError}</p>}
                </label>
                <br />
                <label>
                    Capacity:
                    <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
                    {capacityError && <p className="error">{capacityError}</p>}
                </label>
                <br />
                <button id='submit-button' className='btn btn-primary' type="submit">Edit</button>
                <button id = 'submit-button' className='btn btn-danger' type="button" onClick={handleDelete}>Delete</button>
            </form>
        </div>
    );
}

export default EditStorageUnit;