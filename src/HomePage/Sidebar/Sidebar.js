import React, {useEffect, useState} from "react";
import "./Sidebar.css";
import {
    faAt, faBell, faCalendar, faGear, faInbox, faLayerGroup,
    faRightFromBracket,
    faStar,
    faUserGroup, faUserPen
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {Link, Navigate, useNavigate} from "react-router-dom";
import {useLocalState} from "../../util/useLocalState";


const Sidebar = ({user , club ,allClubs, isActive,pageLocation,clubNotifications,events,outClick}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const authorityName = user?.authority?.authorityName || "Null";
    const roleName = authorityName.split("_")[1];
    const isStudent = authorityName==='ROLE_STUDENT' ||authorityName==='ROLE_MANAGER';
    const [isopenProfileDiv , setOpenProfileDiv]=useState(false);
    const [isopenNavigathion , setOpenNavigathion]=useState(false);
    const [activeclubNotifications , setActiveclubNotifications]=useState([]);
    const [activeEventsNotifications , setActiveEventsNotifications]=useState([]);
    const [activeAdminClubNotifications , setActiveAdminClubNotifications]=useState([]);
    const [navigathionRead , setNavigathionRead]=useState(0);
    const [allNotifications, setAllNotifications] = useState(null);

    const navigate=useNavigate();
    useEffect(() => {
        if ( user &&(user.authority.authorityName==="ROLE_ADMIN")) {
            fetch(`api/admin/getAdminNotifications/${user.userID}`, {
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
                        logout();
                    } else if (response.status === 404) {
                        return null; // Return null when club data is not found
                    } else {
                        return response.json();
                    }
                })
                .then((allNotifications) => {
                    if (allNotifications) {

                        setAllNotifications(allNotifications);

                    }
                });
        }

        if ( user &&(club||user.authority.authorityName==="ROLE_MANAGER")) {

            fetch(`api/club/getClubNotifications/${user.userID}`, {
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
                        logout();
                    } else if (response.status === 404) {
                        return null; // Return null when club data is not found
                    } else {
                        return response.json();
                    }
                })
                .then((clubData) => {
                    if (clubData) {
                        setAllNotifications(clubData);
                    }
                });
        }
    }, [user,club,events,navigathionRead]);

    const  handelUserNotificationClick=(notification)=>{
        console.log("1")
        if (user &&notification) {
            fetch(`api/admin/read-notification-user/${notification.notificationID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                },
                method: "PUT",
            })

                .then((response) => {

                    if (response.status === 200) {
                        setNavigathionRead(navigathionRead+1)
                        if(events&&notification.event) {
                            navigate("/manage-event", {
                                state: {
                                    from: events.find(event => event.eventID === notification.event.eventID) || '',
                                    reason: notification.notificationMessage || ''
                                }
                            })
                        }

                    } else if (response.status === 401){
                        return response.json();
                        logout();
                    } else if (response.status === 404) {
                        return null; // Return null when club data is not found
                    } else {
                        return response.json();
                    }
                });
        }
    }
    const  handelClubNotificationClick=(notification)=>{

        if (user &&notification) {
            fetch(`api/club/read-notification/${notification.notificationID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                },
                method: "PUT",
            })

                .then((response) => {

                    if (response.status === 200) {
                        setNavigathionRead(navigathionRead+1)

                        if(events&&notification.club) {
                            navigate(`/clubprofile`,
                                {state: {club: notification.club}})
                        }

                    } else if (response.status === 401){
                        return response.json();
                        logout();
                    } else if (response.status === 404) {
                        return null; // Return null when club data is not found
                    } else {
                        return response.json();
                    }
                });
        }
    }
    const  handelEventNotificationClick=(notification)=>{

        if (club&& user &&user.authority.authorityName==="ROLE_MANAGER"&&notification) {
            fetch(`api/event/read-notification/${notification.notificationID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                },
                method: "PUT",
            })

                .then((response) => {

                    if (response.status === 200) {
                        setNavigathionRead(navigathionRead+1)


                       if(events&&notification.event) {
                           navigate("/manage-event", {
                               state: {
                                   from: events.find(event => event.eventID === notification.event.eventID) || '',
                                   reason: notification.notificationMessage || ''
                               }
                           })}

                    } else if (response.status === 401){
                        return response.json();
                        logout();
                    } else if (response.status === 404) {
                        return null; // Return null when club data is not found
                    } else {
                        return response.json();
                    }
                });
        }
    }

    const  openNaotification=()=>{
        setOpenNavigathion(!isopenNavigathion);
        setOpenProfileDiv(false);
    }

    const logout = ()=>{
        window.localStorage.clear();
        window.location.href="/login";
    }
    useEffect(() => {
        if (allNotifications&&user&&(user.authority.authorityName==="ROLE_ADMIN")) {
          setActiveclubNotifications(allNotifications.notificationClub.filter(notification => {

              return !notification.readStatus;
            }).sort((a, b) => {
              const dateA = new Date(a.creationDate);
              const dateB = new Date(b.creationDate);
              return dateB - dateA;
          }));
            setActiveAdminClubNotifications(allNotifications.notificationUser.filter(notification => {

                return !notification.readStatus;
            }).sort((a, b) => {
                const dateA = new Date(a.creationDate);
                const dateB = new Date(b.creationDate);
                return dateB - dateA;
            }));

        }
        if(allNotifications&&user&&club&&!(user.authority.authorityName==="ROLE_ADMIN")){
            setActiveclubNotifications(allNotifications.notificationClub.filter(notification => {

                return !notification.readStatus;
            }).sort((a, b) => {
                const dateA = new Date(a.creationDate);
                const dateB = new Date(b.creationDate);
                return dateB - dateA;
            }));
            setActiveEventsNotifications(allNotifications.notificationEvent.filter(notification => {

                return !notification.readStatus;
            }).sort((a, b) => {
                const dateA = new Date(a.creationDate);
                const dateB = new Date(b.creationDate);
                return dateB - dateA;
            }));

        }
    }, [allNotifications]);


    return (
        <header className="header-Sidenav" >
            <div className="Sidenav-rest">
                <div className="SideNav-img-holder" onClick={() => window.location.href = "/editProfile"}>

                    <img className="SideNav-img"
                         src={user ? user.profilePicURL ? user.profilePicURL : "https://i.stack.imgur.com/34AD2.jpg"
                             : "https://i.stack.imgur.com/34AD2.jpg"}
                    />
                    <div className={"sidbar-info-role"}>
                        <h5 style={{color: "black", fontSize: "16px"}}>
                           { user &&
                                (user.firstName.split(' ')[0].length > 10 ?
                                    user.firstName.split(' ')[0].substring(0, 9) + '...'
                                    : user.firstName.split(' ')[0])
                                    .toUpperCase()
                               }
                        </h5>
                        {roleName}
                    </div>
                </div>
                {user&&(club||(user.authority.authorityName==="ROLE_ADMIN"))&&
                    <div className="Sidenav-rest-footer">

                    <div className="nav-rest" onClick={openNaotification}>
                        <FontAwesomeIcon className={"icons-navigation"} onClick={openNaotification}
                                         icon={faBell}/>

                    </div>
                        {((user.authority.authorityName==="ROLE_MANAGER")||club) &&
                            (activeclubNotifications.length>0 || activeEventsNotifications.length>0 )&&
                            <p style={{marginLeft: -15, fontSize: 15, color: "red", fontWeight: "bold"}}>
                            {activeclubNotifications.length
                                +
                                (club.clubisActivation&&activeEventsNotifications.length)
                            }</p>}
                        {user.authority.authorityName==="ROLE_ADMIN"&&
                            (activeclubNotifications.length>0 || activeAdminClubNotifications.length>0)&&
                            <p style={{marginLeft: -15, fontSize: 15, color: "red", fontWeight: "bold"}}>
                                {activeclubNotifications.length+activeAdminClubNotifications.length}</p>}

                        <div className="nav-rest">
                        <FontAwesomeIcon className={"icons-navigation"}
                                         // onClick={openNaotification}
                                         icon={faInbox}/>
                    </div>
                    <p style={{marginLeft: -15, fontSize: 15, color: "red", fontWeight: "bold"}}>
                       </p>

                </div>}
            </div>

            <div className="Sidenav-rest">
                MENU
                <br/>
                {user&&((isActive&&club&&user&&user.authority.authorityName==="ROLE_MANAGER")
                    ||(user.authority.authorityName==="ROLE_ADMIN")) &&
                    <div className="sideBar-mnue">
                    <FontAwesomeIcon className={"icons"} icon={faLayerGroup}/>
                    <a className="SideBar-Button" href={(user&&user.authority.authorityName==="ROLE_ADMIN")?
                        "dashboard"
                        :
                        "/manager-dashboard"}>
                        Dashboard
                    </a>
                </div>}
                <div className="sideBar-mnue">
                    <FontAwesomeIcon className="icons" icon={faStar}/>
                    <a className="SideBar-Button" href="/home">
                        Event's
                    </a>
                </div>
                <div className="sideBar-mnue">
                    <FontAwesomeIcon className="icons" icon={faUserGroup}/>
                    <a className="SideBar-Button" href="/allclubs">
                        Club's
                    </a>
                </div>
                <div className="sideBar-mnue">
                    <FontAwesomeIcon className="icons" icon={faCalendar}/>
                    <a className="SideBar-Button" href="/weekevents">
                        Week Event's
                    </a>
                </div>

            </div>
            <div className="Sidenav-rest">

                <div className="sideBar-mnue-bottem">
                    <FontAwesomeIcon className="icons" icon={faUserPen}/>
                    <a className="SideBar-Button" href="/editProfile">
                        Edit Profile
                    </a>
                </div>
                {user&&!(user.authority.authorityName==="ROLE_ADMIN") &&
                    <div className="sideBar-mnue-bottem">
                    <FontAwesomeIcon className="icons" icon={faGear}/>
                    {club&&isActive&&(user&&user.authority.authorityName==="ROLE_MANAGER")&&
                        <a className="SideBar-Button"
                              onClick={() => navigate(`/clubprofile`, {state: {club}})}
                    >
                        My Club
                    </a>}
                    {((user&&user.authority.authorityName==="ROLE_STUDENT")||(club&&!club.clubisActivation))&&
                        <a className="SideBar-Button"
                           onClick={() => navigate(`/myClub`)}
                    >
                        My Club
                    </a>}
                </div>}
                <div className="sideBar-mnue-bottem">
                    <FontAwesomeIcon onClick={logout} style={{fontSize: "16px", color: "red"}}
                                     icon={faRightFromBracket}/>
                    <button className="SideBar-Button" onClick={logout}>
                        Log Out
                    </button>
                </div>
            </div>

            {isopenNavigathion&&
                <div className="notific-overlay" onClick={() => setOpenNavigathion(false)}>

                    <div className="profile-layout-Navg">
                        {/*<div className="title-notification-modal">Notifications</div>*/}
                        {club &&user && !(user.authority.authorityName === "ROLE_ADMIN") &&
                                <>
                                    {(activeclubNotifications.length > 0) &&
                                        activeclubNotifications.map(notificationClub =>
                                            <div className="SidePage-img-holder-notinfication-club"
                                                onClick={() => {
                                                    handelClubNotificationClick(notificationClub)
                                                }}
                                            >
                                                <img className="SidePage-img"
                                                     src={notificationClub.club.clubProfilePicURL}/>
                                                <div>
                                                    <h5>
                                                        {notificationClub.notificationType}
                                                    </h5>
                                                    <p style={{
                                                        fontSize: 11,
                                                        top: -20
                                                    }}> {notificationClub.notificationMessage.length>99?
                                                        notificationClub.notificationMessage.slice(0, 99)+" Read More..."
                                                    :
                                                        notificationClub.notificationMessage} </p>
                                                    <p style={{fontSize: 11}}> {notificationClub.creationDate} </p>



                                                </div>

                                            </div>)
                                    }


                                    {activeEventsNotifications.length > 0 &&club.clubisActivation&&
                                        activeEventsNotifications.map(notificationEvent =>
                                            <div className="SidePage-img-holder-notinfication"
                                                 onClick={() => {
                                                     handelEventNotificationClick(notificationEvent)
                                                 }}>
                                                <img className="SidePage-img"
                                                     src={"https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F1714400060132Screenshot%202024-04-29%20171400.png?alt=media&token=d6cb2f67-a9af-47c8-9688-6dc3b3b3d22e"}/>
                                                <div>
                                                    <h5>ADMIN</h5>
                                                    <p style={{fontSize: 11}}>{notificationEvent.notificationMessage.length>99?
                                                        notificationEvent.notificationMessage.slice(0, 99)+" Read More..."
                                                        :
                                                        notificationEvent.notificationMessage} </p>
                                                    <p style={{fontSize: 11}}> {notificationEvent.creationDate} </p>

                                                </div>

                                            </div>)}




                        {(!activeEventsNotifications.length > 0) && !activeclubNotifications.length > 0 &&
                            <div style={{alignSelf: "center", textAlign: "center" , marginTop:25}}>

                                <div>
                                    <h4>No Notifications to Display </h4>
                                </div>

                            </div>
                        }
                        </>

                        }
                        {user && (user.authority.authorityName === "ROLE_ADMIN") &&

                            <>
                                {activeclubNotifications.length > 0 &&
                                    activeclubNotifications.map(notificationClub =>
                                        <div className="SidePage-img-holder-notinfication-club"
                                            onClick={() => {
                                                setNavigathionRead(notificationClub)
                                                handelClubNotificationClick(notificationClub)
                                            }}
                                        >
                                            <img className="SidePage-img"
                                                 src={notificationClub.club.clubProfilePicURL}/>
                                            <div>
                                                <h5>{notificationClub.notificationType} </h5>
                                                <p style={{fontSize: 11}}>{notificationClub.notificationMessage.length>99?
                                                    notificationClub.notificationMessage.slice(0, 99)+" Read More..."
                                                    :
                                                    notificationClub.notificationMessage}</p>
                                                <p style={{fontSize: 11}}> {notificationClub.creationDate} </p>
                                            </div>

                                        </div>)}

                                {(activeAdminClubNotifications.length > 0) &&
                                    activeAdminClubNotifications.map(notificationUser =>
                                        <div className="SidePage-img-holder-notinfication"
                                            onClick={() => {
                                                handelUserNotificationClick(notificationUser)
                                            }}
                                        >
                                            <img className="SidePage-img"
                                                 src={notificationUser.event.eventPostMediaURL}/>
                                            <div>
                                                <h5>
                                                    {notificationUser.notificationType}
                                                </h5>
                                                <p style={{
                                                    fontSize: 11,
                                                    top: -20
                                                }}> {notificationUser.notificationMessage.length>99?
                                                    notificationUser.notificationMessage.slice(0, 99)+" Read More..."
                                                    :
                                                    notificationUser.notificationMessage} </p>
                                                <p style={{fontSize: 11}}> {notificationUser.creationDate} </p>

                                            </div>

                                        </div>)}


                                {(!activeAdminClubNotifications.length > 0) && !activeclubNotifications.length > 0 &&
                                    <div style={{alignSelf: "center", textAlign: "center", marginTop: 25}}>

                                        <div>
                                            <h4>No Notifications to Display </h4>
                                        </div>

                                    </div>}

                            </>}
                    </div>
                </div>
            }
        </header>
    )
        ;
};

export default Sidebar;