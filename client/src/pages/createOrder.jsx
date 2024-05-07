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
  const [offeringId, setOfferingId] = useState();


  useEffect(() => {
    // Fetch components from your API
    axios.get('http://localhost:3001/parts')
      .then(response => setComponents(response.data))
      .catch(error => console.error(error));
  }, []);

  
  // This function could be called when a component is selected

  const handleOrderSubmit = () => {
    const isadmin = sessionStorage.getItem('isadmin');
    const Employee_ID = sessionStorage.getItem('Employee_ID');
    console.log(Employee_ID)
    // Create an array of promises
    const promises = cart.map(item => {
      return axios.post('http://localhost:3001/createOrder', {
        managerId: Number(isadmin) === 1 ? Employee_ID : null,
        employeeId: Number(isadmin) === 0 ? Employee_ID : null,
        dateOrdered: new Date(),
        price: item.price,
        quantity: item.quantity,
        offering_id: item.offering_id,
      });
    });
  
    // Use Promise.all() to make multiple requests
    Promise.all(promises)
      .then(() => {
        console.log('All orders created successfully');
        // Clear the cart
        dispatch({ type: 'EMPTY_CART' });
      })
      .catch(error => {
        console.error('Error creating orders:', error);
      });
  };

  const handleComponentSelect = (componentId) => {
    const component = components.find(component => component.component_type_id === Number(componentId));
    console.log(component);
    setSelectedComponent({id: component.component_type_id, name: component.name});
    if (componentId) {
      axios.get(`http://localhost:3001/supplierofferings/${componentId}`)
        .then(response => {
          if (response.data.length === 0) {
            setNoSuppliers(true);
          } else {
            console.log(response.data);
            const sortedSuppliers = response.data.sort((a, b) => a.price - b.price);
            setSuppliers(sortedSuppliers);
            setSelectedSupplier(sortedSuppliers[0]);
            setNoSuppliers(false);
          }
        })
        .catch(error => console.error(error));
    }
    console.log(selectedSupplier);
};

  const handleDelete = (id) => {
    console.log('Deleting item with id:', id);
    dispatch({
      type: 'REMOVE_FROM_CART',
      id: id,
    });
  };

 const handleAddToCart = (supplier) => {
  if (!supplier) {
    console.error('No supplier selected');
    return;
  }

  if (quantity <= 0) {
    console.error('Quantity must be greater than 0');
    return;
  }

  if (!selectedComponent || !supplier) {
    console.error('No component or supplier selected');
    return;
  }

  axios.get(`http://localhost:3001/warehouse/check/${selectedComponent.id}`)
.then(response => {
  const { totalAvailableStorage } = response.data;
  console.log(totalAvailableStorage);
  if (totalAvailableStorage < quantity) {
    setModalMessage(`There's not enough storage in the warehouse. Remaining capacity: ${totalAvailableStorage}.`);
    setModalIsOpen(true);
    return;
  }

  // Dispatch an action to add the order to the cart
  dispatch({
    type: 'ADD_TO_CART',
    item: {
      id: supplier.id,
      name: supplier.supplier_name,
      price: supplier.price * quantity,
      partName: selectedComponent.name,
      partID: selectedComponent.component_type_id,
      quantity: quantity,
      offering_id: supplier.offering_id,
    },
  });

  setSelectedComponent(null);
  setSelectedSupplier(null);
  setQuantity(1);
})
.catch(error => {
  setModalMessage('There is no storage unit for this component. Please create a storage unit first.');
  setModalIsOpen(true);
});
 };

  
  return (
<>
<div id="order-section">
<select value={selectedComponent ? selectedComponent.id : ''} onChange={e => handleComponentSelect(e.target.value)}>
  <option value="">Select component</option>
  {components.map(component => (
    <option key={component.component_type_id} value={component.component_type_id}>{component.name}</option>
  ))}
</select>
  {noSuppliers ? (
    <div>
      <p>No suppliers available for this part</p>
      <button onClick={() => navigate('/main/suppliers')}>Create Supplier</button>
    </div>
  ) : (
    selectedSupplier && (
      <div className='order_info' style={{'background-color': 'white'}}>
        <p>Recommended supplier: {selectedSupplier.supplier_name}</p>
        <p>Price: ${selectedSupplier.price}</p>
        <p>Lead Time: {selectedSupplier.lead_time} days</p> {/* Adjust this line as needed */}
        <label htmlFor="quantity">Quantity: </label>
        <input type="number" id="quantity" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <button onClick={() => handleAddToCart(selectedSupplier)}>Add to cart</button>
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
      <button className="add-to-cart-button" onClick={() => handleAddToCart(supplier)}>Add to cart</button>
  </div>
  ))}


{cart.map((item, index) => (
  <div className="cart-item" key={index}>
    <CartItem item={item} />
    <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
  </div>
))}

{cart.length > 0 && (
      <button className='add-to-cart-button' onClick={handleOrderSubmit}>Place Order</button>
)}
</div>
  <Modal 
    isOpen={modalIsOpen} 
    onRequestClose={() => setModalIsOpen(false)}
    style={{
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%', // Adjust the width
        height: '50%', // Adjust the height
        padding: '20px', // Adjust the padding
        backgroundColor: '#f5f5f5', // Adjust the background color
        borderRadius: '10px', // Adjust the border radius
      },
    }}
  >
    <h2>Notification</h2>
    <p style ={{'color':'red'}}>{modalMessage}</p>
  </Modal>
</>
  );
};

export default CreateOrder;