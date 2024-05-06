import React, {useState} from 'react';
import './modal.css'
import axios from "../../api/axios";

const ModalVerifyEmail = ({isOpen, onClose}) => {
    const [code, setCode] = useState('');
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const [v1, v2, v3, v4] = [USER_REGEX.test(firstName),
            USER_REGEX.test(lastName), EMAIL_REGEX.test(email), STUDEN_NUMBER_REGEX.test(studentNumber)];
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({firstName, lastName, email, password, studentNumber}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true

                });

            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setIsModalOpenForSuccess(true);
            setSuccess(true);
            const empty = "";
            setFirstName(empty);
            setLastName(empty);
            setEmail(empty);
            setStudentNumber(empty);
            setNewPassword(empty);
            setConfirmPassword(empty);


        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
                setErrMsg('Email or student number is already in use! \n Please try to sign in ');

            } else {
                setErrMsg('Registration failed');
            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }


    };
    return (
        <>
            {isOpen && (
                <div className="modal-overlay" onClick={handleClickOutside}>
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Verify Your Email</h2>
                            <p className="content-p">Enter the Code we sent you on your Email to continue.</p>
                            <input
                                className="Emailinput"
                                type="text"
                                placeholder="Enter the code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />

                        </div>
                        <div className="button-container">
                            <button className="ContinueBTN">Continue</button>
                        </div>
                        <div className="button-container">
                            <button className="BackToSigninBTN" onClick={onClose}>Verify</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalVerifyEmail;
