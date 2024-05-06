import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash, faInfoCircle, faLock, faTimes, faUser} from '@fortawesome/free-solid-svg-icons';
import './index.css'
import Slideshow from "../Component/SlidShow";
import Modal from '../Component/Modal/Modal';
import {useWindowSize} from 'react-use';
import {useLocalState} from "../util/useLocalState";
import ModalSuccessSignUp from "../Component/Modal/ModalSuccessSignup";
import axios from "../api/axios";
import VerifyEmail from "./VerifyEmail";
import {logDOM} from "@testing-library/react";
import { jwtDecode } from 'jwt-decode';
import {json} from "react-router-dom";
import Loading from "../Component/loading/Loading";



const USER_REGEX = /^[a-zA-Z ]{3,24}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])\S{8,35}$/;
const EMAIL_REGEX = /^[a-zA-Z.]{3,50}@st\.uskudar\.edu\.tr$/;
const STUDEN_NUMBER_REGEX = /^[0-9]{9}$/;
const REGISTER_URL = '/auth/register'
const LOGIN_URL = '/auth/login'

const Login = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    // const decodedToken = jwtDecode(jwt);
    const [email, setEmail] = useState('');
    const [islogedIn, setIslogedIn] = useLocalState(false,"IsLogedIn");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenForVerufy, setIsModalOpenForVerufy] = useState(false);
    const [isModalOpenForSuccess, setIsModalOpenForSuccess] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const userRef = useRef(null);
    const errRef = useRef(null);
    const [validFirstName, setValidFirstName] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);
    const [validLastName, setValidLastName] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);
    const [validMatchPassword, setValidMatchPassword] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);
    const [validNewPassword, setValidNewPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [validStudentNumber, setValidStudentNumber] = useState(false);
    const [studentNumberFocus, setStudentNumberFocus] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    const images = [
       "https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F187271a8e19a87a1285d7138eceba948.png?alt=media&token=16e5a168-ae17-43d2-b8e6-3a6b004fe30a",
        "https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2Fe85a7850ef2e546c25859f80491ad6c7.png?alt=media&token=8c6f427f-3882-4ed9-9cfd-b2b9b8455618",
        "https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F758793e6958c9fc4723e49649801b009.png?alt=media&token=1d781c90-43be-476a-8a86-dee90f9145b8",

    ];

    const sendLoginRequest = (event) => {
        event.preventDefault();
        const reqBody = {
            "email": email,
            "password": password
        }
        if(!email || !password){
            setErrMsg("Please fill the Email and Password Fields!!");
            return;
        }
        setIsLoading(true);
        setIslogedIn(true);
        fetch("api/auth/login",
            {

                headers: {
                    "Content-Type": "application/json"
                },
                method: "post",
                body: JSON.stringify(reqBody),

            }).then((response) => {


            if (response.status === 200) {
                setIslogedIn(false);
                setIsLoading(false);
                return Promise.all([response.json(), response.headers]);
            } else if (response.status === 403) {
                return Promise.reject("Your Account is Blocked. Please contact admin to activate your account.");
            }else if (response.status === 401) {
                return Promise.reject("Wrong Email or Password please try again.");
            } else {
                return Promise.reject("Invalid LogIn Attempt.");
            }
        })
            .then(([body, headers]) => {
                setJwt(headers.get("authorization"));
                setIsLoading(false);

                    //routing besed on the role here so i need a decode jwt
                // must parse the jwt by headers sense the setJwt will take some extra time ...IMP
                        const decodedToken = parseJwt((headers.get("authorization")));
                        const userRole = decodedToken.roles;
                        setRole(userRole);
                        switch (userRole) {
                            case 'ROLE_ADMIN':
                                window.location.href = "/dashboard";
                                break;
                            case 'ROLE_STUDENT':
                                window.location.href = "/home";
                                break;
                            case 'ROLE_MANAGER':
                                window.location.href = "/manager-dashboard";
                                break;
                            default:
                                window.location.href = "/error";
                        }


            }).catch((message) => {
            setErrMsg(message);
        }).finally( setIsLoading(false));

        setEmail('');
        setPassword('');


    };
    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((char) => {
            return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    //################################## REGESTER REQ ##################################
    const handleSubmit = async (e) => {
        e.preventDefault();
        const [v1, v2, v3, v4] = [USER_REGEX.test(firstName),
            USER_REGEX.test(lastName), EMAIL_REGEX.test(email), STUDEN_NUMBER_REGEX.test(studentNumber)];
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("invalid Entry");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({firstName, lastName, email, password :newPassword, studentNumber}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true

                });
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
            setIsLoading(false);

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

        setIsLoading(false);

    };
    const togglePasswordVisibility = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = (event) => {
        event.preventDefault();
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSignUpClick = () => {
        setErrMsg('');
        setIsSignUp(true); // Show the sign-up form
    };
    const handleBackToSignInClick = () => {
        setIsSignUp(false); // Show the login form
    };

    const {width} = useWindowSize();
    useEffect(() => {
    }, [width]);
    const {height} = useWindowSize();
    useEffect(() => {
    }, [height]);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);
    useEffect(() => {
        if (errMsg) {
            setTimeout(() => {
                setErrMsg('');
            }, 3000);

        }
    }, [errMsg]);
    useEffect(() => {
        const result = USER_REGEX.test(firstName);
        console.log(result);
        console.log(firstName);
        setValidFirstName(result);
    }, [firstName]);
    useEffect(() => {
        const result = USER_REGEX.test(lastName);
        console.log(result);
        console.log(lastName);
        setValidLastName(result);
    }, [lastName]);
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);

    }, [email]);
    useEffect(() => {
        const result = STUDEN_NUMBER_REGEX.test(studentNumber);
        console.log(result);
        console.log(studentNumber);
        setValidStudentNumber(result);

    }, [studentNumber]);
    useEffect(() => {
        const result = PASSWORD_REGEX.test(newPassword);
        console.log(result);
        console.log(newPassword);
        setValidNewPassword(result);
        const match = newPassword === confirmPassword;
        setValidMatchPassword(match);
    }, [newPassword]);
    useEffect(() => {
        const match = newPassword === confirmPassword;
        setValidMatchPassword(match);
    }, [confirmPassword]);
    useEffect(() => {
        setErrMsg('');

    }, [firstName, lastName, email, newPassword, confirmPassword, studentNumber]);
    return (

        <div className="container">
            {isLoading &&
                <div className="modal-post-img-edit-profile">
                    <Loading/>
                </div>
            }

            {(width >= 1200 && height >= 600) && (
                <div className="PicsSide">
                    <Slideshow images={images} delay={5000}/>
                </div>
            )}
            <img
                className="LogoEn1"
                src="https://firebasestorage.googleapis.com/v0/b/cmsystem-f147d.appspot.com/o/images%2F1714400060132Screenshot%202024-04-29%20171400.png?alt=media&token=d6cb2f67-a9af-47c8-9688-6dc3b3b3d22e"
            />
            {isSignUp ?

                <div className="signup-container active">
                    {errMsg && <p className="App-error-message">
                        <FontAwesomeIcon style={{fontSize: "25px"}} icon={faTimes}/> <br/>{errMsg}</p>}
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="title">
                            <h2 className="title">Sign Up</h2>
                        </div>
                        <div className="input-fiel-signup">
                            <div className="input-field-first">
                                <div
                                    className={validFirstName || !firstName ? "input-field-first-name" : "err-input-field-first-name"}>

                                    <input
                                        type="text"
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validFirstName ? "false" : "true"}
                                        onFocus={() => setFirstNameFocus(true)}
                                        onBlur={() => setFirstNameFocus(false)}
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                    {firstNameFocus && firstName && !validFirstName &&
                                        <p
                                            className="error-message">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            3 to 24 characters .<br/>
                                            Only letters are allowed. <br/>
                                        </p>}
                                </div>
                                <div
                                    className={validLastName || !lastName ? "input-field-last-name" : "err-input-field-last-name"}>
                                    <input
                                        className="last-name"
                                        type="text"
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validLastName ? "false" : "true"}
                                        onFocus={() => setLastNameFocus(true)}
                                        onBlur={() => setLastNameFocus(false)}
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                    {lastNameFocus && lastName && !validLastName &&
                                        <p
                                            className="error-message">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            3 to 24 characters .<br/>
                                            Only letters are allowed. <br/>
                                        </p>}
                                </div>
                            </div>


                            <div className="input-field-second">
                                <div className={validEmail || !email ? "input-field-signup" : "err-input-field-signup"}>
                                    <input
                                        type="email"
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validEmail ? "false" : "true"}
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                        placeholder="Email@st.uskudar.edu.tr"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    {emailFocus && email && !validEmail &&
                                        <p
                                            className="email-error-message">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            3 to 24 characters <br/>
                                            Only letters and the specil character DOT . are allowed <br/>
                                            must use your University Student email


                                        </p>}
                                </div>

                            </div>
                            <div className="input-field-third">
                                <div
                                    className={validStudentNumber || !studentNumber ? "input-field-signup" : "err-input-field-signup"}>
                                    <input
                                        type="text"
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validEmail ? "false" : "true"}
                                        onFocus={() => setStudentNumberFocus(true)}
                                        onBlur={() => setStudentNumberFocus(false)}
                                        placeholder="Student Number"
                                        value={studentNumber}
                                        onChange={(e) => setStudentNumber(e.target.value)}
                                        required
                                    />
                                    {studentNumberFocus && studentNumber && !validStudentNumber &&
                                        <p
                                            className="student_number-error-message">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            Only 9 numbers are allowed <br/>
                                            must use your University Student Number <br/>


                                        </p>}
                                </div>

                            </div>

                            <div className="input-field-forth">
                                <div
                                    className={validNewPassword || !newPassword ? "input-field-first-name" : "err-input-field-first-name"}>

                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validEmail ? "false" : "true"}
                                        onFocus={() => setPasswordFocus(true)}
                                        onBlur={() => setPasswordFocus(false)}
                                        placeholder="Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    {passwordFocus && newPassword && !validNewPassword &&
                                        <p
                                            className="error-message">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            8 to 35 characters are allowed <br/>
                                            include at least One capital letter one small letter <br/>
                                            one number and one special character <br/>


                                        </p>}
                                    <button
                                        className="password-toggle-button"
                                        style={{border: 'none', background: 'none'}}
                                        onClick={(event) => togglePasswordVisibility(event)}
                                    >
                                        <FontAwesomeIcon className="icon" icon={showPassword ? faEyeSlash : faEye}/>
                                    </button>

                                </div>

                                <div
                                    className={validMatchPassword || !confirmPassword ? "input-field-last-name" : "err-input-field-last-name"}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        ref={userRef}
                                        autoComplete="off"
                                        aria-invalid={validEmail ? "false" : "true"}
                                        onFocus={() => setMatchPasswordFocus(true)}
                                        onBlur={() => setMatchPasswordFocus(false)}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {matchPasswordFocus && confirmPassword && !validMatchPassword &&
                                        <p
                                            className="error-message">
                                            <FontAwesomeIcon icon={faInfoCircle}/> <br/>
                                            Confirm Password is not the same <br/>
                                            please Fix it ...<br/>


                                        </p>}
                                    <button
                                        className="password-toggle-button"
                                        style={{border: 'none', background: 'none'}}

                                    >
                                        <FontAwesomeIcon onClick={(event) => toggleConfirmPasswordVisibility(event)}
                                                         className="icon"
                                                         icon={showConfirmPassword ? faEyeSlash : faEye}/>
                                    </button>

                                </div>
                            </div>
                        </div>
                        {validFirstName && validLastName && validEmail
                        && validNewPassword && validMatchPassword && validStudentNumber ?

                            <button type="submit" className="btn-signup">SIGN UP</button>
                            :
                            <button type="submit" disabled={true} className="not-valid-btn-signup">SIGN UP</button>

                        }
                        <p className="account-text">
                            Already have an account?{' '}
                            <a href="" id="sign-up-btn" onClick={handleBackToSignInClick}>
                                Back to Sign In
                            </a>
                        </p>
                    </form>

                </div>

                :
                /* if sighnup false ....*/
                <div className="login-container">
                    {errMsg && <p className="App-error-message">
                        <FontAwesomeIcon style={{fontSize: "35px"}} icon={faTimes}/> <br/>{errMsg}</p>}
                    <form className="login-form">
                        <div className="title">
                            <h2 className="title">Sign In</h2>
                        </div>
                        <div className="input-field">
                            <FontAwesomeIcon className="icon" icon={faUser}/>
                            <input
                                type="email"
                                placeholder="Email@st.uskudar.edu.tr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <FontAwesomeIcon className="icon" icon={faLock}/>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                className="password-toggle-button"
                                style={{border: 'none', background: 'none'}}
                                onClick={(event) => togglePasswordVisibility(event)} // Pass the event object
                            >
                                <FontAwesomeIcon className="icon" icon={showPassword ? faEyeSlash : faEye}/>
                            </button>

                        </div>
                        <div className="checkbox-field">
                            <div>
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me">Remember me</label>
                            </div>
                            <div>
                                <a className="forgot-password" href="#" onClick={() => setIsModalOpen(true)}>
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                        <button type="submit" className="btn" onClick={(event) => sendLoginRequest(event)}>Login</button>
                        <p className="account-text">
                            Don't have an account?{' '}
                            <a href="#" id="sign-up-btn" onClick={handleSignUpClick}>
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            }
            {isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>}
            {isModalOpenForSuccess && <ModalSuccessSignUp
                isOpen={isModalOpenForSuccess}
                onClose={() => {
                    handleBackToSignInClick();
                    setIsModalOpenForSuccess(false)
                }

                }/>}
            {isModalOpenForVerufy && <VerifyEmail email={email}
                                                  isOpen={isModalOpenForSuccess}
                                                  onClose={() => setIsModalOpenForVerufy(false)
                                                  }/>
            }


        </div>
    );
};

export default Login;
