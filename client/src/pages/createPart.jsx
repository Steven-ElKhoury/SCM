import React, { useState } from 'react';
import axios from 'axios';
import '../css/createPart.css';
import { useNavigate } from 'react-router-dom';


function CreatePart() {
    const [partType, setPartType] = useState('');
    const [name, setName] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [description, setDescription] = useState('');
    const [partTypeError, setPartTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [modelNumberError, setModelNumberError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlError, setImageUrlError] = useState(null);
    const navigate = useNavigate();


    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    const handlePartTypeChange = (e) => {
        setPartType(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleModelNumberChange = (e) => {
        setModelNumber(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset validation messages
        setPartTypeError('');
        setNameError('');
        setModelNumberError('');
        setDescriptionError('');
        setImageUrlError('');

        // Validate partType, name, modelNumber, and description
        if (!imageUrl) {
            setImageUrlError('Please enter the image URL');
        }
        
        if (!partType) {
            setPartTypeError('Please enter the part type');
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

        if (!partTypeError && !nameError && !modelNumberError && !descriptionError && !imageUrlError) {
            axios.post('http://localhost:3001/createPart', {
                type: partType,
                name: name,
                model_number: modelNumber,
                description: description,
                image_url: imageUrl
            }).then((response) => {
                // Handle the response here
                console.log(response);
                navigate('/main/parts');

            }).catch((error) => {
                // Handle the error here
                console.log(error);
            });
        }
    };

    return (
        <div className='create-part-container'>
            <h1>Create Part</h1>
    <form className='create-part-form' onSubmit={handleSubmit}>
    <label>
        Part Type:
        <select value={partType} onChange={handlePartTypeChange}>
                    <option value="">Select a part type</option>
                    <option value="Handlebars">Handlebars</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Shifters">Shifters</option>
                    <option value="Fork">Fork</option>
                    <option value="Drivetrain">Drivetrain</option>
                    <option value="Saddle">Saddle</option>
                    <option value="Pedals">Pedals</option>
                    <option value="Wheels">Wheels</option>
                    <option value="Tires">Tires</option>
                </select>
        {partTypeError && <p className="error">{partTypeError}</p>}
    </label>
                <br />
                <label>
                    Name:
                    <input type="text" value={name} onChange={handleNameChange} />
                    {nameError && <p className="error">{nameError}</p>}
                </label>
                <br />
                <label>
                    Model Number:
                    <input type="text" value={modelNumber} onChange={handleModelNumberChange} />
                    {modelNumberError && <p className="error">{modelNumberError}</p>}
                </label>
                <br />
                <label>
                    Description:
                    <textarea style={{width:'200px'}} value={description} onChange={handleDescriptionChange} />
                    {descriptionError && <p className="error">{descriptionError}</p>}
                </label>
                <br />
                <label>
                    Image URL:
                    <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
                    {imageUrlError && <p className="error">{imageUrlError}</p>}
                </label>
                <br />
                <button className='btn btn-primary' type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreatePart;