import {useNavigate} from "react-router-dom";
import "../../styles/error.css"
export function LoginError() {
    let navigate = useNavigate();
    const routeChange = () =>{
        let path = `/`;
        navigate(path);
    }

    return (
        <>
            <h1>You are not logged in!</h1>
            <h2 onClick={routeChange} className="text-decoration-underline login-link " style = {{color: "black"}}>Please head to the login screen.</h2>
        </>
    )
}
