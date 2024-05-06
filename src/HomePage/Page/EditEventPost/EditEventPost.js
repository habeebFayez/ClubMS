import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocation, faNoteSticky, faPenToSquare, faStar, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useLocalState} from "../../../util/useLocalState";
import Select from "react-select";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../../api/Firebase";
import "../CreateEvent/CreateEvent.css";
import "./EditEventPost.css";
import "../../../Users/StudentUser/MyClub.css";
const EVENT_NAME_REGEX = /^[a-zA-Z ]{3,50}$/;
const EDIT_EVENT_URL = 'api/event/editEventpost'
const GOOGLE_MAPS_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?google\.com\/maps\/.*$/;
const EditEventPost = ({user,event, isOpenSeccess,isLoading,stopLoading,isFinshedEditing, closeModal, club, categories}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    // ############################################################# EVENT VALUES ####################################################
    const [eventName, setEventName] = useState(event.eventName);
    const [validEventName, setValidEventName] = useState(false);
    const [eventPostDescription, setEventPostDescription] = useState(event.eventPostDescription);
    const [eventLocationURL, setEventLocationURL] = useState(event.eventLocationURL);
    const [eventPostMediaURL, setEventPostMediaURL] = useState(event.eventPostMediaURL);
    const [eventTime, setEventTime] = useState(event.eventNote);
    const [eventEndTime, setEventEndTime] = useState(event.eventEndTime);
    const [eventHall, setEventHall] = useState(event.eventHall);
    const [eventStartingDate, setEventStartingDate] = useState(event.eventStartingDate);
    const [file, setFile] = useState('');
    const [validEventTime, setValidEventTime] = useState(false);

    // ############################################################# FRONT VALUES ####################################################
    const [imageUrl, setImageUrl] = useState('');
    const errRef = useRef(null);
    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const today = new Date();
    const todayDate =today.toISOString().split('T')[0]
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const time = `${hours}:${minutes}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((eventPostMediaURL === '')){
            setErrMsg("You must Upload Event image to continue !!");
            return;
        }
        if (!validEventName) {
            setErrMsg("Event name must be Minimum 3 characters up to 50 !! \n" +
                "  special characters like \"!@#$%^&*()}{[];:' \" are not allowed ");
            return;
        }
        if(!(eventLocationURL==='')&&!GOOGLE_MAPS_URL_REGEX.test(eventLocationURL)){
            setErrMsg("Please Enter Valid Google Maps URL");

            return;
        }
        if (!validEventTime) {
            setErrMsg("Event Ending Time  must be Minimum 1 hour difference of starting Time !! ");
            return;
        }
        if (eventStartingDate===todayDate && eventTime<time){
            setErrMsg(`Event Time cant be before ${time} of Today !! `);
            return;
        }
        if(eventStartingDate<todayDate){
            setErrMsg(`Event Date cant be before today !! ${todayDate}`);
            return;
        }
        try {
            isLoading();
            fetch(EDIT_EVENT_URL,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    withCredentials: true,
                    method: "PUT",
                    body: JSON.stringify({
                        event:
                            {
                               eventID:event.eventID, eventName, eventLocationURL, eventPostMediaURL,
                                eventStartingDate, eventNote: eventTime,eventEndTime,eventPostDescription,eventHall
                            },
                    })
                })
                .then((response) => {
                    stopLoading();
                    if (response.status === 200) {
                        isOpenSeccess();
                        closeModal();
                        isFinshedEditing();
                    } else if (response.status === 401) {
                        setErrMsg('You cant Edit Event !!');
                    } else {
                        setErrMsg('Server Error !!');
                        console.error(response);
                    }
                })

        } catch (err) {
            stopLoading();
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else {
                setErrMsg('Something went wrong!!');
            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }
        console.log("event before"+event.eventLocationURL);
        console.log("event after"+eventLocationURL);

    };

    const openModalForPic = (url) => {
        setImageUrl(url);
        setIsModalOpenForPic(true);
    };
    const closeModalForPic = () => {
        setIsModalOpenForPic(false);
    };
    const handleOverlayClickClosePic = (e) => {
        if (e.target === e.currentTarget) {
            closeModalForPic();
        }
    };
    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return new Date(0, 0, 0, hours, minutes);
    };
    useEffect(() => {
        if (file) {
            // Check if the selected file is an image
            if (!file.type.startsWith('image/')) {
                setErrMsg("Please upload an image file!!");
                setFile('');
                return;
            }
            const uploadFile = () => {
                const newname = new Date().getTime();
                const storageRef = ref(storage, 'images/' + newname + file.name);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is : " + progress + "% done of 100%");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                            default:
                                break;
                        }
                    }, (error) => {
                        setErrMsg(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setEventPostMediaURL(downloadURL);
                        });
                    }
                );
            };

            uploadFile();
        }

    }, [file]);
    useEffect(() => {
        const result = EVENT_NAME_REGEX.test(eventName);
        setValidEventName(result);
    }, [eventName]);
    useEffect(() => {
        if (errMsg) {
            setTimeout(() => {
                setErrMsg('');
            }, 4000);
        }
    }, [errMsg]);
    useEffect(() => {
        const timeOutPut = (parseTime(eventEndTime).getTime()-parseTime(eventTime).getTime())/60000;
        setValidEventTime(timeOutPut> 59);

    }, [eventTime ,eventEndTime]);


    return (
        <div>
            {errMsg&&
                <p className="creat-club-error-message">
                    <FontAwesomeIcon className={"Icon_close_err_mess"} onClick={() => {
                        setErrMsg('');
                    }} icon={faTimes}/>
                    <br/>{errMsg}
                </p>}
        <div className="modal-edit-event" >

        <div className={"Creat Event Post"}>
            <div className="modal-content-create-event">
                <h3>Creat Event Post</h3>
                <p>Edit Event Post</p>
                <br/>
                <div className="input-field-creat-club-third">

                    <div className="input-field-edit-event-first">
                        <div>
                            <label className="edit-event-input-label"> Event Name:
                                <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                            </label>
                            <div className="input-field-creat-club">
                                <FontAwesomeIcon icon={faNoteSticky}/>
                                <input
                                    type="text"
                                    placeholder="Club Name"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}

                                />
                            </div>
                        </div>
                        <div>
                            <label className="edit-event-input-label">
                                Event Hall:
                                <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                            </label>
                            <div className="input-field-creat-club">
                                <FontAwesomeIcon icon={faLocation}/>
                                <input
                                    type="text"
                                    placeholder="Campus/Block/Floor/Hall"
                                    value={eventHall}
                                    onChange={(e) => setEventHall(e.target.value)}

                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="input-field-creat-event-sponsor-speaker-contener">
                    <div>
                        <label className="edit-input-label">
                            Event Date :
                            <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                        </label>
                        <div className="input-field-creat-club">
                            <input
                                type="date"
                                placeholder="Club Name"
                                value={eventStartingDate}
                                onChange={(e) => setEventStartingDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="edit-input-label">
                            Event Start Time :
                            <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                        </label>
                        <div className="input-field-creat-club">
                            <input
                                type="time"
                                placeholder="Event Time "
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="edit-input-label">
                            Event End Time? :
                            <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                        </label>
                        <div className="input-field-creat-club">
                            <input
                                type="time"
                                placeholder="Event Time "
                                value={eventEndTime}
                                onChange={(e) => setEventEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>


                <div>
                    <label className="edit-event-input-label"> Event Location URL:</label>
                    <div className="input-field-creat-club">
                        <FontAwesomeIcon icon={faLocation}/>
                        <input
                            type="text"
                            placeholder="Paste Location URL Here"
                            value={eventLocationURL}
                            onChange={(e) => setEventLocationURL(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{marginTop: 10}}>
                    <label className="edit-input-label-Description">Event Post Description :
                    </label>
                    <div className="input-field-creat-event-discr">
                        <FontAwesomeIcon icon={faPenToSquare}/>

                        <textarea
                            className="last-name"
                            rows={9}
                            autoComplete="off"
                            placeholder={"Club Description"}
                            value={eventPostDescription}
                            onChange={(e) => setEventPostDescription(e.target.value)}
                        />
                    </div>

                </div>

                <div className="input-field-creat-event-pic">
                    <div className="post-image-event">
                        <label className="edit-input-label-pic">
                            Event Post Image :
                            <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                        </label>
                        <img
                            className={"open-img-creat-club"}
                            id="profilpic"
                            src={file ? URL.createObjectURL(file) : (event ? event.eventPostMediaURL : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg")}
                            onClick={() => openModalForPic(file ? URL.createObjectURL(file) : (event.eventPostMediaURL ? event.eventPostMediaURL : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg"))}
                            style={{
                                width: 100,
                                height: 100,
                                position: 'absolute',
                                borderRadius: 15,
                                border: "1px solid #505050"
                            }}
                        />
                        <div className="input-container-creat-event-post">
                            <input type="file"
                                   onChange={(e) => setFile(e.target.files[0])}
                                   className="btn-create-event-img"
                                   accept=".png, .jpg, .jpeg"/>
                        </div>
                    </div>

                </div>
            </div>
            <div className="button-container-create-club">
                {eventName && eventTime && eventHall && eventPostMediaURL && eventStartingDate ?
                    <button className="SaveBTN"
                            onClick={handleSubmit}
                    >Confirm</button>
                    :
                    <button className="not-valid-SaveBTN" disabled={true}
                    >Confirm</button>
                }
                <button className="CloseBTN" type={"button"} onClick={closeModal}>Close
                </button>
            </div>
            {isModalOpenForPic && (
                <div className="modal-post-img-creat-club" onClick={handleOverlayClickClosePic}>
                    <div className="modal-content-Page-creat-club" onClick={handleOverlayClickClosePic}>
                        <span className="close-for-creat-club" onClick={closeModalForPic}>&times;</span>
                        <img src={imageUrl} className={"img-creat-club"}/>
                    </div>
                </div>
            )}
        </div>
        </div>
        </div>
    );
};

export default EditEventPost;