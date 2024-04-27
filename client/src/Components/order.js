import React from 'react';

const Order = ({ order }) => {
  return (
    <div className="order">
      <h2>Order ID: {order.id}</h2>
      <p>Supplier Name: {order.supplierName}</p>
      <p>Component Type: {order.componentType}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Price: ${order.price}</p>
    </div>
  );
};

export default Order;