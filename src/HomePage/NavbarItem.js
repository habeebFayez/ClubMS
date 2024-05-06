import React from 'react';

const NavbarItem = ({ icon, text ,value}) => {
    return (
        <li className="navbar__item">
            <a href="#" className="navbar__link">
                <i data-feather={icon}></i> <span>{text}</span>
            </a>
        </li>
    );
};

export default NavbarItem;
