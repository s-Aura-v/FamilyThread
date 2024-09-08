import {NavigationBar} from "../components/NavigationBar";
import {LoginError} from '../components/Errors/LoginError.tsx';
import {PermissionError} from '../components/Errors/PermissionError';
import {useLocation} from "react-router-dom";
import {Suspense} from "react";
import logo from "../assets/csc380Logo_Logo-31.svg"
import "../styles/error.css"

export function ErrorPage() {
    const location = useLocation();
    const errorType = location.pathname.split("/")[1];

    function displayError() {
        switch (errorType) {
            case "error":
                return <LoginError/>;
            case "403":
                return <PermissionError/>;
            case "404":
                return <div>Page Not Found</div>;
            default:
                return <div>Unknown Error</div>;
        }
    }

    return (
        <>
            <NavigationBar/>
            <style>
                {document.body.style.backgroundColor = '#F0E7D8'};
            </style>
            <div className="error-body">
                <div className="left-error">
                    <h1 className="oops"> Oops! </h1>
                    You seem to have ran into an error.
                    <Suspense fallback={<div>Loading...</div>}>
                        {displayError()}
                    </Suspense>
                </div>
                <div className="right-error">
                    <img src={logo} alt="Family Thread Tree" className="error-img"/>
                </div>
            </div>
        </>
    );
}
