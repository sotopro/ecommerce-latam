import React from "react";
import './styles.css'

const CartItem = ({product, onDeleteItem}) => {
    const { id, image, name, price, stock, quantity} = product || {};
    return (
        <div className="cart-item">
            <img className="cart-image" src={image} alt={name} />
            <div className="cart-item-content">
                <h3 className="cart-item-name">{name}</h3>
                <p className="cart-item-price">$ {price}</p>
                <p className="cart-item-quantity">qty: {quantity}</p>
            </div>
            <div className="cart-item-button-container">
                <button onClick={() => onDeleteItem(id)} className="cart-item-button-delete">x</button>
            </div>
        </div>
    )
}

export default CartItem;