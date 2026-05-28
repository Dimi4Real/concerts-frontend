'use client'
import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import { useForm } from "react-hook-form";
import { post, get } from "@/core/httpClient";

const CreateEventDialog = ({ isOpen }) => {
    const { dispatch } = useListActions();
    const [artists, setArtists] = useState([]);
    const [venues, setVenues] = useState([]);

    const toggle = () => dispatch({ type: listAction.RESET });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ mode: "onSubmit" });

    // Ucitavamo artiste i venue-e kada se modal otvori
    useEffect(() => {
        if (isOpen) {
            get('artist/get-list').then(res => setArtists(res.data));
            get('venue/get-list').then(res => setVenues(res.data));
            reset();
        }
    }, [isOpen]);

    const onSubmit = async (data) => {
        await post("/event/create", {
            ...data,
            artistId: parseInt(data.artistId),
            venueId: parseInt(data.venueId),
            ticketPrice: parseFloat(data.ticketPrice)
        });
        dispatch({ type: listAction.RELOAD });
        toggle();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>Dodaj novi koncert</ModalHeader>
            <ModalBody>
                <Row className="mb-3">
                    <Col md={12}>
                        <label className="form-label">Naziv koncerta</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("name", { required: "Naziv je obavezan!" })}
                        />
                        {errors.name && <span className="text-danger">{errors.name.message}</span>}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <label className="form-label">Datum i vreme</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            {...register("eventDate", { required: "Datum je obavezan!" })}
                        />
                        {errors.eventDate && <span className="text-danger">{errors.eventDate.message}</span>}
                    </Col>
                    <Col md={6}>
                        <label className="form-label">Cena karte (RSD)</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("ticketPrice", { required: "Cena je obavezna!" })}
                        />
                        {errors.ticketPrice && <span className="text-danger">{errors.ticketPrice.message}</span>}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <label className="form-label">Izvođač</label>
                        <select
                            className="form-select"
                            {...register("artistId", { required: "Izvođač je obavezan!" })}
                        >
                            <option value="">-- Izaberi izvođača --</option>
                            {artists.map(artist => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                        {errors.artistId && <span className="text-danger">{errors.artistId.message}</span>}
                    </Col>
                    <Col md={6}>
                        <label className="form-label">Mesto održavanja</label>
                        <select
                            className="form-select"
                            {...register("venueId", { required: "Mesto je obavezno!" })}
                        >
                            <option value="">-- Izaberi mesto --</option>
                            {venues.map(venue => (
                                <option key={venue.id} value={venue.id}>
                                    {venue.name} - {venue.city}
                                </option>
                            ))}
                        </select>
                        {errors.venueId && <span className="text-danger">{errors.venueId.message}</span>}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={12}>
                        <label className="form-label">Opis</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            {...register("description")}
                        />
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

export default CreateEventDialog;