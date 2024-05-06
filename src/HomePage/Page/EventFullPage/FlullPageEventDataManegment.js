import React, {useEffect, useState} from 'react';
import Sidebar from "../../Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBan, faCalendar, faCheck,
    faCircleCheck,
    faCircleXmark, faClock,
    faEdit, faLocationDot,
    faTimes,
    faTrash, faTriangleExclamation, faXmark
} from "@fortawesome/free-solid-svg-icons";
import "./EventFullPage.css";
import {useLocation, useNavigate} from 'react-router-dom';
import Loading from "../../../Component/loading/Loading";
import AnimationCheck from "../../../Component/AnimationCheck/AnimationCheck";
import {useLocalState} from "../../../util/useLocalState";
import ModalCanBeEdited from "../../../Component/ModalCanBeEdited/ModalCanBeEdited";
import Select from "react-select";
import EditFullEvent from "../EditFullEvent/EditFullEvent";


const FlullPageEventDataManegment =  ({events,user,allClubs, clubNotifications,club,allEventsCategories, isActive,categories}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const location = useLocation()
    const navigate=useNavigate();

    const { from }=location.state|| {};
    const {reason} =location.state ||{};

    const [data, setData] = useState(from);
    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [eventToBeDeleted, setEventToBeDeleted] = useState();
    const [isModalOpenForDeletePost, setIsModalOpenForDeletePost] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [eventToBeEdited, setEventToBeEdited] = useState();
    const [isModalOpenForEditedPost, setIsModalOpenForEditedPost] = useState(false);
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isedited, setIsEditedg] = useState(false);
    const [categoriesForValue, setCategoriesForValue] = useState([]);
    const [sponsorsData, setSponsorsData] = useState([]);
    const [speakersData, setSpeakersData] = useState([]);
    const [eventToBeDeactivate, setEventToDeactivate] = useState();
    const [eventToBeActivated, setEventToActivated] = useState();
    const [eventToBeRejected, setEventToRejected] = useState();
    const [isModalOpenForBanEvent, setIsModalOpenForBanEvent] = useState(false);
    const [isModalOpenForActivatePost,  setIsModalOpenForActivatePost] = useState(false);
    const [isModalOpenForRejectPost,   setIsModalOpenForRejectPost] = useState(false);
    const [isopenResoneOver, setIsopenResoneOver] = useState(false);
    const [responseMsg, setResponseMsg] = useState('');
    const [canOpenPage, setCanOpenPage] = useState(true);

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
    useEffect(() => {
        setIsWaiting(true);
        if(jwt&&user&&data&&from) {

            fetch(`api/event/getallevent-speakers-sponsors/${from.eventID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                },
                method: "GET",
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401) {
                        setErrMsg("Authorization Expired ");
                        window.localStorage.clear();
                        window.location.href="/login";
                    }else if(response.status === 404){
                        return response.json();
                    } else {
                        return response.json();
                    }
                })
                .then((allData) => {
                    setSpeakersData(allData.speakers);
                    setSponsorsData(allData.sponsors);
                });
        }
        setIsWaiting(false);
    }, [from]);
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
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay-create-club')) {
            setIsModalOpenForEditedPost(false);
            setIsModalOpenForBanEvent(false)
            setIsModalOpenForActivatePost(false)
            setIsModalOpenForDeletePost(false)
            setIsModalOpenForRejectPost(false)
            setIsopenResoneOver(false)
            setResponseMsg('')
        }
    };
    const openisModaSuccess = () => {

        setIsModalOpenForSuccess(true);
    };
    const openLodingForActivity = () => {
        setIsWaiting(true);
    }
    const closeLodingForActivity = () => {
        setIsWaiting(false);
    }
    const handleClickButtonColse = (e) => {
        setIsModalOpenForEditedPost(false);
    };
    const finishedEditing = (e) => {
        window.location.reload();
    };
    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setCanOpenPage(false);
            setTimeout(() => {
                setIsModalOpenForSuccess(false);
              navigate({state:null})
                if (user&&user.authority.authorityName==="ROLE_MANAGER"){
                    navigate("/manager-dashboard");
                }
                if (user&&user.authority.authorityName==="ROLE_ADMIN"){
                   navigate("/dashboard");

                }
            }, 2000);

        }
        if (from === undefined || from === null || !from) {
            if (user&&user.authority.authorityName==="ROLE_MANAGER"){
                navigate("/manager-dashboard");
            }
            if (user&&user.authority.authorityName==="ROLE_ADMIN"){
                navigate("/dashboard");

            }

        }

    }, [isModalOpenForSuccess]);

    useEffect(() => {
       if(from) {
            setCategoriesForValue(allEventsCategories.filter(eventCategory =>
                eventCategory.event.eventID === from.eventID).map(category => category.category).map(category => ({
                label: category.categoryName,
                value: category.categoryName,
                categoryID: category.categoryID
            })));
        }
        console.log(categoriesForValue)
    }, [allEventsCategories]);

    return (
        <div className="eventPage">
            {(!data &&!from)&&
                (<div className="myClub-page-content">
                    <Loading/>
                    <h3>Redirecting You to Home...</h3>
                    <label
                        style={{fontSize: 100}}>
                        {String.fromCodePoint('0x1f604')}
                    </label>
                </div>)
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
                <Sidebar user={user}   allClubs={allClubs} isActive={isActive} events={events} clubNotifications={clubNotifications} club={club} />
            </div>
            <div className="event-pageBody" >
                <div className="page-event-titel">
                    <div className="Events">
                        "{data&&data.eventName?data.eventName.slice(0, 50):"No Data"}" Event </div>
                </div>
                {isedited||(data?data.eventUpdated:true)&&
                    (<div className="myClub-page-content">
                        <Loading/>
                        <h3>Redirecting You to Home...</h3>
                        <label
                            style={{fontSize: 100}}>
                            {String.fromCodePoint('0x1f604')}
                        </label>
                    </div>)
                }
                {data &&!isedited&&
                    (<div className="Backgrond-full-page">
                        {from.eventisRejected &&
                            <h4>
                                <FontAwesomeIcon className="rejected" icon={faCircleXmark}/>
                                Rejected Event </h4>}

                        {from.eventStates && <h4>
                            <FontAwesomeIcon className="accepted" icon={faCircleCheck}/>
                            Accepted Event </h4>}

                        {(from.eventUpdated || !from.eventStates) && !from.eventisRejected && <h4>
                            <FontAwesomeIcon className="warning" icon={faTriangleExclamation}/>
                            Pending Event </h4>}
                        <>
                            <div className="poster-info-full-page">

                                <img className="poster-info-img-full-page"
                                     onClick={() => (navigate(`/clubprofile`, {state: {club:data.club}}))}

                                     src={data ? data.club.clubProfilePicURL : 'NA'}
                                />
                                <div style={{marginLeft: "1%",cursor:"pointer"}}
                                     onClick={() => (navigate(`/clubprofile`, {state: {club:data.club}}))}
                                >
                                    <h5 style={{
                                        color: "black",
                                        fontSize: "20px",
                                        width: 400
                                    }}>{data ? data.club.clubName : 'NA'}</h5>
                                    <p style={{fontSize: "13px", color: "darkgray"}}>{data.eventCreationDate}</p>
                                </div>
                                <div className="poster-info-TDL-full-page">
                                    {user && (user.authority.authorityName === "ROLE_ADMIN"
                                            || user.authority.authorityName === "ROLE_MANAGER") &&

                                        <div className="post-choises">

                                            {(user.authority.authorityName === "ROLE_MANAGER") &&
                                                <button className="edit-postBTN"
                                                        onClick={() => {
                                                            setEventToBeEdited(data);
                                                            setIsModalOpenForEditedPost(true)

                                                        }}>
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </button>}
                                            {(user.authority.authorityName === "ROLE_ADMIN") &&
                                                data.eventStates &&
                                                <>
                                                    <button className="ban-btn" onClick={() => {
                                                        setEventToDeactivate(data)
                                                        setIsModalOpenForBanEvent(true)

                                                    }}>
                                                        <FontAwesomeIcon icon={faBan}/>
                                                    </button>

                                                </>
                                            }

                                            {(user.authority.authorityName === "ROLE_ADMIN") &&
                                                !data.eventStates && !data.eventisRejected &&

                                                <button className="admin-confirm" onClick={() => {
                                                    setEventToActivated(data);
                                                    setIsModalOpenForActivatePost(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faCheck}/>
                                                </button>}


                                            {(user.authority.authorityName === "ROLE_ADMIN") &&
                                                !data.eventStates &&
                                                <button className="rejectBTN" onClick={() => {
                                                    setEventToRejected(data);
                                                    setIsModalOpenForRejectPost(true)

                                                }}>
                                                    <FontAwesomeIcon icon={faXmark}/>
                                                </button>

                                            }
                                            <button className="deleteBTN" onClick={() => {
                                                setEventToBeDeleted(data);
                                                setIsModalOpenForDeletePost(true)

                                            }}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </button>


                                        </div>
                                    }


                                </div>
                            </div>

                            {/*//################################### EVENT REQUEST #########################################3*/}
                            {user&&(user.authority.authorityName === "ROLE_MANAGER")&&from.eventisRejected&&
                                <div>
                                <label className="admin-reason-input-label"> Reason :</label>
                                <div className="admin-reason-input-field-creat-club">
                                    <textarea
                                        type="text"
                                        placeholder="Not Spicified!!"
                                        value={reason}
                                        disabled={true}/>
                                </div>
                                </div>
                            }
                            <div className="modal-creat-club">

                                <div className={"Creat Event Form"}>
                                    <div className="modal-content-create-event">
                                        <h2> Event Data</h2>
                                        <br/>
                                        <div className="input-field-creat-club-third">
                                            <div className="input-field-creat-event-sponsor-speaker-contener">
                                                <div>
                                                    <label className="edit-input-label">
                                                        Event Name :

                                                    </label>
                                                    <div className="input-field-creat-club">

                                                        <input
                                                            type="text"
                                                            placeholder="NO DATA"
                                                            value={from.eventName}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="edit-input-label">
                                                        Event Hall:

                                                    </label>
                                                    <div className="input-field-creat-club">

                                                        <input
                                                            type="text"
                                                            placeholder="NO DATA"
                                                            value={from.eventHall}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-field-creat-event-sponsor-speaker-contener">
                                                <div>
                                                    <label className="edit-input-label">
                                                        Event Date :
                                                    </label>
                                                    <div className="input-field-creat-club">
                                                        <input
                                                            type="date"
                                                            placeholder="NO DATA"
                                                            value={from.eventStartingDate}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="edit-input-label">
                                                        Event Start Time :
                                                    </label>
                                                    <div className="input-field-creat-club">
                                                        <input
                                                            type="time"
                                                            placeholder="NO DATA "
                                                            value={from.eventNote}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="edit-input-label">
                                                        Event End Time? :
                                                    </label>
                                                    <div className="input-field-creat-club">
                                                        <input
                                                            type="time"
                                                            placeholder="NO DATA "
                                                            value={from.eventEndTime}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>

                                            <label className="edit-input-label"> Event Sponsors :
                                            </label>
                                            <br/>
                                            {sponsorsData && sponsorsData.length > 0 ? sponsorsData.map((sponsor, index) =>
                                                    <div className="input-field-creat-event-sponsor-speaker-contener">

                                                        <div>
                                                            <label className="edit-input-label">Sponsor Name :
                                                                NO {index + 1} </label>
                                                            <div className="input-field-fullpage-list">
                                                                <input
                                                                    type="text"
                                                                    placeholder="NO DATA " value={sponsor.name}
                                                                    name={"name"}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="edit-input-label">Sponsor Contact Number
                                                                :</label>
                                                            <div className="input-field-fullpage-list">
                                                                <input
                                                                    type="tel"
                                                                    placeholder="NO DATA "
                                                                    value={sponsor.contactNumber}
                                                                    name={"contactNumber"}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>)
                                                :
                                                <div className="input-field-creat-event-sponsor-speaker-contener">

                                                    <div>
                                                        <label className="edit-input-label">Sponsor Name :
                                                        </label>
                                                        <div className="input-field-fullpage-list">
                                                            <input
                                                                type="text"
                                                                placeholder="NO DATA "
                                                                name={"name"}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="edit-input-label">Sponsor Contact Number
                                                            :</label>
                                                        <div className="input-field-fullpage-list">
                                                            <input
                                                                type="tel"
                                                                placeholder="NO DATA "
                                                                name={"contactNumber"}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            }
                                            <br/>
                                            <label className="edit-input-label"> Event Speakers :
                                            </label>
                                            <br/>
                                            {speakersData && speakersData.length > 0 ?
                                                speakersData.map((speaker, index) =>
                                                    <div className="input-field-creat-event-sponsor-speaker-contener">

                                                        <div>
                                                            <label className="edit-input-label">Speaker Name :
                                                                NO {index + 1} </label>
                                                            <div className="input-field-fullpage-list">
                                                                <input
                                                                    type="text"
                                                                    placeholder="NO DATA " value={speaker.name}
                                                                    name={"name"}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="edit-input-label">Speaker Contact Number
                                                                :</label>
                                                            <div className="input-field-fullpage-list">
                                                                <input
                                                                    type="tel"
                                                                    placeholder="NO DATA "
                                                                    value={speaker.contactNumber}
                                                                    name={"contactNumber"}
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>)
                                                :
                                                <div className="input-field-creat-event-sponsor-speaker-contener">

                                                    <div>
                                                        <label className="edit-input-label">Speaker Name :
                                                        </label>
                                                        <div className="input-field-fullpage-list">
                                                            <input
                                                                type="text"
                                                                placeholder="NO DATA "
                                                                name={"name"}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="edit-input-label">Speaker Contact Number
                                                            :</label>
                                                        <div className="input-field-fullpage-list">
                                                            <input
                                                                type="tel"
                                                                placeholder="NO DATA "
                                                                name={"contactNumber"}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>}
                                            <br/>
                                            <div className={"Selectors-creat-event"}>
                                                <label className="edit-input-label">Category :
                                                </label>
                                                <Select
                                                    isMulti
                                                    name="categories"
                                                    value={categoriesForValue}
                                                    // options={selectedCategories.length < 3 ? categoriesForValue : []}
                                                    className="basic-multi-select-full-page"
                                                    placeholder={"NO DATA"}
                                                    classNamePrefix="select"
                                                    disabled={true}
                                                    openMenuOnClick={false}
                                                />

                                            </div>
                                            <br/>
                                            <div style={{marginTop: 5}}>
                                                <label className="edit-input-label">Event Description :

                                                </label>
                                                <div className="input-field-display-event-discr">

                                                    <textarea
                                                        className="last-name"
                                                        rows={9}
                                                        autoComplete="off"
                                                        placeholder={"NO DATA"}
                                                        value={from.eventDescription}
                                                        disabled={true}
                                                    />
                                                </div>

                                            </div>
                                            <div className="input-field-creat-event-sponsor-speaker-contener">
                                                <label className="edit-input-label"> public post requested ? :

                                                </label>
                                                <div className={"radio-BTN"}>
                                                    {from.eventPostRequested ?
                                                        <div className="radioButton">

                                                            <input
                                                                type="radio"
                                                                id="option1"
                                                                value={true}
                                                                checked={true}
                                                            />
                                                            :
                                                            <label htmlFor="option1" className="radioLabel">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        :
                                                        <div className="radioButton">
                                                            <input
                                                                type="radio"
                                                                id="option2"
                                                                value={true}
                                                                checked={true}

                                                            />
                                                            <label htmlFor="option2" className="radioLabel">
                                                                No
                                                            </label>
                                                        </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {from.eventPostRequested &&
                                    <div className={"Creat Event Post"}>
                                        <br/>
                                        <div className="modal-content-create-event">
                                            <br/>
                                            <h2> Event Post Data</h2>
                                            <br/>

                                            <div>
                                                <label className="edit-input-label"> Event Location URL:</label>
                                                <div className="input-field-creat-club">
                                                    <input
                                                        type="text"
                                                        placeholder="NO DATA"
                                                        value={from.eventLocationURL}
                                                        disabled={true}/>
                                                </div>
                                            </div>
                                            <br/>

                                            <div style={{marginTop: 10}}>
                                                <label className="edit-input-label">Event Post Description :
                                                </label>
                                                <div className="input-field-display-event-discr">

                                                    <textarea
                                                        className="last-name"
                                                        rows={9}
                                                        autoComplete="off"
                                                        placeholder={"NO DATA"}
                                                        value={from.eventPostDescription}
                                                        disabled={true}/>
                                                </div>

                                            </div>
                                            <div className="post-img-full-page-dashboard">
                                                <label className="edit-input-label-pic">
                                                    Event Post Image :
                                                </label>
                                                <br/>
                                                <img
                                                    className="img-full-page"
                                                    src={from ? from.eventPostMediaURL : ''}
                                                    alt="Example"
                                                    onClick={() => openModalForPic(from.eventPostMediaURL)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>


                        </>


                    </div>)
                }


            </div>
            {isModalOpenForPic && (
                <div className="modal-post-img" onClick={handleOverlayClick}>
                    <div className="modal-content-Page" onClick={handleOverlayClick}>
                        <span className="close" onClick={closeModalForPic}>&times;</span>
                        <img src={imageUrl} className={"img-page-content"}/>
                    </div>
                </div>
            )}
            {isModalOpenForEditedPost &&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                <EditFullEvent
                        user={user}
                        club={club}
                        event={from}
                        isOpenSeccess={() => {
                            openisModaSuccess();
                        }}
                        speakers={speakersData}
                        sponsors={sponsorsData}
                        eventCategory={categoriesForValue}
                        isFinshedEditing={finishedEditing}//reload
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
                                                           title={"Delete '" + eventToBeDeleted.eventName + "Event"}
                                                           text={"Are You Sure You Want To Delete This Event Post ?"}
                                                           onClose={() => setIsModalOpenForDeletePost(false)}
                                                           confirm={deletEvent}
            />}
            {
                isWaiting &&
                <div className="modal-post-img-edit-profile">
                    <Loading/>
                </div>


            }
            {isModalOpenForPic && (
                <div className="modal-post-img" onClick={handleOverlayClick}>
                    <div className="modal-content-Page" onClick={handleOverlayClick}>
                        <span className="close" onClick={closeModalForPic}>&times;</span>
                        <img src={imageUrl} className={"img-page-content"}/>
                    </div>
                </div>
            )}
            {isModalOpenForBanEvent&&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <h2>Deactivate {eventToBeDeactivate.eventName }"' Event"</h2>
                            <p className="content-p-confirm">Are You Sure You Want To Deactivate This Event  ?</p>
                            <div className={"modal-content"}>
                                {!isopenResoneOver&&
                                    <button className="add-reasoneBTN"
                                            onClick={() => setIsopenResoneOver(true)}
                                    >Include Reason
                                    </button>}
                                {isopenResoneOver&&
                                    <div  className="input-field-creat-event-discr">
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
                            <button className="CloseBTN-confirm" onClick={()=> {
                                setIsopenResoneOver(false)
                                setIsModalOpenForBanEvent(false)
                                setResponseMsg('')

                            }}>No</button>
                        </div>

                    </div>
                </div>
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
            {isModalOpenForActivatePost &&
                <ModalCanBeEdited isOpen={isModalOpenForActivatePost}
                                  title={"Activate '" + eventToBeActivated.eventName + "' Event"}
                                  text={"Are You Sure You Want To Activate This Event  ?"}
                                  onClose={() => setIsModalOpenForActivatePost(false)}
                                  confirm={activateEvent}

                />
            }
        </div>
    );
};

export default FlullPageEventDataManegment;