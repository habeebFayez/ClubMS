import React, {useEffect, useState} from 'react';
import PageTop from "./PageTop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBan,
    faCalendar,
    faClock,
    faHashtag,
    faLocationDot,
    faPenToSquare,
    faTimes,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import CreateEvent from "./CreateEvent/CreateEvent";
import {useLocalState} from "../../util/useLocalState";
import {Link, useNavigate} from 'react-router-dom';
import Loading from "../../Component/loading/Loading";
import "./Page.css";
import ModalCanBeEdited from "../../Component/ModalCanBeEdited/ModalCanBeEdited";
import EditEventPost from "./EditEventPost/EditEventPost";
import SpiningLoading from "../../Component/loading/SpiningLoading";

const GOOGLE_MAPS_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?google\.com\/maps\/.*$/;


const PageContent = ({user, club, isActive,isClubPage,allClubsCategories ,allEventsCategories, isModaSuccess ,isLoading,allClubs ,events,categories}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const navigate=useNavigate();

    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isModalOpenForCreatEvent, setIsModalOpenForCreatEvent] = useState(false);
    const [sortedEvents, setSortedEvents] = useState([]);
    const [eventToBeDeleted, setEventToBeDeleted] = useState();
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isModalOpenForDeletePost, setIsModalOpenForDeletePost] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [eventToBeEdited, setEventToBeEdited] = useState();
    const [isModalOpenForEditedPost, setIsModalOpenForEditedPost] = useState(false);
    const [isLoadingFilter, setIsLoadingFilter] = useState(false);
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [eventToBeDeactivate, setEventToDeactivate] = useState();
    const [isModalOpenForBanEvent, setIsModalOpenForBanEvent] = useState(false);
    const [responseMsg, setResponseMsg] = useState('');
    const [isopenResoneOver, setIsopenResoneOver] = useState(false);

    const [isedited, setIsEditedg] = useState(false);
    const today = new Date();
    const todayDate =today.toISOString().split('T')[0]
    const openModalForPic = (url) => {
        setImageUrl(url);
        setIsModalOpenForPic(true);
    };
    const closeModalForPic = () => {
        setIsModalOpenForPic(false);
    };
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModalForPic();
        }
    };
    const handleClickButtonColse = (e) => {

        setIsModalOpenForCreatEvent(false);
        setIsModalOpenForEditedPost(false);
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
                    setIsLoadingEvents(false);
                    setIsWaiting(false);
                    if (response.status === 200) {

                        setIsModalOpenForDeletePost(false);
                        isModaSuccess();
                    } else if (response.status === 401) {
                        setIsModalOpenForDeletePost(false);

                        setErrMsg('You cant Delete Event !!');
                    } else {
                        setIsModalOpenForDeletePost(false);

                        setErrMsg('Server Error !!');
                    }
                })

        } catch (err) {
            setIsLoadingEvents(false);
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
                        isModaSuccess();
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
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay-create-club')) {
            setIsModalOpenForCreatEvent(false);
            setIsModalOpenForEditedPost(false);
        }
    };
    const wordCount = (text) => {
        return text.split(/\s+/).length;
    };
    const openLodingForActivity = () => {
        setIsWaiting(true);
        setIsLoadingEvents(true);
    }
    const closeLodingForActivity = () => {
        setIsWaiting(false);
        setIsLoadingEvents(false);
    }

    const finishedEditing = (e) => {
        setIsEditedg(true);
    };
    useEffect(() => {
        setIsLoadingFilter(true);
        events&&

                ( setSortedEvents( events.filter(event=>
                event.eventStartingDate>=todayDate).sort((a, b) => {
                    const dateA = new Date(a.eventStartingDate);
                    const dateB = new Date(b.eventStartingDate);
                    return dateA - dateB;
                })))

        setIsLoadingFilter(false);
    }, [events]);
    useEffect(() => {
        if (!club) {
            setTimeout(() => {
                setLoadingFirst(false)
            }, 500);

        }
    }, [events]);
    useEffect(() => {
        if (errMsg !== '') {
            setTimeout(() => {
                setErrMsg('');
            }, 3000);

        }
    }, [errMsg]);
    useEffect(() => {
      setIsLoadingFilter(true)
            setTimeout(() => {
                setIsLoadingFilter(false)

            }, 2000);


    }, [sortedEvents]);
    return (<div>

            {errMsg && <p className="creat-club-error-message">
                <FontAwesomeIcon className={"Icon_close_err_mess"} onClick={() => {
                    setErrMsg(false)
                }}
                                 style={{fontSize: "25px"}}
                                 icon={faTimes}/>
                <br/>{errMsg}
            </p>}
            <PageTop title={"Events"} user={user} isActive={isActive} club={club} categories={categories}
                     sortedEvents={sortedEvents} allEventsCategories={allEventsCategories} allClubsCategories={allClubsCategories}
                     allClubs={allClubs} events={events} isClubPage={isClubPage}
                     isModalOpenForCreatEvent={() => setIsModalOpenForCreatEvent(true)}/>
            <div className="PostEvent">

                {/*########################################### POST EVENT ###########################################*/}
                {sortedEvents.length > 0 &&!isLoading ?
                    (sortedEvents.map(post =>  (post.eventStates && !post.eventUpdated && post.eventPostRequested &&
                        <div className="Backgrond" key={post.eventID}>
                            {user&&(post.clubID.clubManager.userID === user.userID) &&
                                <div className="post-choises">
                                <button className="deleteBTN" onClick={() => {
                                    setEventToBeDeleted(post);
                                    setIsModalOpenForDeletePost(true)

                                }}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                                <button className="edit-postBTN"
                                        onClick={() => {
                                            setEventToBeEdited(post);
                                            setIsModalOpenForEditedPost(true)

                                        }}>
                                    <FontAwesomeIcon icon={faPenToSquare}/>
                                </button>

                            </div>}
                            {user&&user.authority.authorityName==="ROLE_ADMIN" &&
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
                                     onClick={() => (navigate(`/clubprofile`, {state: {club:post.club}}))}

                                     src={post ? post.club.clubProfilePicURL : ''}
                                />
                                <div style={{marginLeft: "1%",cursor:"pointer"}}
                                     onClick={() => (navigate(`/clubprofile`, {state: {club:post.club}}))}
                                >
                                    <h5 style={{
                                        color: "black", fontSize: "14px", width: 200
                                    }}>{post ? post.club.clubName : 'NA'}</h5>
                                    <p style={{fontSize: "12px", color: "darkgray"}}>
                                        {post.eventCreationDate}
                                    </p>
                                </div>
                                <div className="poster-info-TDL">
                                    <div className="poster-info-time-date">
                                        <FontAwesomeIcon className="poster-info-icon" icon={faClock}/>
                                        <p>
                                            {post.eventNote}
                                        </p>
                                    </div>
                                    <div className="poster-info-time-date">
                                        <FontAwesomeIcon className="poster-info-icon" icon={faCalendar}/>
                                        <p>
                                            {post.eventStartingDate}
                                        </p>
                                    </div>
                                    <div className="poster-info-time-date">
                                        <FontAwesomeIcon className="poster-location-icon" icon={faLocationDot}/>
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
                                {allEventsCategories.filter(category=>category.event.eventID===post.eventID).map(
                                    eventCategory=>
                                        <h5 className="post-tag">
                                            <FontAwesomeIcon icon={faHashtag} />
                                            {eventCategory.category.categoryName}</h5>)}

                            </div>
                            <div className="post-img">
                                <img
                                    className="img"
                                    src={post ? post.eventPostMediaURL : ''}
                                    alt="Example"
                                    onClick={() => openModalForPic(post.eventPostMediaURL)}
                                />
                            </div>
                            <div className="post-footer"/>
                        </div>)))

                    :

                    (<div style={{alignSelf: "center", textAlign: "center", marginTop: 100}}>
                        {(isLoading||isLoadingFilter||loadingFirst)?
                            <div style={{alignSelf: "center", textAlign: "center", marginTop: 100}}>
                                <SpiningLoading/>
                            </div>
                        :
                            events&&!sortedEvents?
                                   <div>
                                    <h2>Something Went Wrong !! </h2>
                                    <h3>pleas try to refresh the page </h3>
                                    <a style={{fontSize: 30, color: "blue", textUnderlineOffset: false}}
                                       href={"/home"}>Refresh</a>
                                </div>
                                :

                                   !events&&
                                (<div>
                                    <h2>There is no Events </h2>
                                    <h3>Wait till someone creates one </h3>
                                    <label style={{fontSize: 100}} >
                                        {String.fromCodePoint('0x1f604')}
                                    </label>
                                </div>)}
                    </div>)}
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
                                 isModaSuccess();
                             }}
                             isLoading={openLodingForActivity}
                             stopLoading={closeLodingForActivity}
                             closeModal={handleClickButtonColse}
                             categories={categories}
                />
            </div>}
           {isModalOpenForEditedPost&&
               <div className="modal-overlay-create-club" onClick={handleClickOutside}>
               <EditEventPost
                   user={user}
                   club={club}
                   event={eventToBeEdited}
                   isOpenSeccess={() => {
                       isModaSuccess();
                   }}
                   isFinshedEditing={finishedEditing}
                   isLoading={openLodingForActivity}
                   stopLoading={closeLodingForActivity}
                   closeModal={handleClickButtonColse}
                   categories={categories}
               />
               </div>}

            {isLoadingEvents && isWaiting &&
                <div className="modal-post-img-edit-profile">
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
        </div>);
};

export default PageContent;