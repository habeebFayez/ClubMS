import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./CategoryDropdown.css";

const CategoryDropdown = ({ categories, selectedCategories, onSelectCategory, onDeselectCategory }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleCategoryClick = (category) => {
        if (selectedCategories.includes(category)) {
            onDeselectCategory(category);
        } else {
            onSelectCategory(category);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    return (
        <div className="category-dropdown">
            <div className="input-field-creat-event-dropdown">
                <FontAwesomeIcon className="icon" icon={faUser}/>
                <div className="selected-categories">
                    {selectedCategories.map(category => (
                        <button key={category} className="tag-event" onClick={() => onDeselectCategory(category)}>
                            {category}
                            <FontAwesomeIcon className="icon" icon={faTimes}/>
                        </button>
                    ))}
                </div>
                <input
                    className={"Search-categories"}
                    type="text"
                    placeholder="Search categories"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setShowDropdown(false)}
                />
            </div>
            {showDropdown && (
                <div className="category-dropdown-list">
                    {filteredCategories.map(category => (
                        // make div to hold button to give full wiedth S WHITE LIST>>>##########################################################################
                        <button key={category} className="category-item" onClick={() => handleCategoryClick(category)}>
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
