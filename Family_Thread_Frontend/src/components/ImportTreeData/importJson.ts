import FamilyTreeChart from "../FamilyTreeChart.tsx";
import axios from "axios";
import {backend_url} from "../../config/constant.ts";

export const handleButtonClick = (family: FamilyTreeChart) => {
    // Create a file input dynamically
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none'; // Hide the file input

    fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files ? (event.target as HTMLInputElement).files![0] : null;

        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    // Parse JSON data
                    const json: string[] = JSON.parse(e.target?.result as string);
                    console.log(json);

                    sendImportData(json, family).then(r => {
                        console.log(r);
                        window.location.reload();
                    }).catch(e => {
                        console.log(e)
                    })

                } catch (error) {
                    alert("Error parsing JSON: " + error);
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid JSON file.');
        }
    };

    // Simulate a click on the file input
    fileInput.click();
};

const sendImportData = async (jsonData:string[], family: FamilyTreeChart) => {

    console.log(jsonData)
    const response = await axios.post(
        backend_url + "/" + family.props.treeId + "/import-nodes",
        jsonData,
        {withCredentials:true}
    )

    return response.data;


}
