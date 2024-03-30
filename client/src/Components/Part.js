import React from 'react';
import '../css/Part.css';
import { useStateValue } from './StateProvider';
import {useNavigate} from 'react-router-dom';

function Part({id, name, type, description, image, modelNumber, editable}) {
    const [{basket}, dispatch] = useStateValue();
    const navigate = useNavigate();

    const addToBlueprint = () => {
        // Dispatch the item into the data layer
        dispatch({
            type: 'ADD_TO_blueprint',
            item: {
                id: id,
                name: name,
                type: type,
                modelNumber: modelNumber,
                description: description,
                image: image,
            },
        });
    };

    const handleEdit = () => {
        console.log('Edit part:', id);
    };


    return (
        <div className='part'>
            <div className="part__info">
                <h1>{name}</h1>
                <p>Type: {type}</p>
                <img src={image} alt={type} />
                <p>Model: {modelNumber}</p>
                {description && <p>Description: {description}</p>}
            </div>
            {editable ? (
                <>
                    <button onClick={() => navigate(`/main/editPart/${id}`, { state: { part: { id, name, type, description, image, modelNumber } }  })}>Edit</button>
                </>
            ) : (
                <button onClick={addToBlueprint}>Add to Blueprint</button>
            )}
        </div>
    );
}

export default Part;