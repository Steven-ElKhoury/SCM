import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer'; 
import OrderReceipt from '../Components/OrderReceipt';
import '../css/Purchases.css';

function Purchases() {
    const navigate = useNavigate();
    const [byProducts, setbyProducts] = useState([]);
    const [byProductName, setbyProductName] = useState([]);
    const [ByproductQuantity, setByproductQuantity] = useState([]);
    const [modelID, setmodelID] = useState([]);
    
    const [isExpanded, setIsExpanded] = useState(false); // State to track whether section is expanded

    const [selectedName, setselectedName] = useState([]);

    
    const [ByproductList, setByproductList] = useState([]);
    const [selectedType, setselectedType] = useState([]);
    const [purchaseDate, setPurchaseDate] = useState('');


    const [sortKey, setSortKey] = useState('cust_order_id'); // Default sorting key

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US');
    };


    useEffect(() => {
        getByproductList();
      }, []);
    const getByproductList = () => {
        axios.get('http://localhost:3001/gettingByproductList').then((response) => {
            setByproductList(response.data);
        }).catch(error => {
            console.error('Error fetching Byproducts: ', error);
        });
    }


    

    const [ByproductTypeList, setByproductTypeList] = useState([]);

    useEffect(() => {
        getByproductTypeList();
      }, []);
    const getByproductTypeList = () => {
        axios.get('http://localhost:3001/gettingByproductTypeList').then((response) => {
            setByproductTypeList(response.data);
        }).catch(error => {
            console.error('Error fetching Byproduct Types: ', error);
        });
    }




    const [sortDirection, setSortDirection] = useState('ascending'); // Default to ascending

    useEffect(() => {
        axios.get('http://localhost:3001/getbyProducts')
            .then((response) => {
                const sortedByProducts = response.data.sort((a, b) => {
                    let comparison = 0;
                    if (sortKey === 'total_price' || sortKey === 'quantity') {
                        comparison = parseFloat(a[sortKey]) - parseFloat(b[sortKey]);
                    } else if (sortKey === 'date') {
                        comparison = new Date(a.date) - new Date(b.date);
                    } else {
                        comparison = a[sortKey] - b[sortKey];
                    }
    
                    return sortDirection === 'ascending' ? comparison : -comparison;
                });
                setbyProducts(sortedByProducts);
            })
            .catch((error) => {
                console.error('Error fetching byproducts:', error);
            });
    }, [sortKey, sortDirection]);
    
    








                        const existingByproductNames = Array.from(new Set(ByproductList.map(Byproduct => Byproduct.name)));
                        const existingByproductType = Array.from(new Set(ByproductTypeList.map(ByproductType => ByproductType.type)));
  
  
const handleAddPurchase = (event) => {
    event.preventDefault();

        axios.post('http://localhost:3001/newPurchase', {
            //byProductName: byProductName,
            byProductName: selectedName,
            ByproductQuantity: ByproductQuantity,
            purchaseDate: purchaseDate 
    })
              .then(response => {
                  console.log("added Purch")
                })
                .catch(error => {
                  console.error('Error adding purch :', error);
                });
                
                
        axios.post('http://localhost:3001/update_byproduct_storage', {
                byProductName: selectedName,
                ByproductQuantity: ByproductQuantity
                
            })
                      .then(response => {
                          console.log("added Purch")
                        })
                        .catch(error => {
                          console.error('Error adding purch :', error);
                        });              

            }


    return (
        <>
        

        <div className="new-Purchase">
    <h2 className="section-header" id="Purchase-page"  onClick={() => setIsExpanded(!isExpanded)}>Add New Order {isExpanded ? '-' : '+'}</h2>
      {isExpanded && ( // Render the form only if the section is expanded
      <form className='form-container' id='Purchase-page' onSubmit={handleAddPurchase}>
        <div className='form-container' id='Purchase-page'>
      
        <input
        type="number"
        id="Purchase-page"
        placeholder="Quantity"
        value={ByproductQuantity}
        onChange={(e) => setByproductQuantity(e.target.value)}
        step="1"
        />

        <select className='select-name'
        value={selectedName}
        onChange={(e) => setselectedName(e.target.value)}
        >
        <option id='Purchase-page' value="">Select Name</option>
        {existingByproductNames.map((type, index) => (
          <option key={index} value={type}>{type}</option>
          ))}
      </select>

      <input
        type="date"
        placeholder="Purchase Date"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
      />   
            
      </div>
      <button type="submit">Add Purchase</button>
      </form>

      )}
    </div>














        <div className="byProduct-container">
            <header className="byProduct-header">
                <h2>Customer Orders</h2>
            </header>
            
            <div className="sort-container">
    <div className="sort-by">
        <label htmlFor="sort-select">Sort By: </label>
        <select id="sort-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="cust_order_id">Order ID</option>
            <option value="total_price">Price</option>
            <option value="date">Date</option>
            <option value="quantity">Quantity</option>
        </select>
    </div>
    <div className="sort-direction">
        <label>
            <input
                type="radio"
                value="ascending"
                checked={sortDirection === 'ascending'}
                onChange={() => setSortDirection('ascending')}
            />
            Ascending
        </label>
        <label>
            <input
                type="radio"
                value="descending"
                checked={sortDirection === 'descending'}
                onChange={() => setSortDirection('descending')}
            />
            Descending
        </label>
    </div>
</div>




            <div className="byProduct-content">
                <div className="byProduct-grid">
                    {byProducts.map((byProducts) => (
                        <div key={byProducts.cust_order_id} className="byProduct-card-container">
                            <div className="byProduct-card">
                                <div className="byProduct-card-content">
                                    <h2>customer order ID: {byProducts.cust_order_id}</h2>
                                    <h3>Model ID: {byProducts.modelID}</h3>
                                    <p>Type: {byProducts.type}</p>
                                    <h3>quantity: {byProducts.quantity}</h3>
                                    <h3>total price: ${byProducts.total_price}</h3>
                                    <p>Date ordered: {formatDate(byProducts.date)}</p>
                                    <BlobProvider document={<OrderReceipt order={byProducts} />}>
                                            {({ blob, url, loading, error }) => {
                                                if (loading) {
                                                    return <div>Loading...</div>;
                                                } else if (error) {
                                                    return <div>An error occurred while generating the PDF.</div>;
                                                } else {
                                                    return <a href={url} target="_blank" rel="noopener noreferrer">View receipt</a>;
                                                }
                                            }}
                                        </BlobProvider>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>



        </>
    );
}

export default Purchases;