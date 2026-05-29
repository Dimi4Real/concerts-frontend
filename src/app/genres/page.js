'use client'
import { useEffect, useState } from "react";
import useListData from "@/hooks/useListData";
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useAuth } from "@/contexts/authContext";
import { useForm } from "react-hook-form";
import { post, del } from "@/core/httpClient";
import { CiTrash } from "react-icons/ci";

export default function Genres() {
    const { getData, loading, data } = useListData();
    const { state: authState } = useAuth();
    const [createModal, setCreateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const isAdmin = authState.isAuthenticated && authState.user?.role === 'ADMIN';

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        getData('genre/get-list');
    }, []);

    const onSubmit = async (data) => {
        await post('/genre/create', data);
        setCreateModal(false);
        reset();
        getData('genre/get-list');
    };

    const onDelete = async () => {
        await del(`/genre/delete/${selectedGenre.id}`);
        setDeleteModal(false);
        setSelectedGenre(null);
        getData('genre/get-list');
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontWeight: '700' }}>Žanrovi</h2>
                {isAdmin && (
                    <Button
                        className="btn btn-primary"
                        onClick={() => setCreateModal(true)}
                    >
                        + Dodaj žanr
                    </Button>
                )}
            </div>

            {loading && <p>Učitavanje...</p>}

            <Row>
                {data && data.map((genre) => (
                    <Col md={3} key={genre.id} className="mb-3">
                        <div className="card p-3 d-flex flex-row justify-content-between align-items-center">
                            <span className="fw-bold">{genre.name}</span>
                            {isAdmin && (
                                <Button
                                    size="sm"
                                    color="danger"
                                    onClick={() => {
                                        setSelectedGenre(genre);
                                        setDeleteModal(true);
                                    }}
                                >
                                    <CiTrash />
                                </Button>
                            )}
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Create Modal */}
            <Modal isOpen={createModal} toggle={() => setCreateModal(false)}>
                <ModalHeader toggle={() => setCreateModal(false)}>
                    Dodaj žanr
                </ModalHeader>
                <ModalBody>
                    <label className="form-label">Naziv žanra</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("name", { required: "Naziv je obavezan!" })}
                    />
                    {errors.name && (
                        <span className="text-danger">{errors.name.message}</span>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleSubmit(onSubmit)()}>
                        Sačuvaj
                    </Button>
                    <Button color="secondary" onClick={() => setCreateModal(false)}>
                        Otkaži
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
                <ModalHeader toggle={() => setDeleteModal(false)}>
                    Brisanje žanra
                </ModalHeader>
                <ModalBody>
                    Da li ste sigurni da želite da obrišete žanr
                    <strong> {selectedGenre?.name}</strong>?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={onDelete}>
                        Obriši
                    </Button>
                    <Button color="secondary" onClick={() => setDeleteModal(false)}>
                        Otkaži
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}