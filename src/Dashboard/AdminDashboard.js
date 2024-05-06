import React, {useEffect, useState} from 'react';
import Sidebar from "../HomePage/Sidebar/Sidebar";
import Card from "./Card/Card";
import "./ClubManagerDashboard.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBan,
    faCheck,
    faCircleCheck,
    faCircleXmark, faEdit, faEye, faFilter,
    faHourglassHalf, faList,
    faPenToSquare,
    faPlus, faSearch, faTimes, faTrash,
    faTriangleExclamation, faXmark
} from "@fortawesome/free-solid-svg-icons";
import "../Component/ModalCanBeEdited/ModalCanBeEdited.css"
import {useNavigate} from "react-router-dom";
import "./AdminDashboard.css"
import AnimationCheck from "../Component/AnimationCheck/AnimationCheck";
import Loading from "../Component/loading/Loading";
import ModalCanBeEdited from "../Component/ModalCanBeEdited/ModalCanBeEdited";
import {useLocalState} from "../util/useLocalState";
import SpiningLoading from "../Component/loading/SpiningLoading";
import ApplyForClub from "../Users/StudentUser/ApplyForClub";
import CreateClub from "../Users/AdminUser/Creat Club/CreateClub";
import EditClub from "../Users/AdminUser/EditClub";
const Dashboard = ({user,club,isActive ,clubNotifications, allClubs ,isLoading ,categories ,allClubsCategories,allEventsCategories, events}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const startDate = new Date();
    const currentDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - currentDayOfWeek-1);

    const navigate=useNavigate();
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [isModalOpenForDeletePost, setIsModalOpenForDeletePost] = useState(false);
    const [isModalOpenForBanEvent, setIsModalOpenForBanEvent] = useState(false);
    const [isModalOpenForActivatePost,  setIsModalOpenForActivatePost] = useState(false);
    const [isModalOpenForRejectPost,   setIsModalOpenForRejectPost] = useState(false);
    const [isModalOpenForDeleteClub, setIsModalOpenForDeleteClub] = useState(false);
    const [isModalOpenForBanClub, setIsModalOpenForBanClub] = useState(false);
    const [isModalOpenForActivateClub,  setIsModalOpenForActivateClub] = useState(false);
    const [isModalOpenForRejectClub,   setIsModalOpenForRejectClub] = useState(false);
    const [clubToBeActivated, setClubToActivated] = useState();
    const [clubToBeRejected, setClubToRejected] = useState();
    const [clubToBeDeactivate, setClubToDeactivate] = useState();
    const [clubToBeDeleted, setClubToBeDeleted] = useState();
    const [eventToBeActivated, setEventToActivated] = useState();
    const [eventToBeRejected, setEventToRejected] = useState();
    const [eventToBeDeactivate, setEventToDeactivate] = useState();
    const [eventToBeDeleted, setEventToBeDeleted] = useState();
    const [errMsg, setErrMsg] = useState('');
    const [responseMsg, setResponseMsg] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const [users, setUsers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [allevents, setAllEvents] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [blockedClubs, setBlockedClubs] = useState([]);
    const [pendingClubs, setPendingClubs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pendingEvents, setPendingEvents] = useState([]);
    const [rejectedEvents, setRejectedEvents] = useState([]);
    const [rejectedClubs, setRejectedClubs] = useState([]);
    const [acceptedEvents, setAceptedEvents] = useState([]);
    const [activeClubs, setActiveClubs] = useState([]);
    const [rejectedWeekEvents, setRejectedWeekEvents] = useState([]);
    const [excebtedweekEvents, setExcebtedWeekEvents] = useState([]);
    const [weekEvents, setWeekEvents] = useState([]);
    const [isopenResoneOver, setIsopenResoneOver] = useState(false);
    const [showFiltering, setShowFiltering] = useState(false);
    const [eventNameSearchActive, setEventNameSearchActive] = useState('');


    useEffect(() => {
        if (jwt&&user&&user.authority.authorityName==="ROLE_ADMIN") {
            setIsWaiting(true);

            fetch("api/admin/getUsers", {
                headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${jwt}`
                }, method: "GET",
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401) {
                        setErrMsg("Authorization Expired ");
                        window.localStorage.clear();
                        window.location.href="/login";
                    } else {
                        setErrMsg("Something Went Wrong \n  We are sorry please Try to Reload the page");
                        return(response.json());

                    }
                })
                .then((usersData) => {
                    setUsers(usersData);
                    setIsWaiting(false);

                })
                .catch((error) => {
                    setErrMsg(error);
                    if(!error)
                        window.location.reload();
                });
        }

    }, [jwt,user]);

    const deletClub = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/admin/deleteClub/${clubToBeDeleted.clubID}`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "DELETE",

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {
                        setIsModalOpenForDeleteClub(false);
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForDeleteClub(false);
                        setErrMsg('You cant Delete This club !!');
                    } else {
                        setIsModalOpenForDeleteClub(false);

                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForDeleteClub(false);
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForDeleteClub(false);
                setErrMsg('Something went wrong !!');

            }
        }

    };
    const activateClub = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/admin/activateClub/${clubToBeActivated.clubID}`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "PUT",

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {

                        setIsModalOpenForActivateClub(false);
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForActivateClub(false);
                        setErrMsg('You cant Activate CLub !!');
                    } else {
                        setIsModalOpenForActivateClub(false);
                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForActivateClub(false);
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForActivateClub(false);
                setErrMsg('Something went wrong !!');

            }
        }

    };
    const rejectClub = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/admin/rejectClub`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "PUT",
                body: JSON.stringify({
                    notification:
                        {
                            notificationMessage :responseMsg,
                        },
                    clubID: clubToBeRejected.clubID,
                })

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {

                        setIsModalOpenForRejectClub(false)
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForRejectClub(false)
                        setErrMsg('You cant Reject Club !!');
                    } else {
                        setIsModalOpenForRejectClub(false)
                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForRejectClub(false)
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForRejectClub(false)
                setErrMsg('Something went wrong !!');

            }
        }
        setIsopenResoneOver(false)
        setResponseMsg('')
    };
    const deactivateClub = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/admin/deactivateClub`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "PUT",
                body: JSON.stringify({
                    notification:
                        {
                            notificationMessage :responseMsg,
                        },
                    clubID: clubToBeDeactivate.clubID,
                })

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {
                        setIsModalOpenForBanClub(false);
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForBanClub(false);
                        setErrMsg('You cant Ban this Club !!');
                    } else {
                        setIsModalOpenForBanClub(false);
                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForBanClub(false);
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForBanClub(false);
                setErrMsg('Something went wrong !!');

            }
        }
        setIsopenResoneOver(false)
        setResponseMsg('')
    };

    const rejectEvent = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/admin/rejectEvent`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "PUT",
                body: JSON.stringify({
                    notification:
                        {
                            notificationMessage :responseMsg,
                        },
                    eventID: eventToBeRejected.eventID,
                })

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {

                        setIsModalOpenForRejectPost(false)
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForRejectPost(false)
                        setErrMsg('You cant Reject Event !!');
                    } else {
                        setIsModalOpenForRejectPost(false)
                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForRejectPost(false)
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForRejectPost(false)
                setErrMsg('Something went wrong !!');

            }
        }
        setIsopenResoneOver(false)
        setResponseMsg('')
    };
    const activateEvent = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/admin/activateEvent/${eventToBeActivated.eventID}`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "PUT",

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {

                        setIsModalOpenForActivatePost(false);
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForActivatePost(false);
                        setErrMsg('You cant Activate Event !!');
                    } else {
                        setIsModalOpenForActivatePost(false);
                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForActivatePost(false);
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForActivatePost(false);
                setErrMsg('Something went wrong !!');

            }
        }

    };
    const deactivateEvent = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/admin/deactivateEvent`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "PUT",
                body: JSON.stringify({
                    notification:
                        {
                            notificationMessage :responseMsg,
                        },
                    eventID: eventToBeDeactivate.eventID,
                })

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {

                        setIsModalOpenForBanEvent(false);
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForBanEvent(false);
                        setErrMsg('You cant Delete Event !!');
                    } else {
                        setIsModalOpenForBanEvent(false);
                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForBanEvent(false);
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForBanEvent(false);
                setErrMsg('Something went wrong !!');

            }
        }
        setIsopenResoneOver(false)
        setResponseMsg('')
    };
    const deletEvent = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/event/deleteevent/${eventToBeDeleted.eventID}`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "DELETE",

            })
                .then((response) => {
                    setIsWaiting(false);
                    if (response.status === 200) {

                        setIsModalOpenForDeletePost(false);
                        setIsModalOpenForSuccess(true);
                    } else if (response.status === 401) {
                        setIsModalOpenForDeletePost(false);

                        setErrMsg('You cant Delete Event !!');
                    } else {
                        setIsModalOpenForDeletePost(false);

                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsWaiting(false);
            if (!err?.response) {
                setIsModalOpenForDeletePost(false);
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForDeletePost(false);
                setErrMsg('Something went wrong !!');

            }
        }

    };
    const handleClickButtonColse = (e) => {

        setIsModalOpen(false);

    };
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay-create-club')) {
            setIsModalOpenForBanEvent(false)
            setIsModalOpenForBanClub(false);
            setIsModalOpenForRejectClub(false)
            setIsopenResoneOver(false)
            setIsModalOpenForActivateClub(false)
            setIsModalOpenForDeleteClub(false)
            setIsModalOpenForActivatePost(false)
            setIsModalOpenForDeletePost(false)
            setIsModalOpenForRejectPost(false)
            setIsModalOpen(false)
            setResponseMsg('')
        }

    };
    const openLodingForActivity = () => {
        setIsWaiting(true);
        setIsLoadingEvents(true);
    }
    const closeLodingForActivity = () => {
        setIsWaiting(false);
        setIsLoadingEvents(false);
    }



    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setTimeout(() => {
                window.location.reload();
                setIsModalOpenForSuccess(false);
            }, 3000);

        }
    }, [isModalOpenForSuccess]);
    useEffect(() => {
        if (errMsg !== '') {
            setTimeout(() => {
                setErrMsg('');
            }, 5000);

        }
    }, [errMsg]);
    useEffect(() => {
        if (events&&allClubs) {
            setIsWaiting(true)
            setIsLoadingEvents(true)
            setClubs(allClubs.sort((a, b) => {
                const dateA = new Date(a.creatingDate);
                const dateB = new Date(b.creatingDate);
                return dateB - dateA;
            }))
            setAllEvents(events.sort((a, b) => {
                const dateA = new Date(a.eventCreationDate);
                const dateB = new Date(b.eventCreationDate);
                return dateB - dateA;
            }))



        }
        setTimeout(() => {
            setIsWaiting(false)
            setIsLoadingEvents(false)
        }, 500);
    }, [events]);
    useEffect(() => {
        // count number of events **************************************************************************
        if(users){
            setIsWaiting(true)
            setIsLoadingEvents(true)
            setBlockedUsers(users.filter(user=>!user.active))
        }
        if(clubs){
            setRejectedClubs(clubs.filter(club=>{
                return (club.clubisRejected
                    );
            }))

            setBlockedClubs(clubs.filter(club=>{
                return (club.clubIsBlocked&&!club.clubisRejected&&!club.clubisActivation
                   );
            }))
            setPendingClubs(clubs.filter(club=>{
                return ((!club.clubIsBlocked&&!club.clubisRejected&&!club.clubisActivation)
                );
            }))
            setActiveClubs(clubs.filter(club=>{
                return ((!club.clubIsBlocked&&!club.clubisRejected&&club.clubisActivation)
                );
            }))
        }


if(allevents) {
    setPendingEvents(allevents.filter(event =>
      ( ( !event.eventisRejected && (!event.eventStates || event.eventUpdated))
        )
    ))

    setRejectedEvents(allevents.filter(event =>
       (event.eventisRejected)
    ))


    setAceptedEvents(allevents.filter(event =>
       (( !event.eventisRejected && event.eventStates && !event.eventUpdated)
       )
    ))

    setWeekEvents(allevents.filter(event => {
        const eventStartDate = new Date(event.eventCreationDate);
        return (eventStartDate >= startDate.setDate(startDate.getDate()))
    }));

    setExcebtedWeekEvents(acceptedEvents.filter(event => {
        const eventCreationDate = new Date(event.eventCreationDate);
        return (eventCreationDate >= startDate.setDate(startDate.getDate()))
    }));

    setRejectedWeekEvents(rejectedEvents.filter(event => {
        const eventCreationDate = new Date(event.eventCreationDate);
        return (eventCreationDate >= startDate.setDate(startDate.getDate()))
    }));
}
        setTimeout(() => {
            setIsWaiting(false)
            setIsLoadingEvents(false)

        }, 500);

    }, [users,eventNameSearchActive,user,events ,allClubs]);

    console.log(acceptedEvents)
    return (
        <div className="DashboardPage" >

            {isLoadingEvents || isWaiting &&
                <div className="modal-post-img-edit-profile">
                    <Loading/>
                </div>
            }
            {errMsg && <p className="creat-club-error-message">
                <FontAwesomeIcon className={"Icon_close_err_mess"} onClick={() => {
                    setErrMsg(false)
                }}
                                 style={{fontSize: "25px"}}
                                 icon={faTimes}/>
                <br/>{errMsg}
            </p>}

            <div className="menu-sidebar-full-event-page">
                <Sidebar user={user} allClubs={allClubs} events={events} clubNotifications={clubNotifications} isActive={isActive}
                         club={club}/>
            </div>
            <div className="event-pageBody">
                <div className="page-Dashboard-titel">
                    <div className="Events">Admin Dashboard</div>
                    <button className="Button-creat-event" onClick={() => {
                        setIsModalOpen(true)
                    }}>
                        <FontAwesomeIcon style={{fontSize: 20}} icon={faPlus}/>
                        <span style={{marginLeft: 10}}/> Creat Club
                    </button>
                </div>
                <div className="dashboard-pageBody">
                    <div className="dashboard-card-title">
                        <Card title={"Total Users "}
                              numberMax={users.length} buttonRed={true}
                              tagtext={blockedUsers.length + " Blocked"}/>
                        <Card title={"Total Clubs"}
                              numberMax={clubs.length}
                              tagtext={pendingClubs.length + " Pending"}/>
                        <Card title={"Total Events"}
                              numberMax={allevents.length}
                              tagtext={pendingEvents.length + " Pending"}/>
                        <Card color={"red"} title={" Rejected Clubs"}
                              numberMax={rejectedClubs.length}
                              tagtext={blockedClubs.length + " Blocked"}/>
                        <Card color={"red"} title={" Rejected Events"}
                              numberMax={rejectedEvents.length}
                              tagtext={rejectedWeekEvents.length + " this week"}/>
                    </div>

                    <div className="dashboard-List">

                        <div className="dashboard-List-half">
                            <div className="dashboard-List-half-title">
                                <h4>
                                    <FontAwesomeIcon className="warning" icon={faTriangleExclamation}/>
                                    Pending Clubs Requests</h4>

                            </div>

                            <div className="dashboard-List-half-content">
                                {pendingClubs.length > 0 &&
                                    <thead className="table-title">
                                    <tr>
                                        <th className="th-first">CLUB</th>
                                        <th></th>
                                        <th>CLUB MANAGER</th>
                                        <th></th>
                                        <th></th>
                                        <th>Total :{pendingClubs.length}</th>
                                    </tr>
                                    </thead>}
                                {pendingClubs.length > 0 ?
                                    (pendingClubs.map(result =>
                                        (result.clubName.toLowerCase().startsWith(eventNameSearchActive.toLowerCase())||result.clubName.toLowerCase().includes(eventNameSearchActive.toLowerCase()))
                                        &&<div className="Dashboard-img-holder">
                                            <div className="SidePage-img-holder-andName"
                                                 onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                            >
                                                <img className="SidePage-img"
                                                     src={result.clubProfilePicURL ? result.clubProfilePicURL : ""}/>
                                                <div
                                                >
                                                    <h5>{result.clubName ? result.clubName.slice(0, 29).toUpperCase() : ""}</h5>
                                                    <p style={{fontSize: 11}}>
                                                        Created: {result.creatingDate}</p>
                                                </div>

                                            </div>
                                            {users.map(user => user.userID === result.clubManager.userID &&
                                                <div className="SidePage-img-holder-andName">
                                                    <img className="SidePage-img"
                                                         src={user.profilePicURL ? user.profilePicURL : ""}/>
                                                    <div>
                                                        <h5>{user.firstName ?
                                                            (user.firstName + " " + user.lastName).slice(0, 29).toUpperCase() : ""}
                                                        </h5>
                                                        <p style={{fontSize: 11}}>
                                                            Student Number: {user.studentNumber}</p>
                                                    </div>
                                                </div>)}
                                            <div className="dash-events-BTN">
                                                <button className="edit-postBTN"
                                                        onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                                >
                                                    <FontAwesomeIcon icon={faEye}/>
                                                </button>
                                                <button className="admin-confirm"
                                                        onClick={() => {
                                                    setClubToActivated(result);
                                                    setIsModalOpenForActivateClub(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faCheck}/>
                                                </button>
                                                <button className="rejectBTN" onClick={() => {
                                                    setClubToRejected(result);
                                                    setIsModalOpenForRejectClub(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faXmark}/>
                                                </button>
                                            </div>

                                        </div>))
                                    :

                                    <div>
                                        <h3 style={{color: "dimgray"}}> No Pending Clubs
                                            found </h3>
                                    </div>

                                }

                            </div>
                        </div>
                        <div className="dashboard-List-half">
                            <div className="dashboard-List-half-title">
                                <h4>
                                    <FontAwesomeIcon className="warning" icon={faTriangleExclamation}/>
                                    Pending Events Requests</h4>

                            </div>
                            <div className="dashboard-List-half-content">
                                {pendingEvents.length > 0 &&
                                    <thead className="table-title">
                                    <tr>
                                        <th className="th-first">EVENT</th>
                                        <th></th>
                                        <th>CLUB</th>
                                        <th></th>
                                        <th></th>
                                        <th>Total :{pendingEvents.length}</th>
                                    </tr>
                                    </thead>}
                                {pendingEvents.length > 0 ?
                                    (pendingEvents.map(result =>
                                        (result.eventName.toLowerCase().startsWith(eventNameSearchActive.toLowerCase())||result.eventName.toLowerCase().includes(eventNameSearchActive.toLowerCase()))
                                        && <div className="Dashboard-img-holder">
                                            <div className="SidePage-img-holder-andName">
                                                <img className="SidePage-img"
                                                     onClick={() => navigate("/manage-event", {state: {from: result}})}
                                                     src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                                                <div
                                                    onClick={() => navigate("/manage-event", {state: {from: result}})}>
                                                    <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                                    <p style={{fontSize: 11}}>
                                                        Created: {result.eventCreationDate}</p>
                                                </div>
                                            </div>
                                            {activeClubs.map(club => club.clubID === result.club.clubID &&
                                                <div className="SidePage-img-holder-andName"
                                                     onClick={() => (navigate(`/clubprofile`, {state: {club}}))}
                                                >
                                                    <img className="SidePage-img"
                                                         src={club.clubProfilePicURL ? club.clubProfilePicURL : ""}/>
                                                    <div>
                                                        <h5>{club.clubName ?
                                                            club.clubName.slice(0, 29).toUpperCase() : ""}
                                                        </h5>
                                                        <p style={{fontSize: 11}}>
                                                            Rejected Events Number: {club.clubRejectedEventsNumber
                                                        }</p>
                                                    </div>
                                                </div>)}
                                            <div className="dash-events-BTN">
                                                {result.eventPostRequested && <p style={{color: "red"}}>POST</p>}
                                                <button className="edit-postBTN"
                                                        onClick={() => {
                                                            navigate("/manage-event", {state: {from: result}})
                                                        }}>
                                                    <FontAwesomeIcon icon={faEye}/>
                                                </button>
                                                <button className="admin-confirm" onClick={() => {
                                                    setEventToActivated(result);
                                                    setIsModalOpenForActivatePost(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faCheck}/>
                                                </button>
                                                <button className="rejectBTN" onClick={() => {
                                                    setEventToRejected(result);
                                                    setIsModalOpenForRejectPost(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faXmark}/>
                                                </button>
                                            </div>

                                        </div>))
                                    :

                                    <div>
                                        <h3 style={{color: "dimgray"}}> No Pending Events
                                            found </h3>
                                    </div>

                                }

                            </div>
                        </div>


                        <div className="dashboard-List-half">
                            <div className="dashboard-List-half-title">
                                <h4>
                                    <FontAwesomeIcon className="accepted" icon={faCircleCheck}/>
                                    Active Clubs</h4>
                                {/*<button className="filterBTN" onClick={() => {*/}
                                {/*    setShowFiltering(true)*/}

                                {/*}}>*/}
                                {/*    Filter*/}
                                {/*    <FontAwesomeIcon style={{marginLeft: 5}} icon={faFilter}/>*/}
                                {/*</button>*/}
                            </div>

                            <div className="dashboard-List-half-content">
                                {activeClubs.length > 0 &&
                                    <thead className="table-title">
                                <tr>
                                    <th className="th-first">CLUB</th>
                                    <th></th>
                                    <th>CLUB MANAGER</th>
                                    <th></th>
                                    <th></th>
                                    <th>Total :{activeClubs.length}</th>
                                </tr>
                                </thead>}
                                {activeClubs.length > 0 ?

                                    activeClubs.map(result =>
                                    (result.clubName.toLowerCase().startsWith(eventNameSearchActive.toLowerCase())||result.clubName.toLowerCase().includes(eventNameSearchActive.toLowerCase()))
                                        && <div className="Dashboard-img-holder">
                                            <div className="SidePage-img-holder-andName"
                                                 onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                            >
                                                <img className="SidePage-img"

                                                     src={result.clubProfilePicURL ? result.clubProfilePicURL : ""}/>
                                                <div
                                                >
                                                    <h5>{result.clubName ? result.clubName.slice(0, 29).toUpperCase() : ""}</h5>
                                                    <p style={{fontSize: 11}}>
                                                        Accepted Events: {result.clubActiveEventsNumber}</p>
                                                </div>
                                            </div>
                                            {users.map(user => user.userID === result.clubManager.userID &&
                                                <div className="SidePage-img-holder-andName">
                                                    <img className="SidePage-img"
                                                         src={user.profilePicURL ? user.profilePicURL : ""}/>
                                                    <div>
                                                        <h5>{user.firstName ?
                                                            (user.firstName + " " + user.lastName).slice(0, 29).toUpperCase() : ""}
                                                        </h5>
                                                        <p style={{fontSize: 11}}>
                                                            Student Number: {user.studentNumber}</p>
                                                    </div>
                                                </div>)}
                                            <div className="dash-events-BTN">
                                                <button className="edit-postBTN"
                                                        onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                                >
                                                    <FontAwesomeIcon icon={faEye}/>
                                                </button>
                                                <button className="ban-btn" onClick={() => {
                                                    setClubToDeactivate(result)
                                                    setIsModalOpenForBanClub(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faBan}/>
                                                </button>
                                                <button className="deleteBTN" onClick={() => {
                                                    setClubToBeDeleted(result);
                                                    setIsModalOpenForDeleteClub(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faTrash}/>
                                                </button>
                                            </div>

                                        </div>)
                                    :

                                    <div>
                                        <h3 style={{color: "dimgray"}}> No Active Event's Yet </h3>
                                    </div>
                                }

                            </div>

                        </div>
                        <div className="dashboard-List-half">
                            <div className="dashboard-List-half-title">
                                <h4>
                                    <FontAwesomeIcon className="accepted" icon={faCircleCheck}/>
                                    Active Events </h4>
                                {/*<button className="filterBTN" onClick={() => {*/}
                                {/*    setShowFiltering(true)*/}

                                {/*}}>*/}
                                {/*    Filter*/}
                                {/*    <FontAwesomeIcon style={{marginLeft: 5}} icon={faFilter}/>*/}
                                {/*</button>*/}
                            </div>

                            <div className="dashboard-List-half-content">
                                {acceptedEvents.length > 0 &&
                                    <thead className="table-title">
                                    <tr>
                                        <th className="th-first">EVENT</th>
                                        <th></th>
                                        <th>CLUB</th>
                                        <th></th>
                                        <th></th>
                                        <th>Total :{acceptedEvents.length}</th>
                                    </tr>
                                    </thead>}
                                {acceptedEvents.length > 0 ?
                                    acceptedEvents.map(result =>

                                    (result.eventName.toLowerCase().startsWith(eventNameSearchActive.toLowerCase())||result.eventName.toLowerCase().includes(eventNameSearchActive.toLowerCase()))
                                            && <div className="Dashboard-img-holder">
                                            <>
                                                <img className="SidePage-img"
                                                     onClick={() => navigate("/manage-event", {state: {from: result}})}
                                                     src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                                                <div
                                                    onClick={() => navigate("/manage-event", {state: {from: result}})}>
                                                    <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                                    <p style={{fontSize: 11}}> Created: {result.eventCreationDate} </p>
                                                </div>
                                            </>
                                            {activeClubs.map(club => club.clubID === result.club.clubID &&
                                                <div className="SidePage-img-holder-andName"
                                                     onClick={() => (navigate(`/clubprofile`, {state: {club}}))}
                                                >
                                                    <img className="SidePage-img"

                                                         src={club.clubProfilePicURL ? club.clubProfilePicURL : ""}/>
                                                    <div>
                                                        <h5>{club.clubName ?
                                                            club.clubName.slice(0, 29).toUpperCase() : ""}
                                                        </h5>
                                                        <p style={{fontSize: 11}}>
                                                            Rejected Events Number: {club.clubRejectedEventsNumber
                                                        }</p>
                                                    </div>
                                                </div>)}
                                            <div className="dash-events-BTN">
                                                {result.eventPostRequested && <p style={{color: "red"}}>POST</p>}
                                                <button className="edit-postBTN"
                                                        onClick={() => {
                                                            navigate("/manage-event", {state: {from: result}})
                                                        }}>
                                                    <FontAwesomeIcon icon={faEye}/>
                                                </button>

                                                <button className="ban-btn" onClick={() => {
                                                    setEventToDeactivate(result)
                                                    setIsModalOpenForBanEvent(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faBan}/>
                                                </button>
                                                <button className="deleteBTN" onClick={() => {
                                                    setEventToBeDeleted(result);
                                                    setIsModalOpenForDeletePost(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faTrash}/>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                    :

                                    <div>
                                        <h3 style={{color: "dimgray"}}> No Active Clubs
                                            Yet </h3>
                                    </div>
                                }

                            </div>

                        </div>

                        {user && user.authority.authorityName === "ROLE_ADMIN" &&
                            <>
                                <div className="dashboard-List-half">
                                    <div className="dashboard-List-half-title">
                                        <h4>
                                            <FontAwesomeIcon className="rejected" icon={faBan}/>
                                            Rejected & Blocked Clubs</h4>

                                    </div>

                                    <div className="dashboard-List-half-content">
                                        {rejectedClubs.length > 0 &&
                                            <thead className="table-title">
                                            <tr>
                                                <th className="th-first">CLUB</th>
                                                <th></th>
                                                <th>CLUB MANAGER</th>
                                                <th></th>
                                                <th></th>
                                                <th>Total :{rejectedClubs.length + blockedClubs.length}</th>
                                            </tr>
                                            </thead>}
                                        {rejectedClubs.length > 0 ?
                                            rejectedClubs.map(result =>
                                            (result.clubName.toLowerCase().startsWith(eventNameSearchActive.toLowerCase())||result.clubName.toLowerCase().includes(eventNameSearchActive.toLowerCase()))
                                                &&  <div className="Dashboard-img-holder">
                                                    <div className="SidePage-img-holder-andName"
                                                         onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                                    >
                                                        <img className="SidePage-img"
                                                             src={result.clubProfilePicURL ? result.clubProfilePicURL : ""}/>
                                                        <div
                                                        >
                                                            <h5>{result.clubName ? result.clubName.slice(0, 29).toUpperCase() : ""}</h5>
                                                            <p style={{fontSize: 11}}>
                                                                Created: {result.creatingDate}</p>
                                                        </div>
                                                    </div>
                                                    {users.map(user => user.userID === result.clubManager.userID &&
                                                        <div className="SidePage-img-holder-andName">
                                                            <img className="SidePage-img"
                                                                 src={user.profilePicURL ? user.profilePicURL : ""}/>
                                                            <div>
                                                                <h5>{user.firstName ?
                                                                    (user.firstName + " " + user.lastName).slice(0, 20).toUpperCase() : ""}
                                                                </h5>
                                                                <p style={{fontSize: 11}}>
                                                                    Student Number: {user.studentNumber}</p>
                                                            </div>
                                                        </div>)}
                                                    <div className="dash-events-BTN">
                                                        <p style={{color: "red"}}>REJECTED</p>
                                                        <button className="edit-postBTN"
                                                                onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                                        >
                                                            <FontAwesomeIcon icon={faEye}/>
                                                        </button>
                                                        <button className="admin-confirm" onClick={() => {
                                                            setClubToActivated(result);
                                                            setIsModalOpenForActivateClub(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faCheck}/>
                                                        </button>
                                                        <button className="deleteBTN" onClick={() => {
                                                            setClubToBeDeleted(result);
                                                            setIsModalOpenForDeleteClub(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                    </div>

                                                </div>)
                                            :

                                            <div>
                                                <h3 style={{color: "dimgray"}}> No Blocked or Rejected Clubs Yet </h3>
                                            </div>
                                        }
                                        {blockedClubs.length > 0 ?
                                            blockedClubs.map(result =>
                                            (result.clubName.toLowerCase().startsWith(eventNameSearchActive.toLowerCase())||result.clubName.toLowerCase().includes(eventNameSearchActive.toLowerCase()))
                                                && <div className="Dashboard-img-holder">
                                                    <div className="SidePage-img-holder-andName"
                                                         onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                                    >
                                                        <img className="SidePage-img"
                                                             src={result.clubProfilePicURL ? result.clubProfilePicURL : ""}/>
                                                        <div
                                                        >
                                                            <h5>{result.clubName ? result.clubName.slice(0, 20).toUpperCase() : ""}</h5>
                                                            <p style={{fontSize: 11}}>
                                                                Created: {result.creatingDate}</p>
                                                        </div>
                                                    </div>
                                                    {users.map(user => user.userID === result.clubManager.userID &&
                                                        <div className="SidePage-img-holder-andName">
                                                            <img className="SidePage-img"
                                                                 src={user.profilePicURL ? user.profilePicURL : ""}/>
                                                            <div>
                                                                <h5>{user.firstName ?
                                                                    (user.firstName + " " + user.lastName).slice(0, 29).toUpperCase() : ""}
                                                                </h5>
                                                                <p style={{fontSize: 11}}>
                                                                    Student Number: {user.studentNumber}</p>
                                                            </div>
                                                        </div>)}
                                                    <div className="dash-events-BTN">
                                                        <p style={{color: "red"}}>BLOCKED</p>
                                                        <button className="edit-postBTN"
                                                                onClick={() => (navigate(`/clubprofile`, {state: {club:result}}))}
                                                        >
                                                            <FontAwesomeIcon icon={faEye}/>
                                                        </button>
                                                        <button className="admin-confirm" onClick={() => {
                                                            setClubToActivated(result);
                                                            setIsModalOpenForActivateClub(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faCheck}/>
                                                        </button>
                                                        <button className="deleteBTN" onClick={() => {
                                                            setClubToBeDeleted(result);
                                                            setIsModalOpenForDeleteClub(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                    </div>

                                                </div>)
                                            :

                                            <div>
                                                <h3 style={{color: "dimgray", marginTop: "40%"}}> You Didn't Create
                                                    any
                                                    Event's Yet </h3>
                                            </div>
                                        }

                                    </div>

                                </div>
                                <div className="dashboard-List-half">
                                    <div className="dashboard-List-half-title">
                                        <h4>
                                            <FontAwesomeIcon className="rejected" icon={faCircleXmark}/>
                                            Rejected Events </h4>
                                        {/*<button className="filterBTN" onClick={() => {*/}
                                        {/*    setShowFiltering(true)*/}

                                        {/*}}>*/}
                                        {/*    Filter*/}
                                        {/*    <FontAwesomeIcon style={{marginLeft: 5}} icon={faFilter}/>*/}
                                        {/*</button>*/}
                                    </div>


                                    <div className="dashboard-List-half-content">
                                        {rejectedEvents.length > 0 &&
                                            <thead className="table-title">
                                            <tr>
                                                <th className="th-first">EVENT</th>
                                                <th></th>
                                                <th>CLUB</th>
                                                <th></th>
                                                <th></th>
                                                <th>Total :{rejectedEvents.length}</th>
                                            </tr>
                                            </thead>}
                                        {rejectedEvents.length > 0 ?
                                            rejectedEvents.map(result =>

                                            (result.eventName.toLowerCase().startsWith(eventNameSearchActive.toLowerCase())||result.eventName.toLowerCase().includes(eventNameSearchActive.toLowerCase()))
                                                    &&  <div className="Dashboard-img-holder">
                                                    <>
                                                        <img className="SidePage-img"
                                                             onClick={() => navigate("/manage-event", {state: {from: result}})}
                                                             src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                                                        <div
                                                            onClick={() => navigate("/manage-event", {state: {from: result}})}>
                                                            <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                                            <p style={{fontSize: 11}}> Created: {result.eventCreationDate} </p>
                                                        </div>
                                                    </>
                                                    {activeClubs.map(club => club.clubID === result.club.clubID &&
                                                        <div className="SidePage-img-holder-andName"
                                                             onClick={() => (navigate(`/clubprofile`, {state: {club}}))}
                                                        >
                                                            <img className="SidePage-img"

                                                                 src={club.clubProfilePicURL ? club.clubProfilePicURL : ""}/>
                                                            <div>
                                                                <h5>{club.clubName ?
                                                                    club.clubName.slice(0, 29).toUpperCase() : ""}
                                                                </h5>
                                                                <p style={{fontSize: 11}}>
                                                                    Rejected Events Number: {club.clubRejectedEventsNumber
                                                                }</p>
                                                            </div>
                                                        </div>)}
                                                    <div className="dash-events-BTN">
                                                        {result.eventPostRequested &&
                                                            <p style={{color: "red"}}>POST</p>}
                                                        <button className="edit-postBTN"
                                                                onClick={() => {
                                                                    navigate("/manage-event", {state: {from: result}})
                                                                }}>
                                                            <FontAwesomeIcon icon={faEye}/>
                                                        </button>
                                                        <button className="admin-confirm" onClick={() => {
                                                            setEventToActivated(result);
                                                            setIsModalOpenForActivatePost(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faCheck}/>
                                                        </button>
                                                        <button className="deleteBTN" onClick={() => {
                                                            setEventToBeDeleted(result);
                                                            setIsModalOpenForDeletePost(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                            :

                                            <div>
                                                <h3 style={{color: "dimgray"}}> No Rejected Events
                                                    found </h3>
                                            </div>
                                        }

                                    </div>

                                </div>

                            </>}
                    </div>

                </div>
            </div>
            {isModalOpen &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <CreateClub categories={categories} users={users} isOpenSeccess={() => {
                        setIsModalOpenForSuccess(true);
                        handleClickButtonColse();
                    }} closeModal={handleClickButtonColse} isOpen={isModalOpen}/>
                </div>}

            {isModalOpenForSuccess &&
                <div>
                    <p className="Success-message-event-fullPage">
                        <AnimationCheck/> <br/>
                        Your Request hase been sent Successfully !!
                    </p>
                </div>
            }
            {isModalOpenForDeleteClub &&
                <ModalCanBeEdited isOpen={isModalOpenForDeleteClub}
                                                           title={"Delete \"" + clubToBeDeleted.clubName + "\" Club"}
                                                           text={"Are You Sure You Want To Delete This Club ?"}
                                                           onClose={() => setIsModalOpenForDeleteClub(false)}
                                                           confirm={deletClub}

            />}
            {isModalOpenForActivateClub &&
                <ModalCanBeEdited isOpen={isModalOpenForActivateClub}
                                  title={"Activate '" + clubToBeActivated.clubName + "' Club"}
                                  text={"Are You Sure You Want To Activate This Club  ?"}
                                  onClose={() => setIsModalOpenForActivateClub(false)}
                                  confirm={activateClub}

                />
            }
            {isModalOpenForRejectClub &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <h2>Rejecting "{clubToBeRejected.clubName}" Club"</h2>
                            <p className="content-p-confirm">Are You Sure You Want To Reject This Club Request ?</p>
                            <div className={"modal-content"}>
                                {!isopenResoneOver &&
                                    <button className="add-reasoneBTN"
                                            onClick={() => setIsopenResoneOver(true)}
                                    >Include Reason
                                    </button>}
                                {isopenResoneOver &&
                                    <div className="input-field-creat-event-discr">
                                    <textarea
                                        className="resone-message"
                                        rows={9}
                                        autoComplete="off"
                                        value={responseMsg}
                                        onChange={(e) => setResponseMsg(e.target.value)}
                                        placeholder="Write Your Reasone Here">

                                    </textarea>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="button-container-confirm">
                            <button className="SaveBTN-confirm" onClick={rejectClub}>Yes
                            </button>
                            <button className="CloseBTN-confirm" onClick={() => {
                                setIsopenResoneOver(false)
                                setIsModalOpenForRejectClub(false)
                                setResponseMsg('')
                            }}>No
                            </button>
                        </div>

                    </div>
                </div>}

            {isModalOpenForBanClub &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <h2>Deactivate {clubToBeDeactivate.clubName}"' Event"</h2>
                            <p className="content-p-confirm">Are You Sure You Want To Deactivate This Club ?</p>
                            <div className={"modal-content"}>
                                {!isopenResoneOver &&
                                    <button className="add-reasoneBTN"
                                            onClick={() => setIsopenResoneOver(true)}
                                    >Include Reason
                                    </button>}
                                {isopenResoneOver &&
                                    <div className="input-field-creat-event-discr">
                                    <textarea
                                        className="resone-message"
                                        rows={9}
                                        autoComplete="off"
                                        value={responseMsg}
                                        onChange={(e) => setResponseMsg(e.target.value)}
                                        placeholder="Write Your Reasone Here">

                                    </textarea>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="button-container-confirm">
                            <button className="SaveBTN-confirm" onClick={deactivateClub}>Yes
                            </button>
                            <button className="CloseBTN-confirm" onClick={() => {
                                setIsopenResoneOver(false)
                                setIsModalOpenForBanClub(false)
                                setResponseMsg('')
                            }}>No
                            </button>
                        </div>

                    </div>
                </div>
            }

            {isModalOpenForDeletePost &&
                <ModalCanBeEdited isOpen={isModalOpenForDeletePost}
                                  title={"Delete \"" + eventToBeDeleted.eventName + "\" Event"}
                                  text={"Are You Sure You Want To Delete This Event Post ?"}
                                  onClose={() => setIsModalOpenForDeletePost(false)}
                                  confirm={deletEvent}

                />}


            {isModalOpenForBanEvent &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <h2>Deactivate {eventToBeDeactivate.eventName}"' Event"</h2>
                            <p className="content-p-confirm">Are You Sure You Want To Deactivate This Event ?</p>
                            <div className={"modal-content"}>
                                {!isopenResoneOver &&
                                    <button className="add-reasoneBTN"
                                            onClick={() => setIsopenResoneOver(true)}
                                    >Include Reason
                                    </button>}
                                {isopenResoneOver &&
                                    <div className="input-field-creat-event-discr">
                                    <textarea
                                        className="resone-message"
                                        rows={9}
                                        autoComplete="off"
                                        value={responseMsg}
                                        onChange={(e) => setResponseMsg(e.target.value)}
                                        placeholder="Write Your Reasone Here">

                                    </textarea>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="button-container-confirm">
                            <button className="SaveBTN-confirm" onClick={deactivateEvent}>Yes
                            </button>
                            <button className="CloseBTN-confirm" onClick={() => {
                                setIsopenResoneOver(false)
                                setIsModalOpenForBanEvent(false)
                                setResponseMsg('')
                            }}>No
                            </button>
                        </div>

                    </div>
                </div>
            }
            {isModalOpenForActivatePost &&
                <ModalCanBeEdited isOpen={isModalOpenForActivatePost}
                                  title={"Activate '" + eventToBeActivated.eventName + "' Event"}
                                  text={"Are You Sure You Want To Activate This Event  ?"}
                                  onClose={() => setIsModalOpenForActivatePost(false)}
                                  confirm={activateEvent}

                />
            }
            {isModalOpenForRejectPost &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <h2>Rejecting "{eventToBeRejected.eventName}" Event"</h2>
                            <p className="content-p-confirm">Are You Sure You Want To Reject This Event ?</p>
                            <div className={"modal-content"}>
                                {!isopenResoneOver &&
                                    <button className="add-reasoneBTN"
                                            onClick={() => setIsopenResoneOver(true)}
                                    >Include Reason
                                    </button>}
                                {isopenResoneOver &&
                                    <div className="input-field-creat-event-discr">
                                    <textarea
                                        className="resone-message"
                                        rows={9}
                                        autoComplete="off"
                                        value={responseMsg}
                                        onChange={(e) => setResponseMsg(e.target.value)}
                                        placeholder="Write Your Reasone Here">

                                    </textarea>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="button-container-confirm">
                            <button className="SaveBTN-confirm" onClick={rejectEvent}>Yes
                            </button>
                            <button className="CloseBTN-confirm" onClick={() => {
                                setIsopenResoneOver(false)
                                setIsModalOpenForRejectPost(false)
                                setResponseMsg('')
                            }}>No
                            </button>
                        </div>

                    </div>
                </div>}

            {!showFiltering ?
                <button className="filterBTN" onClick={() => {
                    setShowFiltering(!showFiltering)

                }}>
                    <FontAwesomeIcon style={{marginLeft: 5}} icon={faFilter}/>
                </button>
                :
                <button className="filterBTN"
                        onClick={() => {
                    setShowFiltering(!showFiltering)
                            setEventNameSearchActive('')

                }}>
                    <FontAwesomeIcon style={{marginLeft: 5}} icon={faCircleXmark}/>
                </button>}
            {showFiltering &&
                <div className="filtering-input">
                    <input
                        type="text"
                        value={eventNameSearchActive}
                        placeholder={"Filter by Club or Event name"}
                        onChange={(e)=>setEventNameSearchActive(e.target.value)}
                        />
                </div>}


        </div>
    )
        ;
};

export default Dashboard;