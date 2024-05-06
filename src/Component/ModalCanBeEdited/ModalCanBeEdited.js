import React, {useState} from 'react';
import './ModalCanBeEdited.css';

const ModalCanBeEdited = ({isOpen, onClose ,openResoneOver, text,title,confirm,withInput}) => {

    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };
    return (
        <>
            {isOpen && (
                <div className="modal-overlay" onClick={handleClickOutside}>
                    <div className="modal-confirm">
                        <div className="modal-content">
                            <h2>{title}</h2>
                            <p className="content-p-confirm">{text}</p>
                            {withInput&&
                                <div className={"modal-content"} >
                               <button className="add-speaker-sponser-BTN"
                               onClick={openResoneOver}
                               >Include Reason</button>
                            </div>}

                        </div>
                        <div className="button-container-confirm">
                            <button className="SaveBTN-confirm" onClick={confirm}>Yes
                            </button>
                            <button className="CloseBTN-confirm" onClick={onClose}>No</button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default ModalCanBeEdited;
