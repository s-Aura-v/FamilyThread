import "../../styles/EditTreeTree.css"
import image from "../../assets/treePreview.png";

export function EditTreeShowTree() {
    return (
        <>
            <a className="treePreview" href="../EditTree"> <img src={image} alt="Preview of tree"></img> </a>

        </>
    );
}