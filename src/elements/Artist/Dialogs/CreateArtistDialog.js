'use client'
import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import { useForm } from "react-hook-form";
import { post, get } from "@/core/httpClient";

const CreateArtistDialog = ({ isOpen }) => {
    const { dispatch } = useListActions();
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    const toggle = () => dispatch({ type: listAction.RESET });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ mode: "onSubmit" });

    useEffect(() => {
        if (isOpen) {
            get('genre/get-list').then(res => setGenres(res.data));
            setSelectedGenres([]);
            reset();
        }
    }, [isOpen]);

    const onSubmit = async (data) => {
        await post("/artist/create", {
            ...data,
            genres: selectedGenres.map(id => ({ id: parseInt(id) }))
        });
        dispatch({ type: listAction.RELOAD });
        toggle();
    };

    const toggleGenre = (genreId) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Dodaj izvođača</ModalHeader>
            <ModalBody>
                <Row className="mb-3">
                    <Col md={12}>
                        <label className="form-label">Ime izvođača</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("name", { required: "Ime je obavezno!" })}
                        />
                        {errors.name && <span className="text-danger">{errors.name.message}</span>}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={12}>
                        <label className="form-label">Biografija</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            {...register("bio")}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={12}>
                        <label className="form-label">Žanrovi</label>
                        <div className="d-flex flex-wrap gap-2">
                            {genres.map(genre => (
                                <div
                                    key={genre.id}
                                    className={`badge fs-6 p-2 cursor-pointer ${
                                        selectedGenres.includes(genre.id)
                                            ? 'bg-primary'
                                            : 'bg-secondary'
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleGenre(genre.id)}
                                >
                                    {genre.name}
                                </div>
                            ))}
                        </div>
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

export default CreateArtistDialog;