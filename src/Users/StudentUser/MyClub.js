import React, {useEffect, useRef, useState} from 'react';
import Sidebar from "../../HomePage/Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faChevronUp, faFaceSmile, faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import SidePage from "../../HomePage/SidePage/SidePage";
import './MyClub.css';
import Loading from "../../Component/loading/Loading";
import {useLocalState} from "../../util/useLocalState";
import ApplyForClub from "./ApplyForClub";
import AnimationCheck from "../../Component/AnimationCheck/AnimationCheck";
import {Navigate, useNavigate} from "react-router-dom";

const MyClub = ({user,club,isActive , allClubs ,clubNotifications,isLoading ,categories, events}) => {
    const [isVisible, setIsVisible] = useState(false);
    const pageBodyRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [showSecondEmoji, setShowSecondEmoji] = useState(false);
    const [loadingFirst, setLoadingFirst] = useState(false);
    const navigate=useNavigate();

    const scrollToTop = () => {

        pageBodyRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    useEffect(() => {
        if (club&&isActive) {
            (navigate(`/clubprofile`, {state: {club:club}}))

        }
    }, [club]);
    useEffect(() => {
        if (!club) {
            setTimeout(() => {
               setLoadingFirst(false)
            }, 500);

        }
    }, [club]);

    const handleScroll = () => {
        setIsVisible(pageBodyRef.current.scrollTop > 100);
    };
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay-create-club')) {
            setIsModalOpen(false);
        }
    };
    const handleClickButtonColse = (e) => {

            setIsModalOpen(false);

    };
    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        }
    }, [isModalOpenForSuccess]);
    console.log("club")
    console.log(club)
    return (
        <div className="homePage" onClick={()=>setIsModalOpenForSuccess(false)} >

            <div className="menu-sidebar">
                <Sidebar user={user} allClubs={allClubs} isActive={isActive}events={events}  clubNotifications={clubNotifications} club={club}/></div>
            <div className="pageBody" ref={pageBodyRef} onScroll={handleScroll}>
                <div className="page-titel">
                    <div className="Events">Manage My Club</div>
                </div>
                <div className="myClub-page-content" >
                    {club&&!isActive&&!club.clubisRejected&&!club.clubIsBlocked&&!isLoading?

                            (<div className="myClub-page-content">
                                <Loading/>
                                <h3>Your Club Application is being reviewed </h3>
                                <h4>Thank You For Your Patience</h4>
                                {/*<FontAwesomeIcon style={{fontSize: 100,color:"green"}} icon={faFaceSmile}/>*/}
                                <label
                                    style={{fontSize: 100}}
                                    onMouseEnter={() => setShowSecondEmoji(true)}
                                    onMouseLeave={() => setShowSecondEmoji(false)}
                                >
                                    { String.fromCodePoint('0x1f604')}

                                </label>
                            </div>)

                        :
                        (user&&user.authority.authorityName === "ROLE_STUDENT"
                        &&!isLoading &&!club&&!loadingFirst&&
                            <div className="myClub-page-content">
                            <h3>You Don’t have a club</h3>
                            <button className="apply-for-Club" onClick={() => {
                                setIsModalOpen(true)
                            }}>
                                <FontAwesomeIcon style={{fontSize: 20}} icon={faPlus}/>
                                <span style={{marginLeft:10}}/> Apply For One</button>
                            <Loading/>

                        </div>)

                    }
                    {club&&club.clubisRejected&&!isLoading&&

                        (<div className="myClub-page-content">
                            <FontAwesomeIcon className="rejected-club-app" icon={faXmark}/>
                            <h3>Your Club Application Wes Rejected By The Admin </h3>
                            <h4>You Can No Longer Creat a Club Until The Admin Allows it </h4>
                            <label
                                style={{fontSize: 100}}
                            >
                                {String.fromCodePoint('0x1F635')}

                            </label>
                        </div>)
                    }
                    { club&&club.clubIsBlocked&&!isLoading &&

                        (<div className="myClub-page-content">
                            <FontAwesomeIcon className="rejected-club-app" icon={faBan}/>
                            <h3>Your Club has been Blocked By The Admin </h3>
                            <h4>You Can No Longer control your Club</h4>

                        </div>)
                    }


                </div>


                {isVisible && (
                    <button className={"GoUp"} onClick={scrollToTop}>
                        <FontAwesomeIcon icon={faChevronUp}/>
                    </button>
                )}
            </div>
            <div className="pageBody-side">
                <SidePage  user={user} isActive={isActive} isLoadingEvents={isLoading} allClubs={allClubs} club={club} events={events} />

            </div>
            {isModalOpen&& <div className="modal-overlay-create-club" onClick={handleClickOutside}>
            <ApplyForClub  categories={categories} user={user}
                           isOpenSeccess={()=>{
                setIsModalOpenForSuccess(true);
                handleClickButtonColse();

            }}  closeModal={handleClickButtonColse} isOpen={isModalOpen}/>
            </div>}
            {isModalOpenForSuccess &&
                <p className="Success-message-creat-club">
                    <AnimationCheck/> <br/>
                    Your Request hase been sent Successfully !!
                </p>
            }
            {isLoading &&
                <div className="modal-post-img-edit-profile">
                <Loading/>
                </div>
            }


        </div>
    );
};

export default MyClub;