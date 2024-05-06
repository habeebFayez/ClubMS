import React, {useState} from 'react';
import './modal.css'

const Modal = ({isOpen, onClose}) => {
    const [email, setEmail] = useState('');
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };
    return (
        <>
            {isOpen && (
                <div className="modal-overlay" onClick={handleClickOutside}>
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Reset your password</h2>
                            <p className="content-p">Enter the email address associated with your account and we will
                                send you a link to reset
                                your password.</p>
                            <input
                                className="Emailinput"
                                type="email"
                                placeholder=" Email@st.uskudar.edu.tr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>
                        <div className="button-container">
                            <button className="ContinueBTN">Continue</button>
                        </div>
                        <div className="button-container">
                            <button className="BackToSigninBTN" onClick={onClose}>Back to Sign In</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
