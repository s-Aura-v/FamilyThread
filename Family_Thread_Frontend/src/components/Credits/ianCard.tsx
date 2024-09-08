import ReactCardFlip from "react-card-flip";
import "../../styles/flipcards.css"
import {useState} from "react";
import githubLogo from "../../assets/cardIcons/github-142-svgrepo-com.svg";
import linkedInLogo from "../../assets/cardIcons/linked-in-logo-of-two-letters-svgrepo-com.svg";
import image from "../../assets/cardImages/ianImage.jpg";

export function IanCard(){

    const [isFlipped, setIsFlipped] = useState(false)

    function flipCard(){
        setIsFlipped(!isFlipped);
    }


    return(

        <ReactCardFlip flipDirection={"horizontal"} isFlipped={isFlipped}>
            <div style={{paddingTop: 10, paddingBottom: 10}}>

                {/*FRONT OF THE CARD*/}
                <div className={"card-front"}>
                    {/*<img src={crisImage} alt="picture"></img>*/}
                    <div className={"image-container"}>
                        <div className="image">
                            <img src={image} alt="Ian's picture" className="img"></img>
                        </div>
                    </div>
                    <h1 className={"memberName"}>
                        Ian Venton
                    </h1>
                    <h2 className={"email"}>
                        iventon@oswego.edu
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
                        <p className={"summary-text"}>Computer Science BA.</p>

                        <p className={"summary-text"}>Network Administration AS.</p>

                        <div className={"socialLogosContainer"} style={{marginTop: 10}}>
                            <img src={githubLogo} alt={"GitHub Logo"} className={"github-logos"}></img>
                            <h1 className={"socialName"}>
                                <a className={"link"} href={"https://github.com/IanVenton"}>
                                    IanVenton
                                </a>
                            </h1>
                        </div>
                        <div className={"socialLogosContainer"}>
                            <img src={linkedInLogo} alt={"LinkedIn Logo"} className={"linkedin-logos"}></img>
                            <h1 className={"socialName"} style={{marginTop: 24}}>
                                <a className={"link"} href={"https://www.linkedin.com/in/ian-venton-189273306/"}>
                                    Ian Venton
                                </a>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

        </ReactCardFlip>


    );
}