'use client'
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import CreateVenueDialog from "@/elements/Venue/Dialogs/CreateVenueDialog";
import UpdateVenueDialog from "@/elements/Venue/Dialogs/UpdateVenueDialog";
import DeleteVenueDialog from "@/elements/Venue/Dialogs/DeleteVenueDialog";

const AllVenueDialogs = () => {
    const { state } = useListActions();

    return (
        <>
            <CreateVenueDialog isOpen={state.type === listAction.CREATE} />
            <UpdateVenueDialog isOpen={state.type === listAction.UPDATE} />
            <DeleteVenueDialog isOpen={state.type === listAction.DELETE} />
        </>
    );
};

export default AllVenueDialogs;