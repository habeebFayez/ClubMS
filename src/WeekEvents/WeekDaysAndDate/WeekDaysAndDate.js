import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {faClock, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Loading from "../../Component/loading/Loading";
// const timeslots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];
// const timeslotsDouble =[];
// const sameTimeslots = new Set();
const WeekDaysAndDate = ({user,currentDate,scrollListener,club,isActive, events}) => {
    const startDate = new Date(currentDate);
    const currentDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - currentDayOfWeek);
    const datesOfWeek = [];
    const navigate = useNavigate();
    const [disableEvent, setIsDisableEvent] = useState(false);
    const [todayEvents, setTodayEvents] = useState([]);
    const [weekEvents, setWeekEvents] = useState([]);
    const [theDayEvents, setTheDayEvents] = useState();


    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 6);
    const [showSomeDayEvents, setShowSomeDayEvents] = useState(currentDate.getDate());

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        datesOfWeek.push(currentDate.getDate());


    }
    const numberOfEventsPerDay = (index) => {

        return weekEvents.filter(event => {
            const eventStartDate = new Date(event.eventStartingDate);
            return eventStartDate.getDate() === index;
        }).length;
    };
    const wordCount = (text) => {
        return text.split(/\s+/).length;
    };
    const showClickedDayEvents = (day) => {
        const clickedDate = new Date(currentDate);
        clickedDate.setDate(day);
        if (events) {
            const clickedDayEvents = weekEvents.filter(event => {
                const eventStartDate = new Date(event.eventStartingDate);
                return eventStartDate.getDate() === clickedDate.getDate();
            }).sort((a, b) => parseTime(a.eventNote).getTime() - parseTime(b.eventNote).getTime());
            setTodayEvents(clickedDayEvents);
            setShowSomeDayEvents(day)
            setIsDisableEvent(clickedDate)

        }

    };

    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return new Date(0, 0, 0, hours, minutes);
    };
    useEffect(() => {
        if (events) {
            setWeekEvents(events.filter(event => {
                const eventStartDate = new Date(event.eventStartingDate);
                return event.eventStates&&event.eventPostRequested &&(eventStartDate >= startDate.setDate(startDate.getDate() -1) && eventStartDate <= endDate);
            }));
        }

    }, [events]);
    useEffect(() => {
        if (events) {

            const todayEvents = weekEvents.filter(event => {
                const eventStartDate = new Date(event.eventStartingDate);
                return eventStartDate.getDate() === currentDate.getDate();
            }).sort((a, b) => parseTime(a.eventNote).getTime() - parseTime(b.eventNote).getTime());

            setTodayEvents(todayEvents);

        }

    }, [weekEvents]);
    useEffect(() => {
        const clickedDate = new Date(currentDate);
        clickedDate.setDate(theDayEvents);
        const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = clickedDate.toLocaleDateString('en-GB', options);
        setTheDayEvents(formattedDate);
    }, [todayEvents]);

    return (
        <>
            {scrollListener&& <div className="sticky-header">
                <h3 className="day-today-date">{currentDate.toDateString()}</h3>
            </div>}
            <div className="headers">
                <div className="scroller syncscroll">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (

                        <div key={index} className="track-days">

                            <div
                                onClick={(day) => {
                                    showClickedDayEvents(datesOfWeek[index])
                                    setTheDayEvents(datesOfWeek[index])
                                }}
                                className={datesOfWeek[index] === showSomeDayEvents ? "heading-current" : "heading"}>
                                {day}
                                <div>{datesOfWeek[index]}</div>
                            </div>
                            <p style={{color:"red", fontWeight:650}}>{numberOfEventsPerDay(datesOfWeek[index])}</p>
                        </div>
                    ))}
                </div>
            </div>



                <div className="events-scroller">
                    {todayEvents.length>0 ?
                        (
                            todayEvents.map(post => !post.eventUpdated&&post.eventStates&&
                                <>
                                <div style={{display: "flex"}}>
                                    <div className="track time">
                                        <div className={"entry-time"}>
                                            <time>{post.eventNote}</time>
                                            |
                                            <time>{post.eventEndTime}</time>
                                        </div>
                                    </div>
                                    <div className="track blue">
                                        <div className={"entry"}>
                                            <div
                                                className={"details"}
                                               onClick={() =>
                                                   ((club&&isActive&&club.clubID===post.club.clubID)
                                                       || user&&user.authority.authorityName==="ROLE_ADMIN"?
                                                       navigate("/manage-event", {state: {from: post}})
                                                       :
                                                       navigate("/event", {state: {from: post}}))}>
                                                <h4 className="details-title">{post.eventName.toUpperCase()}</h4>
                                                <div
                                                    style={{
                                                        marginTop: 5,
                                                        fontSize: 12,
                                                        minHeight: 45,
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: post.eventPostDescription.replace(/\n/g, '<br />')
                                                                .split(/\s+/).slice(0, 25).join(' ')
                                                            + (wordCount(post.eventPostDescription) > 25 ? "..." : '')
                                                    }}
                                                />
                                                <p className="details-p">
                                                    <FontAwesomeIcon className="event-calender-icon" icon={faClock}/>
                                                    {post.eventNote}-{post.eventEndTime}

                                                </p>
                                                <p className="details-p">
                                                    <FontAwesomeIcon className="event-calender-icon"
                                                                     icon={faLocationDot}/>
                                                    {post.eventHall}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                </>
                            )
                        )
                        :
                        (<div className="week-page-content">
                            <h2>There is No Scheduled Event's Yet </h2>
                            <label
                                style={{fontSize: 100}}>
                                {String.fromCodePoint('0x1f634')}
                            </label>
                        </div>)



                    }
                </div>


        </>
    );
};

export default WeekDaysAndDate;
// <div className={"entry"}>
//     <time>08.00</time>
// </div>
// <div className={"entry"}>
//     <time>09.00</time>
// </div>
// <div className={"entry"}>
//     <time>10.00</time>
// </div>
// <div className={"entry"}>
//     <time>11.00</time>
// </div>
// <div className={"entry"}>
//     <time>12.00</time>
// </div>
// <div className={"entry"}>
//     <time>13.00</time>
// </div>
// <div className={"entry"}>
//     <time>14.00</time>
// </div>
// <div className={"entry"}>
//     <time>15.00</time>
// </div>
// <div className={"entry"}>
//     <time>16.00</time>
// </div>
// <div className={"entry"}>
//     <time>17.00</time>
// </div>
// <div className={"entry"}>
//     <time>18.00</time>
// </div>
// <div className={"entry"}>
//     <time>19.00</time>
// </div>
// <div className={"entry"}>
//     <time>20.00</time>
// </div>
// <div className={"entry"}>
//     <time>21.00</time>
// </div>
// <div className={"entry"}>
//     <time>22.00</time>
// </div>
// <div className={"entry"}>
//     <time>23.00</time>
// </div>
// <div className={"entry"}>
//     <time>24.00</time>
// </div>

// {/* If events > 5 */}
// {todayEvents.length > 5 && (
//     <div className="fliped-container">
//         <button className="see-all-button"> See All</button>
//     </div>
// )}
