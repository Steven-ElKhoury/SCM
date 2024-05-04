import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateValue } from '../Components/StateProvider.js';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../css/Blueprint.css';
import Part from '../Components/Part';
import { useParams } from 'react-router-dom';


const ProductBlueprint = () => {
  const [{blueprint}, dispatch ]  = useStateValue();
  const [components, setComponents] = useState([]);
  const [componentTypes, setComponentTypes] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTypeComponents, setSelectedTypeComponents] = useState([]);
  const { modelId } = useParams();


  useEffect(() => {
    axios.get('http://localhost:3001/getParts')
      .then(response => {
        setComponents(response.data);
        console.log('response.data', response.data)
        const uniqueTypes = [...new Set(response.data.map(item => item.type))];
        setComponentTypes(uniqueTypes);
        console.log('uniqueTypes', uniqueTypes)
      })
      .catch(error => console.error(error));
  }, []);

  const handleComponentSelect = (componentId) => {
    const component = components.find(component => component.component_type_id === Number(componentId));
    setSelectedComponent({id: component.component_type_id, name: component.type});
  };

  const handleComponentTypeSelect = (componentType) => {
    setSelectedComponent(componentType);
    const filteredComponents = components.filter(component => component.type === componentType);
    setSelectedTypeComponents(filteredComponents);
  };

  const handleAddToBlueprint = (component) => {
    if (quantity <= 0) {
      console.error('Quantity must be greater than 0');
      return;
    }
  
    // Check if a part of the selected type already exists in the blueprint
    const existingPart = blueprint.find(part => part.type === component.type);

    if (existingPart) {
      // If it does, update the quantity of that part
      dispatch({
        type: 'UPDATE_PART_IN_BLUEPRINT',
        item: {
          id: component.component_type_id,
          name: component.name,
          type: component.type,
          description: component.description,
          image: component.image_url,
          modelNumber: component.model_number,    
        },
      });
    } else {
      // If it doesn't, add a new part to the blueprint
      console.log('selectedComponent', component);
      dispatch({
        type: 'ADD_TO_BLUEPRINT',
        item: {
          id: component.component_type_id,
          name: component.name,
          type: component.type,
          description: component.description,
          image: component.image_url,
          modelNumber: component.model_number,    
        },
      });
    }
  
    setSelectedComponent(null);
    setQuantity(1);
  };

  const handleRemovePart = (partId) => {
    dispatch({
      type: 'REMOVE_FROM_BLUEPRINT',
      id: partId,
    });
  };

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
  
    // Create a clone of the current target element
    const dragElem = e.currentTarget.cloneNode(true);
    dragElem.style.position = "absolute";
    dragElem.style.top = "-9999px";
    document.body.appendChild(dragElem);
  
    // Use the clone as the drag image
    e.dataTransfer.setDragImage(dragElem, e.offsetX, e.offsetY);
  
    // Remove the clone from the body after a delay
    setTimeout(() => {
      document.body.removeChild(dragElem);
    }, 0);
  };

  const handleDrop = (e) => {
   
    e.preventDefault();
    const component = JSON.parse(e.dataTransfer.getData("component"));
    console.log('component', component);
    if (component) {
         handleAddToBlueprint(component);
    } else {
      console.error("No component data found in event");
    }
  };


  const handleConfirmParts = () => {
    axios.post('http://localhost:3001/blueprint', { modelId, parts: blueprint })
      .then(response => {
        navigate('/main/products');
      })
      .catch(error => {
        console.error('Error creating blueprint:', error);
        setModalMessage('Error creating blueprint. Please try again.');
        setModalIsOpen(true);
      });
  };


  

  return (
    <>
<div className="blueprint-container">
  <div id="blueprint-section" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
    <h2 className="section-header">Blueprint</h2>
  <div className='blueprint-parts'>
    {blueprint.map((component, index) => (
  <div id='part-select' draggable onDragStart={(e) => handleDragStart(e, component)} key={index}>
  <Part 
    key={index} 
    id={component.id} 
    name={component.name} 
    type={component.type} 
    description={component.description} 
    image={component.image} 
    modelNumber={component.modelNumber} 
    editable={false} 
  />
  <button onClick={() => handleRemovePart(component.id)}>Remove</button>
  </div>
))}
  </div>
</div>

  <div id="selection-section">
    <h2 className="section-header">Selection</h2>
    <select value={selectedComponent || ''} onChange={e => handleComponentTypeSelect(e.target.value)}>
      <option value="">Select component type</option>
      {componentTypes.map((type, index) => (
        <option key={index} value={type}>{type}</option>
      ))}
    </select>
    <div className='selection-parts'>
    {selectedTypeComponents.map((component, index) => (
  <div id='part-select' draggable onDragStart={(e) => handleDragStart(e, component)} key={index}>
  <Part 
    key={index} 
    id={component.id} 
    name={component.name} 
    type={component.type} 
    description={component.description} 
    image={component.image_url} 
    modelNumber={component.model_number} 
    editable={false} 
  />
   <button className="add-to-basket" onClick={() => handleAddToBlueprint(component)}>Add to Blueprint</button>
  </div>
))}
  </div>
</div>
</div>
<button onClick={handleConfirmParts}>Confirm Parts</button>
<Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
  <h2>Error</h2>
  <p>{modalMessage}</p>
  <button onClick={() => setModalIsOpen(false)}>Close</button>
</Modal>
  </>
  );
};

export default ProductBlueprint;