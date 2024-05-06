import './App.css';
import {useLocalState} from "./util/useLocalState";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Dashboard from "./Dashboard/AdminDashboard";
import HomePage from "./HomePage/Home";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import React, {useEffect, useState} from "react";
import Loading from "./Component/loading/Loading";
import EditProfile from "./EditProfile/EditProfile";
import MyClub from "./Users/StudentUser/MyClub";
import EventFullPage from "./HomePage/Page/EventFullPage/EventFullPage";
import ClubsPage from "./ClubsPage/ClubsPage";
import ProfileClub from "./Users/ClubManagerUser/ProfileClub";
import axios from "./api/axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import WeekEvents from "./WeekEvents/WeekEvents";
import ClubManagerDashboard from "./Dashboard/ClubManagerDashboard";
import FlullPageEventDataManegment from "./HomePage/Page/EventFullPage/FlullPageEventDataManegment";
import SearchPage from "./HomePage/Page/SearchPage/SearchPage";
import {AxiosError} from "axios";

function App() {

    const [jwt, setJwt] = useLocalState("", "jwt")
    const [islogedIn, setIslogedIn] = useState('');
    const [user, setUser] = useState(null);
    const [club, setClub] = useState(null);
    const [allClubs, setAllClubs] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [events, setEvents] = useState([]);
    const [allEventsCategories, setAllEventsCategories] = useState([]);
    const [allClubsCategories, setAllClubsCategories] = useState([]);

    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [errMsg, setErrMsg] = useState('');

    const location = useLocation()


    useEffect (() => {
        if(jwt){
            setIsLoading(true);

            fetch("api/auth/getUser",
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`},
                method :"GET",

            })
            .then((response)=>{
                if(response.status===200){
                    return response.json();
                }else if (response.status === 401) {
                    setErrMsg("Authorization Expired ");
                     logout();
                } else {
                    setErrMsg("error"+response.status);
                    return response.json();
                }
            })
            .then((userData)=>{
                setUser(userData);
            }).catch((error) => {
            setErrMsg("Error!!"+error);


        }).finally(
                setIsLoading(false)
            );
        }
        ;
    }, []);
    useEffect(() => {
        if (jwt && user) {
            setIsLoading(true);

            fetch("api/club/getClub", {
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
                        logout();
                    } else if (response.status === 404) {
                        return null; // Return null when club data is not found
                    } else {
                        setErrMsg("Error : We are sorry please login again");
                        return response.json();
                    }
                })
                .then((clubData) => {
                    if (clubData) {
                        setClub(clubData);
                        setIsActive(clubData.clubisActivation);
                    }
                });
        }
        setIsLoading(false);
    }, [jwt, user]);
    useEffect(() => {

        if(jwt) {
            setIsLoading(true);
            fetch("api/club/getAllClubs", {
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
                        logout();

                    }else if(response.status === 404){
                        return response.json();
                    } else {
                        setErrMsg("Error : We are sorry please login again");

                        return response.json();
                    }
                })
                .then((clubData) => {
                    setAllClubs(clubData);
                });
        }
        setIsLoading(false);
    }, [user]);
    useEffect(() => {
        if (jwt) {
            setIsLoading(true);

            fetch("api/event/getallevents", {
                headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${jwt}`
                }, method: "GET",
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401) {
                        setErrMsg("Authorization Expired ");
                        logout();
                    } else {
                        setErrMsg(response);
                        setErrMsg("Error : We are sorry please login again");

                    }
                })
                .then((eventData) => {
                    setEvents(eventData);
                })
                .catch((error) => {
                    setErrMsg(error);

                });
        }
        setIsLoading(false);
    }, [user]);
    useEffect(() => {
    const categoriesList = async (e) => {

        try {
            setIsLoading(true);

            const response = await axios.get("/category/getAllCategoreis",

                {
                    headers: {
                        'Content-Type': 'application/json', Authorization: `Bearer ${jwt}`
                    }, method: "get"

                });
            setCategories(response.data);

        } catch (err) {
            if (!err?.response) {
               console.log("No Server Response");
            } else if (err.response?.status === 401) {
                setErrMsg('Authorization Expired!!');
                logout();

            } else {
                setErrMsg('Server Error  Please try  later !!');

            }
        }

    };
       if(jwt){
           categoriesList();
       }
        setIsLoading(false);

    }, [user]);
    useEffect(() => {
        const categoriesList = async (e) => {

            try {
                setIsLoading(true);

                const response = await axios.get("/event/getalleventscategories",

                    {
                        headers: {
                            'Content-Type': 'application/json', Authorization: `Bearer ${jwt}`
                        }, method: "get"

                    });
                setAllEventsCategories(response.data);
            } catch (err) {
                if (!err?.response) {
                    console.log("No Server Response");
                } else if (err.response?.status === 401) {
                    setErrMsg('Authorization Expired!!');
                    logout();

                } else {
                    setErrMsg('Server Error  Please try  later !!');

                }
            }

        };
        if(jwt){
            categoriesList();

        }
        setIsLoading(false);

    }, [events]);
    useEffect(() => {
        const categoriesList = async (e) => {

            try {
                setIsLoading(true);

                const response = await axios.get("/club/getAllClubsCategory",

                    {
                        headers: {
                            'Content-Type': 'application/json', Authorization: `Bearer ${jwt}`
                        }, method: "get"

                    });
                setAllClubsCategories(response.data);
            } catch (err) {
                if (!err?.response) {
                    console.log("No Server Response");
                } else if (err.response?.status === 401) {
                    setErrMsg('Authorization Expired!!');
                    logout();

                } else {
                    setErrMsg('Server Error  Please try  later !!');

                }
            }

        };
        if(jwt){
        categoriesList();}
        setIsLoading(false);

    }, [allClubs]);

    useEffect(() => {

        if (user && events && categories) {
            setDataLoaded(true);
        }
    }, [user, events, categories]);

    const logout = ()=>{
        setTimeout(() => {
            window.location.href="/login";
            window.localStorage.clear();
        }, 2000);



    }

    const waitLoading = ()=>{

        setTimeout(() => {
            // window.location.href="/home";
        }, 2000);

    }
    useEffect(() => {
        if (errMsg !== '') {
            setTimeout(() => {
                setErrMsg('');
            }, 5000);

        }
    }, [errMsg]);

    return (
        <>

            {errMsg && <p className="creat-club-error-message">
                <FontAwesomeIcon className={"Icon_close_err_mess"} onClick={() => {
                    setErrMsg(false)
                }}
                                 style={{fontSize: "25px"}}
                                 icon={faTimes}/>
                <br/>{errMsg}
            </p>}
            <Routes>
                    <Route path="/dashboard" element={
                    <PrivateRoute>

                        {dataLoaded&&((user&&user.authority.authorityName==="ROLE_ADMIN")?
                            <Dashboard user={user}
                                       isActive={isActive}
                                       categories={categories}
                                       allEventsCategories={allEventsCategories}
                                       allClubsCategories={allClubsCategories}
                                       isLoading={isLoading}
                                       allClubs={allClubs}
                                       events={events} club={club}/>
                        :
                            <>
                                <Navigate to="/not-found-page-404"/>
                            </>)
                        }

                    </PrivateRoute>


                }/>


                    <Route path="/manager-dashboard" element={

                    <PrivateRoute>

                        {dataLoaded&&((user&&user.authority.authorityName==="ROLE_MANAGER")?
                            <ClubManagerDashboard user={user}  isActive={isActive} categories={categories}
                                               allEventsCategories={allEventsCategories}
                                               allClubsCategories={allClubsCategories}
                                               isLoading={isLoading}
                                                  allClubs={allClubs} events={events} club={club}/>
                            :
                            <>
                                <Navigate to="/not-found-page-404"/>
                            </>)
                        }
                    </PrivateRoute>

                }/>
            <Route path="/" element={
                <Navigate to="/login"/>
            }/>
            <Route path="/home" element={
                <PrivateRoute >
                    {dataLoaded&&<HomePage user={user} isActive={isActive} categories={categories}
                               allEventsCategories={allEventsCategories} allClubsCategories={allClubsCategories}
                               isLoading={isLoading}
                               allClubs={allClubs} events={events} club={club}/>}
                </PrivateRoute>
                }/>
            <Route path="/allclubs" element={
                <PrivateRoute>
                    {dataLoaded&&<ClubsPage user={user} events={events} isActive={isActive} club={club}
                                allEventsCategories={allEventsCategories} allClubsCategories={allClubsCategories}
                                categories={categories} allClubs={allClubs}/>}
                </PrivateRoute>
            }/>
            <Route path="/clubprofile" element={
                <PrivateRoute>
                    {dataLoaded&&<ProfileClub user={user} events={events} isActive={isActive} userClub={club}
                                  allEventsCategories={allEventsCategories} allClubsCategories={allClubsCategories}
                                  categories={categories} allClubs={allClubs}
                    />}
                </PrivateRoute>
            }/>
            <Route path="/login" element={
                jwt?<Navigate to="/home"/> : <Login/>

            }/>
            <Route path="/editProfile" element={
                <PrivateRoute>
                    {dataLoaded&&<EditProfile user={user} events={events} isLoadingApp={isLoading}
                                  isActive={isActive} allClubs={allClubs} club={club}/>}
                </PrivateRoute>
            }/>
            <Route path="/myClub" element={
                <PrivateRoute>
                    {dataLoaded&&<MyClub user={user} isActive={isActive} categories={categories}
                             isLoading={isLoading} allClubs={allClubs} events={events} club={club}/>}
                </PrivateRoute>
            }/>
                <Route path="/search" element={
                    <PrivateRoute>
                        {dataLoaded&&<SearchPage user={user} isActive={isActive} categories={categories}
                                     allEventsCategories={allEventsCategories}
                                     allClubsCategories={allClubsCategories} isLoading={isLoading}
                                     allClubs={allClubs} events={events} club={club}/>}
                    </PrivateRoute>
                }/>
            <Route path="/event" element={
                <PrivateRoute>
                    {dataLoaded&&<EventFullPage user={user} allClubs={allClubs} events={events}
                                    allEventsCategories={allEventsCategories}
                                    categories={categories} club={club} isActive={isActive}/>}
                </PrivateRoute>
            }/>
                <Route path="/manage-event" element={
                    <PrivateRoute>
                        {dataLoaded&&(((club&&isActive)||(user&&user.authority.authorityName==="ROLE_MANAGER")||(user&&user.authority.authorityName==="ROLE_ADMIN"))?
                            <FlullPageEventDataManegment user={user} allEventsCategories={allEventsCategories}
                                                      events={events} categories={categories} club={club}
                                                      isActive={isActive} />
                        :
                        <Navigate to={"/home"}/>)
                        }
                    </PrivateRoute>
                }/>
                <Route path="/weekevents" element={
                    <PrivateRoute>
                        {dataLoaded&&<WeekEvents user={user} events={events}
                                     categories={categories} club={club} isActive={isActive}/>}
                    </PrivateRoute>
                }/>
                <Route
                    path="/*"
                    element={
                    <Navigate to="/not-found-page-404" />}
                />
                <Route
                    path="/not-found-page-404"
                    element={
                    <div className="not-found-page-container">
                        <h2 className="page-not-found">PAGE NOT FOUND</h2>
                        <h1  className="page-404" >404</h1>
                        <a  className="page-not-found-home" href={"/home"}>
                            {jwt?"Go Home":"Login"} </a>
                    </div>
                    }
                />


            </Routes>
            {isLoading&& <div className="modal-post-img-edit-profile">
                <Loading/>
            </div>


            }
</>
    );
}

export default App;
