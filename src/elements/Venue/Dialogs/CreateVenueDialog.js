'use client'
import { useEffect } from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import { useForm } from "react-hook-form";
import { post } from "@/core/httpClient";

const CreateVenueDialog = ({ isOpen }) => {
    const { dispatch } = useListActions();
    const toggle = () => dispatch({ type: listAction.RESET });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ mode: "onSubmit" });

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen]);

    const onSubmit = async (data) => {
        await post("/venue/create", {
            ...data,
            capacity: parseInt(data.capacity)
        });
        dispatch({ type: listAction.RELOAD });
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Dodaj mesto održavanja</ModalHeader>
            <ModalBody>
                <Row className="mb-3">
                    <Col md={12}>
                        <label className="form-label">Naziv</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("name", { required: "Naziv je obavezan!" })}
                        />
                        {errors.name && <span className="text-danger">{errors.name.message}</span>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={8}>
                        <label className="form-label">Adresa</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("address", { required: "Adresa je obavezna!" })}
                        />
                        {errors.address && <span className="text-danger">{errors.address.message}</span>}
                    </Col>
                    <Col md={4}>
                        <label className="form-label">Grad</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("city", { required: "Grad je obavezan!" })}
                        />
                        {errors.city && <span className="text-danger">{errors.city.message}</span>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={12}>
                        <label className="form-label">Kapacitet</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("capacity", { required: "Kapacitet je obavezan!" })}
                        />
                        {errors.capacity && <span className="text-danger">{errors.capacity.message}</span>}
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSubmit(onSubmit)()}>
                    Sačuvaj
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Otkaži
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CreateVenueDialog;