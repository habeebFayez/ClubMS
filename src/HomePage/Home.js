import React, {useEffect, useRef, useState} from 'react';
import './HomePage.css'
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import SidePage from "./SidePage/SidePage";
import PageContent from "./Page/PageContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import AnimationCheck from "../Component/AnimationCheck/AnimationCheck";

const HomePage = ({user,club,isActive ,clubNotifications, allClubs ,isLoading ,categories ,allClubsCategories,allEventsCategories, events}) => {
    const [isVisible, setIsVisible] = useState(false);
    const pageBodyRef = useRef(null);
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
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
    useEffect(() => {
        if (isModalOpenForSuccess === true) {
            setTimeout(() => {
                 window.location.reload();
                setIsModalOpenForSuccess(false);
            }, 3000);

        }
    }, [isModalOpenForSuccess]);

    return (
        <div className="homePage">
            {/*<div className="nav-underline"><Navbar  /></div>*/}
            <div className="menu-sidebar">
                <Sidebar user={user} allClubs={allClubs} events={events} isActive={isActive} club={club}  />
            </div>

            <div className="pageBody" ref={pageBodyRef} onScroll={handleScroll}>
                <PageContent categories={categories} user={user} isActive={isActive} club={club}
                             events={events} isLoading={isLoading} allEventsCategories={allEventsCategories} isModaSuccess={openisModaSuccess}
                             allClubs={allClubs} allClubsCategories={allClubsCategories} />
                {isVisible && (
                    <button className={"GoUp"} onClick={scrollToTop}>
                        <FontAwesomeIcon icon={faChevronUp} />
                    </button>
                )}
                {isModalOpenForSuccess &&
                    <div>
                        <p className="Success-message-creat-club">
                            <AnimationCheck/> <br/>
                            Your Request hase been sent Successfully !!
                        </p>
                    </div>
                }
            </div>
            <div className="pageBody-side">
                <SidePage user={user} isActive={isActive} isLoadingEvents={isLoading} allClubs={allClubs} club={club} events={events} />
            </div>

        </div>
    );
};

export default HomePage;
