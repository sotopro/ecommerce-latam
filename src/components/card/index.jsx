import React from "react";
import './styles.css'

const Card = ({ product }) => {
    const { category, description, image, name, price, stock} = product || {};
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
                <button className="card-button-minus">-</button>
                <input className="card-input" type="number" value="1" />
                <button className="card-button-plus">+</button>
            </div>
            <button className="card-button">Add to cart</button>
        </div>
    )
}

export default Card;