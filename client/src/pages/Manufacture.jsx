import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Manufacture.css';

const collapseStyle = {
    maxHeight: '0px',
    overflow: 'hidden',
    transition: 'max-height 0.5s ease-in-out',
};

const expandStyle = {
    maxHeight: '500px',
    overflow: 'hidden',
    transition: 'max-height 0.5s ease-in-out',
};


function Manufacture() {
    const navigate = useNavigate();
    const [ByproductQuantity, setByproductQuantity] = useState([]);
    const [selectedName, setselectedName] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); 
    const [ByproductList, setByproductList] = useState([]);
    useEffect(() => {
        console.log("Manufacture component mounted");
    }, []);
    useEffect(() => {
        axios.get('http://localhost:3001/gettingByproductList').then((response) => {
            setByproductList(response.data);
        }).catch(error => {
            console.error('Error fetching Byproducts: ', error);
        });
    }, []);
const handleManufacture = (event) => {
    event.preventDefault();

        axios.post('http://localhost:3001/newPurchase', {
    })
              .then(response => {
                  console.log("added Purch")
                })
                .catch(error => {
                  console.error('Error adding purch :', error);
                });}
                
    return (
        <>
        <div className="new-bike">
        <button className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
            {console.log(isExpanded)}
        Manufacture New Bike {/*isExpanded ? '-':'+'*/}
        </button>
        {isExpanded && (
      <form className='form-container' id='Manufacture-page' onSubmit={handleManufacture}>
        {/*<div className='form-container' id='Manufacture-page'>
      
        <input
        type="number"
        id="Manufacture-page"
        placeholder="Quantity"
        value={ByproductQuantity}
        onChange={(e) => setByproductQuantity(e.target.value)}
        step="1"
        />

        <select className='select-name'
        value={selectedName}
        onChange={(e) => setselectedName(e.target.value)}
        >
        <option id='Manufacture-page' value="">Select Name</option>
        {ByproductList.map((type, index) => (
          <option key={index} value={type}>{type}</option>
          ))}
      </select>
            
      </div>*/}
      <button type="submit">Manufacture Bike</button>
      </form>

      )}
    </div>
        </>
    );
}
export default Manufacture;