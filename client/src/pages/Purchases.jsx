import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer';
import PurchaseReceipt from '../Components/PurchaseReceipt';
import '../css/Purchases.css';

function Purchases() {
    const navigate = useNavigate();
    const [byProducts, setbyProducts] = useState([]);
    const [byProductName, setbyProductName] = useState([]);
    const [ByproductQuantity, setByproductQuantity] = useState([]);


    const [isExpanded, setIsExpanded] = useState(false); // State to track whether section is expanded

    const [selectedName, setselectedName] = useState([]);


    const [ByproductList, setByproductList] = useState([]);
    const [selectedType, setselectedType] = useState([]);
    const [purchaseDate, setPurchaseDate] = useState('');

    const [sortKey, setSortKey] = useState('cust_order_id'); // Default sorting key

    const [custOrderId, setcustOrderId] = useState(null); //when we add purchases the new customer order id is stored here
    const [ModelID, setModelID] = useState(null);

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



/////////////////////////purch:
    const handleAddPurchase = async (event) => {
        event.preventDefault();
               
        const parsedQuantity = parseInt(ByproductQuantity, 10);

        const availableQuantityCheck = await axios.get(`http://localhost:3001/availableQuantityCheck`, {params: { byProductName: selectedName }})
        let quantityy = null;
        if (availableQuantityCheck.data.quantity) {
            quantityy = availableQuantityCheck.data.quantity;
            
        }
        if(quantityy>parsedQuantity){
        try {

//get model id by name
        const model__ID = await axios.get(`http://localhost:3001/getModelIdByName`, { params: { name: selectedName } })
        const modelIDD = model__ID.data.modelId;
        
//update customer order table with values
        const newPurchase = await axios.post('http://localhost:3001/newPurchase', {
            byProductName: selectedName,
            ByproductQuantity: parsedQuantity,
            purchaseDate: purchaseDate
        })

        const custOrderIdd = newPurchase.data.custOrderId;

           /* .then(response => {
                console.log("added Purch")
                setcustOrderId(response.data.custOrderId) //not updating fast enough
                
            })
            .catch(error => {
                console.error('Error adding purch :', error);
            });*/

//reduce quantity of the model
        await axios.post('http://localhost:3001/update_model', {byProductName: selectedName , ByproductQuantity: parsedQuantity})
    .then(response => {
        console.log("model quantity reduced")
    })
    .catch(error => {
        console.error('Error reducing model quantity :', error);
    });
    
//reduce stock from byproduct storage
let quantityLeft = parsedQuantity;
console.log("reached!!!!!!!!!!")

await recursiveUpdateByProductStorage(quantityLeft);  // Call the recursive function here
async function recursiveUpdateByProductStorage(quantityLeft) {
    
    try {console.log("reached????????")
        // Base case: if the quantity left to process is 0, stop recursion
        if (quantityLeft <= 0) {
            console.log("Recursion complete, no quantity left to process.");
            return;
        }
        const storage_stock = await axios.get(`http://localhost:3001/get_byproduct_stock`, { params: { modelID: modelIDD } })
        const stock = storage_stock.data.stock;
        console.log(stock)
        console.log("stockkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        const currentQuantity = Math.min(quantityLeft, stock);
       
        const highest_stock_unit_ID = await axios.get('http://localhost:3001/highest_stock_unit_ID', { params: { modelID: modelIDD } })

        console.log(highest_stock_unit_ID.data.unit_id)
        console.log("unitttt iddddddddddddddddd")

        if (highest_stock_unit_ID.data.unit_id) {
            const unit_id = highest_stock_unit_ID.data.unit_id;
        console.log(highest_stock_unit_ID)
        console.log("uppppppppppppppppppp")

        const update_byproduct_storage = await axios.post('http://localhost:3001/update_byproduct_storage', {
            unitId :unit_id,
            ByproductQuantity: currentQuantity
            
        })
            .then(response => {
                console.log("byproduct_storage stock reduced")
            })
            .catch(error => {
                console.error('Error adding purch :', error);
            });

            console.log("Stock updated successfully.");

        }
        else {
            console.log("No unit found for given model_id.");
        }
        
        await recursiveUpdateByProductStorage(quantityLeft - currentQuantity);

    }catch (error) {
        console.error('Error during recursive byproduct stock update:', error);
    }
}


//update byproduct and set items to be sold and belonging to a customer order
console.log("ModelIDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
console.log(modelIDD)
console.log(ModelID) // the state takes one more render to update!

        await axios.post('http://localhost:3001/update_produced_byproduct', { 
        ModelID:modelIDD, //use local variable instead
        custOrderId : custOrderIdd,
        ByproductQuantity: parsedQuantity

        })
            .then(response => {
                console.log("added Purch")
            })
            .catch(error => {
                console.error('Error adding purch :', error);
            });

    } catch(error){
        console.error('Error during purchase process:', error);
    }


}
else{
    console.log("Quantity of the order is more than what is available, Manufacture more Byproducts!")
}
}
    return (
        <>
            <div className="purchases-container">

                <div className="new-Purchase">
                    <h2 className="section-header" id="Purchase-page" onClick={() => setIsExpanded(!isExpanded)}>Add New Order {isExpanded ? '-' : '+'}</h2>
                    {isExpanded && ( // Render the form only if the section is expanded
                        <form className='form-container' id='Purchase-page' onSubmit={handleAddPurchase}>
                            <div className='form-container' id='Purchase-page'>

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