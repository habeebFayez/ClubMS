import React, {useEffect, useRef, useState} from 'react';
import Sidebar from "../HomePage/Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faChevronUp,
    faClock, faHashtag,
    faLocationDot,
    faPenToSquare, faStar,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import AnimationCheck from "../Component/AnimationCheck/AnimationCheck";
import "./ClubsPage.css"
import PageTop from "../HomePage/Page/PageTop";
import {Link, useNavigate} from "react-router-dom";
import SpiningLoading from "../Component/loading/SpiningLoading";

const ClubsPage = ({user,club,isActive ,clubNotifications, events,allClubs,allClubsCategories ,allEventsCategories  ,categories}) => {
    const [isVisible, setIsVisible] = useState(false);
    const pageBodyRef = useRef(null);
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isClubPage, setIsClubPage] = useState(true);
    const navigate=useNavigate();
    const [hovered, setHovered] = useState(false);
    const [displayHovered, setDisplayHovered] = useState('');

    const scrollToTop = () => {
        pageBodyRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };



    const handleScroll = () => {
        setIsVisible(pageBodyRef.current.scrollTop > 100);
    };

    const openisModaSuccess = () => {
        setIsModalOpenForSuccess(true);
    };
    const wordCount = (text) => {
        return text.split(/\s+/).length;
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
        if (!allClubs.length>0) {
            setIsLoading(true);
            return
        }
        setIsLoading(false);
    }, [isModalOpenForSuccess]);


    return (
        <div className="homePage-allclubs">
            <div className="menu-sidebar">
                <Sidebar   user={user} allClubs={allClubs} isActive={isActive}
                           events={events} clubNotifications={clubNotifications} club={club}/></div>
            <div className="pageBody-allclubs">
                <PageTop  isClubPage={isClubPage} allClubs={allClubs} allEventsCategories={allEventsCategories}
                          categories={categories} events={events} isSearchvis={isVisible} title={"Clubs"}
                           allClubsCategories={allClubsCategories} user={user} isActive={isActive} club={club}/>
                <div
                    className={!isVisible ? (allClubs.length > 9 ? "allclubs-content" : "allclubs-content-lingth-less") : "allclubs-content-notvis"}
                    ref={pageBodyRef}
                    onScroll={handleScroll}>
                    <div className="row-my-club">
                        {club &&
                            <div className="column"
                                 onClick={() => navigate(`/clubprofile`, {state: {club}})}

                            key={club.clubID}>
                                <h3>Your Club : </h3>
                                <br/>
                                <div className="card-my-club">
                                    <div className="poster-info">
                                        <img className="poster-info-img"
                                             src={club ? club.clubProfilePicURL : ''}
                                        />
                                        <div style={{marginLeft: "1%"}}>
                                            <h5
                                                style={{
                                                color: "black", fontSize: "14px", width: 200
                                            }}>{club ? club.clubName : 'NA'}
                                            </h5>

                                            <p style={{fontSize: "12px", color: "darkgray"}}>
                                                {club.creatingDate}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="card-discription">
                                        {club.clubDescription.split(/\s+/).slice(0, 69).join(' ')}
                                        {wordCount(club.clubDescription) > 69 &&
                                            <Link
                                                to={{
                                                    pathname: `/clubprofile`,
                                                    state: {  club }
                                                }}
                                                  style={{
                                                      color: 'blue',
                                                      fontWeight: 500,
                                                      cursor: 'pointer'
                                                  }}>
                                                {" "} Read More...
                                            </Link>}
                                    </p>


                                    <div className="tags-card-containar">
                                        <div style={{marginRight: 0}}>
                                            {club.clubisActivation ?
                                                <p style={{fontWeight: 600, fontSize: 12, color: "green"}}>Active</p>
                                                :
                                                <p style={{fontWeight: 600, fontSize: 12, color: "red"}}>Inactive</p>
                                            }
                                        </div>
                                        {allClubsCategories.filter(category => category.club.clubID === club.clubID).map(
                                            clubCategory =>
                                                <>

                                                    <button
                                                        className={ hovered&&displayHovered===clubCategory.category.categoryName?
                                                    "tags-btn-club-card-hoverd"
                                                    :
                                                    "tags-btn-club-card"}
                                                    id="tagButton"
                                                            onMouseEnter={() => {
                                                                setDisplayHovered(clubCategory.category.categoryName)
                                                                setHovered(true)
                                                            }}
                                                            onMouseLeave={() => {
                                                                setHovered(false)
                                                            }}
                                                    >
                                                        {clubCategory.category.categoryName}

                                                    </button>

                                                </>
                                        )}



                                    </div>
                                </div>
                            </div>}
                    </div>
                    <div className="row">
                        {allClubs.length > 0 && (
                            allClubs.filter(filterClub =>
                                filterClub.clubisActivation && filterClub.clubID !== (club && club.clubID)).sort((a, b) => {
                                const firstIndex = a.clubActiveEventsNumber - a.clubRejectedEventsNumber;
                                const seconedIndez = b.clubActiveEventsNumber - b.clubRejectedEventsNumber;
                                return seconedIndez - firstIndex;
                            }).map(clubCard => (
                                <>
                                    <div className="column" key={clubCard.clubID}>

                                        <div className="card" key={clubCard.clubID}
                                             onClick={() => navigate(`/clubprofile`, {state: {club:clubCard}})}>
                                            <div className="poster-info">
                                                <img className="poster-info-img"
                                                     src={clubCard ? clubCard.clubProfilePicURL : ''}
                                                />
                                                <div style={{marginLeft: "1%"}}>
                                                    <h5 style={{
                                                        color: "black", fontSize: "14px", width: 200
                                                    }}>{clubCard ? clubCard.clubName : 'NA'}</h5>
                                                    <p style={{fontSize: "12px", color: "darkgray"}}>
                                                        {clubCard.creatingDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="card-discription">
                                                {clubCard.clubDescription.split(/\s+/).slice(0, 55).join(' ')}
                                                {wordCount(clubCard.clubDescription) > 69 &&
                                                    <Link
                                                        to={{
                                                            pathname: `/clubprofile`,
                                                            state: {  club:clubCard }
                                                        }}
                                                        style={{
                                                            color: 'blue',
                                                            fontWeight: 500,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Read More...
                                                    </Link>}
                                            </p>
                                            <div className="tags-card-containar">
                                                {allClubsCategories.filter(category=>category.club.clubID===clubCard.clubID).map(
                                                    clubCategory =>
                                                        <>

                                                        <button className={
                                                            hovered&&displayHovered===clubCategory.category.categoryName?
                                                                "tags-btn-club-card-hoverd"
                                                                :
                                                        "tags-btn-club-card"}
                                                                id="tagButton"
                                                                onMouseEnter={() => {
                                                                    setDisplayHovered(clubCategory.category.categoryName)
                                                                    setHovered(true)
                                                                }}
                                                                onMouseLeave={() => {
                                                                    setHovered(false)
                                                                }}>

                                                            {clubCategory.category.categoryName}
                                                        </button>


                                                        </>
                                                           )}


                                            </div>
                                        </div>
                                    </div>

                                </>

                            ))

                        )}


                    </div>

                </div>

                {!allClubs.length>0 &&
                    <div style={{alignSelf: "center", textAlign: "center", marginTop: 100}}>
                    {isLoading ? (
                        <SpiningLoading/>
                    ) : (
                        <div>
                            <h2>Something Went Wrong !!</h2>
                            <h3>Please try to refresh the page</h3>
                            <a style={{fontSize: 30, color: "blue", textDecoration: 'none'}}
                               href={"/home"}>Refresh</a>
                        </div>
                    )}
                </div>}

                {isVisible && (
                    <button className={"GoUp-clubs"} onClick={scrollToTop}>
                        <FontAwesomeIcon icon={faChevronUp}/>
                    </button>
                )}
            </div>
            {isModalOpenForSuccess &&
                <div>
                    <p className="Success-message-creat-club">
                        <AnimationCheck/> <br/>
                        Your Request hase been sent Successfully !!
                    </p>
                </div>
            }
        </div>
    );
};

export default ClubsPage;


// <div className="card-cover">
//     <div className="card-profile-info">
//         <img className="poster-info-img"
//              src={club ? club.clubProfilePicURL : ''}
//         />
//         <div style={{marginLeft: "1%"}}>
//             <h5 style={{
//                 color: "black", fontSize: "14px", width: 200
//             }}>{club ? club.clubName : 'NA'}</h5>
//             <p style={{fontSize: "12px", color: "darkgray"}}>
//                 {club.creatingDate}
//             </p>
//         </div>
//     </div>
//     <div className="tags-card-containar">
//         <button className="tags-btn-club-card"> Tag01</button>
//         <button className="tags-btn-club-card"> Tag02</button>
//         <button className="tags-btn-club-card"> Tag03</button>
//     </div>
// </div>