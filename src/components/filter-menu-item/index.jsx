import React from "react";
import './styles.css';

const FilterMenuItem = ({ name, id, onFilter }) => {
    return (
        <div className="filter-menu-item">
            <button 
                className="filter-menu-item-button"
                id={id}
                onClick={() => onFilter(id)}
            >
                {name}
            </button>
        </div>
    )
}

export default FilterMenuItem;