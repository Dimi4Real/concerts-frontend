'use client'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import { del } from "@/core/httpClient";

const DeleteArtistDialog = ({ isOpen }) => {
    const { state, dispatch } = useListActions();
    const toggle = () => dispatch({ type: listAction.RESET });

    const onDelete = async () => {
        await del(`/artist/delete/${state.row.id}`);
        dispatch({ type: listAction.RELOAD });
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Brisanje izvođača</ModalHeader>
            <ModalBody>
                Da li ste sigurni da želite da obrišete izvođača
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

export default DeleteArtistDialog;