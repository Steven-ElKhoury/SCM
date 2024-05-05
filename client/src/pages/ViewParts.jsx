import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateValue } from '../Components/StateProvider.js';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../css/Blueprint.css';
import Part from '../Components/Part';
import { useParams } from 'react-router-dom';


const ViewParts = () => {
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
  const [counterState, setCounterState] = useState(0);
  let counter = 0;

  useEffect(() => {
    dispatch({ type: 'EMPTY_BLUEPRINT' });

    axios.get('http://localhost:3001/getParts')
      .then(response => {
        setComponents(response.data);
        const uniqueTypes = [...new Set(response.data.map(item => item.type))];
        setComponentTypes(uniqueTypes);
        console.log('uniqueTypes', uniqueTypes)
      })
      .catch(error => console.error(error));
     
      // axios.get(`http://localhost:3001/blueprint/${modelId}`)
      // .then(response => {
      //   response.data.forEach(part => {
      //     dispatch({ type: 'ADD_TO_BLUEPRINT_EDIT', payload: part });
      //   });
      // })
      axios.get(`http://localhost:3001/blueprint/${modelId}`)
        .then(response => {
          response.data.forEach(part => {
            // Generate a unique id for each part
            const uniqueId = counter++;
            setCounterState(counter); 
            // Add the unique id to the part
            part.uniqueId = uniqueId;

            dispatch({ type: 'ADD_TO_BLUEPRINT_EDIT', payload: part });
          });
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
    // Generate a unique id for the new item
    counter = counterState;
    const uniqueId = counter++;
    setCounterState(counter);

    // Check if a part of the selected type already exists in the blueprint
    // const existingPart = blueprint.find(part => part.type === component.type);

    // if (existingPart) {
    //   // If it does, update the quantity of that part
    //   dispatch({
    //     type: 'UPDATE_PART_IN_BLUEPRINT',
    //     item: {
    //       id: component.component_type_id,
    //       name: component.name,
    //       type: component.type,
    //       description: component.description,
    //       image_url: component.image_url,
    //       model_number: component.model_number,    
    //     },
    //   });
    // } else {
      // If it doesn't, add a new part to the blueprint
      console.log('selectedComponent', component);
      dispatch({
        type: 'ADD_TO_BLUEPRINT',
        item: {
          uniqueId: uniqueId,
          id: component.component_type_id,
          name: component.name,
          type: component.type,
          description: component.description,
          image_url: component.image_url,
          model_number: component.model_number,    
        },
      });
  
    setSelectedComponent(null);
    setQuantity(1);
  };

  const handleAddToBlueprintEdit = (component) => {
    if (quantity <= 0) {
      console.error('Quantity must be greater than 0');
      return;
    }  
    // Generate a unique id for the new item
    counter = counterState;
    const uniqueId = counter++;
    setCounterState(counter);
    // // Check if a part of the selected type already exists in the blueprint
    // const existingPart = blueprint.find(part => part.type === component.type);

    // if (existingPart) {
    //   // If it does, update the quantity of that part
    //   dispatch({
    //     type: 'UPDATE_PART_IN_BLUEPRINT',
    //     item: {
    //       id: component.component_type_id,
    //       name: component.name,
    //       type: component.type,
    //       description: component.description,
    //       image_url: component.image_url,
    //       model_number: component.model_number,    
    //     },
    //   });
    // } else {
      // If it doesn't, add a new part to the blueprint
      console.log('selectedComponent', component);

      dispatch({
        type: 'ADD_TO_BLUEPRINT_EDIT',
        item: {
          uniqueId: uniqueId,
          id: component.component_type_id,
          name: component.name,
          type: component.type,
          description: component.description,
          image_url: component.image_url,
          model_number: component.model_number,    
        },
      });
  
    setSelectedComponent(null);
    setQuantity(1);
  };


  // const handleRemovePart = (componentTypeId) => {
  //   dispatch({ type: 'REMOVE_FROM_BLUEPRINT_EDIT', payload: componentTypeId });
  // };
  
  const handleRemovePart = (uniqueId) => {
    dispatch({ type: 'REMOVE_FROM_BLUEPRINT_EDIT', payload: uniqueId });
  };
  
  const handleConfirmParts = () => {
    axios.put(`http://localhost:3001/updateBlueprint/${modelId}`, blueprint)
      .then(response => {
        navigate('/main/products');
      })
      .catch(error => {
        console.error('Error updating blueprint:', error);
        setModalMessage('Error updating blueprint. Please try again.');
        setModalIsOpen(true);
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
    uniqueId={component.uniqueId}
    name={component.name} 
    type={component.type} 
    description={component.description} 
    image={component.image_url} 
    modelNumber={component.model_number} 
    editable={false} 
  />
  <button onClick={() => handleRemovePart(component.uniqueId)}>Remove</button>
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
    id={component.component_type_id} 
    uniqueId = {component.uniqueId}
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

export default ViewParts;