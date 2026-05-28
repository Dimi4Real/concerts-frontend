'use client'
import { useEffect } from "react";
import useListData from "@/hooks/useListData";
import { Spinner, Button, Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import { useAuth } from "@/contexts/authContext";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import AllVenueDialogs from "@/elements/Venue/AllVenueDialogs";

export default function Venues() {
    const { getData, loading, data } = useListData();
    const { state: authState } = useAuth();
    const { state: listState, dispatch } = useListActions();

    const isAdmin = authState.isAuthenticated && authState.user?.role === 'ADMIN';

    useEffect(() => {
        getData('venue/get-list');
    }, [listState.reload]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Mesta održavanja</h2>
                {isAdmin && (
                    <Button
                        className="btn btn-primary"
                        onClick={() => dispatch({ type: listAction.CREATE })}
                    >
                        + Dodaj mesto
                    </Button>
                )}
            </div>

            {loading && <Spinner color="primary" />}

            <Row>
                {data && data.map((venue) => (
                    <Col md={4} key={venue.id} className="mb-3">
                        <Card className="h-100 shadow-sm">
                            <CardBody>
                                <CardTitle tag="h5">{venue.name}</CardTitle>
                                <CardText>
                                    <strong>Adresa:</strong> {venue.address}<br />
                                    <strong>Grad:</strong> {venue.city}<br />
                                    <strong>Kapacitet:</strong> {venue.capacity?.toLocaleString()} mesta
                                </CardText>
                                {isAdmin && (
                                    <div className="d-flex gap-2 mt-2">
                                        <Button
                                            size="sm"
                                            color="warning"
                                            onClick={() => dispatch({
                                                type: listAction.UPDATE,
                                                payload: venue
                                            })}
                                        >
                                            Izmeni
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            onClick={() => dispatch({
                                                type: listAction.DELETE,
                                                payload: venue
                                            })}
                                        >
                                            Obriši
                                        </Button>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <AllVenueDialogs />
        </>
    );
}