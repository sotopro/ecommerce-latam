import React from "react";
import './styles.css'

const FilterMenu = ({ name, id, onFilter}) => {
    return (
        <div className="filter-menu">
            <button onClick={() => onFilter(id)} className="filter-menu-button" id={id}>{name}</button>
        </div>
    )
};

export default FilterMenu;