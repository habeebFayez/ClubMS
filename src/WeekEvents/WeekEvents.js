import React, {useEffect, useRef, useState} from 'react';
import "./WeekEvents.css"
import Sidebar from "../HomePage/Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";

import PageTop from "../HomePage/Page/PageTop";
import WeekDaysAndDate from "./WeekDaysAndDate/WeekDaysAndDate";

const WeekEvents = ({user,club,isActive ,clubNotifications, allClubs ,isLoading ,categories , events}) => {
    const pageBodyRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [ scrollListener, setScrollListener] = useState(false);
    const today = new Date();
    const todayDate =today.toISOString().split('T')[0]
    const dayFormatOptions = { weekday: 'long' };
    const dayFormatter = new Intl.DateTimeFormat('en-US', dayFormatOptions);
    const day = dayFormatter.format(today);
    let dayHours=18;

    const handleScroll = () => {
        setScrollListener(pageBodyRef.current.scrollTop > 100);
        setIsVisible(pageBodyRef.current.scrollTop > 100);
    };
    useEffect(() => {
        const handleScrollRight = () => {
            const tracks = document.querySelector('.tracks');
            const tracksW = tracks.scrollWidth;
            tracks.scrollBy({
                left: tracksW / 2,
                behavior: 'smooth'
            });
        };

        const handleScrollLeft = () => {
            const tracks = document.querySelector('.tracks');
            const tracksW = tracks.scrollWidth;
            tracks.scrollBy({
                left: -tracksW / 2,
                behavior: 'smooth'
            });
        };

    }, []);
    const scrollToTop = () => {
        pageBodyRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) {
                document.body.classList.add('reveal');
            } else {
                document.body.classList.remove('reveal');
            }
        });

        observer.observe(document.querySelector('#top-of-site-pixel-anchor'));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="homePage">
            <div className="menu-sidebar">
                <Sidebar user={user} allClubs={allClubs} events={events} clubNotifications={clubNotifications} isActive={isActive} club={club}/>
            </div>

            <div className="pageBody-allclubs"  >
                <PageTop isSearchvis={true} title={"Weekly Events"} user={user} isActive={isActive} club={club}/>

                <div className="wrapper" ref={pageBodyRef} onScroll={handleScroll}>


                    <div className="table">

                           <WeekDaysAndDate user={user} scrollListener={scrollListener} isActive={isActive} club={club} events={events} currentDate={today}/>


                    </div>
                </div>
                <div id="top-of-site-pixel-anchor"></div>
                {isVisible && (
                    <button className={"GoUp-clubs"} onClick={scrollToTop}>
                        <FontAwesomeIcon icon={faChevronUp}/>
                    </button>
                )}
            </div>
        </div>

    );
};

export default WeekEvents;