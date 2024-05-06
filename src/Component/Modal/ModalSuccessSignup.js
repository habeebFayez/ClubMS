import './modalsignup.css'

import AnimationCheck from "../AnimationCheck/AnimationCheck";


const ModalSuccessSignUp = ({isOpen, onClose}) => {

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
                            <AnimationCheck/>
                            <h2 style={{color: "green"}}> Sign up successful!</h2>

                            <p className="content-p"> Please click the 'Sign In' button to access your account.</p>
                        </div>
                        <div className="button-container">
                            <button className="ContinueBTN" onClick={onClose}>Sign In</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalSuccessSignUp;
