import {useEffect, useState} from "react";
import {NavigationBar} from "../components/NavigationBar.tsx";
import {backend_url} from "../config/constant.ts";
import temppfp from "../assets/placeholderpfp.png";
import image from "../assets/logo.png";
import '../styles/myaccount.css';


export function MyAccount() {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    const getName = async () => {
        try {
            const response = await fetch(
                backend_url + "/user",
                {method: "GET", redirect: "follow", credentials: "include"}
            );
            if (response.redirected) {
                document.location = response.url;
                return; // Return early if redirected
            }
            console.log(response)

            const data = await response.json();
            console.log(data)
            setName(data.user_details.name);
            setEmail(data.user_details.emailAddress);
            setProfilePicture(data.user_details.profilePicture);
        } catch (error) {
            console.error("Error fetching user data:", error);
            document.location = backend_url + "/oauth2/authorization/google";
        }
    };

    useEffect(() => {
        getName();
    }, []);

    return (
        <>
            <NavigationBar/>
            <style>
                {document.body.style.backgroundColor = '#F0E7D8'};
            </style>
            <h1 className="accheader">MyAccount</h1>

            <div className="accContainer">
                <div className="userinfo">
                    <div><img src={profilePicture} alt="temppfp" className="portrait"/></div>
                </div>
                <div className="adjust">
                    <div className="newinfobox1">
                        <div className="infoboxestxt">Name</div>
                        {name}
                    </div>
                    <div className="newinfobox2">
                        <div className="infoboxestxt">Email</div>
                        {email}
                    </div>
                </div>
                <img src={image} alt="Family Thread logo" className="alignimg"></img>
                </div>


        </>
    );
}
