import React from "react";
import './styles.css'

const Sidebar = ({children, isOpenCart, onHandlerCart }) => {
    return (
        <div 
            className="sidebar-container"
            style={{
                transform: isOpenCart ? 'translateX(0)': 'translateX(100%)'
                
            }}
        >
            <div className="close-button-container">
                <button className="close-button" onClick={onHandlerCart}>X</button>
            </div>
            {children}
        </div>
    )
}

export default Sidebar;