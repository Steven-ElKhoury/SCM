import React from 'react';
import './CheckoutProduct.css';
import { useStateValue } from './StateProvider';

function CheckoutProduct({id, type, dimensions, image, description, hideButton}) {
    const [{basket}, dispatch] = useStateValue();

    const removeFromBasket = () => {
        // Remove the item from the basket
        dispatch({
            type: 'REMOVE_FROM_BASKET',
            id: id,
        });
    };

    return (
        <div className='checkoutProduct'>
            <div className='checkoutProduct__imageContainer'>
                <img className='checkoutProduct__image' src={image} alt={type} />
            </div>
            <div className='checkoutProduct__info'>
                <p className='checkoutProduct__title'>Type: {type}</p>
                <p className='checkoutProduct__dimensions'>Dimensions: {dimensions}</p>
                {description && <p className='checkoutProduct__description'>Description: {description}</p>}
                {!hideButton && (
                    <button onClick={removeFromBasket}>Remove from Basket</button>
                )}
            </div>
        </div>
    );
}

export default CheckoutProduct;