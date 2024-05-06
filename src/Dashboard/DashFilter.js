import React, {useEffect, useRef, useState} from 'react';
import Select from "react-select";
import {useNavigate} from "react-router-dom";
import {useLocalState} from "../util/useLocalState";

const DashFilter = ({user,club,isActive,isModalOpenForCreatEvent,isClubPage,allClubsCategories,allEventsCategories ,allClubs,isSearchvis,categories ,events,title}) => {
    const navigate=useNavigate();
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [hovered, setHovered] = useState(false);
    const inputRef = useRef();
    const [searchByClub, setSearchByClub] = useState([]);
    const [searchByEvent, setSearchByEvent] = useState([]);
    const [searchByDate, setSearchByDate] = useState([]);
    const [searchByCategory, setSearchByCategory] = useState([]);
    const [searchByAll, setSearchByAll] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filterResults, setFilterResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoriesForValue, setCategoriesForValue] = useState([]);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        switch (filter) {
            case 'all' : setFilterResults(events,allClubs)
                break;
            case 'club'  : setFilterResults()
                break;
            case 'event' : setFilterResults()
                break;

        }
        console.log(filterResults)
        setInputValue('');
        setSelectedCategories([]);
        console.table(filterResults)
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setInputValue('');
        setSelectedCategories([]);
        setShowDropdown(!showDropdown);
    };
    const closeDropdown = () => {
        setInputValue('');
        if(showDropdown)

            setShowDropdown(false);
    };

    useEffect(() => {
        if(categories) {
            const updatedCategories = categories.map(category => ({
                label: category.categoryName,
                value: category.categoryName,
                categoryID: category.categoryID
            }));
            setCategoriesForValue(updatedCategories);
        }
    }, [categories]);

    return (
        <div>
            <div>
                <div id="myDropdown" className={`dropdown-content-dashboard ${showFiltering ? 'show' : ''}`}>
                    <button
                        className={activeFilter === 'all' ? "focused-show-dropdown-BTN" : "show-dropdown-BTN"}
                        onClick={() => handleFilterClick('all')}>
                        No Filter
                    </button>
                    <button
                        className={activeFilter === 'club' ? "focused-show-dropdown-BTN" : "show-dropdown-BTN"}
                        onClick={() => handleFilterClick('club')}>
                        Club Name
                    </button>
                    <button
                        className={activeFilter === 'event' ? "focused-show-dropdown-BTN" : "show-dropdown-BTN"}
                        onClick={() => handleFilterClick('event')}>
                        Event Name
                    </button>
                    <button
                        className={activeFilter === 'date' ? "focused-show-dropdown-BTN" : "show-dropdown-BTN"}
                        onClick={() => handleFilterClick('date')}>
                        Event Start Date
                    </button>
                    <button
                        className={activeFilter === 'category' ? "focused-show-dropdown-BTN" : "show-dropdown-BTN"}
                        onClick={() => handleFilterClick('category')}>
                        Category
                    </button>
                </div>
            </div>
            {activeFilter === 'all' && <input
                type="text"
                autoComplete="off"
                placeholder={" Search for Clubs, Events, Categories..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                required
            />}
            {activeFilter === 'club' && <input
                type="text"
                autoComplete="off"
                placeholder={" Search By Clubs Name"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toLowerCase())}

            />}
            {activeFilter === 'event' && <input
                type="text"
                autoComplete="off"
                placeholder={" Search By Event Name"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            />}
            {activeFilter === 'category' &&
                <Select
                    isMulti
                    name="categories"
                    value={selectedCategories}
                    options={selectedCategories.length < 1 ? categoriesForValue : []}
                    className="basic-multi-select-search"
                    placeholder={"Search By Category"}
                    classNamePrefix="select"
                    onChange={(selectedOptions) => setSelectedCategories(selectedOptions)}
                />}

            {activeFilter === 'date' && <input
                type="date"
                ref={inputRef}
                placeholder="Club Name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />}
            {inputValue && activeFilter === 'club' && (
                <div className={isClubPage ? "search-results-content-club-page" : "search-results-content"}>
                    {allClubs.filter(input => {
                        const name = input.clubName.toLowerCase();
                        return name.startsWith(inputValue) || name.includes(inputValue);
                    }).map(result => result.clubisActivation &&
                        <div className="SidePage-img-holder"
                             onClick={() => navigate(`/clubprofile`, {state: {club: result}})}>
                            <img className="SidePage-img" src={result.clubProfilePicURL ? result.clubProfilePicURL : ""}
                                 alt={result.clubName}/>
                            <div>
                                <h5>{result.clubName ? result.clubName.slice(0, 29).toUpperCase() : ""}</h5>
                                <p style={{fontSize: 11}}> Creating Date: {result.creatingDate}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}


            {inputValue && activeFilter === 'all' && (
                <div
                    className={isClubPage ? "search-results-content-club-page-inhalf" : "search-results-content-inhalf"}>

                    <div className="searchall-inhalf">
                        <h3>Clubs</h3>
                        {allClubs.filter(input => {
                            const name = input.clubName.toLowerCase();
                            return name.startsWith(inputValue) || name.includes(inputValue);
                        }).map(result => result.clubisActivation &&
                            <div className="SidePage-img-holder"
                                 onClick={() => navigate(`/clubprofile`, {state: {club: result}})}>
                                <img className="SidePage-img"
                                     src={result.clubProfilePicURL ? result.clubProfilePicURL : ""}
                                     alt={result.clubName}/>
                                <div>
                                    <h5>{result.clubName ? result.clubName.slice(0, 29).toUpperCase() : ""}</h5>
                                    <p style={{fontSize: 11}}> Creating Date: {result.creatingDate}</p>
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="searchall-inhalf">
                        <h3>Events</h3>
                        {events.filter(input => {
                                const name = input.eventName.toLowerCase();
                                return name.startsWith(inputValue) || name.includes(inputValue);
                            }
                        ).map(result => result.eventStates &&
                            <div className="SidePage-img-holder"
                                 onClick={() => navigate("/event", {state: {from: result}})}>
                                <img className="SidePage-img"
                                     src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                                <div>
                                    <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                    <p style={{fontSize: 11}}> Date: {result.eventStartingDate} Time
                                        : {result.eventNote}</p>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            )}

            {inputValue && activeFilter === 'event' &&
                <div className={isClubPage ? "search-results-content-club-page" : "search-results-content"}>
                    {events.filter(input => {
                            const name = input.eventName.toLowerCase();
                            return name.startsWith(inputValue) || name.includes(inputValue);
                        }
                    ).map(result => result.eventStates &&
                        <div className="SidePage-img-holder"
                             onClick={() => navigate("/event", {state: {from: result}})}>
                            <img className="SidePage-img"
                                 src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                            <div>
                                <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                <p style={{fontSize: 11}}> Date: {result.eventStartingDate} Time
                                    : {result.eventNote}</p>
                            </div>

                        </div>
                    )}


                </div>}


            {inputValue && activeFilter === 'date' &&
                <div className={isClubPage ? "search-results-content-club-page" : "search-results-content"}>
                    {events.filter(input => {
                            const date = input.eventStartingDate;
                            return date.includes(inputValue);
                        }
                    ).map(result => result.eventStates &&
                        <div className="SidePage-img-holder"
                             onClick={() => navigate("/event", {state: {from: result}})}>
                            <img className="SidePage-img"
                                 src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                            <div>
                                <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                <p style={{fontSize: 11}}> Date: {result.eventStartingDate} Time
                                    : {result.eventNote}</p>
                            </div>

                        </div>
                    )}


                </div>}


            {selectedCategories.length > 0 && activeFilter === 'category' && (
                <div
                    className={isClubPage ? "search-results-content-club-page-inhalf" : "search-results-content-inhalf"}>

                    <div className="searchall-inhalf">
                        <h3>Clubs</h3>
                        {allClubs.filter(club => {

                            const hasCategory = allClubsCategories.some(clubCategory =>
                                clubCategory.category.categoryID ===
                                (selectedCategories.length > 0 && selectedCategories[0].categoryID)
                                && clubCategory.club.clubID === club.clubID);

                            return hasCategory;
                        }).map(result => result.clubisActivation &&
                            <div className="SidePage-img-holder"
                                 onClick={() => navigate(`/clubprofile`, {state: {club: result}})}>
                                <img className="SidePage-img"
                                     src={result.clubProfilePicURL ? result.clubProfilePicURL : ""}/>
                                <div>
                                    <h5>{result.clubName ? result.clubName.slice(0, 29).toUpperCase() : ""}</h5>
                                    <p style={{fontSize: 11}}> Date: {result.creatingDate} </p>
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="searchall-inhalf">
                        <h3>Events</h3>
                        {events.filter(event => {

                            const hasCategory = allEventsCategories.some(eventCategory =>
                                eventCategory.category.categoryID ===
                                (selectedCategories.length > 0 && selectedCategories[0].categoryID)
                                && eventCategory.event.eventID === event.eventID);

                            return hasCategory;
                        }).map(result => result.eventStates &&
                            <div className="SidePage-img-holder"
                                 onClick={() => navigate("/event", {state: {from: result}})}>
                                <img className="SidePage-img"
                                     src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                                <div>
                                    <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                    <p style={{fontSize: 11}}> Date: {result.eventStartingDate} Time
                                        : {result.eventNote}</p>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    )
        ;
};

export default DashFilter;