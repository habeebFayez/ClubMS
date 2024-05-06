import React, {useEffect, useState} from 'react';
import Sidebar from "../../Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faClock, faHashtag,
    faLocationDot,
    faPenToSquare,
    faPlus,
    faTimes,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import "./EventFullPage.css";
import {useLocation, useNavigate} from 'react-router-dom';
import EditEventPost from "../EditEventPost/EditEventPost";
import Loading from "../../../Component/loading/Loading";
import AnimationCheck from "../../../Component/AnimationCheck/AnimationCheck";
import {useLocalState} from "../../../util/useLocalState";
import ModalCanBeEdited from "../../../Component/ModalCanBeEdited/ModalCanBeEdited";

const EventFullPage = ({events,user,allClubs,clubNotifications, club,allEventsCategories, isActive,categories}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const location = useLocation()
    const navigate=useNavigate();

    const { from }=location.state||"";
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
    const [canOpenPage, setCanOpenPage] = useState(true);


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
        setIsEditedg(true);
    };
    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setCanOpenPage(false);
            setData(null);
            window.history.replaceState({}, '')
            setTimeout(() => {

                setIsModalOpenForSuccess(false);
                window.location.href="/home";
            }, 2000);

        }
        if(!location.state || !canOpenPage){
                window.location.href="/home";
        }

    }, [isModalOpenForSuccess]);


    return (canOpenPage&&
        <div className="eventPage">
            {errMsg && <p className="creat-club-error-message">
                <FontAwesomeIcon className={"Icon_close_err_mess"} onClick={() => {
                    setErrMsg(false)
                }}
                                 style={{fontSize: "25px"}}
                                 icon={faTimes}/>
                <br/>{errMsg}
            </p>}
            <div className="menu-sidebar-full-event-page">
                <Sidebar user={user} allClubs={allClubs} isActive={isActive} events={events}  clubNotifications={clubNotifications} club={club} />
            </div>
            <div className="event-pageBody" >
                <div className="page-event-titel">
                    <div className="Events">"{data?data.eventName.slice(0, 50):"No Data"}" Event </div>
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
                        {data &&data.eventStates&&!data.eventUpdated&&!isedited&&
                            (<div className="Backgrond-full-page">
                                    {user&&(data.clubID.clubManager.userID === user.userID) &&
                                        <div className="post-choises">
                                        <button className="deleteBTN" onClick={() => {
                                            setEventToBeDeleted(data);
                                            setIsModalOpenForDeletePost(true)

                                        }}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                        <button className="edit-postBTN"
                                                onClick={() => {
                                                    setEventToBeEdited(data);
                                                    setIsModalOpenForEditedPost(true)

                                                }}>
                                            <FontAwesomeIcon icon={faPenToSquare}/>
                                        </button>

                                    </div>}
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
                                            <div className="poster-info-time-date">
                                                <FontAwesomeIcon className="poster-info-icon-full-page" icon={faClock}/>
                                                <p>
                                                    {data.eventNote}
                                                </p>
                                            </div>
                                            <div className="poster-info-time-date">
                                                <FontAwesomeIcon className="poster-info-icon-full-page"
                                                                 icon={faCalendar}/>
                                                <p>
                                                    {data.eventStartingDate}
                                                </p>
                                            </div>
                                            <div className="poster-info-time-date">
                                                <FontAwesomeIcon className="poster-info-icon-full-page"
                                                                 icon={faLocationDot}/>
                                                <p>
                                                    Click to Navigate
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="post-text">
                                        <p style={{fontWeight: 650, fontSize: 20}}>{data.eventName}</p>
                                        <br/>
                                        <p style={{width: 1000}}>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: data.eventPostDescription.replace(/\n/g, '<br />')
                                                }}/>

                                        </p>
                                        <br/>
                                        {allEventsCategories.filter(category=>category.event.eventID===data.eventID).map(
                                            eventCategory=>
                                                <h5 className="post-tag">
                                                    <FontAwesomeIcon icon={faHashtag} />
                                                    {eventCategory.category.categoryName}</h5>)}
                                        <br/>
                                        {data.eventPostRequested&&
                                            <div className="post-img-full-page">
                                            <img
                                                className="img-full-page"
                                                src={data ? data.eventPostMediaURL : ''}
                                                alt="Example"
                                                onClick={() => openModalForPic(data.eventPostMediaURL)}
                                            />
                                        </div>}
                                    </div>
                                    <div className="post-footer"/>
                                </div>
                            )
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
            {isModalOpenForEditedPost&&
                <div className="modal-overlay-create-club" onClick={handleClickOutside}>
                    <EditEventPost
                        user={user}
                        club={club}
                        event={data}
                        isOpenSeccess={() => {
                            openisModaSuccess();
                        }}
                        isFinshedEditing={finishedEditing}
                        isLoading={openLodingForActivity}
                        stopLoading={closeLodingForActivity}
                        closeModal={handleClickButtonColse}
                        categories={categories}
                    />
                </div>}

            {isModalOpenForSuccess &&
                <div >
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
        </div>
    );
};

export default EventFullPage;