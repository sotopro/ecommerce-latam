import React from "react";
import './styles.css'

const Card = ({ product, addToCart, decreaseQuantity, increaseQuantity, numberOfItem, onChangeInput }) => {
    const { id, category, description, image, name, price, stock} = product || {};
    return (
        <div className="card">
            <img className="cart-image" src={image} alt={name} />
            <div className="card-content">
                <h3 className="card-name">{name}</h3>
                <p className="card-category">{category}</p>
                <p className="card-description">{description}</p>
                <p className="card-price">${price}</p>
                <p className="card-stock">{stock} in stock</p>
            </div>
            <div className="card-button-container">
                <button disabled={numberOfItem === 0} className="card-button-minus" onClick={() => decreaseQuantity(id)}>-</button>
                <input
                    className="card-input"
                    type="text"
                    disabled
                    value={numberOfItem}
                    onChange={(e) => onChangeInput(e,id)}
                    />
                <button disabled={numberOfItem == stock} className="card-button-plus" onClick={() => increaseQuantity(id)}>+</button>
            </div>
        </div>
    )
}

export default Card;