import React from "react";

const CartItem = ({ item }) => {
    const id = item.partID;
  return (
    <div>
      <p>Supplier: {item.name}</p>
      <p>Part: {item.}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${item.price}</p>
    </div>
  );
}

export default CartItem;