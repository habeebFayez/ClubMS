import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarDays, faClock, faCross,
    faLocation,
    faNoteSticky, faPenToSquare, faPlus, faStar,
    faTimes, faTrash,
    faUser,
    faUserGroup
} from "@fortawesome/free-solid-svg-icons";
import {useLocalState} from "../../../util/useLocalState";
import axios from "../../../api/axios";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../../api/Firebase";
import "./CreateEvent.css";
import "../../../EditProfile/EditProfile.css";

import Select from 'react-select';
import Loading from "../../../Component/loading/Loading";

const PHONE_NUMBER_REGEX = /^\d+$/;
const EVENT_NAME_REGEX = /^[a-zA-Z ()]{3,50}$/;
const CREATE_EVENT_URL = 'api/event/createEvent'
const GOOGLE_MAPS_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?google\.com\/maps\/.*$/;

const CreateEvent = ({user, isOpenSeccess,isLoading,stopLoading, closeModal, club, categories}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    // ############################################################# EVENT VALUES ####################################################
    const [eventName, setEventName] = useState('');
    const [validEventName, setValidEventName] = useState(false);
    const [validEventTime, setValidEventTime] = useState(false);
    const [eventDescription, setEventDescription] = useState('');
    const [eventPostDescription, setEventPostDescription] = useState('');
    const [eventLocationURL, setEventLocationURL] = useState('');
    const [eventPostMediaURL, setEventPostMediaURL] = useState('https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F17140737510891000_F_767765511_rtJxp7ErgqwzDRPE6miLMluFJnfyrfUR.jpg?alt=media&token=43237d84-4c97-4cb1-a58c-a0f786ec803a');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [eventTime, setEventTime] = useState('');
    const [eventEndTime, setEventEndTime] = useState('');
    const [eventHall, setEventHall] = useState('');
    const [eventStartingDate, setEventStartingDate] = useState('');
    const [file, setFile] = useState('');
    const [eventSponsors, setEventSponsors] = useState([]);
    const [eventSpeakers, setEventSpeakers] = useState([]);
    const [eventCategories, setEventCategories] = useState([]);

    // ############################################################# FRONT VALUES ####################################################
    const [imageUrl, setImageUrl] = useState('');
    const [categoriesForValue, setCategoriesForValue] = useState([]);
    const [selectedValue,setSelectedValue] = useState(false);
    const [eventPostRequested, setIsEventPostRequested] = useState(false);
    const [isModalOpenForSponsorsForm, setIsModalOpenForSponsorsForm] = useState(false);
    const [isModalOpenForSpeakersForm, setIsModalOpenForSpeakersForm] = useState(false);
    const errRef = useRef(null);
    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [sponsorsData, setSponsorsData] = useState([]);
    const [speakersData, setSpeakersData] = useState([]);
    const today = new Date();
    const todayDate =today.toISOString().split('T')[0]
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const time = `${hours}:${minutes}`;
    const [loadingImage,setloadingImage] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((file === '') && eventPostRequested){
            setErrMsg("You must Upload Event image to continue !!");
            return;
    }
        if (!validEventName) {
            setErrMsg("Event name must be Minimum 3 characters up to 24 !! \n" +
                "  special characters like \"!@#$%^&*()}{[];:' \" are not allowed ");
            return;
        }
        if (!validEventTime) {
            setErrMsg("Event Ending Time  must be Minimum 1 hour difference of starting Time !! ");
            return;
        }
        if(!(eventLocationURL==='')&&!GOOGLE_MAPS_URL_REGEX.test(eventLocationURL)){
            setErrMsg("Please Enter Valid Google Maps URL");
            return;
        }
        if(eventStartingDate<todayDate){
            setErrMsg("Event Date cant be before today !! ");
            return;
        }
        if (eventStartingDate===todayDate && eventTime<time){
            setErrMsg(`Event Time cant be before ${time} of Today !! `);
            return;
        }
        if (eventSponsors.length<1 || eventSpeakers<1){
            setErrMsg("Please Enter at least One Sponsor and One Speaker !!");
            return;
        }
        try {
            isLoading();
            fetch(CREATE_EVENT_URL,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`
                    },
                    withCredentials: true,
                    method: "post",
                    body: JSON.stringify({
                        event:
                            {
                                eventName, eventDescription, eventLocationURL,
                                eventPostMediaURL, eventStartingDate, eventNote: eventTime,eventPostDescription,
                                eventPostRequested,eventHall,eventEndTime
                            },
                        category: eventCategories,
                        speakers: eventSpeakers,
                        sponsors: eventSponsors
                    })
                })
                .then((response) => {
                    stopLoading();
                    if (response.status === 200) {
                        isOpenSeccess();
                        closeModal();
                    } else if (response.status === 401) {
                        setErrMsg('You cant creat Event !!');
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
                setErrMsg('You cant creat Event !!');

            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }


    };
    const nextToPostEvent = () => {
           if(!validEventName){
               setErrMsg("Event name must be Minimum 3 characters up to 24 !! \n" +
                   "  special characters like \"!@#$%^&*()}{[];:' \" are not allowed ");
               return;
           }
        if (!validEventTime) {
            setErrMsg("Event Ending Time  must be Minimum 1 hour ,Maximum 2 hours difference of starting Time !! ");
            return;
        }
           if(eventStartingDate<todayDate){
               setErrMsg(`Event Date cant be before today !! ${todayDate}`);
               return;
           }
        if (eventStartingDate===todayDate && eventTime<time){
            setErrMsg(`Event Time cant be before ${time} of Today !! `);
            return;
        }
        if (eventSponsors.length<1 || eventSpeakers<1){
            setErrMsg("Please Enter at least One Sponsor and One Speaker !!");
            return;
        }

           setIsEventPostRequested(true);

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
   const handleRadioChange = (value) => {
        setSelectedValue(value);
    };
    const  handleClickButtonConfirmSpeakers = () => {
        if (speakersData.length > 0) {
            const hasEmptyFields = speakersData.some(speakers => speakers.name === "" || speakers.contactNumber === "");
            const onRegexFields = speakersData.some(speaker =>
                EVENT_NAME_REGEX.test(speaker.name) && PHONE_NUMBER_REGEX.test(speaker.contactNumber));
            if (!hasEmptyFields) {
                if (onRegexFields) {
                    setEventSpeakers(speakersData);
                    handleClickButtonColse();
                } else {
                    setErrMsg("Please fill in the Name only Min 3 letters and Contact Number only Integers!!");
                }
            } else {
                setErrMsg("Please fill in all speakers details before confirming.");
            }
        } else {
            setErrMsg("No speakers added to confirm.");
        }

    };
    const handleClickButtonColse = (e) => {
        setIsModalOpenForSpeakersForm(false);
        setIsModalOpenForSponsorsForm(false);


    };
    const handelDeletspealkerClick = (index) => {
        const updatedSpeacersValue=[...speakersData];
        updatedSpeacersValue.splice(index,1);
        setSpeakersData(updatedSpeacersValue);
        if(eventSpeakers.length>0){
            const updatedSpeacersValue=[...eventSpeakers];
            updatedSpeacersValue.splice(index,1);
            setEventSpeakers(updatedSpeacersValue);
        }
    };
    const handelSpeakersChange = (e,index) => {
        const {name,value}=e.target
        const onChangeValue=[...speakersData];
        onChangeValue[index][name]=value;
        setSpeakersData(onChangeValue);
    };
    const addMoreInputFieldSpeakers = (e) => {
        if(speakersData.length<5){
            setSpeakersData([...speakersData,{name:"",contactNumber:""}]);
        }else {
            setErrMsg("Cant Add More Than 5 Speakers !! ")
        }

    };
    const handleClickButtonConfirmSponsors = () => {
        if (sponsorsData.length > 0) {
            const hasEmptyFields = sponsorsData.some(sponsor => sponsor.name === "" || sponsor.contactNumber === "");
            const onRegexFields = sponsorsData.some(sponsor =>
                EVENT_NAME_REGEX.test(sponsor.name) && PHONE_NUMBER_REGEX.test(sponsor.contactNumber));

            if (!hasEmptyFields) {
                if (onRegexFields) {
                    setEventSponsors(sponsorsData);
                    handleClickButtonColse();
                } else {
                    setErrMsg("Please fill in the Name only Min 3 letters and Contact Number only Integers!!");
                }
            } else {
                setErrMsg("Please fill in all sponsor details before confirming.");
            }
        } else {
            setErrMsg("No sponsors added to confirm.");
        }
    };
    const handelDeletSponsorsClick = (index) => {
        const updatedSpeacersValue=[...sponsorsData];
        updatedSpeacersValue.splice(index,1);
        setSponsorsData(updatedSpeacersValue);
        if(eventSponsors.length>0){
            const updatedSpeacersValue=[...eventSponsors];
            updatedSpeacersValue.splice(index,1);
            setEventSponsors(updatedSpeacersValue);
        }
    };
    const handelSponsorsChange = (e,index) => {
        const {name,value}=e.target
        const onChangeValue=[...sponsorsData];
        onChangeValue[index][name]=value;
        setSponsorsData(onChangeValue);

    };
    const addMoreInputFieldSponsors = (e) => {
        if(sponsorsData.length<5){
            setSponsorsData([...sponsorsData,{name:"",contactNumber:""}]);
        }else {
            setErrMsg("Cant Add More Than 5 Sponsors !! ")
        }

    };
    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return new Date(0, 0, 0, hours, minutes);
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
    useEffect(() => {
        const updatedCategories = selectedCategories.map(category => ({
            categoryName: category.value,
            categoryID: category.categoryID
        }));
        setEventCategories(updatedCategories);
    }, [selectedCategories]);
    useEffect(() => {
        if (file) {
            // Check if the selected file is an image
            if (!file.type.startsWith('image/')) {
                setErrMsg("Please upload an image file!!");
                setFile('');
                return;
            }
        const uploadFile = () => {
            setloadingImage(true);
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
            setloadingImage(false);
        };

            uploadFile();
        }

    }, [file]);
    useEffect(() => {
        if (errMsg) {
            setTimeout(() => {
                setErrMsg('');
            }, 8000);
        }
    }, [errMsg]);
    useEffect(() => {
        const result = EVENT_NAME_REGEX.test(eventName);
        setValidEventName(result);
    }, [eventName]);
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
                    }}

                                     icon={faTimes}/>
                    <br/>{errMsg}
                </p>}

            {/*//################################### EVENT REQUEST #########################################3*/}

            <div className="modal-creat-club"  >

                {!eventPostRequested?
                    (
                        <div className={"Creat Event Form"}>
                        <div className="modal-content-create-event">
                            <h3>Creat Event Form</h3>
                            <p>This form to be sent to the Admin</p>
                            <br/>
                            <div className="input-field-creat-club-third">
                                <div className="input-field-creat-event-sponsor-speaker-contener">
                                    <div>
                                        <label className="edit-input-label">
                                            Event Name :
                                            <FontAwesomeIcon className="req-star-input" icon={faStar} />
                                        </label>
                                        <div className="input-field-creat-club">
                                            <FontAwesomeIcon icon={faNoteSticky}/>
                                            <input
                                                type="text"
                                                placeholder="Event Name"
                                                value={eventName}
                                                onChange={(e) => setEventName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="edit-input-label">
                                            Event Hall:
                                            <FontAwesomeIcon className="req-star-input" icon={faStar} />
                                        </label>
                                        <div className="input-field-creat-club">
                                            <FontAwesomeIcon icon={faLocation}/>
                                            <input
                                                type="text"
                                                placeholder="Campus/Block/Floor/Hall"
                                                value={eventHall}
                                                onChange={(e) => setEventHall(e.target.value)}
                                                required
                                            />
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
                                <div className="input-field-creat-event-sponsor-speaker-contener">
                                    <div>
                                        <label className="edit-input-label"> Event Speakers :
                                            <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                                        </label>
                                        <div className="input-field-creat-club">
                                            <button
                                                className={"Speakers-Sponsors-BTN"}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsModalOpenForSpeakersForm(true);
                                                }}>
                                            Event Speakers
                                                : {eventSpeakers.length > 0 ? eventSpeakers.length : "Not Specified"}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="edit-input-label"> Event Sponsors :
                                            <FontAwesomeIcon className="req-star-input" icon={faStar} />
                                        </label>
                                        <div className="input-field-creat-club">
                                            <button
                                                className={"Speakers-Sponsors-BTN"}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsModalOpenForSponsorsForm(true)
                                                }}>
                                                Event Sponsors
                                                : {eventSponsors.length > 0 ? eventSponsors.length : "Not Specified"}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                                <div className={"Selectors-creat-event"}>
                                    <label className="edit-input-label">Category :
                                        <FontAwesomeIcon className="req-star-input" icon={faStar} />
                                    </label>
                                    <Select
                                        isMulti
                                        name="categories"
                                        value={selectedCategories}
                                        options={selectedCategories.length < 3 ? categoriesForValue : []}
                                        className="basic-multi-select"
                                        placeholder={"Select three Categories maximum"}
                                        classNamePrefix="select"
                                        required
                                        onChange={(selectedOptions) => setSelectedCategories(selectedOptions)}
                                    />

                                </div>
                                <div style={{marginTop:5}}>
                                    <label className="edit-input-label">Event Description :
                                        <FontAwesomeIcon className="req-star-input" icon={faStar} />
                                    </label>
                                    <div className="input-field-creat-event-discr">
                                        <FontAwesomeIcon icon={faPenToSquare}/>

                                        <textarea
                                            className="last-name"
                                            rows={9}
                                            autoComplete="off"
                                            placeholder={"Club Description"}
                                            value={eventDescription}
                                            onChange={(e) => setEventDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                </div>
                                <div className="input-field-creat-event-sponsor-speaker-contener">
                                    <label className="edit-input-label">Do You want to create a public post to everyone ? :
                                        <FontAwesomeIcon className="req-star-input" icon={faStar} />
                                    </label>
                                    <div className={"radio-BTN"}>
                                        <div className="radioButton">
                                            <input
                                                type="radio"
                                                id="option1"
                                                value={true}
                                                checked={selectedValue === true}
                                                onChange={() => handleRadioChange(true)}
                                            />
                                            <label htmlFor="option1" className="radioLabel">
                                                Yes
                                            </label>
                                        </div>

                                        <div className="radioButton">
                                            <input
                                                type="radio"
                                                id="option2"
                                                value={false}
                                                checked={selectedValue === false}
                                                onChange={() => handleRadioChange(false)}
                                            />
                                            <label htmlFor="option2" className="radioLabel">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="button-container-create-club">
                        {selectedValue?
                            (eventDescription && eventName && selectedCategories.length > 0 && eventHall && eventTime
                                    &&eventStartingDate?
                                    <button className="SaveBTN" type={"button"} onClick={nextToPostEvent}
                                    >Next</button>
                                    :
                                    <button className="not-valid-SaveBTN" type={"button"} disabled={true} >Next</button>
                            )
                            :
                            (eventDescription && eventName && selectedCategories.length > 0 && eventHall && eventTime
                                &&eventStartingDate?
                                    <button className="SaveBTN"
                                            onClick={handleSubmit}
                                    >Confirm</button>
                                    :
                                    <button className="not-valid-SaveBTN" disabled={true} >Confirm</button>
                            )
                        }

                        <button className="CloseBTN" type={"button"} onClick={closeModal}>Close</button>
                    </div>
                        </div>
                    )
                :
                    (
                        <div className={"Creat Event Post"}>
                            <div className="modal-content-create-event">
                                <h3>Creat Event Post</h3>
                                <p>This form to be Posted to Everyone</p>
                                <br/>
                                <div className="input-field-creat-club-third">

                                    <div className="input-field-creat-club-first">
                                        <div>
                                            <label className="edit-input-label"> Event Name:</label>
                                            <div className="input-field-creat-club">
                                                <FontAwesomeIcon icon={faNoteSticky}/>
                                                <input
                                                    type="text"
                                                    placeholder="Club Name"
                                                    value={eventName}
                                                    onChange={(e) => setEventName(e.target.value)}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="edit-input-label">
                                                Event Hall:
                                            </label>
                                            <div className="input-field-creat-club">
                                                <FontAwesomeIcon icon={faLocation}/>
                                                <input
                                                    type="text"
                                                    placeholder="Campus/Block/Floor/Hall"
                                                    value={eventHall}
                                                    onChange={(e) => setEventHall(e.target.value)}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-field-creat-club-first">
                                    <div>
                                        <label className="edit-input-label"> Event Start Time :</label>
                                        <div className="input-field-creat-club">
                                            <input
                                                type="time"
                                                placeholder="Event Time "
                                                value={eventTime}
                                                onChange={(e) => setEventTime(e.target.value)}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="edit-input-label"> Event End Time :</label>
                                        <div className="input-field-creat-club">
                                            <input
                                                type="time"
                                                placeholder="Event Time "
                                                value={eventEndTime}
                                                onChange={(e) => setEventTime(e.target.value)}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="edit-input-label"> Event Date :</label>
                                        <div className="input-field-creat-club">
                                            <input
                                                type="date"
                                                value={eventStartingDate}
                                                min={today}
                                                onChange={(e) => setEventStartingDate(e.target.value)}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div>
                                    <label className="edit-input-label"> Event Location URL:</label>
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
                                    <label className="edit-input-label">Event Post Description :
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
                                            <FontAwesomeIcon className="req-star-input" icon={faStar} />
                                        </label>
                                        <img
                                            className={"open-img-creat-club"}
                                            id="profilpic"
                                            src={file ? URL.createObjectURL(file) : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg"}
                                            onClick={() => openModalForPic(file ? URL.createObjectURL(file) : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg")}
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
                                {eventDescription && eventName && selectedCategories.length > 0 && eventHall && eventTime
                                && eventStartingDate&& eventPostMediaURL && eventSponsors.length > 0 && eventSpeakers.length > 0 ?
                                    <button className="SaveBTN"
                                            onClick={handleSubmit}
                                        >Confirm</button>
                                    :
                                    <button className="not-valid-SaveBTN"  disabled={true}
                                           >Confirm</button>
                                }
                                <button className="CloseBTN" type={"button"} onClick={() => setIsEventPostRequested(false)}>Back
                                </button>
                            </div>
                        </div>
                    )
                }


            </div>


            {/*//################################### MODAL POST IMAGE #########################################3*/}

            {isModalOpenForPic && (
                <div className="modal-post-img-creat-club" onClick={handleOverlayClickClosePic}>
                    <div className="modal-content-Page-creat-club" onClick={handleOverlayClickClosePic}>
                        <span className="close-for-creat-club" onClick={closeModalForPic}>&times;</span>
                        <img src={imageUrl} className={"img-creat-club"}/>
                    </div>
                </div>
            )}

            {/*//################################### MODAL Speakers #########################################3*/}

            {isModalOpenForSpeakersForm &&
                <div className="modal-overlay" onClick={(e)=>{
                    if(e.target===e.currentTarget)handleClickButtonColse()}}>
                    <div className="modal-confirm-speaker-sponser">
                        <div className="modal-content">
                            <h2>Write Speakers Details</h2>
                            <p className="content-p-confirm">Press Add Button to add more Speakers (5 Max) </p>


                            {speakersData.map((value, index) =>
                                <div className="input-field-creat-event-sponsor-speaker-contener">
                                    <div>
                                        <label className="edit-input-label"> Name & Surname :</label>
                                        <div className="input-field-creat-club">
                                            <input
                                                type="text"
                                                placeholder="Name & Surname"
                                                value={value.name}
                                                name={"name"}
                                                onChange={(e) => handelSpeakersChange(e, index)}
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="edit-input-label"> Contact Number :</label>
                                        <div className="input-field-creat-club">
                                            <input
                                                type="tel"
                                                placeholder="Contact Number "
                                                value={value.contactNumber}
                                                name={"contactNumber"}
                                                onChange={(e) => handelSpeakersChange(e, index)}
                                                pattern="[0-9]*"
                                                aria-valuemax={10}
                                                required={true}
                                            />
                                        </div>
                                    </div>

                                    <button className="delete-speaker-sponser-BTN"
                                            onClick={() => handelDeletspealkerClick(index)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            )
                            }
                            <button className="add-speaker-sponser-BTN" onClick={addMoreInputFieldSpeakers}>
                                <FontAwesomeIcon style={{fontSize: 18}} icon={faPlus}/>
                                Add Speaker
                            </button>

                            <div className="button-container-confirm">
                                <button className="SaveBTN-confirm" onClick={handleClickButtonConfirmSpeakers}>Confirm
                                </button>
                                <button className="CloseBTN-confirm"  onClick={() => {
                                    handleClickButtonColse()
                                }}>Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/*//################################### MODAL Sponsors #########################################3*/}

            {isModalOpenForSponsorsForm &&
                <div className="modal-overlay">
                    <div className="modal-confirm-speaker-sponser">
                        <div className="modal-content">
                            <h2>Write Sponsors Details</h2>
                            <p className="content-p-confirm">Press Add Button to add more Sponsors (5 Max) </p>


                            {sponsorsData.map((value, index) =>
                                <div className="input-field-creat-event-sponsor-speaker-contener">
                                    <div>
                                        <label className="edit-input-label"> Name & Surname :</label>
                                        <div className="input-field-creat-club">
                                            <input
                                                type="text"
                                                placeholder="Name & Surname"
                                                value={value.name}
                                                name={"name"}
                                                onChange={(e) => handelSponsorsChange(e, index)}
                                                required={true}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="edit-input-label"> Contact Number :</label>
                                        <div className="input-field-creat-club">
                                            <input
                                                type="tel"
                                                placeholder="Contact Number "
                                                value={value.contactNumber}
                                                name={"contactNumber"}
                                                onChange={(e) => handelSponsorsChange(e, index)}
                                                pattern="[0-9]*"
                                                aria-valuemax={10}
                                                required={true}
                                            />
                                        </div>
                                    </div>

                                    <button className="delete-speaker-sponser-BTN"
                                            onClick={() => handelDeletSponsorsClick(index)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            )
                            }
                            <button className="add-speaker-sponser-BTN" onClick={addMoreInputFieldSponsors}>
                                <FontAwesomeIcon style={{fontSize: 18}} icon={faPlus}/>
                                Add Sponsor
                            </button>

                            <div className="button-container-confirm">
                                <button className="SaveBTN-confirm" onClick={handleClickButtonConfirmSponsors}>Confirm
                                </button>
                                <button className="CloseBTN-confirm" onClick={() => {
                                    handleClickButtonColse()
                                }}>Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {loadingImage && <div className="modal-post-img-edit-profile">
                <Loading/>
            </div>
            }

        </div>
    );
};

export default CreateEvent;
