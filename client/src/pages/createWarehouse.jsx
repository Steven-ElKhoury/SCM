import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateStorageUnit() {
    const [partTypes, setPartTypes] = useState([]);
    const [selectedPartType, setSelectedPartType] = useState('');
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [capacity, setCapacity] = useState('');
    const [partTypeError, setPartTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [sizeError, setSizeError] = useState(null);
    const [capacityError, setCapacityError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/partTypes')
            .then(response => {
                setPartTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching part types:', error);
            });
    }, []);

    const handleSubmit = (e) => {
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

        if (!partTypeError && !nameError && !sizeError && !capacityError) {
            axios.post('http://localhost:3001/createUnits', {
                component_type_id: selectedPartType,
                name: name,
                size: size,
                capacity: capacity
            })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error creating storage unit:', error);
            });
        }
    };

    return (
        <div>
            <h1>Create Storage Unit</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Part Type:
                    <select value={selectedPartType} onChange={e => setSelectedPartType(e.target.value)}>
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
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateStorageUnit;