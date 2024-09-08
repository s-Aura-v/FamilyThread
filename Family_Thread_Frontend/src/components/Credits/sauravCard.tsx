import ReactCardFlip from "react-card-flip";
import "../../styles/flipcards.css"
import {useState} from "react";
import image from "../../assets/cardImages/sauravImage.jpg";
import githubLogo from "../../assets/cardIcons/github-142-svgrepo-com.svg";
import linkedInLogo from "../../assets/cardIcons/linked-in-logo-of-two-letters-svgrepo-com.svg";


export function SauravCard() {

    const [isFlipped, setIsFlipped] = useState(false)



    function flipCard(){
        setIsFlipped(!isFlipped);
    }



    return(
        <ReactCardFlip flipDirection={"horizontal"} isFlipped={isFlipped}>
            <div style={{paddingTop: 10, paddingBottom: 10}}>

                {/*FRONT OF THE CARD*/}
                <div className={"card-front"}>
                    <div className={"image-container"}>
                        <div className="image">
                            <img src={image} alt="Soney's picture" className="img" ></img>
                        </div>
                    </div>
                    <h1 className={"memberName"} >
                        Saurav Lamichhane
                    </h1>
                    <h2 className={"email"}>
                        slamich2@oswego.edu
                    </h2>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <button className={"button"} onClick={flipCard}>LEARN MORE</button>
                    </div>

                </div>

            </div>

            <div style={{paddingTop: 10, paddingBottom: 10}}>
                {/*BACK OF THE CARD*/}
                <div className={"card-back"} onClick={flipCard}>
                    <h1 className={"summary-title"}>
                        Summary
                    </h1>
                    <div className={"summary-text"}>
                        <p className={"summary-text"}>Computer Science BS.</p>

                        <p className={"summary-text"}>Graphic Design Minor.</p>

                        <p className={"summary-text"}>Java Enthusiast (both types).</p>
                        <div className={"socialLogosContainer"} style={{marginTop:10}}>
                            <img src={githubLogo} alt={"GitHub Logo"} className={"github-logos"}></img>
                            <h1 className={"socialName"}>
                                <a className={"link"} href={'https://github.com/s-Aura-v'}>
                                    Saurav L
                                </a>
                            </h1>
                        </div>
                        <div className={"socialLogosContainer"}>
                            <img src={linkedInLogo} alt={"LinkedIn Logo"} className={"linkedin-logos"}></img>
                            <h1 className={"socialName"} style={{marginTop: 24}}>
                                <a className={"link"} href={"https://www.linkedin.com/in/s-Aura-v/"}>
                                    Saurav Lamichhane
                                </a>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

        </ReactCardFlip>
    );
}