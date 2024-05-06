import React, {useEffect, useRef, useState} from 'react';
import './index.css';

const Slideshow = ({images, delay = 2500}) => {
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, delay);

        return () => {
            resetTimeout();
        };
    }, [index]);

    return (
        <div className="slideshow-container">
            <div
                className="slideshowSlider"
                style={{transform: `translate3d(${-index * 100}%, 0, 0)`}}
            >
                {images.map((image, idx) => (
                    <div
                        className="slide"
                        key={idx}
                        style={{backgroundImage: `url(${image})`}}
                    ></div>
                ))}
            </div>
            <div className="slideshowDotsContainer">
                <div className="slideshowDots">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`slideshowDot${index === idx ? " active" : ""}`}
                            onClick={() => {
                                setIndex(idx);
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slideshow;
