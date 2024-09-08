import axios from "axios";
import {backend_url} from "../config/constant.ts";

export const getTreeData = async (treeId: string) => {
    try {
        const response = await axios.get(backend_url + "/tree/" + treeId, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error)
        // @ts-ignore
        if (error.response && error.response.status === 403) {
            window.location.href = "/403";
        } else { // @ts-ignore
            if (error.message === "Network Error") {
                        window.location.href = backend_url + "/oauth2/authorization/google";
                    }
        }
        throw error; // Rethrow the error to handle it in the caller
    }
};
