'use client'
import { useEffect } from "react";
import useListData from "@/hooks/useListData";
import { Spinner, Button, Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import { useAuth } from "@/contexts/authContext";
import { useListActions } from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import AllArtistDialogs from "@/elements/Artist/AllArtistDialogs";

export default function Artists() {
    const { getData, loading, data } = useListData();
    const { state: authState } = useAuth();
    const { state: listState, dispatch } = useListActions();

    const isAdmin = authState.isAuthenticated && authState.user?.role === 'ADMIN';

    useEffect(() => {
        getData('artist/get-list');
    }, [listState.reload]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Izvođači</h2>
                {isAdmin && (
                    <Button
                        className="btn btn-primary"
                        onClick={() => dispatch({ type: listAction.CREATE })}
                    >
                        + Dodaj izvođača
                    </Button>
                )}
            </div>

            {loading && <Spinner color="primary" />}

            <Row>
                {data && data.map((artist) => (
                    <Col md={4} key={artist.id} className="mb-3">
                        <Card className="h-100 shadow-sm">
                            <CardBody>
                                <CardTitle tag="h5">{artist.name}</CardTitle>
                                <CardText className="text-muted">{artist.bio}</CardText>
                                <div className="mb-2">
                                    {artist.genres?.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="badge bg-primary me-1"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                                {isAdmin && (
                                    <div className="d-flex gap-2 mt-2">
                                        <Button
                                            size="sm"
                                            color="warning"
                                            onClick={() => dispatch({
                                                type: listAction.UPDATE,
                                                payload: artist
                                            })}
                                        >
                                            Izmeni
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            onClick={() => dispatch({
                                                type: listAction.DELETE,
                                                payload: artist
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

            <AllArtistDialogs />
        </>
    );
}