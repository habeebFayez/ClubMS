import React, {useEffect, useState} from "react";
import "./SidePage.css";
import {
    faAt, faCalendar, faGear,
    faRightFromBracket,
    faStar,
    faUserGroup, faUserPen
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {forEach} from "react-bootstrap/ElementChildren";
import SpiningLoading from "../../Component/loading/SpiningLoading";
import {NavLink} from "react-bootstrap";


const SidePage = ({events , user,isActive,club ,allClubs ,isLoadingEvents}) => {
    const navigate=useNavigate();
    const [clubSortedEvents, setClubSortedEvents] = useState([]);
    const [clubSorted, setClubSorted] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const today = new Date();
    const todayDate =today.toISOString().split('T')[0]
    useEffect(() => {
        setIsLoading(true);
        events&&
        (club&&club.clubisActivation?
                (setClubSortedEvents( events.filter(filteredCLub =>
                    (filteredCLub.club.clubID === club.clubID)
                      &&filteredCLub.eventStates&&filteredCLub.eventStartingDate>=todayDate).sort((a, b) => {
                    const dateA = new Date(a.eventStartingDate);
                    const dateB = new Date(b.eventStartingDate);
                    return dateA - dateB;
                }).filter(event => {
                    const eventStartDate = new Date(event.eventStartingDate).toISOString().split('T')[0];
                    return event.eventStates&&(eventStartDate >= todayDate );
                }).slice(0,5)))
        :
            ( setClubSortedEvents( events.filter(filteredCLub =>
                filteredCLub.eventStates&&filteredCLub.eventStartingDate>=todayDate).sort((a, b) => {
            const dateA = new Date(a.eventStartingDate);
            const dateB = new Date(b.eventStartingDate);
            return dateA - dateB;
        }).filter(event => {
                const eventStartDate = new Date(event.eventStartingDate).toISOString().split('T')[0];
                return event.eventStates&&(eventStartDate >= todayDate );
            }).slice(0,5)))
        )

        setIsLoading(false);
    }, [events]);
    useEffect(() => {
        setIsLoading(true);

       allClubs&& //clubs must be exist
       setClubSorted( allClubs.filter(club => club.clubisActivation).sort((a, b) => {
                    const dateA = new Date(a.creatingDate);
                    const dateB = new Date(b.creatingDate);
                    return( dateB - dateA);
                }).slice(0,4));
        setIsLoading(false);
    }, [allClubs]);

    return (
        <header className="header-SidePage">
            {/* 5 max events */}
            <div className="SidePage-rest">
                {club&&club.clubisActivation?
                    <p style={{color: "dimgray"}}> Your Posted Events</p>
                    :
                    <p style={{color: "dimgray"}}> Coming Events</p>
                }

                {clubSortedEvents.length > 0 ?
                    (clubSortedEvents.map
                        (from => (from.eventStates && !from.eventUpdated &&
                          (
                            <div className="SidePage-img-holder" onClick={() =>
                                ((club&&isActive&&club.clubID===from.club.clubID)
                                || user&&user.authority.authorityName==="ROLE_ADMIN"?
                                    navigate("/manage-event", {state: {from: from}})
                                    :
                                    navigate("/event", {state: {from: from}}))}>

                                 <img className="SidePage-img" src={from.eventPostMediaURL?from.eventPostMediaURL:""}/>
                                <div>
                                     <h5>{from.eventName?from.eventName.slice(0, 29).toUpperCase():""}</h5>
                                     <p style={{fontSize: 11}}> Date: {from.eventStartingDate} Time : {from.eventNote}</p>
                                </div>

                             </div>))
                        )
                    )
                        :
                        (

                            <div style={{alignSelf: "center", textAlign: "center", marginTop: 100}}>
                                {isLoading || isLoadingEvents ?
                                    <SpiningLoading/>
                                    :
                                        <div>
                                            <h4>You dont have any Event to Display </h4>
                                            <h5>You can create a new event any time </h5>
                                        </div>
                                }
                            </div>
                        )
                }

                {clubSortedEvents.length > 4 &&
                    <div className="SidePage-img-holder">
                        <button className={"seeAll-btn"}>View All</button>
                    </div>}
            </div>
            {/* 4 max clubs */}

            <div className="SidePage-rest">
            <p style={{color: "dimgray"}}> Recent Clubs</p>
                {clubSorted.length > 0 ?
                    (clubSorted.map(clubCard => (
                        (<div className="SidePage-img-holder"
                              onClick={() => navigate(`/clubprofile`, {state: {club:clubCard}})}>

                            <img className="SidePage-img"
                                 src={clubCard.clubProfilePicURL ? clubCard.clubProfilePicURL : ""}/>
                            <div>
                                <h5>{clubCard.clubName ? clubCard.clubName.toUpperCase() : ""}</h5>
                                <p style={{fontSize: 11}}> {clubCard.creatingDate} </p>
                            </div>

                        </div>))))
                    :
                    (

                        <div style={{alignSelf: "center", textAlign: "center", marginTop: 100}}>
                            {isLoading || isLoadingEvents ?
                                <SpiningLoading/>
                                :
                                <div>
                                    <h4>Something Went Wrong !! </h4>
                                    <h5>pleas try to refresh the page </h5>
                                    <a style={{fontSize: 15, color: "blue", textUnderlineOffset: false}}
                                       href={"/home"}>Refresh</a>
                                </div>
                            }
                        </div>
                    )
                }

                {clubSorted.length > 3 &&
                    <div className="SidePage-img-holder">
                        <button className={"seeAll-btn"}>View All</button>
                    </div>}
            </div>
        </header>
    )
        ;
};

export default SidePage;