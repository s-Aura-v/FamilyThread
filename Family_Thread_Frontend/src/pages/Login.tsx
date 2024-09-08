import {OAuthLogin} from "../components/logInButton.tsx";
import '../styles/login.css'
import image from "../assets/loginLogo.svg";
import {CardFlip} from "../components/Credits/cardFlip.tsx";
import {useEffect, useState} from "react";
import {checkUserLogInStatus} from "../utils/checkUserLoginStatus.ts";

export function Login() {
    const [logInStatus, setLogInStatus] = useState(false);


    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const isLoggedIn = await checkUserLogInStatus();
                setLogInStatus(isLoggedIn);
                // if (logInStatus) {
                //     navigate("/viewtrees")
                // }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };
        checkLoginStatus();
    })

    return (
        <>
            <div className="top">
                <OAuthLogin/>
                <img src={image} alt="Family Thread logo" id="login-logo"></img>
                <h1 className="name">Family Thread</h1>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 0, paddingBottom: 20}}>
                    {logInStatus ?
                        <p></p>
                        :
                        <OAuthLogin />

                    }

                </div>
            </div>

            <div className="mission">
                <div className="text">
                    <h2 className="text-lg-start" style={{fontSize: 60, marginLeft:10}}>Our Mission</h2>
                    <blockquote>
                        <p>
                            The Family Thread is a system software that family members can use to create a family tree.
                            Unlike other family tree products, ours allows users to add custom portraits, and work with other
                            collaborators to create a more accurate representation while being user-friendly and
                            visually appealing.
                        </p>
                    </blockquote>
                </div>
            </div>

            <div className="vision">
                <div className="text">
                    <h2 className="text-lg-end" style={{fontSize: 60, marginRight:10}}>Our Vision</h2>

                    <blockquote>
                        <p className={"vision-blockquote"}>
                            For genealogists or adults who might be interested in their lineage or their family’s represented as a visualization. The Family Thread is an interactive family tree that allows family members to create a family tree, add custom portraits, and work with other collaborators to create a more accurate representation while being user-friendly and visually appealing. Unlike Family Echo, our product provides more creative flexibility and allows the family tree to be pleasing to the eye.
                        </p>
                    </blockquote>
                </div>
            </div>

            <div className="team">
                <div className="text">
                    <h2 className="text-lg-start" style={{fontSize: 60, marginLeft: 20}}>The Family Thread Team</h2>
                    <div style={{paddingTop: 20, paddingBottom:20}}>
                        <CardFlip/>
                    </div>
                </div>
            </div>
        </>
    );
}
