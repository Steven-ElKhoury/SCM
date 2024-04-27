import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CartItem from '../Components/CartItem.js';
import { useStateValue } from '../Components/StateProvider.js';// Import your CartContext
import '../css/CreateOrder.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';



const CreateOrder = () => {
  const [{cart}, dispatch ]  = useStateValue(); // Use your CartContext to get the cart state
  const [components, setComponents] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const [noSuppliers, setNoSuppliers] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch components from your API
    axios.get('http://localhost:3001/parts')
      .then(response => setComponents(response.data))
      .catch(error => console.error(error));
  }, []);

  
  // This function could be called when a component is selected

  const handleComponentSelect = (componentId) => {
    const component = components.find(component => component.component_type_id === Number(componentId));

    setSelectedComponent({id: component.component_type_id, name: component.type});
    if (componentId) {
      axios.get(`http://localhost:3001/supplierofferings/${componentId}`)
        .then(response => {
          if (response.data.length === 0) {
            setNoSuppliers(true);
          } else {
            setSuppliers(response.data);
            setSelectedSupplier(response.data[0]);
            setNoSuppliers(false);
          }
        })
        .catch(error => console.error(error));
    }
  };

  const handleDelete = (id) => {
    console.log('Deleting item with id:', id);
    dispatch({
      type: 'REMOVE_FROM_CART',
      id: id,
    });
  };

  const handleAddToCart = () => {
  if (!selectedSupplier) {
    console.error('No supplier selected');
    return;
  }

  if (quantity <= 0) {
    console.error('Quantity must be greater than 0');
    return;
  }

  if (!selectedComponent || !selectedSupplier) {
    console.error('No component or supplier selected');
    return;
  }
  
  axios.get(`http://localhost:3001/warehouse/check/${selectedComponent.id}`)
  .then(response => {
    if (response.data.storage < quantity) {
      setModalMessage(`There's not enough storage in the warehouse. Remaining capacity: ${response.data.storage}.`);
      setModalIsOpen(true);
      return;
    }
  }).catch(error =>{
    setModalMessage('There is no storage unit for this component. Please create a storage unit first.');
    setModalIsOpen(true);
  })

  // Dispatch an action to add the order to the cart
  dispatch({
    type: 'ADD_TO_CART',
    item: {
      id: selectedSupplier.id,
      name: selectedSupplier.supplier_name,
      price: selectedSupplier.price * quantity,
      partName: selectedComponent.name,
      partID: selectedComponent.id,
      quantity: quantity,
    },
  });

  setSelectedComponent(null);
  setSelectedSupplier(null);
  setQuantity(1);
};
  
  return (
<>
<div id="order-section">
<select value={selectedComponent ? selectedComponent.id : ''} onChange={e => handleComponentSelect(e.target.value)}>
  <option value="">Select component</option>
  {components.map(component => (
    <option key={component.component_type_id} value={component.component_type_id}>{component.type}</option>
  ))}
</select>
  {noSuppliers ? (
    <div>
      <p>No suppliers available for this part</p>
      <button onClick={() => navigate('/main/suppliers')}>Create Supplier</button>
    </div>
  ) : (
    selectedSupplier && (
      <div>
        <p>Recommended supplier: {selectedSupplier.supplier_name}</p>
        <p>Price: ${selectedSupplier.price}</p>
        <p>Lead Time: {selectedSupplier.lead_time} days</p> {/* Adjust this line as needed */}
        <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <button onClick={handleAddToCart}>Add to cart</button>
        <button onClick={() => setShowAllSuppliers(!showAllSuppliers)}>
          {showAllSuppliers ? 'Hide Others' : 'See Others'}
        </button>
      </div>
    )
  )}
</div>

<div id="separator"></div>

<div>
  {showAllSuppliers && suppliers.filter(supplier => selectedSupplier && supplier.supplier_id !== selectedSupplier.supplier_id).map(supplier => (
    <div className="cart-item" key={supplier.supplier_id}>
      <p>Name: {supplier.supplier_name}</p>
      <p>Price: ${supplier.price}</p>
      <p>Lead Time: {supplier.lead_time} days</p> {/* Adjust this line as needed */}
      <button className="add-to-cart-button" onClick={() => handleAddToCart()}>Add to cart</button>
  </div>
  ))}


{cart.map((item, index) => (
  <div className="cart-item" key={index}>
    <CartItem item={item} />
    <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
  </div>
))}
</div>
</>
  );
};

export default CreateOrder;