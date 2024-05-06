import React, {useState} from 'react';
import {useLocalState} from "../util/useLocalState";
import {Navigate, useNavigate} from "react-router-dom";
import ajax from "../api/fetchServise";
import Loading from "../Component/loading/Loading";

const PrivateRoute = ({children}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [isLoading , setIsLoading]=useState(true);
    const [isValid , setIsValid]=useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    if(jwt) {
        ajax(`/api/auth/validate?token=${jwt}`, "GET",jwt).then( (isValid)=>{
            setIsValid(isValid);
            setIsLoading(false);

        })
    }else {
        return <Navigate to="/login"/>;
    }

    return isLoading?(
        <Loading/>)
        : ( isValid===true ? (children)
        : (<Navigate to="/login"/>) );
};

export default PrivateRoute;