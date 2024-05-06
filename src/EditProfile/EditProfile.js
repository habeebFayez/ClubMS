import React, {useEffect, useRef, useState} from 'react';
import Sidebar from "../HomePage/Sidebar/Sidebar";
import "./EditProfile.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {storage} from "../api/Firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {faGear, faInfoCircle, faLock, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useLocalState} from "../util/useLocalState";
import axios from "../api/axios";
import AnimationCheck from "../Component/AnimationCheck/AnimationCheck";
import Loading from "../Component/loading/Loading";
import SpiningLoading from "../Component/loading/SpiningLoading";

const USER_REGEX = /^[a-zA-Z ]{3,24}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])\S{8,35}$/;
const EMAIL_REGEX = /^[a-zA-Z.]{3,50}@st\.uskudar\.edu\.tr$/;
const STUDEN_NUMBER_REGEX = /^[0-9]{9}$/;
const EditProfile = ({user ,allClubs, club,events ,clubNotifications, isActive , isLoadingApp}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const userRef = useRef(null);
    const errRef = useRef(null);
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);
    const [validLastName, setValidLastName] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);
    const [validMatchPassword, setValidMatchPassword] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);
    const [validNewPassword, setValidNewPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [validStudentNumber, setValidStudentNumber] = useState(false);
    const [studentNumberFocus, setStudentNumberFocus] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [errMsgPassword, setErrMsgPassword] = useState('');
    const [file, setFile] = useState("");
    const [profileImgURL, setProfileImgURL] = useState();
    const [imageUrl, setImageUrl] = useState('');
    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const [v1, v2, v3] = [USER_REGEX.test(firstName),
            USER_REGEX.test(lastName), STUDEN_NUMBER_REGEX.test(studentNumber)];
        if (!v1 || !v2 || !v3) {
            setErrMsg("invalid Entry");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post("/auth/updateUser",
                JSON.stringify({firstName, lastName, studentNumber, profilePicURL: profileImgURL}),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`
                    },
                    withCredentials: true,
                    method: "POST"

                },
            );
            setIsLoading(false)
            setIsModalOpenForSuccess(true);


        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
                setIsLoading(false)

            } else if (err.response?.status === 409) {
                setIsLoading(false)

                setErrMsg('Student number is already in use! ');

            } else {
                setIsLoading(false)

                setErrMsg('Saving User failed');

            }
            if (errRef.current) {

                errRef.current.focus();
            }

        }
    };
    const savePasswordChange = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)

            const response = await axios.post("/auth/resetPassword",
                JSON.stringify({lastName: newPassword, password: password}),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`
                    },
                    withCredentials: true,
                    method: "POST"

                },
            );
            setIsModalOpen(false);
            setIsLoading(false)
            setIsModalOpenForSuccess(true);

        } catch (err) {
            if (!err?.response) {
                setIsLoading(false)

                setErrMsgPassword("No Server Response");

            } else if (err.response?.status === 401) {
                setIsLoading(false)

                setErrMsgPassword('Wrong password please try again');
            } else {
                setIsLoading(false)

                setErrMsgPassword('Saving User failed');
                console.log(err.response);

            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");

    };
    useEffect(() => {
        if(user){
            if (userRef.current) {
                userRef.current.focus();
            }
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setStudentNumber(user.studentNumber);
            setProfileImgURL(user.profilePicURL);
        }
    }, [user]);
    useEffect(() => {
        const result = USER_REGEX.test(firstName);
        setValidFirstName(result);
    }, [firstName]);
    useEffect(() => {
        const result = USER_REGEX.test(lastName);
        setValidLastName(result);
    }, [lastName]);
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);

    }, [email]);
    useEffect(() => {
        const result = STUDEN_NUMBER_REGEX.test(studentNumber);
        setValidStudentNumber(result);

    }, [studentNumber]);
    useEffect(() => {
        const result = PASSWORD_REGEX.test(newPassword);
        setValidNewPassword(result);
        const match = newPassword === confirmPassword;
        setValidMatchPassword(match);
    }, [newPassword]);
    useEffect(() => {
        const match = newPassword === confirmPassword;
        setValidMatchPassword(match);
    }, [confirmPassword]);
    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        }
    }, [isModalOpenForSuccess]);
    useEffect(() => {
        if (errMsg) {
            setTimeout(() => {
                setErrMsg('')
            }, 3000);

        }
    }, [errMsg]);
    useEffect(() => {
        setErrMsg('');

    }, [firstName, lastName, email, newPassword, confirmPassword, studentNumber]);
    useEffect(() => {
        if (file) {
            setIsLoading(true);
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
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setIsLoading(false);
                        setProfileImgURL(downloadURL);
                    });
                }
            );
        };

            // Check if the selected file is an image
            if (!file.type.startsWith('image/')) {
                setIsLoading(false);
                setErrMsg("Please upload an image file!!");
                setFile('');

                return;
            }
            uploadFile();
            setErrMsg("Dont Forgot to Save Changes")
        }
    }, [file]);
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setIsModalOpen(false);
        }
    };
    const ModalOpen = (e) => {
        setIsModalOpen(!isModalOpen);

    };
    const closeModalForPic = () => {
        setIsModalOpenForPic(false);
    };
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModalForPic();
        }
    };
    const openModalForPic = (url) => {
        setImageUrl(url);
        setIsModalOpenForPic(true);
    };
    return (
        <div>
            <div className="EditPage" onClick={() => {
                setIsModalOpenForSuccess(false);
                setErrMsg(false);
            }}>

                <div ><Sidebar  allClubs={allClubs} pageLocation={"Edit Profile"} events={events} clubNotifications={clubNotifications} user={user} club={club} isActive={isActive}/>
                </div>

                {(isLoadingApp)&& !user?

                    <div className="modal-post-img-edit-profile">
                        <Loading/>
                    </div>

                    :
                    <div className="container-EditPage">
                    <div className="container-titel">
                        <FontAwesomeIcon className="icons-editProfile" style={{fontSize: 30}} icon={faGear}/>
                        <h4 className="font-weight-bold">
                            Edit Profile
                        </h4>
                    </div>
                    <div className="d-flex">
                        <h4 className="font-weight-bold">
                            Hello {user ? user.firstName.toUpperCase() : ''}
                            <span style={{fontSize: '1.5em'}}>👋</span>,
                        </h4>

                        <div className="profile-image" style={{position: 'absolute', top: '50px', right: '100px'}}>
                            <img
                                className={"profile-image"}
                                id="profilpic"
                                src={file ? URL.createObjectURL(file) :
                                    profileImgURL || ("https://i.stack.imgur.com/34AD2.jpg")

                                }
                                onClick={() => openModalForPic(file ? file : user.profilePicURL || "")}

                                style={{
                                    width: '220px',
                                    height: '220px',
                                    right: '-20px',
                                    top: '0',
                                    position: 'absolute',
                                    borderRadius: '110px',

                                }}
                            />
                            <div className="input-container">
                                <input type="file"
                                       onChange={(e) => setFile(e.target.files[0])}
                                       className="btn-editProfile-img"
                                       accept=".png, .jpg, .jpeg"/>
                            </div>
                        </div>
                    </div>
                    <div className="Edit-profile-container active">
                        {errMsg &&
                            <p className="App-error-message-editProfile">
                                <FontAwesomeIcon onClick={() => {
                                    setErrMsg(false)
                                }}
                                                 style={{fontSize: "25px",cursor:"pointer"}}
                                                 icon={faTimes}/>
                                <br/>{errMsg}
                            </p>}
                        <form onSubmit={handleSubmit} className="Edit-profile-form">
                            <div className="input-fiel-signup">
                                <div className="input-field-first">
                                    <div
                                        className={validFirstName || !firstName ? "input-field-first-name" : "err-input-field-first-name"}>

                                        <label className="edit-input-label">First Name :</label>
                                        <input
                                            type="text"
                                            ref={userRef}
                                            autoComplete="off"
                                            aria-invalid={validFirstName ? "false" : "true"}
                                            onFocus={() => setFirstNameFocus(true)}
                                            onBlur={() => setFirstNameFocus(false)}
                                            placeholder={user ? user.firstName : ''}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                        {firstNameFocus && firstName && !validFirstName &&
                                            <p
                                                className="error-message-first-last-editprofile">
                                                <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                                3 to 24 characters .<br/>
                                                Only letters are allowed. <br/>
                                            </p>}
                                    </div>
                                    <div
                                        className={validLastName || !lastName ? "input-field-last-name" : "err-input-field-last-name"}>
                                        <label className="edit-input-label">Last Name : </label>
                                        <input
                                            className="last-name"
                                            type="text"
                                            ref={userRef}
                                            autoComplete="off"
                                            aria-invalid={validLastName ? "false" : "true"}
                                            onFocus={() => setLastNameFocus(true)}
                                            onBlur={() => setLastNameFocus(false)}
                                            placeholder={user ? user.lastName : ''}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                        {lastNameFocus && lastName && !validLastName &&
                                            <p
                                                className="error-message-first-last-editprofile">
                                                <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                                3 to 24 characters .<br/>
                                                Only letters are allowed. <br/>
                                            </p>}
                                    </div>
                                </div>
                                <div className="input-field-second-editProfile">
                                    <label className="edit-input-label">Email: </label>
                                    <div
                                        className={validEmail || !email ? "input-field-signup" : "err-input-field-signup"}>

                                        <input
                                            type="email"
                                            ref={userRef}
                                            onBlur={() => setEmailFocus(false)}
                                            onClick={() => setEmailFocus(true)}
                                            placeholder={user ? user.email : ''}
                                            value={email}
                                        />
                                        {emailFocus &&
                                            <p
                                                className="email-error-message-EditProfile">
                                                <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                                You cant Change your Email sense its Confirmed <br/>
                                            </p>}
                                    </div>

                                </div>
                                <div className="input-field-third">
                                    <label className="edit-input-label">Student Number: </label>
                                    <div
                                        className={validStudentNumber || !studentNumber ? "input-field-signup" : "err-input-field-signup"}>
                                        <input
                                            type="text"
                                            ref={userRef}
                                            autoComplete="off"
                                            aria-invalid={validEmail ? "false" : "true"}
                                            onFocus={() => setStudentNumberFocus(true)}
                                            onBlur={() => setStudentNumberFocus(false)}
                                            placeholder={user ? user.studentNumber : ''}
                                            value={studentNumber}
                                            onChange={(e) => setStudentNumber(e.target.value)}
                                            required
                                        />
                                        {studentNumberFocus && studentNumber && !validStudentNumber &&
                                            <p
                                                className="studentNumber-error-message-EditProfile">
                                                <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                                Only 9 numbers are allowed <br/>
                                                must use your University Student Number <br/>


                                            </p>}
                                    </div>

                                </div>


                            </div>
                            {validFirstName && validLastName
                            && validStudentNumber ?

                                <button type="submit" className="btn-editProfile">Save</button>
                                :
                                <button type="submit" disabled={true}
                                        className="not-valid-btn-editProfile">Save</button>

                            }
                        </form>
                        <div className="Chaange-password-EditPage">
                            <button className="Change-password" onClick={() => setIsModalOpen(true)}>
                                Change your password
                            </button>
                        </div>
                    </div>
                </div>}
                {isModalOpen && <div className="modal-overlay" onClick={handleClickOutside}>
                    {errMsgPassword &&
                        <p className="App-error-message-editProfile-Password">
                            <FontAwesomeIcon onClick={() => {
                                setErrMsgPassword(false)
                            }}
                                             style={{fontSize: "25px"}}
                                             icon={faTimes}/>
                            <br/>{errMsgPassword}
                        </p>}
                    <div className="modal">

                        <div className="modal-content">
                            <h2>Change your password</h2>
                            <br/>
                            <div className="input-field-third">
                                <div className="input-field">
                                    <FontAwesomeIcon className="icon" icon={faLock}/>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Current Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />


                                </div>
                                <div
                                    className={validNewPassword || !newPassword ? "input-field" : "err-input-field"}>
                                    <FontAwesomeIcon className="icon" icon={faLock}/>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validEmail ? "false" : "true"}
                                        onFocus={() => setPasswordFocus(true)}
                                        onBlur={() => setPasswordFocus(false)}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    {passwordFocus && newPassword && !validNewPassword &&
                                        <p
                                            className="error-message-Edit-Profile">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            8 to 35 characters are allowed <br/>
                                            include at least One capital letter one small letter <br/>
                                            one number and one special character <br/>


                                        </p>}

                                </div>

                                <div
                                    className={validMatchPassword || !confirmPassword ? "input-field" : "err-input-field"}>
                                    <FontAwesomeIcon className="icon" icon={faLock}/>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validEmail ? "false" : "true"}
                                        onFocus={() => setMatchPasswordFocus(true)}
                                        onBlur={() => setMatchPasswordFocus(false)}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {matchPasswordFocus && confirmPassword && !validMatchPassword &&
                                        <p
                                            className="error-message-Edit-Profile-conf">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            Confirm Password is not the same <br/>
                                            please Fix it ...<br/>


                                        </p>}

                                </div>
                            </div>

                        </div>
                        <div className="button-container-EditPage">
                            {validNewPassword && validMatchPassword ?
                                <button className="SaveBTN" onClick={savePasswordChange}>Save</button>
                                :
                                <button className="not-valid-SaveBTN" disabled={true}
                                        onClick={savePasswordChange}>Save</button>
                            }
                            <button className="CloseBTN" onClick={ModalOpen}>Close</button>
                        </div>
                    </div>

                </div>}
                {isModalOpenForSuccess &&
                    <p className="Success-message-Edit-Profile">
                        <AnimationCheck/> <br/>
                        Success!!
                    </p>
                }

            </div>
            {isModalOpenForPic && (
                <div className="modal-post-img" onClick={handleOverlayClick}>
                    <div className="modal-content-Page" onClick={handleOverlayClick}>
                        <span className="close" onClick={closeModalForPic}>&times;</span>
                        <img src={file?URL.createObjectURL(file): (user.profilePicURL?user.profilePicURL :"https://i.stack.imgur.com/34AD2.jpg")} className={"img-page-content"}/>
                    </div>
                </div>
            )}
            {isLoading &&
                <div className="modal-post-img-edit-profile">

                <SpiningLoading/>
            </div>


            }

        </div>
    );
};

export default EditProfile;