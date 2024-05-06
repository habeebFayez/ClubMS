import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import "./Card.css";

const Card = ({title,numberMax ,tagtext,color,buttonRed}) => {

    return (
        <>
            <div className={color==="red"?
                "card-dashboard-red"
                : "card-dashboard"}>

                <div className="poster-info-dashboard">
                    <h3>{title}</h3>
                </div>
                <h1 className={color==="red"?
                    "tags-card-containar-dashboard-title-red"
                    :
                    "tags-card-containar-dashboard-title"}>{numberMax}</h1>
                <div className="tags-card-tags-card-containar-dashboardcontainar">

                    <button className={color==="red"||buttonRed?
                        "tags-btn-club-card-dashboard-red":"tags-btn-club-card-dashboard-green"}> {tagtext}</button>
                </div>
            </div>
        </>
    );
};

export default Card;