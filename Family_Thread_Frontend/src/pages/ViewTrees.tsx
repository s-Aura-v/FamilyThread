import {NavigationBar} from "../components/NavigationBar.tsx";
import {MyTreesViewTrees} from "../components/MyTrees2.tsx";
import {FeaturedTrees} from "../components/FeaturedTrees.tsx";
import {Separator} from "../components/separator.tsx";
import "../styles/sectionsInViewTrees.css"
import {SharedTrees} from "../components/SharedTrees.tsx";
import {CreateTrees} from "./CreateTrees.tsx";

export function ViewTrees() {
    return (
        <>

            <style>
                {document.body.style.backgroundColor = '#F0E7D8'};
            </style>

            <NavigationBar />
            <div>
                <CreateTrees/>
                <Separator/>
                <MyTreesViewTrees/>
                <Separator/>
                <SharedTrees />
                {/*Deprecated */}
                {/*<Separator/>*/}
                {/*<FeaturedTrees/>*/}
            </div>
        </>
    );
}
