import FamilyTree from "@balkangraph/familytree.js";
// import data from "../data/treeCreation.json"
// import css from './teststyles/personCreation.css'

export function Family(container: HTMLElement) {

    // Templates: https://balkan.app/FamilyTreeJS/Docs/CSSCustomization
    FamilyTree.templates.tommy_female.field_0 =
        '<text width="600px" style="font-size: 28px;" fill="#ffffff" x="125" y="95" text-anchor="middle" class="field_0">{val}</text>';

    var family = new FamilyTree(container, {
        mouseScrool: FamilyTree.action.ctrlZoom,
        template: 'tommy',
        searchDisplayField: 'name',
        searchFieldsWeight: {
            "name": 100, //percent
            "friends": 20 //percent
        },
        nodeBinding: {

            field_0: 'Name',
            field_1: 'Date of Birth',
            field_2: 'Place of Birth',
            field_3: 'Date of Death',
            field_4: 'Parent 1',
            field_5: 'Parent 2'

        },
        menu: {
            pdf: { text: "Export PDF" },
            json: { text: "Export JSON" }
        },
        mode: "light",
        nodeTreeMenu: true
    });

    family.onInit(() => {
    });

    family.load([

    ]);
}