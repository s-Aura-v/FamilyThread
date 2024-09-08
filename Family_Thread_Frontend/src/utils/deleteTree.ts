import FamilyTreeChart from "../components/FamilyTreeChart.tsx";
import axios from "axios";
import {backend_url} from "../config/constant.ts";


export const handleDeleteTree = (family: FamilyTreeChart) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000'; // Make sure it's on top of other content

    // Create dialog box
    const dialog = document.createElement('div');
    dialog.style.width = '300px';
    dialog.style.padding = '20px';
    dialog.style.backgroundColor = '#fff';
    dialog.style.borderRadius = '10px';
    dialog.style.textAlign = 'center';

    // Add text to dialog
    const message = document.createElement('p');
    message.textContent = `Are you sure you want to delete the tree? (${family.props.treeName})`;
    dialog.appendChild(message);

    // Create yes button
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.style.margin = '10px';
    yesButton.style.padding = '10px 20px';
    yesButton.style.borderRadius = "20px";
    yesButton.onclick = () => {
        window.location="/viewtrees";
        deleteTreeFromDB(family);
    }


    // Create no button
    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.style.margin = '10px';
    noButton.style.padding = '10px 20px';
    noButton.style.borderRadius = "20px";
    noButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    // Append buttons to dialog
    dialog.appendChild(yesButton);
    dialog.appendChild(noButton);

    // Append dialog to overlay
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

const deleteTreeFromDB = async (family: FamilyTreeChart) => {

    const response = await axios.post(
        backend_url + "/tree/" + family.props.treeId + "/delete-tree",
        {},
        {withCredentials: true}
        )

    console.log(response.data);
}
