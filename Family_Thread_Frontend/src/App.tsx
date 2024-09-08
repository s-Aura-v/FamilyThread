import {Routes, Route} from "react-router-dom"
import {ViewTrees} from "./pages/ViewTrees.tsx";
import {CreateTrees} from "./pages/CreateTrees.tsx";
import {Backend_MyAccount} from "./pages/Backend_MyAccount.tsx";
import {DisplayTrees} from "./pages/DisplayTrees.tsx";
import {MyAccount} from "./pages/MyAccount.tsx";
import {ErrorPage} from "./pages/ErrorPage.tsx";
import {AboutUs} from "./pages/AboutUs.tsx";
import {Login} from "./pages/Login.tsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/aboutus" element={<AboutUs />}/>
                <Route path="/viewtrees" element={<ViewTrees />}/>
                <Route path="/myaccount" element={<MyAccount />}/>
                <Route path="/displaytrees" element={<DisplayTrees/>}/>
                <Route path="/createtrees" element={<CreateTrees/>}/>
                <Route path="/displaytrees/:treeId" element={<DisplayTrees/>}/>
                <Route path="/403" element={<ErrorPage />}/>
                <Route path="*" element={<ErrorPage />}/>
                <Route path="/error" element={<ErrorPage />} />

            {/* Testing Routes*/}
                <Route path="/myaccounttest" element={<Backend_MyAccount />}/>
            </Routes>
        </>
    );
}

export default App;
