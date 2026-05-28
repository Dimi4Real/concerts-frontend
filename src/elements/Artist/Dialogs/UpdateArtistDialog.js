'use client'
import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import { useForm } from "react-hook-form";
import { put, get } from "@/core/httpClient";

const UpdateArtistDialog = ({ isOpen }) => {
    const { state, dispatch } = useListActions();
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    const toggle = () => dispatch({ type: listAction.RESET });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({ mode: "onSubmit" });

    useEffect(() => {
        if (isOpen && state.row) {
            get('genre/get-list').then(res => setGenres(res.data));
            setValue("id", state.row.id);
            setValue("name", state.row.name);
            setValue("bio", state.row.bio);
            setSelectedGenres(state.row.genres?.map(g => g.id) || []);
        }
    }, [isOpen, state.row]);

    const onSubmit = async (data) => {
        await put("/artist/update", {
            ...data,
            id: parseInt(data.id),
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
            <ModalHeader toggle={toggle}>Izmeni izvođača</ModalHeader>
            <ModalBody>
                <input type="hidden" {...register("id")} />

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
                                    className={`badge fs-6 p-2 ${
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
                    Sačuvaj izmene
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Otkaži
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default UpdateArtistDialog;