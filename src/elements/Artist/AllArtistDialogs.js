'use client'
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import CreateArtistDialog from "@/elements/Artist/Dialogs/CreateArtistDialog";
import UpdateArtistDialog from "@/elements/Artist/Dialogs/UpdateArtistDialog";
import DeleteArtistDialog from "@/elements/Artist/Dialogs/DeleteArtistDialog";

const AllArtistDialogs = () => {
    const { state } = useListActions();

    return (
        <>
            <CreateArtistDialog isOpen={state.type === listAction.CREATE} />
            <UpdateArtistDialog isOpen={state.type === listAction.UPDATE} />
            <DeleteArtistDialog isOpen={state.type === listAction.DELETE} />
        </>
    );
};

export default AllArtistDialogs;