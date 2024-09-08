import axios from "axios";
import {backend_url} from "../config/constant.ts";

export const sendNewNodes = async (newNodes: object[], treeId: string) => {

    if (newNodes.length === 0) {
        return;
    }
    try {
        const response = await axios.post(backend_url + "/" + treeId  + "/add-nodes", {newNodes} , { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
    } finally {
        console.log("new done");
    }
};

export const updateNode = async (newNodes: object[], treeId: string) => {

    if (newNodes.length === 0) {
        return;
    }
    try {
        const response = await axios.post(backend_url + "/" + treeId + "/update-nodes", {newNodes}, {withCredentials: true});
        return response.data;
    } catch (error) {
        console.log(error);
    } finally {
        console.log("update Done")
    }

}

export const removeNode = async (nodeId: string | number, treeId:string)=> {
    if (nodeId === null) {
        return;
    }

    try {
        const response = await axios.post(backend_url + "/" + treeId + "/remove-nodes", {nodeId}, {withCredentials: true});
        return response.data;
    } catch (error) {
        console.log(error);
    } finally {
        console.log("remove done")
    }

}
