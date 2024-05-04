import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import "../css/supplier.css";

// NewSupplier component for adding a new supplier
const NewSupplier = ({ existingTypes, supplierfunc }) => {
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [leadTime,setLeadTime] = useState('');
  const [component_id,setComponent_id] = useState('');
  const [supplier_id,setSupplier_id] = useState('');
  const [parts, setParts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // State to track whether section is expanded
  
  const handleAddSupplier = () => {
    // Validation checks can be added here if needed
    if (supplierName && supplierEmail && leadTime &&  selectedPrice) {
      addSupplier({ supplierName,supplierEmail,selectedPrice, selectedType,leadTime,component_id,supplier_id });
      setSupplierName('');
      setSupplierEmail('');
      setSelectedType('');
      setSelectedPrice('');
      setLeadTime('');
      setSupplier_id('');
      setComponent_id('');
    } else {
      // Handle invalid input
      console.log('invalid input')
    }
  };
  


  useEffect(() => {
    Axios.get('http://localhost:3001/parts').then((response) => {
      setParts(response.data);
    }).catch(error => {
      console.error('Error fetching parts:', error);
    });
  }, []);


  const addSupplier = (newSupplier) => {

    
    Axios.post('http://localhost:3001/getcomponentid',{ selectedType: newSupplier.selectedType })
      .then(response => {
        console.log(response.data[0])
        setComponent_id(response.data[0].component_type_id);


        const componentId = response.data[0].component_type_id;
        newSupplier.component_id = componentId;

        Axios.post('http://localhost:3001/addSupplier', newSupplier)
        .then(response => {
            supplierfunc();

            Axios.get('http://localhost:3001/getsupplierid').then((response) => {
              console.log("supplier id is "+JSON.stringify(response.data[0].supplier_id))
              setSupplier_id(response.data[0].supplier_id);

              const supplierId = response.data[0].supplier_id;
              newSupplier.supplier_id = supplierId;
        
              Axios.post('http://localhost:3001/addsupplieroffering', newSupplier)
              .then(response => {
                  console.log("added supplier")
                })
                .catch(error => {
                  console.error('Error adding supplier offering:', error);
                });
          
          
          
        }).catch(error => {
          console.error('Error fetching suppliers:', error);
        });
        console.log("supermario"+supplier_id)
    })
    .catch(error => {
      console.error('Error adding supplier:', error);
    });

        })
        .catch(error => {
          console.error('Error getting component id:', error);
        });    
    };


  return (
    <div className="new-supplier">
    <h2 className="section-header" id="supplier-page"  onClick={() => setIsExpanded(!isExpanded)}>Add New Supplier {isExpanded ? '-' : '+'}</h2>
      {isExpanded && ( // Render the form only if the section is expanded
        <div className='form-container' id='supplier-page'>
      <input
        type="text"
        id='supplier-page'
        placeholder="Supplier Name"
        value={supplierName}
        onChange={(e) => setSupplierName(e.target.value)}
        />
      <input
        type="text" //change to emaillllllllllllllllllll
        id='supplier-page'
        placeholder="Supplier Email"
        value={supplierEmail}
        onChange={(e) => setSupplierEmail(e.target.value)}
        />
      <input
        type="text"
        id='supplier-page'
        placeholder="Component Price"
        value={selectedPrice}
        onChange={(e) => setSelectedPrice(e.target.value)}
        />
      <input
        type="text"
        id='supplier-page'
        placeholder="Lead Time"
        value={leadTime} ////////change data restriction to data only (integer)
        onChange={(e) => setLeadTime(e.target.value)}
        />


      <select className='select-type'
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        >
        <option id='supplier-page' value="">Select Type</option>
        {parts.map((part) => (
          <option key={part.component_type_id} value={part.name}>{part.name}</option>
          ))}
      </select>
      <button className="submit-btn" id='supplier-page' onClick={handleAddSupplier}>Add Supplier</button>
      </div>
      )}
    </div>
  );
};


// SupplierDetails component to display details of a supplier
const SupplierDetails = ({ supplier, offerings,supplierfunc }) => {

  // const isManager = userData.role === 'manager';
  const isManager = true;

  const [newPrices, setNewPrices] = useState({});
  // Function to send new prices to the backend
  const updatePrice = (offeringId) => {
    const newPrice = newPrices[offeringId];
    if (newPrice !== undefined && newPrice !== '') {
        Axios.post('http://localhost:3001/updatePrice', { offeringId, newPrice })
            .then(response => {
                // Handle success, maybe show a success message
                supplierfunc();

            })
            .catch(error => {
                console.error('Error updating price:', error);
            });
    } else {
      console.log('problem')  
      // Handle invalid input, maybe show a validation message
    }
  };
  
  // Function to handle change in price
  const handlePriceChange = (offeringId, event) => {
    const { value } = event.target;
    setNewPrices(prevState => ({
      ...prevState,
      [offeringId]: value
    }));
  };

  return (
        <div className="supplier-details">
            <h2 className="supplier-name">Supplier: {supplier}</h2>
            <div className="offerings">
                {offerings.map((offering, index) => (
                    <div key={index} className="offering">
                        <p>Offering ID: {offering.offering_id}</p>
                        <p>Price: ${offering.price}</p>
                        <p>Lead Time: {offering.lead_time} days</p>
                        <p>Type: {offering.name}</p>

                        {isManager && (
                        <div>
                            <input
                                type="number"
                                placeholder="New Price"
                                value={newPrices[offering.offering_id] || ''}
                                onChange={(e) => handlePriceChange(offering.offering_id, e)}
                                />
                            <button onClick={() => updatePrice(offering.offering_id)}>Edit Price</button>
                        </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Suppliers = () => {


    const [suppliersList, setSuppliersList] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortOrder, setSortOrder] = useState({ sortBy: 'price', order: 'asc' });


    var sessionUser = sessionStorage.getItem('Employee_ID');
    var isAdmin = sessionStorage.getItem('isadmin');
    console.log('sessionUser is :', sessionUser)
    console.log('houwwe admin :', isAdmin)
    console.log("SESSION STORAGE:"+JSON.stringify(sessionStorage))


 
    useEffect(() => {
        getSupplier();
      }, []);


    const getSupplier = () => {
        Axios.get('http://localhost:3001/gettingsuppliers').then((response) => {
            setSuppliersList(response.data);
        }).catch(error => {
            console.error('Error fetching suppliers:', error);
        });
    }





    // Filter and sort suppliers based on selected criteria
    const filteredSuppliers = suppliersList.filter(supplier => {
        if (selectedSupplier && selectedType) {
            return supplier.supplier_name === selectedSupplier && supplier.name === selectedType;
        } else if (selectedSupplier) {
            return supplier.supplier_name === selectedSupplier;
        } else if (selectedType) {
            return supplier.name === selectedType;
        } else {
            return true;
        }
    }).sort((a, b) => {
        if (sortOrder.sortBy === 'price') {
            return sortOrder.order === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (sortOrder.sortBy === 'leadTime') {
            return sortOrder.order === 'asc' ? a.lead_time - b.lead_time : b.lead_time - a.lead_time;
        }
    });

    // Group offerings by supplier name
    const groupedSuppliers = {};
    filteredSuppliers.forEach(supplier => {
        if (!groupedSuppliers[supplier.supplier_name]) {
            groupedSuppliers[supplier.supplier_name] = [];
        }
        groupedSuppliers[supplier.supplier_name].push(supplier);
    });

  //for add supplier feature
  const existingTypes = Array.from(new Set(suppliersList.map(supplier => supplier.name)));

    return (
        <div className="container" id='supplier-page'>
                <div className="content">
                    <div className="header">
                        <h1>Suppliers List</h1>
                    </div>
                  <NewSupplier existingTypes={existingTypes} supplierfunc={getSupplier}/>
                    <div className="filters">
                        <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                            <option value="">Select Supplier</option>
                            {Array.from(new Set(suppliersList.map(supplier => supplier.supplier_name))).map((supplierName, index) => (
                                <option key={index} value={supplierName}>{supplierName}</option>
                            ))}
                        </select>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            <option value="">Select Type</option>
                            {Array.from(new Set(suppliersList.map(supplier => supplier.name))).map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                        <button onClick={() => setSortOrder({ sortBy: 'price', order: sortOrder.sortBy === 'price' && sortOrder.order === 'asc' ? 'desc' : 'asc' })}>
                            Sort by Price {sortOrder.sortBy === 'price' && (sortOrder.order === 'asc' ? '(Low to High)' : '(High to Low)')}
                        </button>
                        <button onClick={() => setSortOrder({ sortBy: 'leadTime', order: sortOrder.sortBy === 'leadTime' && sortOrder.order === 'asc' ? 'desc' : 'asc' })}>
                            Sort by Lead Time {sortOrder.sortBy === 'leadTime' && (sortOrder.order === 'asc' ? '(Short to Long)' : '(Long to Short)')}
                        </button>
                    </div>
                    <div className="supplier-list">
                        {Object.keys(groupedSuppliers).map((supplierName, index) => (
                            <SupplierDetails key={index} supplier={supplierName} offerings={groupedSuppliers[supplierName]} supplierfunc ={getSupplier}/>
                        ))}
                    </div>
                </div>
            </div>
    );
}

export default Suppliers;
