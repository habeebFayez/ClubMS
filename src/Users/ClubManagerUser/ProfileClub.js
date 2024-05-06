import React, {useEffect, useRef, useState} from 'react';
import Sidebar from "../../HomePage/Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAppleAlt, faBan,
    faCalendar, faCheck,
    faChevronUp, faCircleCheck, faCircleXmark,
    faClock, faEnvelope, faEye, faHashtag, faLayerGroup, faList,
    faLocationDot, faPen,
    faPenToSquare, faPhone, faStar, faTimes,
    faTrash, faTriangleExclamation, faXmark
} from "@fortawesome/free-solid-svg-icons";
import AnimationCheck from "../../Component/AnimationCheck/AnimationCheck";
import PageTop from "../../HomePage/Page/PageTop";
import {Link, useNavigate} from "react-router-dom";
import {useLocation, useParams} from 'react-router-dom';
import "./ProfileClub.css"
import SpiningLoading from "../../Component/loading/SpiningLoading";
import {useLocalState} from "../../util/useLocalState";
import ModalCanBeEdited from "../../Component/ModalCanBeEdited/ModalCanBeEdited";
import CreateEvent from "../../HomePage/Page/CreateEvent/CreateEvent";
import EditEventPost from "../../HomePage/Page/EditEventPost/EditEventPost";
import Loading from "../../Component/loading/Loading";
import EditFullEvent from "../../HomePage/Page/EditFullEvent/EditFullEvent";
import EditClub from "../AdminUser/EditClub";


const GOOGLE_MAPS_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?google\.com\/maps\/.*$/;

