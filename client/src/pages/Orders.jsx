import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../css/orders.css'; // Import the CSS file
import { PDFDownloadLink } from '@react-pdf/renderer';

import { PDFViewer } from '@react-pdf/renderer';
import { BlobProvider } from '@react-pdf/renderer';
import PurchaseReceipt from '../Components/PurchaseReceipt';
import OrderReceipt from '../Components/OrderReceipt';
const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDate, setSearchDate] = useState('');
    const [searchPrice, setSearchPrice] = useState('');
    const [searchLeadTime, setSearchLeadTime] = useState('');
    const [searchSupplier, setSearchSupplier] = useState('');
    const [searchComponent, setSearchComponent] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [sortDirection, setSortDirection] = useState('asc'); // Default sorting direction
    const [suppliers, setSuppliers] = useState([]);
    const [components, setComponents] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);


    // Define predefined ranges for date, price, and lead time
    const dateRanges = ['Last 7 years', 'Last 10 years', 'Last 20 years'];
    const priceRanges = ['Less than $50', '$50 - $100', 'More than $100'];
    const leadTimeRanges = ['Less than 5 days', '5 - 10 days', 'More than 10 days'];

    const handleViewReceipt = (order) => {
        setSelectedOrder(order);
    };
    

    useEffect(() => {
        axios.get('http://localhost:3001/getOrders')
            .then(response => {
                const formattedOrders = response.data.map(order => ({
                    ...order,
                    date_ordered: formatDate(order.date_ordered),
                    date_arrived: formatDate(order.date_arrived)
                }));
                setOrders(formattedOrders);
                setLoading(false);
                // Extract suppliers and components from orders
                const uniqueSuppliers = [...new Set(formattedOrders.map(order => order.supplier_name))];
                setSuppliers(uniqueSuppliers);
                const uniqueComponents = [...new Set(formattedOrders.map(order => order.component_type_name))];
                setComponents(uniqueComponents);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
    }, []);

    const handleSortChange = (option) => {
        if (option === sortOption) {
            // If the same option is clicked again, toggle the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOption(option);
            setSortDirection('asc'); // Default to ascending order when a new option is selected
        }
    };

    const applyFilters = (order) => {
        return (
            (!searchDate || checkDateRange(order.date_ordered, searchDate)) &&
            (!searchPrice || checkPriceRange(order.price, searchPrice)) &&
            (!searchLeadTime || checkLeadTimeRange(order.lead_time, searchLeadTime)) &&
            (!searchSupplier || order.supplier_name === searchSupplier) &&
            (!searchComponent || order.component_type_name === searchComponent)
        );
    };

    const checkDateRange = (date, range) => {
        const currentDate = new Date();
        switch (range) {
            case 'Last 7 years':
                return new Date(date) > new Date(currentDate.getFullYear() - 7, currentDate.getMonth(), currentDate.getDate());
            case 'Last 10 years':
                return new Date(date) > new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDate());
            case 'Last 20 years':
                return new Date(date) > new Date(currentDate.getFullYear() - 20, currentDate.getMonth(), currentDate.getDate());
            default:
                return false;
        }
    };

    const checkPriceRange = (price, range) => {
        switch (range) {
            case 'Less than $50':
                return price < 50;
            case '$50 - $100':
                return price >= 50 && price <= 100;
            case 'More than $100':
                return price > 100;
            default:
                return false;
        }
    };

    const checkLeadTimeRange = (leadTime, range) => {
        switch (range) {
            case 'Less than 5 days':
                return leadTime < 5;
            case '5 - 10 days':
                return leadTime >= 5 && leadTime <= 10;
            case 'More than 10 days':
                return leadTime > 10;
            default:
                return false;
        }
    };

    const sortedOrders = [...orders].filter(applyFilters).sort((a, b) => {
        if (sortOption === 'date') {
            return sortDirection === 'asc' ? new Date(a.date_ordered) - new Date(b.date_ordered) : new Date(b.date_ordered) - new Date(a.date_ordered);
        } else if (sortOption === 'price') {
            return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (sortOption === 'leadTime') {
            return sortDirection === 'asc' ? a.lead_time - b.lead_time : b.lead_time - a.lead_time;
        } else {
            return 0;
        }
    });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US');
    };

    return (
        <div className="orders-container">
            <button className='create-order' onClick={() => navigate('/main/createOrder')}>Create Order</button>
            <button 
                className='order-button view-orders' 
                onClick={() => navigate('/main/viewOrders')}
                style={{  }}
            >
                View Orders
            </button>
            <h1 className="orders-title">Previous Orders</h1>
            <div className="search-container">
                {/* Sorting dropdown */}
                <div className="sort-dropdown">
                    <select className="search-select" value={sortOption} onChange={(e) => handleSortChange(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="date">Date</option>
                        <option value="price">Price</option>
                        <option value="leadTime">Lead Time</option>
                    </select>
                    {sortOption && (
                        <div className="sort-icon-container" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
                            <FontAwesomeIcon icon={sortDirection === 'asc' ? faArrowUp : faArrowDown} className="sort-icon" />
                        </div>
                    )}
                </div>
                {/* Dropdowns for filtering */}
                <select className="search-select" value={searchDate} onChange={(e) => setSearchDate(e.target.value)}>
                    <option value="">Select Date Range</option>
                    {dateRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                    ))}
                </select>
                <select className="search-select" value={searchPrice} onChange={(e) => setSearchPrice(e.target.value)}>
                    <option value="">Select Price Range</option>
                    {priceRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                    ))}
                </select>
                <select className="search-select" value={searchLeadTime} onChange={(e) => setSearchLeadTime(e.target.value)}>
                    <option value="">Select Lead Time Range</option>
                    {leadTimeRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                    ))}
                </select>
                <select className="search-select" value={searchSupplier} onChange={(e) => setSearchSupplier(e.target.value)}>
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplierName => (
                        <option key={supplierName} value={supplierName}>{supplierName}</option>
                    ))}
                </select>
                <select className="search-select" value={searchComponent} onChange={(e) => setSearchComponent(e.target.value)}>
                    <option value="">Select Component Type</option>
                    {components.map(componentType => (
                        <option key={componentType} value={componentType}>{componentType}</option>
                    ))}
                </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="orders-list">
                    {sortedOrders.map(order => (
                        <li key={order.component_order_id} className="order-item">
                            <div className="order-details">
                                <FontAwesomeIcon icon={faBicycle} className="order-icon" />
                                <div className="order-info">
                                    <h2>Order ID: {order.component_order_id}</h2>
                                    <p>Supplier Name: {order.supplier_name}</p>
                                    <p>Component Type: {order.component_type_name}</p>
                                    <p>Quantity: {order.quantity}</p>
                                    <p>Price: ${order.price}</p>
                                    <p>Date Ordered: {order.date_ordered ? new Date(Date.parse(order.date_ordered)).toLocaleDateString() : 'Not available'}</p>
                                    <p>Date Arrived: {order.date_arrived ? new Date(Date.parse(order.date_arrived)).toLocaleDateString() : 'Not available'}</p>
                                    <p>Lead Time: {order.lead_time} days</p>
                                </div>
                            </div>
                                {/* <BlobProvider document={<OrderReceipt order={order} />}>
                                    {({ blob, url, loading, error }) => {
                                        if (loading) {
                                            return <div>Loading...</div>;
                                        } else if (error) {
                                            return <div>An error occurred while generating the PDF.</div>;
                                        } else {
                                            return <a href={url} target="_blank" rel="noopener noreferrer">View receipt</a>;
                                        }
                                    }}
                                </BlobProvider> */}

                          <BlobProvider document={<OrderReceipt order={order} />}>
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;