import React from "react";
import './styles.css'

const Header = ({ numbersOfItems = 0 }) => {
    return (
        <div className="header-menu">
            <div className="header-menu-logo" />
            <div className="header-menu-cart">
                <img className="header-menu-cart-image" src="https://cdn-icons-png.flaticon.com/512/834/834781.png" alt="cart" />
                <div className="header-menu-cart-number-container">
                    <span className="header-menu-cart-number">{numbersOfItems}</span>
                </div>
            </div>
        </div>

    )
};

export default Header;