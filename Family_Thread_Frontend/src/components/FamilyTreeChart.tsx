import React, {Component, RefObject} from "react";
import FamilyTree from "@balkangraph/familytree.js";
import {removeNode, sendNewNodes, updateNode} from "../utils/nodeOperations.ts";
import {handleButtonClick} from "./ImportTreeData/importJson.ts";
import {handleDeleteTree} from "../utils/deleteTree.ts";


interface ChartProps {
    nodes: any[];
    permissions: {
        canEdit: boolean;
        canView: boolean;
        canDelete: boolean;
    }
    treeId: string;
    treeName: string;
}


export default class FamilyTreeChart extends Component<ChartProps> {

    private readonly divRef: RefObject<HTMLDivElement>;
    private family: FamilyTree | undefined;

    constructor(props: ChartProps) {
        super(props);
        this.divRef = React.createRef();
    }


    shouldComponentUpdate() {
        return false;
    }


    // shouldComponentUpdate() {
    //     if (prevProps.data !== this.props.data) {
    //         // Assuming `this.family` has a method to update its data
    //         this.family.load(this.props.data);
    //     }
    // }

    componentDidMount() {
        if (this.divRef.current) {
            FamilyTree.templates.sriniz = Object.assign({}, FamilyTree.templates.base);

            FamilyTree.templates.sriniz.size = [225, 90];
            FamilyTree.templates.sriniz.node =
                '<rect x="0" y="0" height="90" width="225" stroke-width="1" rx="15" ry="15"></rect>';


            FamilyTree.templates.sriniz.defs = `
<g transform="matrix(0.05,0,0,0.05,-13 ,-12)" id="heart">
    <path d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z" style="fill:#fff;stroke:red;stroke-miterlimit:10;stroke-width:24px" fill="red"></path><path d="M256,360a16,16,0,0,1-9-2.78c-39.3-26.68-56.32-45-65.7-56.41-20-24.37-29.58-49.4-29.3-76.5.31-31.06,25.22-56.33,55.53-56.33,20.4,0,35,10.63,44.1,20.41a6,6,0,0,0,8.72,0c9.11-9.78,23.7-20.41,44.1-20.41,30.31,0,55.22,25.27,55.53,56.33.28,27.1-9.31,52.13-29.3,76.5-9.38,11.44-26.4,29.73-65.7,56.41A16,16,0,0,1,256,360Z" fill="red"></path>
  </g>
  <g id="sriniz_male_up">
    <circle cx="15" cy="15" r="10" fill="#fff" stroke="#fff" stroke-width="1"></circle>
    ${FamilyTree.icon.ft(15, 15, '#039BE5', 7.5, 7.5)}
  </g>

  <g id="sriniz_female_up">
    <circle cx="15" cy="15" r="10" fill="#fff" stroke="#fff" stroke-width="1"></circle>
    ${FamilyTree.icon.ft(15, 15, '#FF46A3', 7.5, 7.5)}
  </g>`;


            // Male
            FamilyTree.templates.sriniz_male = Object.assign({},
                FamilyTree.templates.sriniz
            );
            FamilyTree.templates.sriniz_male.node =
                '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="#039BE5" stroke="#aeaeae" rx="15" ry="15"></rect>';

            FamilyTree.templates.sriniz_male.field_0 =
                '<text style="font-size: 16px; font-weight: bold;" fill="#ffffff" x="100" y="30">{val}</text>';
            FamilyTree.templates.sriniz_male.field_1 =
                '<text style="font-size: 12px; font-weight: bold;" fill="#ffffff" x="100" y="50">{val}</text>';

            // Female
            FamilyTree.templates.sriniz_female = Object.assign({},
                FamilyTree.templates.sriniz
            );
            FamilyTree.templates.sriniz_female.node =
                '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="#FF46A3" stroke="#aeaeae" rx="15" ry="15"></rect>';

            FamilyTree.templates.sriniz_female.field_0 =
                '<text style="font-size: 16px; font-weight: bold;" fill="#ffffff" x="100" y="30">{val}</text>';
            FamilyTree.templates.sriniz_female.field_1 =
                '<text style="font-size: 12px; font-weight: bold;" fill="#ffffff" x="100" y="50">{val}</text>';

            const expandIconMale =
                '<circle cx="97" cy="-16" r="10" fill="#039BE5" stroke="#fff" stroke-width="1"><title>Expand</title></circle>' +
                '<line x1="90" y1="-16" x2="104" y2="-16" stroke-width="1" stroke="#fff"></line>' +
                '<line x1="97" y1="-23" x2="97" y2="-9" stroke-width="1" stroke="#fff"></line>';

            const expandIconFemale =
                '<circle cx="97" cy="-16" r="10" fill="#FF46A3" stroke="#fff" stroke-width="1"></circle>' +
                '<line x1="90" y1="-16" x2="104" y2="-16" stroke-width="1" stroke="#fff"></line>' +
                '<line x1="97" y1="-23" x2="97" y2="-9" stroke-width="1" stroke="#fff"></line>';

            FamilyTree.templates.sriniz_male.plus = expandIconMale;
            FamilyTree.templates.sriniz_female.plus = expandIconFemale;

// Image
            const imgTemplate =
                '<clipPath id="ulaImg">' +
                '<rect  height="75" width="75" x="7" y="7" stroke-width="1" fill="#FF46A3" stroke="#aeaeae" rx="15" ry="15"></rect>' +
                '</clipPath>' +
                '<image x="7" y="7" preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" width="75" height="75">' +
                '</image>';

            FamilyTree.templates.sriniz_male.img_0 = imgTemplate;
            FamilyTree.templates.sriniz_female.img_0 = imgTemplate;

            FamilyTree.templates.sriniz_male.up =
                '<use x="195" y="0" xlink:href="#sriniz_male_up"></use>';
            FamilyTree.templates.sriniz_female.up =
                '<use x="195" y="0" xlink:href="#sriniz_female_up"></use>';

// Pointer
            FamilyTree.templates.sriniz.pointer =
                '<g data-pointer="pointer" transform="matrix(0,0,0,0,80,80)">><g transform="matrix(0.3,0,0,0.3,-17,-17)">' +
                '<polygon fill="#039BE5" points="53.004,173.004 53.004,66.996 0,120" />' +
                '<polygon fill="#039BE5" points="186.996,66.996 186.996,173.004 240,120" />' +
                '<polygon fill="#FF46A3" points="66.996,53.004 173.004,53.004 120,0" />' +
                '<polygon fill="#FF46A3" points="120,240 173.004,186.996 66.996,186.996" />' +
                '<circle fill="red" cx="120" cy="120" r="30" />' +
                '</g></g>';

            const userPermission = this.props.permissions;
            this.family = new FamilyTree(this.divRef.current, {
                mouseScrool: FamilyTree.action.none,
                nodes: this.props.nodes,
                enableSearch: false,
                template: "hugo",
                nodeMouseClick: FamilyTree.action.details,
                ...(userPermission.canEdit && {nodeTreeMenu: true}),
                editForm: {
                    readOnly: userPermission.canView && !userPermission.canEdit,
                    generateElementsFromFields: false,
                    addMore: "",
                    elements: [
                        {type: 'textbox', label: 'Full Name', binding: 'name'},
                        {
                            type: "select", options: [
                                {value: "male", text: "Male"},
                                {value: "female", text: "Female"}
                            ], label: "Gender", binding: "gender"
                        },
                        [
                            {type: 'date', label: 'Birth Date', binding: 'dateOfBirth'},
                            {type: 'date', label: 'Death Date', binding: 'dateOfDeath'},
                        ],
                        {type: 'textbox', label: 'Place of Birth', binding: 'placeOfBirth'},
                        {type: 'textbox', label: 'Description', binding: 'description'},
                        {type: 'textbox', label: 'Photo Url', binding: 'img'},
                    ],
                    buttons: {
                        edit: {
                            icon: FamilyTree.icon.edit(24, 24, '#fff'),
                            text: 'Edit',
                            hideIfEditMode: true,
                            hideIfDetailsMode: false
                        },
                        share: {
                            icon: FamilyTree.icon.share(24, 24, '#fff'),
                            text: 'Share',
                            hideIfEditMode: true,
                            hideIfDetailsMode: true
                        },
                        pdf: {
                            icon: FamilyTree.icon.pdf(24, 24, '#fff'),
                            text: 'Save as PDF'
                        },
                        remove: null
                    },
                },
                nodeBinding: {
                    field_0: 'name',
                    img_0: 'img'
                },


                menu: createMenu(this, userPermission),
            });

            this.family.onUpdateNode((args) => {
                const treeId = window.location.href.split("/displayTrees/")[1];
                console.log(args)
                if (args.addNodesData) {
                    sendNewNodes(args.addNodesData, treeId);
                }
                if (args.updateNodesData) {
                    updateNode(args.updateNodesData, treeId);
                }
                if (args.removeNodeId) {
                    removeNode(args.removeNodeId, treeId);
                }
            })

        }
    }


    render() {
        return <div id="tree" ref={this.divRef}></div>;
        // return React.createElement('div', {id: 'tree', ref: this.divRef});
    }
}

const createMenu = (family: FamilyTreeChart, userPermission: { canEdit: boolean; canView: boolean; canDelete: boolean }) => {
    const menu = {
        pdf: {text: "Export PDF"},
        png: {text: "Export PNG"},
        svg: {text: "Export SVG"},
        json: {text: "Export JSON"},

    };

    if (userPermission.canEdit || userPermission.canDelete) {
        // @ts-ignore
        menu.importJson = {
            text: "Import JSON",
                icon: FamilyTree.icon.json(24, 24, 'red'),
                onClick: () => {
                handleButtonClick(family);
            }
        };
    }

    if (userPermission.canDelete) {
        // @ts-ignore
        menu.deleteTree = {
            text: "Delete Tree",
                icon: FamilyTree.icon.remove(24,24,'red'),
                onClick: () => {
                handleDeleteTree(family);
            }
        }
    }

    return menu;
}
