import React, {useEffect, useState} from 'react';
import Sidebar from "../HomePage/Sidebar/Sidebar";
import Card from "./Card/Card";
import "./ClubManagerDashboard.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleXmark, faEdit, faEye,
    faHourglassHalf, faList,
    faPenToSquare,
    faPlus, faTimes, faTrash,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import PageTop from "../HomePage/Page/PageTop";
import CreateEvent from "../HomePage/Page/CreateEvent/CreateEvent";
import EditEventPost from "../HomePage/Page/EditEventPost/EditEventPost";
import AnimationCheck from "../Component/AnimationCheck/AnimationCheck";
import Loading from "../Component/loading/Loading";
import ModalCanBeEdited from "../Component/ModalCanBeEdited/ModalCanBeEdited";
import {useLocalState} from "../util/useLocalState";
const ClubManagerDashboard = ({user,club,isActive,allClubs ,categories ,clubNotifications,allEventsCategories, events}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const startDate = new Date();
    const currentDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - currentDayOfWeek);
    const navigate=useNavigate();
    const [isModalOpenForCreatEvent, setIsModalOpenForCreatEvent] = useState(false);
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [isModalOpenForDeletePost, setIsModalOpenForDeletePost] = useState(false);
    const [eventToBeDeleted, setEventToBeDeleted] = useState();
    const [errMsg, setErrMsg] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [rejectedEvents, setRejectedEvents] = useState([]);
    const [acceptedEvents, setAcceptedEvents] = useState([]);
    const [myClubEvents, setMyClubEvents] = useState([]);
    const [rejectedWeekEvents, setRejectedWeekEvents] = useState(0);
    const [excebtedweekEvents, setExcebtedWeekEvents] = useState(0);
    const [weekEvents, setWeekEvents] = useState(0);
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
    const openisModaSuccess = () => {
        setIsModalOpenForSuccess(true);
    };
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay-create-club')) {
            setIsModalOpenForCreatEvent(false);
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
    const handleClickButtonColse = (e) => {

        setIsModalOpenForCreatEvent(false);
    };
    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setTimeout(() => {
                window.location.reload();
                setIsModalOpenForSuccess(false);
            }, 3000);

        }
    }, [isModalOpenForSuccess]);

    useEffect(() => {
        if (events&&club) {
            setMyClubEvents(events.filter(event=>
                (event.club.clubID === club.clubID)
            ).sort((a, b) => {
                const dateA = new Date(a.eventCreationDate);
                const dateB = new Date(b.eventCreationDate);
                return dateB - dateA;
            }))



        }
    }, [events]);
    useEffect(() => {
        // count number of events **************************************************************************

        if(myClubEvents.length>0){
            setIsWaiting(true)
            setIsLoadingEvents(true)

            setPendingEvents(myClubEvents.filter(event=>
                (event.club.clubID === club.clubID)
                &&!event.eventisRejected &&(!event.eventStates||event.eventUpdated)
            ))

            setRejectedEvents(myClubEvents.filter(event=>
                (event.club.clubID === club.clubID)
                &&event.eventisRejected
            ))


            setAcceptedEvents(myClubEvents.filter(event=>
                (event.club.clubID === club.clubID)
                &&!event.eventisRejected &&event.eventStates&&!event.eventUpdated
            ))

            setWeekEvents(myClubEvents.filter(event => {
                const eventStartDate = new Date(event.eventCreationDate);
                return (eventStartDate >= startDate.setDate(startDate.getDate()))
            }).length);

            setExcebtedWeekEvents(acceptedEvents.filter(event => {
                const eventStartDate = new Date(event.eventCreationDate);
                return (eventStartDate >= startDate.setDate(startDate.getDate()))
            }).length);

            setRejectedWeekEvents(rejectedEvents.filter(event => {
                const eventStartDate = new Date(event.eventCreationDate);
                return (eventStartDate >= startDate.setDate(startDate.getDate()))
            }).length);


        }
        setTimeout(() => {
            setIsWaiting(false)
            setIsLoadingEvents(false)
        }, 500);

    }, [myClubEvents]);

    return (
        <div className="DashboardPage">
            {isLoadingEvents && isWaiting &&
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
                <Sidebar user={user} allClubs={allClubs} events={events} clubNotifications={clubNotifications} isActive={isActive} club={club}/>
            </div>
            <div className="event-pageBody">
                <div className="page-Dashboard-titel">
                    <div className="Events">Club Manager Dashboard</div>
                    {isActive&&
                        <button className="Button-creat-event"
                                onClick={() =>
                                        setIsModalOpenForCreatEvent(true)
                                    }>
                            <FontAwesomeIcon style={{fontSize: 20}} icon={faPlus}/>
                            <span style={{marginLeft: 10}}/>Create Event</button>
                    }
                </div>
                <div className="dashboard-pageBody">
                    <div className="dashboard-card-title">
                        <Card title={"Total Created Events"}
                              numberMax={acceptedEvents.length+rejectedEvents.length+pendingEvents.length}
                              tagtext={weekEvents + " this week"}/>
                        <Card title={"Total Accepted Events"}
                              numberMax={acceptedEvents.length}
                              tagtext={ excebtedweekEvents+ " this week"}/>
                        <Card color={"red"} title={"Total Rejected Events"}
                              numberMax={rejectedEvents.length}
                              tagtext={rejectedWeekEvents + " this week"}/>
                    </div>

                    <div className="dashboard-List">
                        <div className="dashboard-List-half">
                            <div className="dashboard-List-half-title">
                            <h4>
                                <FontAwesomeIcon className="warning" icon={faTriangleExclamation}/>
                                Pending Events Requests</h4>
                            </div>
                            <div className="dashboard-List-half-content">

                                        {pendingEvents.length>0 ?
                                           ( pendingEvents.map(result => !result.eventisRejected &&(!result.eventStates||result.eventUpdated)&&
                                               <div className="Dashboard-img-holder">
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

                                                   <div className="dash-events-BTN">
                                                       {result.eventPostRequested&&<p style={{color:"red"}}>POST</p>}
                                                       <button className="edit-postBTN"
                                                               onClick={() => {
                                                                   navigate("/manage-event", {state: {from: result}})
                                                               }}>
                                                           <FontAwesomeIcon icon={faEye}/>
                                                       </button>
                                                       <button className="deleteBTN" onClick={() => {
                                                           setEventToBeDeleted(result);
                                                           setIsModalOpenForDeletePost(true)

                                                       }}>
                                                           <FontAwesomeIcon icon={faTrash}/>
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
                                    <FontAwesomeIcon className="rejected" icon={faCircleXmark}/>
                                    Rejected Events Requests</h4>
                            </div>

                            <div className="dashboard-List-half-content">
                                {rejectedEvents.length > 0 ?
                                    rejectedEvents.map(result => result.eventisRejected &&
                                        <div className="Dashboard-img-holder">
                                            <>
                                                <img className="SidePage-img"
                                                     onClick={() => navigate("/manage-event", {state: {from: result}})}
                                                     src={result.eventPostMediaURL ? result.eventPostMediaURL : ""}/>
                                                <div onClick={() => navigate("/manage-event", {state: {from: result}})}>
                                                    <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                                    <p style={{fontSize: 11}}> Created: {result.eventCreationDate} </p>
                                                </div>
                                            </>

                                            <div className="dash-events-BTN">
                                                {result.eventPostRequested && <p style={{color: "red"}}>POST</p>}
                                                <button className="edit-postBTN"
                                                        onClick={() => {
                                                            navigate("/manage-event", {state: {from: result}})
                                                        }}>
                                                    <FontAwesomeIcon icon={faEye}/>
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
                                        <h3 style={{color: "dimgray"}}> No Rejected Events found </h3>
                                    </div>

                                }
                            </div>

                        </div>
                        <div className="dashboard-List-half">

                            <div className="dashboard-List-half-title">
                                <h4>
                                    <FontAwesomeIcon className="accepted" icon={faCircleCheck}/>
                                    Accepted Events Requests</h4>
                            </div>


                            <div className="dashboard-List-half-content">
                                {acceptedEvents.length > 0 ?
                                    acceptedEvents.map(result =>
                                        <div className="Dashboard-img-holder">
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
                                            <div className="dash-events-BTN">
                                                {result.eventPostRequested && <p style={{color: "red"}}>POST</p>}
                                                <button className="edit-postBTN"
                                                        onClick={() => {
                                                            navigate("/manage-event", {state: {from: result}})
                                                        }}>
                                                    <FontAwesomeIcon icon={faEye}/>
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
                                        <h3 style={{color: "dimgray"}}> No Accepted Events
                                            found </h3>
                                    </div>
                                }

                            </div>

                        </div>
                        <div className="dashboard-List-half">
                            <div className="dashboard-List-half-title">
                                <h4>
                                    <FontAwesomeIcon className="accepted" icon={faList}/>
                                    All Events Requests</h4>
                            </div>


                            <div className="dashboard-List-half-content">
                                {myClubEvents.length > 0 ?
                                    myClubEvents.map(result =>
                                        <div className="Dashboard-img-holder">
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
                                            <div className="dash-events-BTN">
                                                {result.eventPostRequested && <p style={{color: "red"}}>POST</p>}
                                                <button className="edit-postBTN"
                                                        onClick={() => {
                                                            navigate("/manage-event", {state: {from: result}})
                                                        }}>
                                                    <FontAwesomeIcon icon={faEye}/>
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
                                        <h3 style={{color: "dimgray", marginTop: "40%"}}> You Didn't Create any Event's
                                            Yet </h3>
                                    </div>
                                }

                            </div>

                        </div>

                    </div>


                </div>
            </div>
            {isModalOpenForCreatEvent &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <CreateEvent
                        user={user}
                        club={club}
                        isOpenSeccess={() => {
                            openisModaSuccess();
                        }}
                        isLoading={openLodingForActivity}
                        stopLoading={closeLodingForActivity}
                        closeModal={handleClickButtonColse}
                        categories={categories}
                    />
                </div>}


            {isModalOpenForSuccess &&
                <div>
                    <p className="Success-message-event-fullPage">
                        <AnimationCheck/> <br/>
                        Your Request hase been sent Successfully !!
                    </p>
                </div>
            }

            {isModalOpenForDeletePost && <ModalCanBeEdited isOpen={isModalOpenForDeletePost}
                                                           title={"Delete '" + eventToBeDeleted.eventName + " Event"}
                                                           text={"Are You Sure You Want To Delete This Event Post ?"}
                                                           onClose={() => setIsModalOpenForDeletePost(false)}
                                                           confirm={deletEvent}
            />}
        </div>
    );
};

export default ClubManagerDashboard;