import {useEffect, useState} from 'react';
import Slider from 'react-slick';
import { Container } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate} from "react-router-dom";
import {ImageConversion} from "./ImageConversion.tsx";
import axios from "axios";
import {backend_url} from "../config/constant.ts";
// import '../styles/nav.css';

export function FeaturedTrees() {
    const [treeArray, setTreeData]   = useState<Tree[]>([]);
    const navigate = useNavigate();

    function checkForImage(image64, treeid) {
        switch (image64) {
            case "":
                return <ImageConversion treeId={treeid} />;
            default:
                return <img src={image64} alt={"No Image Found"} className="tree-picture"></img>
        }
    }
    const getiDs = async () => {
        const tree = await axios.get<{ treeId: string; treeName: string; image64: string }[]>(backend_url + "/user/trees/ft", { withCredentials: true });
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
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    return (
        <Container>
            <h2>Featured Trees</h2>
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
                            paddingTop: 10
                        }}>
                            <button className="button-view-trees" onClick={() => handleTreeClick(tree.treeId)}>{tree.treeName}</button>
                        </div>
                    </div>
                )))}
            </Slider>
        </Container>
    );
}
