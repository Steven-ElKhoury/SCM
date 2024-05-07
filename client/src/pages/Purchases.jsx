import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer';
import PurchaseReceipt from '../Components/PurchaseReceipt';
import '../css/Purchases.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Purchases() {
    const navigate = useNavigate();
    const [byProducts, setbyProducts] = useState([]);
    const [byProductName, setbyProductName] = useState([]);
    const [ByproductQuantity, setByproductQuantity] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // State to track whether section is expanded
    const [selectedModelID, setselectedModelID] = useState([]);
    const [ByproductList, setByproductList] = useState([]);
    const [selectedType, setselectedType] = useState([]);
    const [purchaseDate, setPurchaseDate] = useState('');
    const [sortKey, setSortKey] = useState('cust_order_id'); // Default sorting key
    const [custOrderId, setcustOrderId] = useState(null); //when we add purchases the new customer order id is stored here
    const [ModelID, setModelID] = useState(null);
    const [ByproductTypeList, setByproductTypeList] = useState([]);
    const [sortDirection, setSortDirection] = useState('ascending'); // Default to ascending
    const [highest_stock_unitID, sethighest_stock_unitID] = useState([]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US');
    };


    useEffect(() => {
        axios.get('http://localhost:3001/gettingByproductList').then((response) => {
            setByproductList(response.data);
        }).catch(error => {
            console.error('Error fetching Byproducts: ', error);
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/gettingByproductTypeList').then((response) => {
            setByproductTypeList(response.data);
        }).catch(error => {
            console.error('Error fetching Byproduct Types: ', error);
        });
    }, []);

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

    const existingByproductType = Array.from(new Set(ByproductTypeList.map(ByproductType => ByproductType.type)));

    /////////////////////////purch:
    const handleAddPurchase = async (event) => {
        event.preventDefault();
        let stock;
        let higheststock_unitID;
        const parsedQuantity = parseInt(ByproductQuantity, 10);

        const availableQuantityCheck = await axios.get(`http://localhost:3001/availableQuantityCheck`, { params: { modelID: selectedModelID } })
        let quantityy = null;
        if (availableQuantityCheck.data.quantity) {
            quantityy = availableQuantityCheck.data.quantity;

        }
        if (quantityy >= parsedQuantity) {
            try {
                const newPurchase = await axios.post('http://localhost:3001/newPurchase', {
                    modelID: selectedModelID,
                    ByproductQuantity: parsedQuantity,
                    purchaseDate: purchaseDate
                })
                const custOrderIdd = newPurchase.data.custOrderId;

                //reduce quantity of the model
                await axios.post('http://localhost:3001/update_model', { modelID: selectedModelID, ByproductQuantity: parsedQuantity })
                    .then(response => {
                        console.log("model quantity reduced")
                    })
                    .catch(error => {
                        console.error('Error reducing model quantity :', error);
                    });

                
                console.log("reached!!!!!!!!!!")
                await recursiveUpdateByProductStorage(parsedQuantity);  
                async function recursiveUpdateByProductStorage(quantityLeft) {
                    try {
                        console.log("reached????????")
                        // Base case: if the quantity left to process is 0, stop recursion
                        if (quantityLeft <= 0) {
                            console.log("Recursion complete, no quantity left to process.");
                            return;
                        }

                        const highest_stock_unit_ID = await axios.get('http://localhost:3001/highest_stock_unit_ID', { params: { modelID: selectedModelID } })
                        stock = highest_stock_unit_ID.data.stock
                        console.log("stock of highest_stock_unitID: ",stock)

                        const currentQuantity = Math.min(quantityLeft, stock);

                        higheststock_unitID = highest_stock_unit_ID.data.unit_id
                        console.log("highest stock unit id: ", higheststock_unitID)

                        if (highest_stock_unit_ID.data.unit_id) {
//reduce stock from byproduct storage
                            const update_byproduct_storage = await axios.post('http://localhost:3001/update_byproduct_storage', {
                                unitId: higheststock_unitID,
                                ByproductQuantity: currentQuantity
                            })
                                .then(response => {
                                    console.log("byproduct_storage stock reduced")
                                })
                                .catch(error => {
                                    console.error('Error in update_byproduct_storage :', error);
                                });
                            console.log("update_byproduct_storage updated successfully.");
//update unit ids from produced_byproduct
                            await axios.post('http://localhost:3001/update_produced_byproduct', {
                                ModelID: selectedModelID, 
                                custOrderId: custOrderIdd,
                                ByproductQuantity: currentQuantity,
                                unit_id: higheststock_unitID
                            })
                                .then(response => {
                                    console.log("updated: update_produced_byproduct")
                                })
                                .catch(error => {
                                    console.error('Error in update_produced_byproduct :', error);
                                });
                        }
                        else {
                            console.log("Error in update_byproduct_storage");
                        }

                        await recursiveUpdateByProductStorage(quantityLeft - currentQuantity);
                        
                    } catch (error) {
                        console.error('Error during recursive byproduct stock update:', error);
                    }
                }
            } catch (error) {
                console.error('Error during purchase process:', error);
            }
        }
        else {
            alert("Quantity of the order is more than what is available, Manufacture more Byproducts!")
            navigate('/main/manufacture'); 
        }
axios.get('http://localhost:3001/gettingByproductList').then((response) => {
    setByproductList(response.data);
}).catch(error => {
    console.error('Error fetching Byproducts: ', error);
});
axios.get('http://localhost:3001/gettingByproductTypeList').then((response) => {
    setByproductTypeList(response.data);
}).catch(error => {
    console.error('Error fetching Byproduct Types: ', error);
});
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

toast.success(`Successfully manufactured ${parsedQuantity} units of model ID ${selectedModelID}.`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});
        
    }

    return (
        <>
        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> 
            <div  id="purchases-page-container"className="purchases-container">
                    <h2 className="section-header" id="Purchase-page" onClick={() => setIsExpanded(!isExpanded)}>Add New Order {isExpanded ? '-' : '+'}</h2>
                <div className="new-Purchase">
                    {isExpanded && (
                        <form className='form-container' id='Purchase-page' onSubmit={handleAddPurchase}>
                            <div className='form-container' id='Purchase-page'>
                                <select className='select-name'
                                    value={selectedModelID}
                                    onChange={(e) => setselectedModelID(e.target.value)}
                                >
                                    <option id='Purchase-page' value="">Select Name</option>
                                    {ByproductList.map((type, index) => (
                                        <option key={type.model_id} value={type.model_id}>{type.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    id="Purchase-page"
                                    placeholder="Quantity"
                                    value={ByproductQuantity}
                                    onChange={(e) => setByproductQuantity(e.target.value)}
                                    step="1"
                                />
                                <input
                                    type="date"
                                    placeholder="Purchase Date"
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                />
                            </div>
                            <button class="submit-btn" type="submit">Add Purchase</button>
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
                                            <h2>Customer Order ID #{byProducts.cust_order_id}</h2>
                                            <h3>Bike Model #{byProducts.modelID}</h3>
                                            <p>{byProducts.name}</p>
                                            <p>Type: {byProducts.type}</p>
                                            <h3>Quantity: {byProducts.quantity}</h3>
                                            <h3>Total: ${byProducts.total_price}</h3>
                                            <p>Date ordered: {formatDate(byProducts.date)}</p>
                                            <BlobProvider document={<PurchaseReceipt order={byProducts} />}>
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

            </div>
        </>
    );
}

export default Purchases;