import { useEffect, useState } from "react";
import { NavigationBar } from "../components/NavigationBar.tsx";
import { backend_url } from "../config/constant.ts";
import temppfp from "../assets/placeholderpfp.png";


export function Backend_MyAccount() {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    const getName = async () => {
        try {
            const response = await fetch(
                backend_url + "/user",
                { method: "GET", redirect: "follow", credentials: "include" }
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
            setLoading(false);
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
            <div>


                <h1>MyAccount</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : name ? (
                    <>

                        <p>Name: {name}</p>
                        <p>Email: {email}</p>
                    </>
                ) : (
                    <p>Name doesn't exist</p>
                )}
            </div>

            <h1 className="accheader">MyAccount</h1>

            <div className="accContainer">
                <div className="userinfo">
                    <div><img src={temppfp} alt="temppfp" className="portrait"/></div>
                </div>
                <div className="adjust">
                    <div className="infoboxes">
                        <div className="infoboxestxt">Name</div>
                    </div>
                    <div className="infoboxes">
                        <div className="infoboxestxt">Username</div>
                        [User's Username]
                    </div>
                    <div className="infoboxes">
                        <div className="infoboxestxt">Email</div>
                        [User's Email]
                    </div>
                </div>
                <div className="options">
                    <div className="header-options">Options</div>
                    <div className="optionstxt">
                    </div>
                    <div className="optionstxt">
                    </div>
                </div>
            </div>


        </>
    );
}
