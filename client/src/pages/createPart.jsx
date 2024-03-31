import React, { useState } from 'react';
import axios from 'axios';

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
            }).catch((error) => {
                // Handle the error here
                console.log(error);
            });
        }
    };

    return (
        <div>
            <h1>Create Part</h1>
    <form onSubmit={handleSubmit}>
    <label>
        Part Type:
        <select value={partType} onChange={handlePartTypeChange}>
            <option value="">Select a part type</option>
            <optgroup label="Wheels, tires & tubes">
                <option value="Road wheels">Road wheels</option>
                <option value="Mountain wheels">Mountain wheels</option>
                <option value="All wheels">All wheels</option>
                <option value="Road tires">Road tires</option>
                <option value="Mountain tires">Mountain tires</option>
                <option value="Gravel tires">Gravel tires</option>
                <option value="City & hybrid tires">City & hybrid tires</option>
                <option value="All tires">All tires</option>
                <option value="Tubes">Tubes</option>
                <option value="Tubeless accessories">Tubeless accessories</option>
            </optgroup>
            <optgroup label="Lights">
                <option value="Front bike lights">Front bike lights</option>
                <option value="Rear bike lights">Rear bike lights</option>
                <option value="Daytime Running Lights">Daytime Running Lights</option>
                <option value="Bike light accessories">Bike light accessories</option>
                <option value="All bike lights">All bike lights</option>
            </optgroup>
            {/* Add more <optgroup> and <option> elements for the other categories and subcategories */}
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