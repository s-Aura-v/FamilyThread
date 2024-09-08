import "../../styles/flipcards.css"
import {Container} from "react-bootstrap";
import {CrisCard} from "./crisCard.tsx";
import Slider from "react-slick";
import {SauravCard} from "./sauravCard.tsx";
import {SoneyCard} from "./soneyCard.tsx";
import {LuisCard} from "./luisCard.tsx";
import {KerrieCard} from "./kerrieCard.tsx";
import {IanCard} from "./ianCard.tsx";


export function CardFlip() {


    const settings = {
        dot: true,
        speed: 500,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        adaptiveHeight: true,
    };


    return (
        <Container>
            <div>
                <div>
                    <Slider {...settings}>
                            <SoneyCard/>
                            <SauravCard/>
                            <CrisCard/>
                            <LuisCard/>
                            <KerrieCard/>
                            <IanCard/>
                    </Slider>
                </div>
            </div>
        </Container>
    );
}