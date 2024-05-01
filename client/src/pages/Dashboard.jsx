import '../css/dashboard.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBox, faTools } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  // Sample data arrays
  const ordersData = [
    { name: 'January', orders: 100, revenue: 5000 },
    { name: 'February', orders: 150, revenue: 7500 },
    { name: 'March', orders: 200, revenue: 10000 },
    { name: 'April', orders: 180, revenue: 9000 },
    { name: 'May', orders: 220, revenue: 11000 },
    { name: 'June', orders: 180, revenue: 9000 },
    { name: 'July', orders: 150, revenue: 7500 },
    // Add more data as needed
  ];

  const inventoryData = [
    { unit: 'Unit A', Handlebars: 20, Frames: 50, Saddles: 30, Chains: 0, Wheels: 0, Pedals: 0, Forks: 0, Brakes: 0, Tires: 0, 'Mountain Bike': 0, BMX: 0, 'Hybrid Bike': 0, 'Road Bike': 0 },
    { unit: 'Unit B', Handlebars: 0, Frames: 0, Saddles: 0, Chains: 40, Wheels: 70, Pedals: 50, Forks: 0, Brakes: 0, Tires: 0, 'Mountain Bike': 0, BMX: 0, 'Hybrid Bike': 0, 'Road Bike': 0 },
    { unit: 'Unit C', Handlebars: 0, Frames: 0, Saddles: 0, Chains: 0, Wheels: 0, Pedals: 0, Forks: 30, Brakes: 40, Tires: 60, 'Mountain Bike': 0, BMX: 0, 'Hybrid Bike': 0, 'Road Bike': 0 },
    { unit: 'Unit D', Handlebars: 0, Frames: 0, Saddles: 0, Chains: 0, Wheels: 0, Pedals: 0, Forks: 0, Brakes: 0, Tires: 0, 'Mountain Bike': 100, BMX: 100, 'Hybrid Bike': 100, 'Road Bike': 100 },
    // Add more data as needed
  ];
  
  const productionData = [
    { name: 'January', output: 50, defects: 5 },
    { name: 'February', output: 70, defects: 7 },
    { name: 'March', output: 90, defects: 9 },
    // Add more data as needed
  ];

  const suppliersData = [
    { supplier: 'A', orders: 80, deliveryTime: 4, qualityRating: 8 },
    { supplier: 'B', orders: 120, deliveryTime: 3, qualityRating: 7 },
    { supplier: 'C', orders: 150, deliveryTime: 5, qualityRating: 6 },
    // Add more data as needed
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#e34c26', '#ff7f0e', '#2ca02c', '#9467bd', '#8c564b', '#1f77b4', '#ff00ff', '#ff99ff', '#33cc33', '#ff3300'];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Bike Factory Supply Chain Management Dashboard</h1>
        <div className="buttons">
          <button className="button orders" onClick={() => scrollToSection('orders-section')}>Orders</button>
          <button className="button inventory" onClick={() => scrollToSection('inventory-section')}>Inventory</button>
          <button className="button production" onClick={() => scrollToSection('production-section')}>Production</button>
          <button className="button suppliers" onClick={() => scrollToSection('suppliers-section')}>Suppliers</button>
        </div>
      </div>
      <div className="graphs">
        {/* Orders Section */}
        <div className="chart-container" id="orders-section">
          <div className="chart">
            <h2>Orders Overview</h2>
            <BarChart width={800} height={400} data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#ffd166" />
              <Bar dataKey="revenue" fill="#06d6a0" />
            </BarChart>
          </div>
          <div className="stat-box-container">
            <div className="stat-box orders" onClick={() => scrollToSection('orders-section')} style={{ backgroundColor: '#ffd166' }}>
              <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p>450</p>
              </div>
            </div>
            <div className="stat-box revenue" onClick={() => scrollToSection('orders-section')} style={{ backgroundColor: '#06d6a0' }}>
              <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p>$50,000</p>
              </div>
            </div>
          </div>
        </div>
        {/* Inventory Section */}
        <div className="chart-container" id="inventory-section">
          <div className="chart">
            <h2>Inventory Breakdown</h2>
            <BarChart width={800} height={400} data={inventoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="unit" type="category" />
              <Tooltip />
              <Legend />
              {Object.keys(inventoryData[0]).map((key, index) => (
                key !== 'unit' &&
                <Bar key={key} dataKey={key} stackId="a" fill={colors[index]} />
              ))}
            </BarChart>
          </div>
          <div className="stat-box-container">
            {inventoryData.map((item, index) => (
              <div className="stat-box inventory" key={index} onClick={() => scrollToSection('inventory-section')} style={{ backgroundColor: colors[index] }}>
                <FontAwesomeIcon icon={faBox} className="stat-icon" />
                <div className="stat-content">
                  <h3>{item.unit} </h3>
                  <p>{Object.values(item).reduce((total, val) => typeof val === 'number' ? total + val : total, 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Production Section */}
        <div className="chart-container" id="production-section">
          <div className="chart">
            <h2>Production Output</h2>
            <LineChart width={800} height={400} data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="output" stroke="#118ab2" />
              <Line type="monotone" dataKey="defects" stroke="#ef476f" />
            </LineChart>
          </div>
          <div className="stat-box-container">
            <div className="stat-box production" onClick={() => scrollToSection('production-section')}>
              <FontAwesomeIcon icon={faTools} className="stat-icon" />
              <div className="stat-content">
                <h3>Production Output</h3>
                <p>210</p>
              </div>
            </div>
          </div>
        </div>
        {/* Suppliers Section */}
        <div className="chart-container" id="suppliers-section">
          <div className="chart">
            <h2>Supplier Orders</h2>
            <BarChart width={800} height={400} data={suppliersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#ef476f" name="Orders" />
              <Bar dataKey="deliveryTime" fill="#8884d8" name="Avg. Delivery Time (Days)" />
              <Bar dataKey="qualityRating" fill="#82ca9d" name="Quality Rating" />
            </BarChart>
          </div>
          <div className="stat-box-container">
            {suppliersData.map((supplier, index) => (
              <div className="stat-box suppliers" key={index} onClick={() => scrollToSection('suppliers-section')}>
                <FontAwesomeIcon icon={faShoppingCart} className="stat-icon" />
                <div className="stat-content">
                  <h3>Supplier {supplier.supplier}</h3>
                  <p>Orders: {supplier.orders}</p>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
