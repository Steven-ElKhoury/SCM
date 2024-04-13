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
        if (e.target.value) {
            setImageUrlError(''); // clear error if input is not empty
        } else {
            setImageUrlError('Please enter the image URL'); // set error if input is empty
        }
    };
    
    const handlePartTypeChange = (e) => {
        setPartType(e.target.value);
        if (e.target.value) {
            setPartTypeError(''); // clear error if input is not empty
        } else {
            setPartTypeError('Please enter the part type'); // set error if input is empty
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
            console.log('No changes were made');
            return;
        }

        if (!partTypeError && !nameError && !modelNumberError && !descriptionError && !imageUrlError) {
            console.log('hello');
            axios.put(`http://localhost:3001/editPart/${part.id}`, {
                name: name,
                type: partType,
                model_number: modelNumber,
                description: description,
                image_url: imageUrl,
            })
            .then(response => {
                console.log(response);
                navigate('/main/parts');
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
            navigate('/main/parts');
        })
        .catch(error => {
            console.error('Error deleting part:', error);
        });
    }
    return (
        <div className="create-part-container">
        <h1 className="create-part-header">Edit Part</h1>
        <form className="create-part-form" onSubmit={handleEdit}>
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
                        <button className='btn btn-primary' type="submit">Edit</button>
                        <button className='btn btn-danger' type="button" onClick={handleDelete}>Delete</button>
                    </form>
                </div>
    );
};

export default EditPart;