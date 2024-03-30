import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function EditPart() {
    const navigate = useNavigate();
    const location = useLocation();
    const part = location.state.part;
    const id = part.id;
    const [partType, setPartType] = useState(part.type);
    const [name, setName] = useState(part.name);
    const [modelNumber, setModelNumber] = useState(part.modelNumber);
    const [description, setDescription] = useState(part.description);
    const [partTypeError, setPartTypeError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [modelNumberError, setModelNumberError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [imageUrl, setImageUrl] = useState(part.image);
    const [imageUrlError, setImageUrlError] = useState(null);
    const [error, setError] = useState(null);

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

    function handleEdit(e) {
        e.preventDefault();
    
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

        if (name === part.name && partType === part.type && modelNumber === part.modelNumber && imageUrl === part.image && description === part.description) {
            setError('No changes were made');
            return;
        }

        if (!partTypeError && !nameError && !modelNumberError && !descriptionError && !imageUrlError) {
            axios.put(`http://localhost:3001/editpart/${part.id}`, {
                name: name,
                type: partType,
                model_number: modelNumber,
                description: description,
                image_url: imageUrl,
            })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error updating part:', error);
            });
        }

}
    
    function handleDelete() {
        // Send a delete request to the server
        axios.delete(`http://localhost:3001/deletepart/${part.id}`)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error('Error deleting part:', error);
        });
        navigate('/main/parts');
    }
    return (
        <div>
        <h1>Edit Part</h1>
            <form onSubmit={handleEdit}>
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
                        <button className='btn btn-primary' type="submit">Edit</button>
                        <button className='btn btn-danger' type="button" onClick={handleDelete}>Delete</button>
                    </form>
                </div>
    );
};

export default EditPart;