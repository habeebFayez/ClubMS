import React, {useEffect} from 'react';
import "./AnimationCheck.css"

const AnimationCheck = () => {
    useEffect(() => {
        // Start animation when the component mounts
        setTimeout(() => {
            const checkIcon = document.querySelector('.check-icon');
            if (checkIcon) {
                checkIcon.classList.add('animate');
            }
        }, 10);
    }, [])
    return (

        <div className="success-checkmark">
            <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
            </div>
        </div>

    )
        ;
};

export default AnimationCheck;