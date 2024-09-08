import {NavigationBar} from "../components/NavigationBar.tsx";
import FamilyTreeChart from "../components/FamilyTreeChart.tsx";
import {SetStateAction, useEffect, useState} from "react";
import {getTreeData} from "../utils/getTree.ts";
import {useLocation} from "react-router-dom";
import "../styles/displayTrees.css";
import {SharePopUpBox} from "../components/SharingPermissions/SharePopUpBox.tsx";

export function DisplayTrees() {
    const [treeName, setTreeName] = useState<String>();
    const [nodes, setNodes] = useState()
    const [isOwner, setIsOwner] = useState<Boolean>(false);
    const [permissions, setPermissions] = useState({
        canEdit: false,
        canView: false,
        canDelete: false
    });
    const location = useLocation();
    const treeId = location.pathname.split("displayTrees/")[1];

    useEffect(() => {
        getTreeData(treeId).then(r => {
            setPermissions({
                canEdit: r.owner || r.editor,
                canView: r.viewer,
                canDelete: r.owner,
            })
            console.log(r)
            setIsOwner(r.owner);
            const jsonData = r.jsonData;
            const nodes = jsonData.map((jsonString: string) => JSON.parse(jsonString));
            setNodes(nodes);
            setTreeName(r.treeName);
        })
    }, []);


    return (

        <>
            <NavigationBar/>

            <div style={{height: "100vh"}}>
                {isOwner ? <SharePopUpBox treeId={treeId}/> : null}
                {nodes ?
                    <FamilyTreeChart nodes={nodes} permissions={permissions} treeId={treeId} treeName={treeName}/> :
                    <h1>Loading ...</h1>}
            </div>

        </>
    );
}
