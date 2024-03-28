import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Axios from 'axios';

import "../css/supplier.css";


// SupplierDetails component to display details of a supplier
const SupplierDetails = ({ supplier, offerings }) => {
    return (
        <div className="supplier-details">
            <h2 className="supplier-name">Supplier: {supplier}</h2>
            <div className="offerings">
                {offerings.map((offering, index) => (
                    <div key={index} className="offering">
                        <p>Offering ID: {offering.offering_id}</p>
                        <p>Price: ${offering.price}</p>
                        <p>Lead Time: {offering.lead_time} days</p>
                        <p>Type: {offering.type}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Suppliers = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [suppliersList, setSuppliersList] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortOrder, setSortOrder] = useState({ sortBy: 'price', order: 'asc' });

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
            return supplier.supplier_name === selectedSupplier && supplier.type === selectedType;
        } else if (selectedSupplier) {
            return supplier.supplier_name === selectedSupplier;
        } else if (selectedType) {
            return supplier.type === selectedType;
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

    return (
        <div className="container" id='supplier-page'>
            <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`main-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="content">
                    <div className="header">
                        <h1>Suppliers List</h1>
                    </div>
                    <div className="filters">
                        <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                            <option value="">Select Supplier</option>
                            {Array.from(new Set(suppliersList.map(supplier => supplier.supplier_name))).map((supplierName, index) => (
                                <option key={index} value={supplierName}>{supplierName}</option>
                            ))}
                        </select>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                            <option value="">Select Type</option>
                            {Array.from(new Set(suppliersList.map(supplier => supplier.type))).map((type, index) => (
                                <option key={index} value={type}>{type}</option>
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
                            <SupplierDetails key={index} supplier={supplierName} offerings={groupedSuppliers[supplierName]} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suppliers;
