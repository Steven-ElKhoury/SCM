import React, {useEffect} from 'react';
import Part from '../Components/Part'; // Import the Part component
import '../css/Parts.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Parts = () => {
    const [parts, setParts] = React.useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/parts')
            .then((response) => {
                setParts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);
    
    const navigate = useNavigate();

    const navigateToCreatePart = () => {
        navigate('/main/createpart'); // Navigate to the add part page
    };

    return (
        <div>
            <h1 className="parts-header">Parts</h1>
            <button type="button" className="btn btn-primary" onClick={navigateToCreatePart}>Create Part</button>
                {parts.map((part) => (
                    <Part
                        key={part.component_type_id}
                        id={part.component_type_id}
                        type={part.type}
                        image={part.image_url}
                        description={part.description}
                        name={part.name}
                        modelNumber={part.model_number}
                        editable={true}
                    />
                ))}
        </div>
    );
};

export default Parts;