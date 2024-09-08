import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Typography} from "@mui/material";
import "../styles/search.css"
import SearchIcon from '../assets/search-alt-2-svgrepo-com.svg'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {backend_url} from "../config/constant.ts";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

interface Tree {
    treeId: string;
    treeName: string;
}

export function SearchPopup() {
    const [open, setOpen] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [trees, setTrees] = useState<Tree[]>([]);
    const [filteredTrees, setFilteredTrees] = useState<Tree[]>([]);
    const navigate = useNavigate();

    const getTreesID = async () => {
        try {
            const response = await axios.get<{ treeId: string; treeName: string }[]>(backend_url + "/user/trees", { withCredentials: true });
            const jsonData = response.data;
            setTrees(jsonData);
            setFilteredTrees(jsonData);
        } catch (error) {
            console.error(error);
            // Handle errors appropriately
        }
    };


    useEffect(() => {
        getTreesID();
    }, []);

    const filterTrees = (input: string) => {
        setSearchInput(input);
        const filtered = trees.filter(tree =>
            tree.treeName.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredTrees(filtered);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTreeClick = (treeId: string) => {
        navigate(`/displayTrees/${treeId}`);
    };

    return (
        <>
            <div className="search-format">
                <input
                    className="search-input"
                    placeholder="Search For Tree"
                    aria-label="Enter Tree Name..."
                    onChange={(e) => filterTrees(e.target.value)}
                />
                <button className="search-button" onClick={handleClickOpen}>
                    <img className="search-icon" src={SearchIcon} alt="Search" />
                </button>
            </div>
            <BootstrapDialog
                onClose={handleClose}
                open={open}
                maxWidth='md'
                fullWidth
            >
                <DialogTitle className="search-title">
                    <p className="search-title">
                        Search results for: {searchInput}
                    </p>
                </DialogTitle>
                <DialogContent dividers>
                    {filteredTrees.map((tree) => (
                        <Typography
                            key={tree.treeId}
                            gutterBottom
                            onClick={() => handleTreeClick(tree.treeId)}
                            style={{ cursor: 'pointer' }}
                            className=" font-monospace"
                        >
                            {tree.treeName}
                        </Typography>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}
