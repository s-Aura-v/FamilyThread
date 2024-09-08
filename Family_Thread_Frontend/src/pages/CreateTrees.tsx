import axios from "axios";
import {backend_url} from "../config/constant.ts";
import {FormEvent, useEffect, useState} from "react";
import "../styles/createTrees.css";
import {useNavigate} from "react-router-dom";
import {checkUserLogInStatus} from "../utils/checkUserLoginStatus.ts";
import {Container} from "react-bootstrap";

export function CreateTrees() {
    const [treeName, setTreeName] = useState("");
    const navigate = useNavigate();

    const createNewTree = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (treeName === "") {
            alert("please enter a name");
        } else if (treeName.length >= 40) {
            alert("please enter a name that is no more than 20 characters (spaces included)");
            setTreeName("");
        } else {
            const response = await axios.post(backend_url + "/tree/new", {
                "treeName": treeName
            }, {withCredentials: true})
            const data = response.data;

            navigate("/displayTrees/" + data.redirect);
        }
    }

    useEffect(() => {
        checkUserLogInStatus().then(isLoggedIn => {
            if (!isLoggedIn) {
                navigate("/error")
            }
        })

    }, []);

    return (
        <>
            <Container>
                    <h2 className="title" style={{paddingTop: 100}}>Create a tree</h2>
                    <div className="external">
                        <div className="rect-container justify-content-center align-content-center">
                            <h5 style={{
                                marginTop: 30,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontFamily: "gill-sans",
                                fontSize: 20,
                            }}>
                                Choose a tree name:
                            </h5>
                            <div>
                                <form onSubmit={(event) => {
                                    createNewTree(event)
                                }}>
                                    <label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="TreeName"
                                            value={treeName}
                                            onChange={(e) => setTreeName(e.target.value)}
                                            style={{
                                                borderRadius:10,
                                                height:40,
                                                paddingLeft: 10
                                                }}
                                        />
                                    </label>
                                    <input type="submit" value="Submit" className="button-view-trees" style={{marginLeft: 20}}/>
                                </form>
                            </div>
                        </div>

                    </div>
            </Container>
        </>
    );
}
