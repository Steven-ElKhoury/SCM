import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/createPart.css';
import { useNavigate } from 'react-router-dom';

function CreatePart() {
    const navigate = useNavigate();
    const [selectedPartType, setSelectedPartType] = useState('');
    const [name, setName] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [description, setDescription] = useState('');
    const [partTypeError, setPartTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [modelNumberError, setModelNumberError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlError, setImageUrlError] = useState(null);
    const [partTypes, setPartTypes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/partTypes')
          .then((response) => {
            setPartTypes(response.data);
          })
          .catch((error) => {
            console.error('Error fetching part types:', error);
          });
      }, []);

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        if (e.target.value) {
            setImageUrlError(''); // clear error if input is not empty
        } else {
            setImageUrlError('Please enter the image URL'); // set error if input is empty
        }
    };

    const handlePartTypeChange = (e) => {
        setSelectedPartType(e.target.value);
        if (e.target.value) {
            setPartTypeError(''); // clear error if input is not empty
        } else {
            setPartTypeError('Part type is required'); // set error if input is empty
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (e.target.value) {
            setNameError(''); // clear error if input is not empty
        } else {
            setNameError('Please enter the name'); // set error if input is empty
        }
    };

    const handleModelNumberChange = (e) => {
        setModelNumber(e.target.value);
        if (e.target.value) {
            setModelNumberError(''); // clear error if input is not empty
        } else {
            setModelNumberError('Please enter the model number'); // set error if input is empty
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        if (e.target.value) {
            setDescriptionError(''); // clear error if input is not empty
        } else {
            setDescriptionError('Please enter the description'); // set error if input is empty
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if fields are empty and set error state
        if (!imageUrl) {
            setImageUrlError('Please enter the image URL');
        }
        
        if (!selectedPartType) {
            setPartTypeError('Please select a part type');
        }
    
        if (!name) {
            setNameError('Please enter the name');
        }
    
        if (!modelNumber) {
            setModelNumberError('Please enter the model number');
        }
    
        if (!description) {
            setDescriptionError('Please enter the description');
        }
    
        // Only submit the form if no fields are empty
        if (imageUrl && selectedPartType && name && modelNumber && description) {
            axios.post('http://localhost:3001/createPart', {
                part_category_id: selectedPartType,
                name: name,
                model_number: modelNumber,
                description: description,
                image_url: imageUrl,
            })
            .then(response => {
                console.log(response);
                navigate('/main/parts');
            })
            .catch(error => {
                console.error('Error creating part:', error);
            });
        }
    };

    return (
        <div className='create-part-container'>
            <div className='create-part-header'>
            <h1 style= {{textAlign:'center'}}>Create Part</h1>
            </div>
            <div style={{ textAlign: "left" }}>
                <button style={{
                    backgroundColor: "#007BFF", /* Blue */
                    border: "none",
                    color: "white",
                    padding: "10px 20px", /* Smaller */
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "14px", /* Smaller */
                    margin: "10px 2px",
                    cursor: "pointer",
                    borderRadius: "4px"
                }} onClick={() => navigate('/main/createPartType')}>Create Part Type</button>
            </div>

            <div className='create-part-form-container'>
                <form className='create-part-form' onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label>
                            Part Type:
                            <select value={selectedPartType} onChange={handlePartTypeChange}>
                                <option value="">Select a part type</option>
                                {partTypes.map(partType => (
                                    <option key={partType.part_category_id} value={partType.part_category_id}>
                                    {partType.category_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                            {partTypeError && <p className="error">{partTypeError}</p>}
                    <div className='input-group'>
                        <label>
                            Name:
                            <input type="text" value={name} onChange={handleNameChange} />
                        </label>
                    </div>
                            {nameError && <p className="error">{nameError}</p>}
                    <div className='input-group'>
                        <label>
                            Model Number:
                            <input type="text" value={modelNumber} onChange={handleModelNumberChange} />
                        </label>
                    </div>
                            {modelNumberError && <p className="error">{modelNumberError}</p>}
                    <div className='input-group'>
                        <label>
                            Description:
                            <textarea value={description} onChange={handleDescriptionChange} />
                        </label>
                    </div>
                            {descriptionError && <p className="error">{descriptionError}</p>}
                    <div className='input-group'>
                        <label>
                            Image URL:
                            <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
                        </label>
                    </div>
                        {imageUrlError && <p className="error">{imageUrlError}</p>}
                        <button className='btn btn-primary' type="submit">Create</button>
                    
                </form>
            </div>
        </div>
    );
};

export default CreatePart;