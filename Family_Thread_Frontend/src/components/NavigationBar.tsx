import "../styles/nav.css";
import logo from "../assets/navLogo.png"
import {backend_url} from "../config/constant.ts";
import {checkUserLogInStatus} from "../utils/checkUserLoginStatus.ts";
import {useEffect, useState} from "react";
import {SearchPopup} from "./SearchPopup.tsx";
import {ProfileInfo} from "./navigationBar/ProfileInfo.tsx";

export function NavigationBar() {
    const [loggedIn, setLoggedIn] = useState(false);
    // const [openSearch, setSearchFunction] = useState(false);

    const checkLoginStatus = async () => {
        try {
            return await checkUserLogInStatus();
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    };

    useEffect(() => {
        // @ts-ignore
        checkLoginStatus().then(r => setLoggedIn(r))
    }, []);


    return (
        <>
            <nav className="nav">
                <a className="nav-logo" href="/viewtrees" style={{paddingLeft:20}}>
                    <img src={logo} alt="Family Thread Logo"></img>
                </a>
                <ul style={{paddingLeft: 80}}>
                    <li><a href="/myaccount">My Account</a></li>
                    <li><a href="/viewtrees">View Trees</a></li>
                    <li><a href="/aboutus">About Us</a></li>
                </ul>
                <div className="search-container">
                    <SearchPopup/>
                </div>
                <ProfileInfo/>
                {loggedIn ?
                    <a href={backend_url + "/logout"}>Logout</a> : <a href={backend_url + "/"}>Login</a>}
            </nav>
        </>
    )
        ;
}
