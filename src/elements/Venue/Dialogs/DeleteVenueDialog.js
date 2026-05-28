'use client'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import { del } from "@/core/httpClient";

const DeleteVenueDialog = ({ isOpen }) => {
    const { state, dispatch } = useListActions();
    const toggle = () => dispatch({ type: listAction.RESET });

    const onDelete = async () => {
        await del(`/venue/delete/${state.row.id}`);
        dispatch({ type: listAction.RELOAD });
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Brisanje mesta</ModalHeader>
            <ModalBody>
                Da li ste sigurni da želite da obrišete
                <strong> {state.row?.name}</strong>?
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={onDelete}>
                    Obriši
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Otkaži
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteVenueDialog;