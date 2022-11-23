import React from "react";
import './styles.css';

const CartItem = ({item, onRemoveItem}) => {
    const {id, image, name, price, quantity} = item || {};
    return (
        <div className="cart-item">
            <img className="cart-item-image" src={image} alt={name} />
            <div className="cart-item-details">
                <h3 className="cart-item-name">{name}</h3>
                <p className="cart-item-price">$ {price}</p>
                <p className="cart-item-quantity">qty: {quantity}</p>
            </div>
            <div className="cart-item-actions">
                <button className="cart-item-actions-remove" onClick={() => onRemoveItem(id)}>X</button>
            </div>
        </div>
    )
}

export default CartItem;