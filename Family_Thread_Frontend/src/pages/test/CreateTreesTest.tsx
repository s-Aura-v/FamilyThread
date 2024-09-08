import {NavigationBar} from "../../components/NavigationBar.tsx";
import axios from "axios";
import {useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Empty from "../../data/UploadTree.json";
import previewFile from "../../data/previewFile.json";
import {backend_url} from "../../config/constant.ts";

export function CreateTreeTest() {
    const [treeName, setTreeName] = useState("");

    const createNewTree = async () => {
        const response = await axios.post(backend_url + "/tree/new", {
            "treeName": treeName
        },{ withCredentials: true })
        const data = response.data;
        console.log(data);
        return data
    }

    return (
        <>
            <style>
                {document.body.style.backgroundColor = '#6EA07F'};
            </style>
            <NavigationBar/>
            <h2>Create a tree</h2>
            <form onSubmit={() => {
                createNewTree().then(r => console.log("data here" + r))
            }}>
                <label>
                    <input
                        type="text"
                        name="name"
                        placeholder="TreeName"
                        value={treeName}
                        onChange={(e) => setTreeName(e.target.value)}
                    />
                </label>
                <input type="submit" value="Submit"/>

            </form>

            <div className="">
                <Container>
                    <h1>Blank Tree/Import Files</h1>
                    <Row className="g-0">
                        {Empty.map(item => (
                                <Col key={item.name}>
                                    <BlankImport {...item} />
                                </Col>
                            )
                        )}
                    </Row>
                </Container>
                <Container>
                    <h1>Template</h1>
                    <Row className="g-0">
                        {previewFile.map(item => (
                                <Col key={item.name}>
                                    <BlankImport {...item} />
                                </Col>
                            )
                        )}
                    </Row>
                </Container>
                <Container>
                    <Row className="g-0">
                        {previewFile.map(item => (
                                <Col key={item.name}>
                                    <BlankImport {...item} />
                                </Col>
                            )
                        )}
                    </Row>
                </Container>
            </div>
        </>
    );
}
