import {backend_url} from "../config/constant.ts";

export const checkUserLogInStatus = async () => {
    try {
        const response = await fetch(
            backend_url + "/verify",
            {method: "GET", credentials: "include"}
        );


        const data = await response.json();
        if(data.authorizedClientRegistrationId) {
            return true;
        }

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
    return false;
};