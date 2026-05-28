'use client'
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import CreateEventDialog from "@/elements/Event/Dialogs/CreateEventDialog";
import UpdateEventDialog from "@/elements/Event/Dialogs/UpdateEventDialog";
import DeleteEventDialog from "@/elements/Event/Dialogs/DeleteEventDialog";

const AllEventDialogs = () => {
    const { state } = useListActions();

    return (
        <>
            <CreateEventDialog isOpen={state.type === listAction.CREATE} />
            <UpdateEventDialog isOpen={state.type === listAction.UPDATE} />
            <DeleteEventDialog isOpen={state.type === listAction.DELETE} />
        </>
    );
};

export default AllEventDialogs;