const ProfileClub = ({user,isActive,userClub , events,allClubs,allClubsCategories ,allEventsCategories  ,categories}) => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    const location = useLocation()
    const { club } = location.state||{};
    const { clubID } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const pageBodyRef = useRef(null);
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate=useNavigate();
    const [sortedEvents, setSortedEvents] = useState([]);
    const [eventToBeDeleted, setEventToBeDeleted] = useState();
    const [isModalOpenForDeletePost, setIsModalOpenForDeletePost] = useState(false);
    const [isModalOpenForEditedPost, setIsModalOpenForEditedPost] = useState(false);
    const [eventToBeDeactivate, setEventToDeactivate] = useState();
    const [isModalOpenForBanEvent, setIsModalOpenForBanEvent] = useState(false);
    const [responseMsg, setResponseMsg] = useState('');
    const [isopenResoneOver, setIsopenResoneOver] = useState(false);
    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isModalOpenForCreatEvent, setIsModalOpenForCreatEvent] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [isedited, setIsEditedg] = useState(false);
    const [clubToBeActivated, setClubToActivated] = useState();
    const [isModalOpenForActivateClub,  setIsModalOpenForActivateClub] = useState(false);
    const [clubToBeDeleted, setClubToBeDeleted] = useState();
    const [isModalOpenForDeleteClub, setIsModalOpenForDeleteClub] = useState(false);
    const [clubToBeDeactivate, setClubToDeactivate] = useState();
    const [isModalOpenForBanClub, setIsModalOpenForBanClub] = useState(false);
    const [clubToBeRejected, setClubToRejected] = useState();
    const [isModalOpenForRejectClub,   setIsModalOpenForRejectClub] = useState(false);
    const [isList,   setIsList] = useState((club&&user&&(!(club.clubManager.userID === user.userID)||
            (user.authority.authorityName === "ROLE_ADMIN"))));
    const [categoriesForValue, setCategoriesForValue] = useState([]);
    const [clubToBeEdited, setClubToBeEdited] = useState();
    const [isModalOpenForEditClub,   setIsModalOpenForEditClub] = useState(false);
    const [users, setUsers] = useState([]);
    const [editContactInfo,   setEditContactInfo] = useState(false);
    const [contactEmail, setContactEmail] = useState(club&&club.contactEmail);
    const [contactNumber, setContactNumber] = useState(club&&club.contactNumber);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [rejectedEvents, setRejectedEvents] = useState([]);

    const today = new Date();
    const todayDate =today.toISOString().split('T')[0]

    const changeContactInfo = (e) => {
        setIsWaiting(true);
        try {
            fetch(`api/club/edit-contact-info`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "PUT",

                body: JSON.stringify(
                    {
                        clubID:club.clubID,
                        contactEmail:contactEmail,
                        contactNumber:contactNumber,
                    })


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
    const deletEvent = (e) => {
        setIsWaiting(true);
        try {
            setIsLoadingEvents(true);
            fetch(`api/event/deleteevent/${eventToBeDeleted.eventID}`, {
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${jwt}`
                }, method: "DELETE",

            })
                .then((response) => {

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

            if (!err?.response) {
                setIsModalOpenForDeletePost(false);

                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForDeletePost(false);

                setErrMsg('Something went wrong !!');

            }
        }finally {
            setIsLoadingEvents(false);
            setIsWaiting(false);
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

            if (!err?.response) {
                setIsModalOpenForBanEvent(false);
                setErrMsg("No Server Response");
            } else {
                setIsModalOpenForBanEvent(false);
                setErrMsg('Something went wrong !!');

            }
        }finally {
            setIsLoadingEvents(false);
            setIsWaiting(false);
        }
        setIsopenResoneOver(false)
        setResponseMsg('')
    };

    useEffect(() => {

       if(events){
           if(club&&user&&
               ((club.clubManager.userID === user.userID)
                   ||
                   (user.authority.authorityName==="ROLE_ADMIN"))) {
           }
        ( setSortedEvents( events.filter(event=>
            event.eventStartingDate>=todayDate&&(club&&club.clubID===event.club.clubID))
            .sort((a, b) => {
            const dateA = new Date(a.eventStartingDate);
            const dateB = new Date(b.eventStartingDate);
            return dateA - dateB;
        })))
       }
    }, [club]);
    const scrollToTop = () => {
        pageBodyRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModalForPic();
        }
    };
    const closeModalForPic = () => {
        setIsModalOpenForPic(false);
    };
    const openModalForPic = (url) => {
        setImageUrl(url);
        setIsModalOpenForPic(true);
    };
    const wordCount = (text) => {
        return text.split(/\s+/).length;
    };
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
    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setTimeout(() => {
                navigate({state:null})
                setIsModalOpenForSuccess(false);
                if (user&&user.authority.authorityName==="ROLE_MANAGER"){
                    navigate("/manager-dashboard");
                }
                if (user&&user.authority.authorityName==="ROLE_ADMIN"){
                    navigate("/dashboard");

                }
            }, 2000);

        }
        if (club === undefined || club === null || !club) {
            if (user&&user.authority.authorityName==="ROLE_MANAGER"){
                navigate("/manager-dashboard");
            }
            if (user&&user.authority.authorityName==="ROLE_ADMIN"){
                navigate("/dashboard");

            }

        }



    }, [isModalOpenForSuccess]);
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay-create-club')) {
            setIsModalOpenForCreatEvent(false);
            setIsModalOpenForEditedPost(false);
            setIsModalOpenForBanEvent(false)
            setIsModalOpenForBanClub(false);
            // setIsModalOpenForRejectClub(false)
            setIsopenResoneOver(false)
            setIsModalOpenForActivateClub(false)
            setIsModalOpenForDeleteClub(false)
            setIsModalOpenForDeletePost(false)
            setIsModalOpenForEditClub(false)
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
    const handleClickButtonColse = (e) => {

        setIsModalOpenForCreatEvent(false);
        setIsModalOpenForEditedPost(false);
    };

    useEffect(() => {
        if(club) {
            setCategoriesForValue(allClubsCategories.filter(clubCategory =>
                clubCategory.club.clubID === (club.clubID)).map(category => category.category).map(category => ({
                label: category.categoryName,
                value: category.categoryName,
                categoryID: category.categoryID

            })));
        }

    }, [allClubsCategories]);
    useEffect(() => {
        // count number of events **************************************************************************

        if(sortedEvents.length>0){
            setIsWaiting(true)
            setIsLoadingEvents(true)

            setPendingEvents(sortedEvents.filter(event=>
                (event.club.clubID === club.clubID)
                &&!event.eventisRejected &&(!event.eventStates||event.eventUpdated)
            ))

            setRejectedEvents(sortedEvents.filter(event=>
                (event.club.clubID === club.clubID)
                &&event.eventisRejected
            ))

        }
        setTimeout(() => {
            setIsWaiting(false)
            setIsLoadingEvents(false)
        }, 500);

    }, [sortedEvents]);
    return (
        <div className="homePage-allclubs">
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
            <div className="menu-sidebar">
                <Sidebar user={user}  allClubs={allClubs} isActive={isActive} club={userClub} events={events}/></div>
            <div className="pageBody-allclubs">

                <div className="Profile-page-clubProfile">

                    <div className="Profile-info-clubProfile">
                        <div className="background-pic-clubProfile">
                            <div className="image-container-clubProfile">
                                <img
                                    src={club && club.clubCoverPicURL ?
                                        club.clubCoverPicURL
                                        :
                                        "https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F1713614226425dbac47a2d3f467ec6f940cc49bbf41a0.jpeg?alt=media&token=6c9f8d99-8ec0-41f6-bc89-c560e45d56be"
                                    }
                                    onClick={() => openModalForPic(club.clubCoverPicURL ?
                                        club.clubCoverPicURL
                                        :
                                        "https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F1713614226425dbac47a2d3f467ec6f940cc49bbf41a0.jpeg?alt=media&token=6c9f8d99-8ec0-41f6-bc89-c560e45d56be"
                                    )}
                                    alt="Image"
                                />
                                {club && club.clubIsBlocked && <div className="club-states">
                                    <p>Blocked</p>
                                    <FontAwesomeIcon className="club-states-icon-ban" icon={faBan}/>
                                </div>}
                                {club && club.clubisRejected && <div className="club-states">
                                    <p>Rejected</p>
                                    <FontAwesomeIcon className="club-states-icon-ban" icon={faXmark}/>
                                </div>}
                                {club && !club.clubisActivation && !club.clubisRejected && !club.clubIsBlocked &&
                                    <div className="club-states">
                                        <p>Pending</p>
                                        <FontAwesomeIcon className="club-states-icon-pending"
                                                         icon={faTriangleExclamation}/>
                                    </div>}
                            </div>

                        </div>
                        <div className="profile-details-clubProfile">
                            {user && club && (user.authority.authorityName === "ROLE_ADMIN") &&
                                (club.clubisRejected || club.clubIsBlocked || club.clubisActivation) &&
                                <button className="delete-profile-BTN"
                                        onClick={() => {
                                            setClubToBeDeleted(club);
                                            setIsModalOpenForDeleteClub(true)

                                        }}>
                                    Delete
                                    <FontAwesomeIcon className="header-edit-icone" icon={faTrash}/>
                                </button>
                            }
                            {user && club && (user.authority.authorityName === "ROLE_ADMIN") &&
                                (!club.clubisActivation && !club.clubisRejected && !club.clubIsBlocked) &&
                                <button className="delete-profile-BTN"
                                        onClick={() => {
                                            setClubToRejected(club)
                                            setIsModalOpenForRejectClub(true)

                                        }}>
                                    Reject
                                    <FontAwesomeIcon className="header-edit-icone" icon={faXmark}/>
                                </button>
                            }
                            {user && club && (user.authority.authorityName === "ROLE_ADMIN") &&
                                !club.clubisActivation &&
                                <button className="activate-profile-BTN"
                                        onClick={() => {
                                            setClubToActivated(club);
                                            setIsModalOpenForActivateClub(true)

                                        }}
                                >Activate
                                    <FontAwesomeIcon className="header-edit-icone" icon={faCheck}/>
                                </button>
                            }
                            {user && club && (user.authority.authorityName === "ROLE_ADMIN") &&
                                (club.clubisRejected || club.clubIsBlocked || club.clubisActivation) &&
                                <button className="blocked-profile-BTN"
                                        onClick={() => {
                                            setClubToDeactivate(club)
                                            setIsModalOpenForBanClub(true)

                                        }}>
                                    Block
                                    <FontAwesomeIcon className="header-edit-icone" icon={faBan}/>
                                </button>
                            }
                            <div className="profile-pic-clubProfile">
                                <img
                                    src={club && club.clubProfilePicURL ?
                                        club.clubProfilePicURL
                                        :
                                        "https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F1713614226425dbac47a2d3f467ec6f940cc49bbf41a0.jpeg?alt=media&token=6c9f8d99-8ec0-41f6-bc89-c560e45d56be"
                                    }
                                    onClick={() => openModalForPic(club.clubProfilePicURL ?
                                        club.clubProfilePicURL
                                        :
                                        "https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F1713614226425dbac47a2d3f467ec6f940cc49bbf41a0.jpeg?alt=media&token=6c9f8d99-8ec0-41f6-bc89-c560e45d56be"
                                    )}
                                    alt="Profile Picture"></img>
                            </div>

                            <div className="data-name-manager-clubProfile">
                                <h3 className="name-of-club-clubProfile">
                                    {club && club.clubName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                </h3>
                                <h5 className="Manager-of-club-clubProfile">
                                    Manager: {club && (club.clubManager.firstName + " " + club.clubManager.lastName).slice(0, 15)}
                                    {user && ((user.authority.authorityName === "ROLE_ADMIN")
                                            ||(club.clubManager.userID === user.userID)) &&
                                        <button className="edit-profile-BTN"
                                                onClick={() => {
                                                    setClubToBeEdited(club);
                                                    setIsModalOpenForEditClub(true)

                                                }}
                                        >Edit
                                            <FontAwesomeIcon className="header-edit-icone" icon={faPen}/>
                                        </button>
                                    }
                                </h5>

                            </div>

                            <div className="club-data-clubProfile">
                                <div className="create-date-clubProfile">
                                    Create Date
                                    <p>{club && club.creatingDate}</p>
                                </div>
                                <div className="Members-clubProfile">
                                    Members
                                    <p>{club && club.clubMaxMembersNumber}</p>
                                </div>
                                <div className="Event-clubProfile">
                                    Events
                                    <p>{club && club.clubActiveEventsNumber}</p>
                                </div>
                                <div className="rating-clubProfile">
                                    Rating
                                    <p>{(club&&(club.clubActiveEventsNumber + club.clubRejectedEventsNumber) > 0) ?
                                        (club && ((club.clubActiveEventsNumber)
                                            / (club.clubActiveEventsNumber + club.clubRejectedEventsNumber)) * 10).toFixed(1)
                                        :
                                        "--"
                                    } / 10 </p>
                                </div>
                            </div>

                        </div>
                        <div className="club-categories">
                            {club&&(allClubsCategories.filter(category => category.club.clubID === (club.clubID)).map(
                                clubCategory =>

                                    <button
                                        className={
                                            "tags-btn-club-category-profile"}
                                        id="tagButton"
                                    >
                                        {clubCategory.category.categoryName}

                                    </button>
                            ))}

                        </div>
                        <div className="page-content-clubProfile">
                            <div className="description-clubProfile">

                                <div className="Discription-clubProfile">
                                    <div className="description-title">

                                        <div className="header-title">
                                            <h5>Description</h5>
                                        </div>
                                        <p>{club && club.clubDescription}</p>
                                    </div>
                                </div>
                                <div className="contact-clubProfile">
                                    <div className="Email-clubProfile">

                                        <div className="description-title">
                                            <div className="header-title">
                                                <h5>Contact</h5>
                                                {user && club && ((club.clubManager.userID === user.userID)
                                                        ||
                                                        (user.authority.authorityName === "ROLE_ADMIN")) &&
                                                    <FontAwesomeIcon
                                                        onClick={()=>setEditContactInfo(true)} className="header-title-icone" icon={faPen}/>}
                                            </div>
                                            <br/>
                                            <div className="contact-Email">
                                                <FontAwesomeIcon style={{fontSize: 17, color: "darkblue"}}
                                                                 icon={faEnvelope}/>
                                                <p>{club && club.contactEmail}</p>
                                            </div>
                                            <br/>
                                            <div className="contact-number">
                                                <FontAwesomeIcon style={{fontSize: 17, color: "darkblue"}}
                                                                 icon={faPhone}/>
                                                <p>{club && club.contactNumber}</p>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="club-posts">
                                {club && user &&
                                    ((club.clubManager.userID === user.userID)
                                        ||
                                        (user.authority.authorityName === "ROLE_ADMIN"))&&
                                    <div className="choose-view">
                                    <button className={isList?"choose-view-cards-active":"choose-view-cards"}
                                    onClick={()=>setIsList(true)}>
                                        <FontAwesomeIcon icon={faList}/>
                                    </button>
                                    <button className={!isList ?  "choose-view-list-active": "choose-view-list"}
                                            onClick={()=>setIsList(false)}>
                                        <FontAwesomeIcon icon={faLayerGroup}/>
                                    </button>
                                </div>}
                                {sortedEvents.length > 0 && !isLoading ?
                                    (club && user &&
                                        ((club.clubManager.userID === user.userID)
                                            ||
                                            (user.authority.authorityName === "ROLE_ADMIN"))) ?
                                       ( !isList?
                                            (sortedEvents.map(post => (
                                            <div className="Backgrond-clubProfile-post" key={post.eventID}>

                                                {user && (post.clubID.clubManager.userID === user.userID) &&
                                                    <div className="post-choises">
                                                        <button className="deleteBTN" onClick={() => {
                                                            setEventToBeDeleted(post);
                                                            setIsModalOpenForDeletePost(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                        <button className="edit-postBTN"
                                                                onClick={() => {
                                                                    navigate("/manage-event", {state: {from: post}})

                                                                }}>
                                                            <FontAwesomeIcon icon={faPen}/>
                                                        </button>

                                                    </div>}
                                                {user && user.authority.authorityName === "ROLE_ADMIN" &&
                                                    <div className="post-choises">
                                                        {post.eventPostRequested &&
                                                            <p style={{color: "green",marginRight:10,fontWeight:600,paddingTop:5}}>POST</p>}

                                                        {post.eventStates &&
                                                            <button className="ban-btn" onClick={() => {
                                                                setEventToDeactivate(post)
                                                                setIsModalOpenForBanEvent(true)

                                                            }}>
                                                                <FontAwesomeIcon icon={faBan}/>
                                                            </button>}
                                                        <button className="deleteBTN" onClick={() => {
                                                            setEventToBeDeleted(post);
                                                            setIsModalOpenForDeletePost(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                        <button className="edit-postBTN"
                                                                onClick={() => {
                                                                    navigate("/manage-event", {state: {from: post}})

                                                                }}>
                                                            <FontAwesomeIcon icon={faPen}/>
                                                        </button>

                                                    </div>}
                                                <div className="poster-info">
                                                    <img className="poster-info-img"
                                                         src={post ? post.club.clubProfilePicURL : ''}
                                                    />
                                                    <div style={{marginLeft: "1%"}}>
                                                        <h5 style={{
                                                            color: "black", fontSize: "14px", width: 200
                                                        }}>{post ? post.club.clubName : 'NA'}</h5>
                                                        <p style={{fontSize: "12px", color: "darkgray"}}>
                                                            {post.eventCreationDate}
                                                        </p>
                                                    </div>

                                                    <div className="poster-info-TDL-clubProfile-post">

                                                        <div className="poster-info-time-date">
                                                            <FontAwesomeIcon className="poster-info-icon"
                                                                             icon={faClock}/>
                                                            <p>
                                                                {post.eventNote}
                                                            </p>
                                                        </div>
                                                        <div className="poster-info-time-date">
                                                            <FontAwesomeIcon className="poster-info-icon"
                                                                             icon={faCalendar}/>
                                                            <p>
                                                                {post.eventStartingDate}
                                                            </p>
                                                        </div>
                                                        <div className="poster-info-time-date">
                                                            <FontAwesomeIcon className="poster-location-icon"
                                                                             icon={faLocationDot}/>
                                                            <p>
                                                                <a
                                                                    href={GOOGLE_MAPS_URL_REGEX.test(post.eventLocationURL) ? post.eventLocationURL : ''}
                                                                >
                                                                    {post.eventHall}
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="post-text">
                                                    <p style={{fontWeight: 650, fontSize: 17}}>{post.eventName}</p>


                                                    <p style={{maxWidth: 500, maxHeight: "12em"}}>
                                                        {/*# TEXT 200 word max#########################################################################*/}
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: post.eventPostDescription.replace(/\n/g, '<br />')
                                                                    .split(/\s+/).slice(0, 69).join(' ')
                                                            }}/>
                                                        {wordCount(post.eventPostDescription) > 69 &&
                                                            <Link to="/event" state={{from: post}}
                                                                  style={{
                                                                      color: 'blue',
                                                                      fontWeight: 700,
                                                                      cursor: 'pointer'
                                                                  }}>
                                                                Read More...
                                                            </Link>}

                                                    </p>
                                                    <br/>
                                                    {allEventsCategories.filter(category => category.event.eventID === post.eventID).map(
                                                        eventCategory =>
                                                            <h5 className="post-tag">
                                                                <FontAwesomeIcon icon={faHashtag}/>
                                                                {eventCategory.category.categoryName}</h5>)}

                                                </div>
                                                {post.eventPostRequested &&
                                                    <div className="post-img">
                                                    <img
                                                        className="img"
                                                        src={post ? post.eventPostMediaURL : ''}
                                                        alt="Example"
                                                        onClick={() => openModalForPic(post.eventPostMediaURL)}
                                                    />
                                                </div>}
                                                <div className="post-footer"/>
                                            </div>)))
                                            :
                                            (
                                                <div className="Backgrond-clubProfile-post-list">
                                                    <div className="dashboard-List-half-profile">
                                                        <div className="dashboard-List-half-title">
                                                            <h4>
                                                                <FontAwesomeIcon className="warning"
                                                                                 icon={faTriangleExclamation}/>
                                                                Pending Events Requests</h4>
                                                        </div>
                                                        <div className="dashboard-List-half-content">

                                                            {pendingEvents.length > 0 ?
                                                                (pendingEvents.map(result => !result.eventisRejected && (!result.eventStates || result.eventUpdated) &&
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



                                                                            {user && (result.clubID.clubManager.userID === user.userID) &&
                                                                                <div className="post-choises">
                                                                                    {result.eventPostRequested &&
                                                                                        <p style={{color: "red"}}>POST</p>}
                                                                                    <button className="deleteBTN" onClick={() => {
                                                                                        setEventToBeDeleted(result);
                                                                                        setIsModalOpenForDeletePost(true)

                                                                                    }}>
                                                                                        <FontAwesomeIcon icon={faTrash}/>
                                                                                    </button>
                                                                                    <button className="edit-postBTN"
                                                                                            onClick={() => {
                                                                                                navigate("/manage-event", {state: {from: result}})

                                                                                            }}>
                                                                                        <FontAwesomeIcon icon={faPen}/>
                                                                                    </button>

                                                                                </div>}
                                                                            {user && user.authority.authorityName === "ROLE_ADMIN" &&
                                                                                <div className="post-choises">
                                                                                    {result.eventPostRequested &&
                                                                                        <p style={{color: "red"}}>POST</p>}
                                                                                    <button className="edit-postBTN"
                                                                                            onClick={() => {
                                                                                                navigate("/manage-event", {state: {from: result}})

                                                                                            }}>
                                                                                        <FontAwesomeIcon icon={faPen}/>
                                                                                    </button>
                                                                                    <button className="deleteBTN"
                                                                                            onClick={() => {
                                                                                                setEventToBeDeleted(result);
                                                                                                setIsModalOpenForDeletePost(true)

                                                                                            }}>
                                                                                        <FontAwesomeIcon
                                                                                            icon={faTrash}/>
                                                                                    </button>


                                                                                </div>}


                                                                    </div>
                                                                ))
                                                                :
                                                                <div>
                                                                    <h3 style={{color: "dimgray"}}> No Pending Events
                                                                        found </h3>
                                                                </div>

                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="dashboard-List-half-profile">

                                                        <div className="dashboard-List-half-title">
                                                            <h4>
                                                                <FontAwesomeIcon className="accepted"
                                                                                 icon={faCircleCheck}/>
                                                                Accepted Events Requests</h4>
                                                        </div>


                                                        <div className="dashboard-List-half-content">
                                                            {sortedEvents.length > 0 ?
                                                                sortedEvents.map(result => result.eventStates&&
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

                                                                        {user && (result.clubID.clubManager.userID === user.userID) &&
                                                                            <div className="post-choises">
                                                                                {result.eventPostRequested &&
                                                                                    <p style={{color: "red"}}>POST</p>}
                                                                                <button className="deleteBTN" onClick={() => {
                                                                                    setEventToBeDeleted(result);
                                                                                    setIsModalOpenForDeletePost(true)

                                                                                }}>
                                                                                    <FontAwesomeIcon icon={faTrash}/>
                                                                                </button>
                                                                                <button className="edit-postBTN"
                                                                                        onClick={() => {
                                                                                            navigate("/manage-event", {state: {from: result}})

                                                                                        }}>
                                                                                    <FontAwesomeIcon icon={faPen}/>
                                                                                </button>

                                                                            </div>}
                                                                        {user && user.authority.authorityName === "ROLE_ADMIN" &&
                                                                            <div className="post-choises">
                                                                                {result.eventPostRequested &&
                                                                                    <p style={{color: "red"}}>POST</p>}
                                                                                <button className="edit-postBTN"
                                                                                        onClick={() => {
                                                                                            navigate("/manage-event", {state: {from: result}})

                                                                                        }}>
                                                                                    <FontAwesomeIcon icon={faPen}/>
                                                                                </button>

                                                                                <button className="ban-btn"
                                                                                        onClick={() => {
                                                                                            setEventToDeactivate(result)
                                                                                            setIsModalOpenForBanEvent(true)

                                                                                        }}>
                                                                                    <FontAwesomeIcon icon={faBan}/>
                                                                                </button>
                                                                                <button className="deleteBTN"
                                                                                        onClick={() => {
                                                                                            setEventToBeDeleted(result);
                                                                                            setIsModalOpenForDeletePost(true)

                                                                                        }}>
                                                                                    <FontAwesomeIcon
                                                                                        icon={faTrash}/>
                                                                                </button>


                                                                            </div>}
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
                                                    <div className="dashboard-List-half-profile">
                                                        <div className="dashboard-List-half-title">
                                                            <h4>
                                                                <FontAwesomeIcon className="rejected"
                                                                                 icon={faCircleXmark}/>
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
                                                                            <div
                                                                                onClick={() => navigate("/manage-event", {state: {from: result}})}>
                                                                                <h5>{result.eventName ? result.eventName.slice(0, 29).toUpperCase() : ""}</h5>
                                                                                <p style={{fontSize: 11}}> Created: {result.eventCreationDate} </p>
                                                                            </div>
                                                                        </>


                                                                        {user && (result.clubID.clubManager.userID === user.userID) &&
                                                                            <div className="post-choises">
                                                                                {result.eventPostRequested &&
                                                                                    <p style={{color: "red"}}>POST</p>}
                                                                                <button className="deleteBTN" onClick={() => {
                                                                                    setEventToBeDeleted(result);
                                                                                    setIsModalOpenForDeletePost(true)

                                                                                }}>
                                                                                    <FontAwesomeIcon icon={faTrash}/>
                                                                                </button>
                                                                                <button className="edit-postBTN"
                                                                                        onClick={() => {
                                                                                            navigate("/manage-event", {state: {from: result}})

                                                                                        }}>
                                                                                    <FontAwesomeIcon icon={faPen}/>
                                                                                </button>

                                                                            </div>}
                                                                        {user && user.authority.authorityName === "ROLE_ADMIN" &&
                                                                            <div className="post-choises">
                                                                                {result.eventPostRequested &&
                                                                                    <p style={{color: "red"}}>POST</p>}
                                                                                <button className="edit-postBTN"
                                                                                        onClick={() => {
                                                                                            navigate("/manage-event", {state: {from: result}})

                                                                                        }}>
                                                                                    <FontAwesomeIcon icon={faPen}/>
                                                                                </button>

                                                                                <button className="deleteBTN"
                                                                                        onClick={() => {
                                                                                            setEventToBeDeleted(result);
                                                                                            setIsModalOpenForDeletePost(true)

                                                                                        }}>
                                                                                    <FontAwesomeIcon
                                                                                        icon={faTrash}/>
                                                                                </button>


                                                                            </div>}
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


                                                </div>))
                                        :
                                        (sortedEvents.map(post => (
                                            post.eventStates && !post.eventUpdated &&post.eventPostRequested &&
                                            <div className="Backgrond-clubProfile-post" key={post.eventID}>
                                                {user && (post.clubID.clubManager.userID === user.userID) &&
                                                    <div className="post-choises">
                                                        <button className="deleteBTN" onClick={() => {
                                                            setEventToBeDeleted(post);
                                                            setIsModalOpenForDeletePost(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                        <button className="edit-postBTN"
                                                                onClick={() => {
                                                                    navigate("/manage-event", {state: {from: post}})

                                                                }}>
                                                            <FontAwesomeIcon icon={faPen}/>
                                                        </button>

                                                    </div>}
                                                {user && user.authority.authorityName === "ROLE_ADMIN" &&
                                                    <div className="post-choises">


                                                        <button className="ban-btn" onClick={() => {
                                                            setEventToDeactivate(post)
                                                            setIsModalOpenForBanEvent(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faBan}/>
                                                        </button>
                                                        <button className="deleteBTN" onClick={() => {
                                                            setEventToBeDeleted(post);
                                                            setIsModalOpenForDeletePost(true)

                                                        }}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                        </button>

                                                    </div>}
                                                <div className="poster-info">
                                                    <img className="poster-info-img"
                                                         src={post ? post.club.clubProfilePicURL : ''}
                                                    />
                                                    <div style={{marginLeft: "1%"}}>
                                                        <h5 style={{
                                                            color: "black", fontSize: "14px", width: 200
                                                        }}>{post ? post.club.clubName : 'NA'}</h5>
                                                        <p style={{fontSize: "12px", color: "darkgray"}}>
                                                            {post.eventCreationDate}
                                                        </p>
                                                    </div>
                                                    <div className="poster-info-TDL-clubProfile-post">
                                                        <div className="poster-info-time-date">
                                                            <FontAwesomeIcon className="poster-info-icon"
                                                                             icon={faClock}/>
                                                            <p>
                                                                {post.eventNote}
                                                            </p>
                                                        </div>
                                                        <div className="poster-info-time-date">
                                                        <FontAwesomeIcon className="poster-info-icon"
                                                                             icon={faCalendar}/>
                                                            <p>
                                                                {post.eventStartingDate}
                                                            </p>
                                                        </div>
                                                        <div className="poster-info-time-date">
                                                            <FontAwesomeIcon className="poster-location-icon"
                                                                             icon={faLocationDot}/>
                                                            <p>
                                                                <a
                                                                    href={GOOGLE_MAPS_URL_REGEX.test(post.eventLocationURL) ? post.eventLocationURL : ''}
                                                                >
                                                                    {post.eventHall}
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="post-text">
                                                    <p style={{fontWeight: 650, fontSize: 17}}>{post.eventName}</p>


                                                    <p style={{maxWidth: 500, maxHeight: "12em"}}>
                                                        {/*# TEXT 200 word max#########################################################################*/}
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: post.eventPostDescription.replace(/\n/g, '<br />')
                                                                    .split(/\s+/).slice(0, 69).join(' ')
                                                            }}/>
                                                        {wordCount(post.eventPostDescription) > 69 &&
                                                            <Link to="/event" state={{from: post}}
                                                                  style={{
                                                                      color: 'blue',
                                                                      fontWeight: 700,
                                                                      cursor: 'pointer'
                                                                  }}>
                                                                Read More...
                                                            </Link>}

                                                    </p>
                                                    <br/>
                                                    {allEventsCategories.filter(category => category.event.eventID === post.eventID).map(
                                                        eventCategory =>
                                                            <h5 className="post-tag">
                                                                <FontAwesomeIcon icon={faHashtag}/>
                                                                {eventCategory.category.categoryName}</h5>)}

                                                </div>
                                                {post.eventPostRequested &&
                                                    <div className="post-img">
                                                        <img
                                                            className="img"
                                                            src={post ? post.eventPostMediaURL : ''}
                                                            alt="Example"
                                                            onClick={() => openModalForPic(post.eventPostMediaURL)}
                                                        />
                                                    </div>}
                                                <div className="post-footer"/>
                                            </div>)))

                                    :

                                    ((isWaiting || isLoadingEvents) ?
                                        <div style={{alignSelf: "center", textAlign: "center", marginTop: 100}}>
                                            <div>
                                                <SpiningLoading/>
                                            </div>
                                        </div>
                                        :
                                        ( events&&!(sortedEvents.length > 0) &&
                                            <div style={{alignSelf: "center", textAlign: "center", marginTop: 100}}>

                                                <div>
                                                    <h2>There is no Events to Display</h2>
                                                    {user&&club && (club.clubManager.userID === user.userID) ?
                                                        <h3>You can create one any time </h3>
                                                        :
                                                        <h3>Wait till Club Manager creates one </h3>
                                                    }
                                                    <label style={{fontSize: 100}}>
                                                        {String.fromCodePoint('0x1f604')}
                                                    </label>
                                                </div>
                                            </div>)
                                    )

                                }

                            </div>
                        </div>


                    </div>
                </div>


                {isVisible && (
                    <button className={"GoUp-clubs"} onClick={scrollToTop}>
                        <FontAwesomeIcon icon={faChevronUp}/>
                    </button>
                )}
            </div>

            {isModalOpenForDeletePost && <ModalCanBeEdited isOpen={isModalOpenForDeletePost}
                                                           title={"Delete '" + eventToBeDeleted.eventName + "Event"}
                                                           text={"Are You Sure You Want To Delete This Event Post ?"}
                                                           onClose={() => setIsModalOpenForDeletePost(false)}
                                                           confirm={deletEvent}
            />}

            {isModalOpenForPic && (<div className="modal-post-img" onClick={handleOverlayClick}>
                <div className="modal-content-Page" onClick={handleOverlayClick}>
                    <span className="close" onClick={closeModalForPic}>&times;</span>
                    <img src={imageUrl} className={"img-page-content"}/>
                </div>
            </div>)}
            {isModalOpenForCreatEvent &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <CreateEvent
                        user={user}
                        club={club}
                        isOpenSeccess={() => {
                            setIsModalOpenForSuccess(true);
                        }}
                        isLoading={openLodingForActivity}
                        stopLoading={closeLodingForActivity}
                        closeModal={handleClickButtonColse}
                        categories={categories}
                    />
                </div>}
            {isModalOpenForBanClub &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <h2>Deactivate '{clubToBeDeactivate.clubName}' Club</h2>
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

            {isLoadingEvents && isWaiting && <div className="modal-post-img-edit-profile">
                <Loading/>
            </div>


            }

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
            {user&&club&&((club.clubManager.userID===user.userID)&&
                (!club.clubisActivation||club.clubIsBlocked))&&
                <div className="modal-overlay-inactive-club">
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <div className={"modal-content"}>
                                {club&&club.clubIsBlocked&&
                                    <>
                                        <h2>Your Club is Blocked </h2>
                                        <p className="content-p-confirm">
                                            You Can No Longer control your Club </p>
                                        <FontAwesomeIcon style={{color:"red",fontSize:50}} icon={faBan}/>
                                    </>
                                }
                                {club&&!club.clubisActivation&&!club.clubisRejected&&!club.clubIsBlocked&&
                                    <>
                                        <h2>Your Club is being reviewed </h2>
                                        <p className="content-p-confirm">Please Wait For the Admin Activation </p>
                                        <FontAwesomeIcon style={{color:"yellow",fontSize:50}} icon={faTriangleExclamation}/>
                                    </>}
                                {club&&!club.clubisActivation&&club.clubisRejected&&!club.clubIsBlocked&&
                                    <>
                                        <h2>Your Club Application Wes Rejected By The Admin </h2>
                                        <FontAwesomeIcon style={{color:"red",fontSize:75}} icon={faXmark}/>
                                    </>}

                            </div>
                        </div>
                        <div className="button-container-confirm">
                            <button className="ContinueBTN" onClick={() => {
                                (navigate(`/myClub`))
                            }}>Ok
                            </button>
                        </div>

                    </div>
                </div>}
            {isModalOpenForActivateClub &&
                <ModalCanBeEdited isOpen={isModalOpenForActivateClub}
                                  title={"Activate '" + clubToBeActivated.clubName + "' Club"}
                                  text={"Are You Sure You Want To Activate This Club  ?"}
                                  onClose={() => setIsModalOpenForActivateClub(false)}
                                  confirm={activateClub}

                />
            }
            {isModalOpenForDeleteClub &&
                <ModalCanBeEdited isOpen={isModalOpenForDeleteClub}
                                  title={"Delete \"" + clubToBeDeleted.clubName + "\" Club"}
                                  text={"Are You Sure You Want To Delete This Club ?"}
                                  onClose={() => setIsModalOpenForDeleteClub(false)}
                                  confirm={deletClub}

                />}
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
            {isModalOpenForEditClub &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <EditClub
                        clubCategory={categoriesForValue}
                        users={users}
                        user={user}
                        isOpenSeccess={()=> {
                            setIsModalOpenForEditClub(false)
                            setIsModalOpenForSuccess(true)
                        }}
                        clickedClub={clubToBeEdited}
                        categories={categories}
                        closeModal={()=>setIsModalOpenForEditClub(false)}

                    />
                </div>}
            {isModalOpenForSuccess &&
                <div>
                    <p className="Success-message-profile-club">
                        <AnimationCheck/> <br/>
                        Your Request hase been sent Successfully !!
                    </p>
                </div>
            }
            {editContactInfo &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <div className="modal-confirm" >
                        <div className="modal-content">
                            <h3>Edit Contact Information's for "{club.clubName}" Club"</h3>
                            <div>
                                <label className="edit-input-label"> Email :</label>
                                <div className="input-field-creat-club">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="edit-input-label"> Contact Number :</label>
                                <div className="input-field-creat-club">
                                    <input
                                        type="tel"
                                        placeholder="Contact Number [0-9]"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        pattern="[0-9]*"
                                        aria-valuemax={10}
                                        required={true}
                                    />
                                </div>
                            </div>


                        </div>
                        <div className="button-container-confirm">
                            <button className="SaveBTN-confirm" onClick={()=>{
                                changeContactInfo()
                            setEditContactInfo(false)
                            }}
                            >Confirm
                            </button>
                            <button className="CloseBTN-confirm" onClick={() => {
                                setContactNumber('')
                                setContactEmail('')
                                setEditContactInfo(false)
                            }}
                            >Close
                            </button>
                        </div>
                    </div>


                </div>
            }
        </div>
    )
        ;
    }
;

export default ProfileClub;