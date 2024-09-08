import React, {useEffect, useState} from "react";
import {
    Button,
    IconButton,
    MenuItem,
    Select, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {backend_url} from "../../config/constant.ts";
import axios from "axios";

interface IndividualData {
    name: string;
    userId: string;
    userPermission: string;
    userEmail: string;
}

interface UserPermissionData {
    OWNER: IndividualData[];
    EDITOR: IndividualData[];
    VIEWER: IndividualData[];
}


export function OwnerEditUsersDialog({ treeId }: { treeId: string }) {

    const [open, setOpen] = useState<boolean>(false);

    const [allUsers, setAllUsers] = useState<IndividualData[]>([]);

    const [snackBarOpen, setSnackBarOpen] = useState<boolean>(false);
    const [shareMessageResponse, setShareMessageResponse] = useState<string>("");




    const getTreeAssociatedUsers = async () => {
        const response = await axios.get(
            backend_url + "/share/" + treeId + "/getUsers",
            {withCredentials:true}
        )
        return response.data;
    }

    function handleClickOpen() {
        setOpen(true);
        getTreeAssociatedUsers().then((data: UserPermissionData) => {
            for (const [, value] of Object.entries(data)) {
                setAllUsers(prevState => prevState.concat(value));
            }
        })
    }



    function handleClose() {
        setOpen(false);
        setAllUsers([]);
    }

    function handleEventChange(userId:string, value:string) {
        const indexToChange = allUsers.findIndex(element => element.userId === userId);
        const changedValue = allUsers.find(element => element.userId === userId);

        console.log(changedValue)


        if (indexToChange !== -1) {
            const usersUpdate = [... allUsers];
            usersUpdate[indexToChange] = {
                ...usersUpdate[indexToChange],
                userPermission: value
            }
            updateUserPermission(usersUpdate[indexToChange]);
            setAllUsers(usersUpdate);
        }
    }

    const updateUserPermission = async (changedValue: IndividualData) => {
        const response = await axios.post(
            backend_url + "/share/" + treeId + "/update-user",
            changedValue,
            {withCredentials:true}
        )
        console.log(response);
        return response.data;
    }

    useEffect(() => {
        console.log("Updated allUsers:", allUsers); // This logs whenever allUsers changes
    }, [allUsers]);

    async function removeUser(userId:string) {
        const indexToRemove = allUsers.findIndex(element => element.userId === userId);
        const changedValue = allUsers.find(element => element.userId === userId);


        const response = await axios.post(
            backend_url + "/share/" + treeId + "/remove-user",
            changedValue,
            {withCredentials:true}
        )


        setAllUsers(currentItems => [
            ...currentItems.slice(0, indexToRemove),
            ...currentItems.slice(indexToRemove+1)
        ]);



        setSnackBarOpen(true);
        setShareMessageResponse(response.data);

        console.log(response.data);

    }

    const snackBarClose = () => {
        setSnackBarOpen(false);
    }

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={snackBarClose}
            >
                <CloseIcon/>
            </IconButton>
        </React.Fragment>
    );



    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Edit Users
            </Button>
            <Snackbar
                anchorOrigin={{vertical: "bottom" ,
                    horizontal: "center"}}
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={snackBarClose}
                message={shareMessageResponse}
                action={action}
            />
            <Dialog
                open={open}
                    >
                <DialogTitle id="alert-dialog-title">
                    Edit Users
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableCell>Email</TableCell>
                            <TableCell>Permission</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableHead>
                        <TableBody>
                            {
                                allUsers.filter((data: IndividualData) => data.userPermission !== "OWNER")
                                    .map((data: IndividualData, key) =>
                                    {
                                        return  (
                                            <TableRow key={key}>
                                                <TableCell>{data.userEmail}</TableCell>
                                                <Select style={{
                                                    width: "10rem"
                                                }}
                                                        value={data.userPermission}
                                                        onChange = {e => handleEventChange(data.userId, e.target.value)}
                                                >
                                                    <MenuItem value={"EDITOR"}>Editor</MenuItem>
                                                    <MenuItem value={"VIEWER"}>Viewer</MenuItem>
                                                </Select>
                                                <TableCell>
                                                    <IconButton onClick={() => removeUser(data.userId)}>
                                                        <CloseIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                )})

                            }
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </>
    )
}