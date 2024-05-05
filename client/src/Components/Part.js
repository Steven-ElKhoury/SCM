import React from 'react';
import '../css/Part.css';
import { useStateValue } from './StateProvider';
import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';


function Part({id, uniqueId, name, type, description, image, modelNumber, editable, category_id}) {
    const [showDescription, setShowDescription] = React.useState(false);
    const [{basket}, dispatch] = useStateValue();
    const navigate = useNavigate();
    const addToBlueprint = () => {
        // Dispatch the item into the data layer
        dispatch({
            type: 'ADD_TO_blueprint',
            item: {
                id: id,
                uniqueId:uniqueId,
                name: name,
                type: type,
                modelNumber: modelNumber,
                description: description,
                image: image,
                category_id: category_id,
            },
        });
    };

    const handleEdit = () => {
        console.log('Edit part:', id);
    };

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    return (
        <div className='part'>
            <div className="part__info">
                <h1>{name}</h1>
                <p>Type: {type}</p>
                <img className='part-image' src={image} alt={type} />
                <p>Model: {modelNumber}</p>
                {showDescription ? (
                    <>
                        <p className='part-description'>Description: {description}</p>
                        <p className='toggle-description' onClick={toggleDescription}>Read Less</p>
                    </>
                ) : (
                    <p className='toggle-description' onClick={toggleDescription}>Read More</p>
                    
                )}
            </div>
            {editable && (
                <>
                    <button onClick={() => navigate(`/main/editPart/${id}`, { state: { part: { id, name, type, category_id , description, image, modelNumber} }  })} className='part-edit-btn'>Edit</button>
                </>
            )}
        </div>
    );
}

export default Part;