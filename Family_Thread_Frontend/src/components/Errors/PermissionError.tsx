import {useNavigate} from "react-router-dom";

export function PermissionError() {
    let navigate = useNavigate();
    const routeChange = () =>{
        let path = `/viewtrees`;
        navigate(path);
    }
    return (
        <>
            <h1>You have inadequate permission!</h1>
            <h2>Contact the tree owner for permission!</h2>
            <ul>
                <h2>In the meantime, you can view your own trees: <button className="bg-transparent border-0 text-decoration-underline" onClick={routeChange}> View Trees </button></h2>
            </ul>
        </>
    )
}
