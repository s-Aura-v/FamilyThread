import "../styles/sectionsInViewTrees.css"
import axios from "axios";
import {backend_url} from "../config/constant.ts";
import {useEffect, useState,} from "react";
import {useNavigate} from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import {Col, Container, Row} from "react-bootstrap";
import {ImageConversion} from "./ImageConversion.tsx";


interface Tree {
    treeId: string;
    treeName: string;
    image64: string;
}

export function SharedTrees() {
    const [treeArray, setTreeData] = useState<Tree[]>([]);
    const navigate = useNavigate();

    function checkForImage(image64, treeid) {
        switch (image64) {
            case "":
                return <ImageConversion treeId={treeid}/>;
            default:
                return <img src={image64} alt={"No Image Found"} className="tree-picture"></img>
        }
    }

    const getiDs = async () => {
        const tree = await axios.get<{
            treeId: string;
            treeName: string;
            image64: string
        }[]>(backend_url + "/user/trees/shared", {withCredentials: true});
        const treeData = tree.data;
        setTreeData(treeData);
        console.log(treeData);

    }

    useEffect(() => {
        getiDs();
    }, []);

    const handleTreeClick = (treeId: string) => {
        navigate(`/displayTrees/${treeId}`);
    };


    const settings = {
        dot: true,
        speed: 500,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,

    };

    if (treeArray.length >= 5) {
        return (
            <>
                <Container>
                    <h2 style={{marginTop: 90, marginBottom: 20}}>
                        Shared Trees
                    </h2>
                    <div>
                        <Slider {...settings}>
                            {treeArray.map((tree => (
                                <div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <div className="tree-container">
                                            {checkForImage(tree.image64, tree.treeId)}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingTop: 10,
                                    }}>
                                        <button className="button-view-trees"
                                                onClick={() => handleTreeClick(tree.treeId)}>{tree.treeName}</button>
                                    </div>
                                </div>
                            )))}
                        </Slider>
                    </div>
                </Container>
            </>
        );
    }
    if ((treeArray.length >= 1) && (treeArray.length <= 4)) {
        return (
            <Container>
                <h2 style={{marginTop: 90, marginBottom: 20}}>
                    Shared Trees
                </h2>
                <div>
                    <div>
                        <Row>
                            {treeArray.map((tree => (
                                <Col>
                                    <div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            {checkForImage(tree.image64, tree.treeId)}
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingTop: 10
                                        }}>
                                            <button className="button-view-trees"
                                                    onClick={() => handleTreeClick(tree.treeId)}>{tree.treeName}</button>
                                        </div>
                                    </div>
                                </Col>
                            )))}
                        </Row>
                    </div>
                </div>
            </Container>
        );
    }
    if (treeArray.length < 1) {
        return (
            <Container>
                <h2 style={{marginTop: 90, marginBottom: 20}}>
                    Shared Trees
                </h2>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 10
                }}>
                    <h1 style={{paddingBottom: 100}}> It's looking a bit empty :( </h1>
                </div>
            </Container>
        );
    }
}
