import React from "react";
import './styles.css'

const FilterMenu = ({ name, id}) => {
    return (
        <div className="filter-menu">
            <button className="filter-menu-button" id={id}>{name}</button>
        </div>
    )
};

export default FilterMenu;