import React, { useState } from "react";
import "./Navbar.css";
import {faBell, faChevronDown, faGear, faRightFromBracket, faUserPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Navbar = () => {
    const [isopenProfileDiv , setOpenProfileDiv]=useState(false);
    const [isopenNavigathion , setOpenNavigathion]=useState(false);

    const openProfileDiv=()=>{
            setOpenProfileDiv(!isopenProfileDiv);
        setOpenNavigathion(false);


    }
    const logout = ()=>{
        window.localStorage.clear();
        window.location.href="/login";
    }
    const  openNavigation=()=>{
        setOpenNavigathion(!isopenNavigathion);
        setOpenProfileDiv(false);
    }

    return (
        <header className="header-nav">
            <div className="nav-rest">
                <FontAwesomeIcon style={{fontSize: "22px",color: "darkgrey"}} onClick={openNavigation} icon={faBell}/>
                <p style={{borderRadius:"4px",fontSize: "12px",color:"red",fontWeight:"bolder"}}>
                    5</p>
            </div>

            <div className="img-holder" onClick={openProfileDiv}>

                <img className="nav-img"
                     src={"https://s3-alpha-sig.figma.com/img/f598/b3f4/1357884f307efb326ba0917b6408d34c?Expires=1713744000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZCYHFj2JsqdSEUvoT4pYOxXY6iEM-vZM6uUc8GZvFxihpYW18VgrjDGlUvi1y5MoZ-obgQyoFI1aRhEgi2dTSWAItcUGck6WXghYt2c~K9w01vHF3HU8Y3jD9ijCHKgdS~y6b2RINlrkCfoHh7E~9zbhaGPrm49lWhsYGNVYdcEwAI1wpEAt~0y7RqfUY0MqF-fZnT6ZoL~lmHjl0vsO9XBoDiRYxDMi7pwr6oWm~llOZ5nRQqnzoA~Ary4hlp8ikgQz5EClH6gqIfczd-4~lbOMF8MhcVsmY3THqAvmFWI6zXZpUyR1m09R~kw2KZfF0rmxubOgsuDA7koKezZfwA__"}/>
                <FontAwesomeIcon style={{fontSize: "12px", marginLeft: "10px", color: "darkblue"}}
                                 icon={faChevronDown}/>
            </div>
            { isopenProfileDiv && <div className="profile-layout">
                <div className="Sidenav-rest">

                    <div className="sideBar-mnue-bottem">
                        <FontAwesomeIcon className="icons" icon={faUserPen}/>
                        <a className="SideBar-Button" href="/editProfile">
                            Edit Profile
                        </a>
                    </div>
                    <div className="sideBar-mnue-bottem">
                        <FontAwesomeIcon className="icons" icon={faGear}/>
                        <a className="SideBar-Button" href="#">
                            My Club
                        </a>
                    </div>
                    <div className="sideBar-mnue-bottem">
                        <FontAwesomeIcon onClick={logout} style={{fontSize: "16px", color: "red"}} icon={faRightFromBracket}/>
                        <button className="SideBar-Button" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>}
            { isopenNavigathion &&
                <div className="profile-layout-Navg">

                    <div className="SidePage-img-holder">

                    </div>
                </div>}
        </header>
    );
};

export default Navbar;