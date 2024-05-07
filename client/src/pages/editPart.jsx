import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function EditPart() {
    const navigate = useNavigate();
    const location = useLocation();
    const part = location.state.part;
    const id = part.id;
    const [selectedPartType, setSelectedPartType] = useState(part.category_id);
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
    const [partTypes, setPartTypes] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        if (e.target.value) {
            setImageUrlError(''); // clear error if input is not empty
        } else {
            setImageUrlError('Please enter the image URL'); // set error if input is empty
        }
    };

    useEffect(() => {
        axios.get('http://localhost:3001/partTypes')
          .then((response) => {
            setPartTypes(response.data);
          })
          .catch((error) => {
            console.error('Error fetching part types:', error);
          });
      }, []);
    
  
    
    const handleNameChange = (e) => {
        setName(e.target.value);
        if (e.target.value) {
            setNameError(''); // clear error if input is not empty
        } else {
            setNameError('Please enter the name'); // set error if input is empty
        }
    };
    
    const handlePartTypeChange = (e) => {
        const newPartType = e.target.value;
        setSelectedPartType(newPartType);
    
        // Validate the new part type
        if (newPartType === '') {
            setPartTypeError('Part type is required');
        } else {
            setPartTypeError('');  // Clear the error message
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
        
        if (!selectedPartType) {
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

        if (name === part.name && selectedPartType === part.type && modelNumber === part.modelNumber && imageUrl === part.image && description === part.description) {
            setError('No changes were made');
            console.log('No changes were made');
            return;
        }

        if (!partTypeError && !nameError && !modelNumberError && !descriptionError && !imageUrlError) {
            console.log('hello');
            axios.put(`http://localhost:3001/editPart/${part.id}`, {
                name: name,
                part_category_id: selectedPartType,
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
         <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            >
            <DialogTitle>Delete Part</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Are you sure you want to delete this part?
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
    <div className="create-part-header">
        <h1 style={{ 'textAlign': 'center'}} >Edit Part</h1>
    </div>
    <div className="create-part-form-container">   
    <form className="create-part-form" onSubmit={handleEdit}>
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
                        <br />
                        <button className='btn btn-primary' type="submit">Edit</button>
                        <button className='btn btn-danger' type="button" onClick= {() => setOpenDeleteDialog(true)}>Delete</button>
                    </form>
        </div>
    </div> 
    );
};

export default EditPart;