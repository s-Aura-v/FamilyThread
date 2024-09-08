import { useEffect } from 'react';
import { EditPersonPopup } from "../../components/EditPersonPopup.tsx";
import { NavigationBar } from "../../components/NavigationBar.tsx";
import { Family } from './Familytree.tsx';

export function TestingGrounds() {
    useEffect(() => {
        const familyTreeContainer = document.getElementById('tree');
        if (familyTreeContainer) {
            Family(familyTreeContainer);
        } else {
            console.error("Element with ID 'tree' not found.");
        }
    }, []);

    return (
        <>
            <NavigationBar />
            <EditPersonPopup />
            <div id="tree"></div>
        </>
    );
}