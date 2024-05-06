import React, {useEffect, useRef, useState} from 'react';
import axios from "../../api/axios";
import {useLocalState} from "../../util/useLocalState";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../api/Firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faInfoCircle,
    faLock,
    faPenToSquare,
    faStar,
    faTimes,
    faUser,
    faUserGroup
} from "@fortawesome/free-solid-svg-icons";
import AnimationCheck from "../../Component/AnimationCheck/AnimationCheck";
import Select from "react-select";
import Loading from "../../Component/loading/Loading";
const Club_NAME_REGEX = /^[a-zA-Z0-9_ ]{3,50}$/;
const CREATE_CLUB_URL = '/club/createClub'

const ApplyForClub = ({user,isOpenSeccess,closeModal,categories, isLoading}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [clubName, setClubName] = useState('');
    const [validClubName, setValidClubName] = useState(false);
    const [firstClubNameFocus, setFirstClubNameFocus] = useState(false);
    const [clubDescription, setClubDescription] = useState('');
    const [clubCoverPicURL,setClubCoverPicURL ] = useState('');
    const [clubProfilePicURL, setClubProfilePicURL] = useState('');
    const [file, setFile] = useState("");
    const [fileCover, setFileCover] = useState("");
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const errRef = useRef(null);

    const [loadingApply, setLoadingApply] = useState(false);

    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoriesForValue, setCategoriesForValue] = useState([]);
    const [clubCategories, setClubCategories] = useState([]);
    const handleSubmit = async (e) => { //add fetching for admin user
        e.preventDefault();
        if(file==="" || fileCover===""){
            setErrMsg("You must Upload Logo and cover images to continue !!");
            return;
        }
        if(!validClubName){
            setErrMsg("Club name must be Minimum 3 characters up to 24 !! \n" +
                "  special characters like \"!@#$%^&*()}{[];:' \" are not allowed ");
            return;
        }

        try {
            setLoadingApply(true)
            const response = await axios.post(CREATE_CLUB_URL,
                JSON.stringify(
                    {
                        club:{clubName, clubDescription, clubCoverPicURL, clubProfilePicURL},
                        category:clubCategories,

                    }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`},
                    withCredentials: true,
                    method: "POST"

                });

            setSuccess(true);
            isOpenSeccess();

        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
                setErrMsg('Club name is already in use! \n Please try Different name ');

            }else if (err.response?.status === 502) {
                setErrMsg('You already has a Club \n Please wait for activation by admin!! ');

            }else if (err.response?.status === 401) {
                setErrMsg('You cant creat Club !!');

            } else {
                setErrMsg('Server Error  Please try  later !!');
            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }finally {
            setLoadingApply(false)
        }


    };
    useEffect(() => {
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
                        console.log("File URL is :" + downloadURL);
                        setClubProfilePicURL(downloadURL);
                    });
                }
            );
        };
        if (file) {
            // Check if the selected file is an image
            if (!file.type.startsWith('image/')) {
                setErrMsg("Please upload an image file!!");
                setFile('');
                return;
            }
            uploadFile();
        }
    }, [file]);
    useEffect(() => {
        const uploadFile = () => {
            const newname = new Date().getTime();
            const storageRef = ref(storage, 'images/' + newname + fileCover.name);
            const uploadTask = uploadBytesResumable(storageRef, fileCover);

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
                        console.log("File URL is :" + downloadURL);
                        setClubCoverPicURL(downloadURL);
                    });
                }
            );
             };
        if (fileCover) {
            // Check if the selected file is an image
            if (!file.type.startsWith('image/')) {
                setErrMsg("Please upload an image file!!");
                setFileCover('');
                return;
            }
            uploadFile();
        }
    }, [fileCover]);
    useEffect(() => {
        if (errMsg!=='' ) {
            setTimeout(() => {
               setErrMsg('');
            }, 5000);

        }
    }, [errMsg]);
    useEffect(() => {
        const result = Club_NAME_REGEX.test(clubName);
        setValidClubName(result);
    }, [clubName]);
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
        setClubCategories(updatedCategories);
    }, [selectedCategories]);
    const openModalForPic = (url) => {
        setImageUrl(url);
        setIsModalOpenForPic(true);
    };
    const closeModalForPic = () => {
        setIsModalOpenForPic(false);
    };
    const handleOverlayClickCreatClub = (e) => {
        if (e.target === e.currentTarget) {
            closeModalForPic();
        }
    };
    return (
        <div>

                {errMsg &&
                    <p className="creat-club-error-message">
                        <FontAwesomeIcon className={"Icon_close_err_mess"} onClick={() => {
                            setErrMsg(false)
                        }}
                                         style={{fontSize: "25px"}}
                                         icon={faTimes}/>
                        <br/>{errMsg}
                    </p>}
                <form className="modal-creat-club" onClick={() => {
                    setErrMsg(false)
                }}
                      onSubmit={handleSubmit}>

                    <div className="modal-content-cteate-club">
                        <h2>Create Club Application</h2>
                        <br/>
                        <div className="input-field-creat-club-third">
                            <div className="input-field-creat-club-first">
                                <div>
                                    <label className="edit-input-label"> Student Name :</label>
                                    <div className="input-field-creat-club-first-input">
                                        <FontAwesomeIcon className="icon" icon={faUser}/>
                                        <p id={"st"}>{user.firstName + " " + user.lastName} </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="edit-input-label">Student Number :</label>
                                    <div className="input-field-creat-club-first-input">
                                        <FontAwesomeIcon className="icon" icon={faUser}/>
                                        <p id={"st"}>{user.studentNumber} </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="edit-input-label">
                                    Club Name :
                                    <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                                </label>
                                <div className="input-field-creat-club">
                                    <FontAwesomeIcon icon={faUserGroup}/>
                                    <input
                                        type="text"
                                        placeholder="Club Name"
                                        value={clubName}
                                        onChange={(e) => setClubName(e.target.value)}
                                        required
                                    />
                                </div>

                            </div>
                            <div className={"Selectors-creat-event"}>
                                <label className="edit-input-label">Category :
                                    <FontAwesomeIcon className="req-star-input" icon={faStar}/>
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
                            <div style={{marginTop: 10}}>
                                <label className="edit-input-label">
                                    Club Description :
                                    <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                                </label>
                                <div className="input-field-creat-club-discr">
                                    <FontAwesomeIcon icon={faPenToSquare}/>
                                    <textarea
                                        className="last-name"
                                        rows={9}
                                        autoComplete="off"
                                        placeholder={"Club Description"}
                                        value={clubDescription}
                                        onChange={(e) => setClubDescription(e.target.value)}
                                        required
                                    />
                                </div>

                            </div>
                            <div className="input-field-creat-club-pic">
                                <div className="profile-image-club">
                                    <label className="edit-pic-label">
                                        Club Logo :
                                        <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                                    </label>
                                    <img
                                        className={"open-img-creat-club"}
                                        id="profilpic"
                                        src={file ? URL.createObjectURL(file) : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg"}
                                        onClick={() => openModalForPic(file ? URL.createObjectURL(file) : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg")}
                                        style={{
                                            width: 125,
                                            height: 125,
                                            position: 'absolute',
                                            borderRadius: 15,
                                            border: "1px solid #505050"
                                        }}
                                    />
                                    <div className="input-container">
                                        <input type="file"
                                               onChange={(e) => setFile(e.target.files[0])}
                                               className="btn-create-club-img"
                                               accept=".png, .jpg, .jpeg"/>
                                    </div>
                                </div>
                                <div className="profile-image-club">
                                    <label className="edit-pic-label">
                                        Club Cover :
                                        <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                                    </label>


                                    <img
                                        className={"open-img-creat-club"}
                                        id="profilpic"
                                        onClick={() => openModalForPic(fileCover ? URL.createObjectURL(fileCover) : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg")}
                                        src={fileCover ? URL.createObjectURL(fileCover) : "https://as1.ftcdn.net/v2/jpg/03/29/64/56/1000_F_329645688_8ODoJI5NrLeQDi6K16JvR6DhH2gDXpRV.jpg"}
                                        style={{
                                            width: 125,
                                            height: 125,
                                            position: 'absolute',
                                            borderRadius: 15,
                                            border: "1px solid #505050"
                                        }}
                                    />
                                    <div className="input-container">
                                        <input type="file"
                                               onChange={(e) => setFileCover(e.target.files[0])}
                                               className="btn-create-club-img"
                                               accept=".png, .jpg, .jpeg"/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="button-container-create-club">
                        {/*{validClubName ?*/ clubDescription && clubName ?
                            <button className="SaveBTN-creat-club" onClick={onclose} type={"submit"}>Save</button>
                            :
                            <button className="not-valid-SaveBTN-creat-club" disabled={true} type={"submit"}>Save</button>
                        }
                        <button className="CloseBTN-creat-club" onClick={closeModal}>Close</button>
                    </div>
                </form>
            {isModalOpenForPic && (
                <div className="modal-post-img-creat-club" onClick={handleOverlayClickCreatClub}>
                    <div className="modal-content-Page-creat-club" onClick={handleOverlayClickCreatClub}>
                        <span className="close-for-creat-club" onClick={closeModalForPic}>&times;</span>
                        <img src={imageUrl} className={"img-creat-club"}/>
                    </div>
                </div>
            )}
            {loadingApply &&
                <div className="modal-post-img-edit-profile">
                    <Loading/>
                </div>
            }

        </div>
    );
};

export default ApplyForClub;