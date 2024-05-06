import React, {useState} from 'react';
import './verify.css'
import axios from "axios";


const VerifyEmail = ({isOpen, onClose, email}) => {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/auth/verify', {email, otp});
            if (response.status === 200) {
                onClose();
                window.location.href = '/dashboard';
            } else if (response.status === 401) {
                setError('Invalid Code. Please try again.');
            } else if (response.status === 403) {
                window.location.href = '/blocked';
            } else {
                setError('Unexpected Error. Please try again later.');
            }
        } catch (error) {
            setError('Unexpected Error. Please try again later.');
        }


    };

    return (
        <>
            {isOpen && (<div className="modal-overlay-verify">
                <div className="container-verify">
                    <img
                        src="https://img.freepik.com/premium-vector/keywords-optimization-flat-vector-illustration-design_1223-242.jpg?w=740"
                        alt="Circle" className="circle-img"/>
                    <h2 className="h2-verify">Email Verification</h2>
                    <p>You must verify your e-mail to proceed
                        we sent you an Email with the secret code.
                    </p>
                    {error && <div className="error-verify">{error}</div>}
                    <div className="otp-form">
                        <label className="label-verify" htmlFor="otp">Enter Code:</label>
                        <input
                            className="input-verify"
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            required={true}
                        />
                        <button className="button-verify" onClick={handleSubmit}> Submit</button>
                    </div>
                </div>
            </div>)}
        </>
    );
};


export default VerifyEmail;