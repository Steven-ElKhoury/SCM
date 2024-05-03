import React, {useState, useEffect} from 'react';
import Part from '../Components/Part'; // Import the Part component
import '../css/Parts.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Parts = () => {
    const [parts, setParts] = React.useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/parts')
            .then((response) => {
                setParts(response.data);
                console.log(response.data);
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
        <div className="parts-page">
            <h1 className="parts-header">Parts</h1>
            <div className="part-search-container">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search parts by type, model number or name" />
                <button type="button" className="create-part-button" onClick={navigateToCreatePart}>Create Part</button>
            </div>
            <div className="parts-container">
                {parts
                    .filter(part => 
                        part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        part.category_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        part.model_number.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((part) => (
                        <Part
                            key={part.component_type_id}
                            id={part.component_type_id}
                            category_id = {part.part_category_id}
                            type={part.category_name}
                            image={part.image_url}
                            description={part.description}
                            name={part.name}
                            modelNumber={part.model_number}
                            editable={true}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Parts;