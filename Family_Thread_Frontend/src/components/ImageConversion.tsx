import {useState} from "react";
import axios from "axios";
import {backend_url} from "../config/constant.ts";

export function ImageConversion(treeID) {
    const [image, setImage] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileRead = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                setUploadStatus("Failed to read the file.");
            };
        }
    };

    const handleSubmit = async () => {
        if (!image) {
            setUploadStatus("Please select an image to upload.");
            return;
        }
        console.log(treeID);
        try {
            console.log(image);
            const response = await axios.post(`${backend_url}/tree/${treeID.treeId}/add-img`, {
                image64: image
            }, {withCredentials: true});
            setUploadStatus("Image uploaded successfully: " + response.data);
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploadStatus("Failed to upload image.");
        }
    };

    return (
        <div className="bg-white align-content-center justify-content-center tree-picture" style={{width: 300, height:290}}>
            <div className="align-content-center justify-content-center text-center">
                <p>{uploadStatus || "No Image Loaded"}</p>
                <input
                    accept="image/*"
                    type="file"
                    onChange={handleFileRead}
                    className="w-75"
                />
                <br />
                <button onClick={handleSubmit}>Upload Image</button>
            </div>
        </div>
    );
}
